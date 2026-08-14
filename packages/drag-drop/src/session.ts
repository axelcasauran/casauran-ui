import {
  type DragCollisionStrategy,
  type DragPoint,
  type DragRect,
  type DropTargetRegistry,
  type ResolvedDropTarget,
  validateDragPoint,
  validateDragRect,
} from './geometry.js';

export type DragPhase = 'idle' | 'pending' | 'dragging';
export type DragInput = 'pointer' | 'keyboard';
export type DragCancelReason =
  'cancelled' | 'capture-lost' | 'disposed' | 'pointer-cancelled' | 'threshold-not-met';

export interface DragSnapshot<TPayload, TTargetData> {
  readonly phase: DragPhase;
  readonly input: DragInput | null;
  readonly pointerId: number | null;
  readonly pointerType: string | null;
  readonly payload: TPayload | null;
  readonly origin: DragPoint | null;
  readonly current: DragPoint | null;
  readonly delta: DragPoint;
  readonly target: ResolvedDropTarget<TTargetData> | null;
}

export interface PointerDragStart<TPayload> {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly isPrimary: boolean;
  readonly button: number;
  readonly point: DragPoint;
  readonly payload: TPayload;
  readonly dragRect?: DragRect;
}

export interface KeyboardDragStart<TPayload> {
  readonly point: DragPoint;
  readonly payload: TPayload;
  readonly dragRect?: DragRect;
}

export interface DragCompletion<TPayload, TTargetData> {
  readonly kind: 'dropped' | 'cancelled';
  readonly input: DragInput;
  readonly payload: TPayload;
  readonly point: DragPoint;
  readonly target: ResolvedDropTarget<TTargetData> | null;
  readonly reason: DragCancelReason | null;
}

export interface DragSessionOptions<TPayload, TTargetData> {
  readonly targets: DropTargetRegistry<TPayload, TTargetData>;
  readonly activationDistance?: number;
  readonly collisionStrategy?: DragCollisionStrategy;
}

export interface DragSession<TPayload, TTargetData> {
  getSnapshot(): DragSnapshot<TPayload, TTargetData>;
  beginPointer(start: PointerDragStart<TPayload>): boolean;
  movePointer(
    pointerId: number,
    point: DragPoint,
    dragRect?: DragRect,
  ): DragSnapshot<TPayload, TTargetData>;
  endPointer(pointerId: number): DragCompletion<TPayload, TTargetData> | null;
  beginKeyboard(start: KeyboardDragStart<TPayload>): DragSnapshot<TPayload, TTargetData>;
  moveKeyboardBy(delta: DragPoint, dragRect?: DragRect): DragSnapshot<TPayload, TTargetData>;
  dropKeyboard(): DragCompletion<TPayload, TTargetData>;
  cancel(reason?: DragCancelReason): DragCompletion<TPayload, TTargetData> | null;
}

const ZERO_POINT = Object.freeze({ x: 0, y: 0 });

const idleSnapshot = <TPayload, TTargetData>(): DragSnapshot<TPayload, TTargetData> =>
  Object.freeze({
    phase: 'idle',
    input: null,
    pointerId: null,
    pointerType: null,
    payload: null,
    origin: null,
    current: null,
    delta: ZERO_POINT,
    target: null,
  });

const assertFiniteNonNegative = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
};

const assertPointerId = (pointerId: number): void => {
  if (!Number.isSafeInteger(pointerId) || pointerId < 0) {
    throw new RangeError('pointerId must be a non-negative safe integer');
  }
};

export const createDragSession = <TPayload, TTargetData>(
  options: DragSessionOptions<TPayload, TTargetData>,
): DragSession<TPayload, TTargetData> => {
  const activationDistance = options.activationDistance ?? 4;
  assertFiniteNonNegative(activationDistance, 'activationDistance');
  const strategy = options.collisionStrategy ?? 'pointer-within';
  let snapshot = idleSnapshot<TPayload, TTargetData>();
  let dragRect: DragRect | undefined;
  let payloadValue: TPayload | undefined;
  let hasPayload = false;

  const assertIdle = (): void => {
    if (snapshot.phase !== 'idle') throw new Error('a drag session is already active');
  };

  const activePayload = (): TPayload => {
    if (!hasPayload) throw new Error('drag session has no payload');
    return payloadValue as TPayload;
  };

  const setActiveSnapshot = (
    phase: 'pending' | 'dragging',
    current: DragPoint,
    target: ResolvedDropTarget<TTargetData> | null,
  ): DragSnapshot<TPayload, TTargetData> => {
    const origin = snapshot.origin;
    if (origin === null) throw new Error('drag session has no origin');
    snapshot = Object.freeze({
      phase,
      input: snapshot.input,
      pointerId: snapshot.pointerId,
      pointerType: snapshot.pointerType,
      payload: snapshot.payload,
      origin,
      current,
      delta: Object.freeze({ x: current.x - origin.x, y: current.y - origin.y }),
      target,
    });
    return snapshot;
  };

  const resolve = (point: DragPoint): ResolvedDropTarget<TTargetData> | null => {
    const query = { payload: activePayload(), point, strategy };
    return dragRect === undefined
      ? options.targets.resolve(query)
      : options.targets.resolve({ ...query, dragRect });
  };

  const complete = (
    kind: 'dropped' | 'cancelled',
    reason: DragCancelReason | null,
  ): DragCompletion<TPayload, TTargetData> => {
    if (snapshot.input === null || snapshot.current === null) {
      throw new Error('drag session is not active');
    }
    const completion = Object.freeze({
      kind,
      input: snapshot.input,
      payload: activePayload(),
      point: snapshot.current,
      target: kind === 'dropped' ? snapshot.target : null,
      reason,
    });
    snapshot = idleSnapshot();
    dragRect = undefined;
    payloadValue = undefined;
    hasPayload = false;
    return completion;
  };

  return {
    getSnapshot: () => snapshot,
    beginPointer(start) {
      assertPointerId(start.pointerId);
      if (typeof start.pointerType !== 'string' || start.pointerType.length === 0) {
        throw new TypeError('pointerType must be a non-empty string');
      }
      if (!start.isPrimary || start.button !== 0) return false;
      assertIdle();
      const point = validateDragPoint(start.point);
      dragRect =
        start.dragRect === undefined ? undefined : validateDragRect(start.dragRect, 'dragRect');
      payloadValue = start.payload;
      hasPayload = true;
      snapshot = Object.freeze({
        phase: 'pending',
        input: 'pointer',
        pointerId: start.pointerId,
        pointerType: start.pointerType,
        payload: start.payload,
        origin: point,
        current: point,
        delta: ZERO_POINT,
        target: null,
      });
      if (activationDistance === 0) setActiveSnapshot('dragging', point, resolve(point));
      return true;
    },
    movePointer(pointerId, nextPoint, nextDragRect) {
      assertPointerId(pointerId);
      if (snapshot.input !== 'pointer' || snapshot.pointerId !== pointerId) return snapshot;
      const point = validateDragPoint(nextPoint);
      if (nextDragRect !== undefined) dragRect = validateDragRect(nextDragRect, 'dragRect');
      const origin = snapshot.origin;
      if (origin === null) return snapshot;
      const distance = Math.hypot(point.x - origin.x, point.y - origin.y);
      if (snapshot.phase === 'pending' && distance < activationDistance) {
        return setActiveSnapshot('pending', point, null);
      }
      return setActiveSnapshot('dragging', point, resolve(point));
    },
    endPointer(pointerId) {
      assertPointerId(pointerId);
      if (snapshot.input !== 'pointer' || snapshot.pointerId !== pointerId) return null;
      if (snapshot.phase === 'pending') return complete('cancelled', 'threshold-not-met');
      return complete('dropped', null);
    },
    beginKeyboard(start) {
      assertIdle();
      const point = validateDragPoint(start.point);
      dragRect =
        start.dragRect === undefined ? undefined : validateDragRect(start.dragRect, 'dragRect');
      payloadValue = start.payload;
      hasPayload = true;
      snapshot = Object.freeze({
        phase: 'dragging',
        input: 'keyboard',
        pointerId: null,
        pointerType: null,
        payload: start.payload,
        origin: point,
        current: point,
        delta: ZERO_POINT,
        target: null,
      });
      return setActiveSnapshot('dragging', point, resolve(point));
    },
    moveKeyboardBy(delta, nextDragRect) {
      if (snapshot.input !== 'keyboard' || snapshot.current === null) {
        throw new Error('keyboard drag is not active');
      }
      const validatedDelta = validateDragPoint(delta, 'delta');
      if (nextDragRect !== undefined) dragRect = validateDragRect(nextDragRect, 'dragRect');
      const point = validateDragPoint({
        x: snapshot.current.x + validatedDelta.x,
        y: snapshot.current.y + validatedDelta.y,
      });
      return setActiveSnapshot('dragging', point, resolve(point));
    },
    dropKeyboard() {
      if (snapshot.input !== 'keyboard') throw new Error('keyboard drag is not active');
      return complete('dropped', null);
    },
    cancel(reason = 'cancelled') {
      if (snapshot.phase === 'idle') return null;
      return complete('cancelled', reason);
    },
  };
};
