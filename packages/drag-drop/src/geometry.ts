export interface DragPoint {
  readonly x: number;
  readonly y: number;
}

export interface DragRect extends DragPoint {
  readonly width: number;
  readonly height: number;
}

export type DragId = string | number;
export type DragCollisionStrategy = 'pointer-within' | 'rectangle-intersection' | 'closest-center';

export interface DropTarget<TPayload, TData> {
  readonly id: DragId;
  readonly data: TData;
  readonly rect: () => DragRect;
  readonly disabled?: boolean;
  readonly priority?: number;
  readonly accepts?: (payload: TPayload) => boolean;
}

export interface ResolvedDropTarget<TData> {
  readonly id: DragId;
  readonly data: TData;
  readonly rect: DragRect;
}

export interface DropTargetQuery<TPayload> {
  readonly payload: TPayload;
  readonly point: DragPoint;
  readonly dragRect?: DragRect;
  readonly strategy?: DragCollisionStrategy;
}

export interface DropTargetRegistration<TPayload, TData> {
  update(target: DropTarget<TPayload, TData>): void;
  dispose(): void;
}

export interface DropTargetRegistry<TPayload, TData> {
  register(target: DropTarget<TPayload, TData>): DropTargetRegistration<TPayload, TData>;
  resolve(query: DropTargetQuery<TPayload>): ResolvedDropTarget<TData> | null;
  clear(): void;
  readonly size: number;
}

interface TargetRecord<TPayload, TData> {
  readonly token: symbol;
  readonly order: number;
  target: DropTarget<TPayload, TData>;
}

interface Candidate<TData> {
  readonly target: ResolvedDropTarget<TData>;
  readonly priority: number;
  readonly order: number;
  readonly score: number;
  readonly area: number;
}

const assertFinite = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
};

export const validateDragPoint = (point: DragPoint, name = 'point'): DragPoint => {
  assertFinite(point.x, `${name}.x`);
  assertFinite(point.y, `${name}.y`);
  return Object.freeze({ x: point.x, y: point.y });
};

export const validateDragRect = (rect: DragRect, name = 'rect'): DragRect => {
  validateDragPoint(rect, name);
  assertFinite(rect.width, `${name}.width`);
  assertFinite(rect.height, `${name}.height`);
  if (rect.width < 0 || rect.height < 0) {
    throw new RangeError(`${name} dimensions must be non-negative`);
  }
  return Object.freeze({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
};

const targetArea = (rect: DragRect): number => rect.width * rect.height;
const contains = (rect: DragRect, point: DragPoint): boolean =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

const intersectionArea = (left: DragRect, right: DragRect): number => {
  const width = Math.max(
    0,
    Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x),
  );
  const height = Math.max(
    0,
    Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y),
  );
  return width * height;
};

const centerDistanceSquared = (rect: DragRect, point: DragPoint): number => {
  const x = rect.x + rect.width / 2 - point.x;
  const y = rect.y + rect.height / 2 - point.y;
  return x * x + y * y;
};

const validateId = (id: DragId): void => {
  if (typeof id === 'string') {
    if (id.length === 0) throw new RangeError('target id must not be empty');
    return;
  }
  assertFinite(id, 'target id');
};

const validatePriority = (priority: number | undefined): number => {
  const value = priority ?? 0;
  assertFinite(value, 'target priority');
  return value;
};

const compareCandidates = <TData>(left: Candidate<TData>, right: Candidate<TData>): number =>
  right.priority - left.priority ||
  right.score - left.score ||
  left.area - right.area ||
  left.order - right.order;

export const createDropTargetRegistry = <TPayload, TData>(): DropTargetRegistry<
  TPayload,
  TData
> => {
  const records = new Map<DragId, TargetRecord<TPayload, TData>>();
  let order = 0;

  const validateTarget = (target: DropTarget<TPayload, TData>): void => {
    validateId(target.id);
    validatePriority(target.priority);
    if (typeof target.rect !== 'function') throw new TypeError('target rect must be a function');
    if (target.accepts !== undefined && typeof target.accepts !== 'function') {
      throw new TypeError('target accepts must be a function');
    }
  };

  const register = (
    target: DropTarget<TPayload, TData>,
  ): DropTargetRegistration<TPayload, TData> => {
    validateTarget(target);
    if (records.has(target.id)) throw new RangeError(`duplicate drop target ${String(target.id)}`);
    const token = Symbol(String(target.id));
    const record: TargetRecord<TPayload, TData> = { token, order: order++, target };
    records.set(target.id, record);
    let disposed = false;
    return Object.freeze({
      update(nextTarget: DropTarget<TPayload, TData>): void {
        if (disposed) throw new Error('drop target registration is disposed');
        validateTarget(nextTarget);
        const current = records.get(target.id);
        if (current?.token !== token) return;
        if (nextTarget.id !== target.id) throw new RangeError('drop target id cannot change');
        current.target = nextTarget;
        target = nextTarget;
      },
      dispose(): void {
        if (disposed) return;
        disposed = true;
        if (records.get(target.id)?.token === token) records.delete(target.id);
      },
    });
  };

  return {
    register,
    resolve(query) {
      const point = validateDragPoint(query.point);
      const strategy = query.strategy ?? 'pointer-within';
      if (!['pointer-within', 'rectangle-intersection', 'closest-center'].includes(strategy)) {
        throw new RangeError(`unsupported collision strategy ${strategy}`);
      }
      const dragRect = query.dragRect === undefined ? undefined : validateDragRect(query.dragRect);
      if (strategy === 'rectangle-intersection' && dragRect === undefined) {
        throw new TypeError('rectangle-intersection requires dragRect');
      }
      const candidates: Candidate<TData>[] = [];
      for (const record of records.values()) {
        const { target } = record;
        if (
          target.disabled === true ||
          (target.accepts !== undefined && !target.accepts(query.payload))
        ) {
          continue;
        }
        const rect = validateDragRect(target.rect(), `target ${String(target.id)} rect`);
        const area = targetArea(rect);
        let score: number;
        if (strategy === 'pointer-within') {
          if (!contains(rect, point)) continue;
          score = 1;
        } else if (strategy === 'rectangle-intersection') {
          const intersection = intersectionArea(dragRect as DragRect, rect);
          if (intersection === 0) continue;
          score = area === 0 ? 0 : intersection / area;
        } else {
          score = -centerDistanceSquared(rect, point);
        }
        candidates.push({
          target: Object.freeze({ id: target.id, data: target.data, rect }),
          priority: validatePriority(target.priority),
          order: record.order,
          score,
          area,
        });
      }
      candidates.sort(compareCandidates);
      return candidates[0]?.target ?? null;
    },
    clear() {
      records.clear();
    },
    get size() {
      return records.size;
    },
  };
};
