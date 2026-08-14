import { type DragPoint, type DragRect, validateDragPoint, validateDragRect } from './geometry.js';

export interface AutoScrollMetrics {
  readonly scrollLeft: number;
  readonly scrollTop: number;
  readonly scrollWidth: number;
  readonly scrollHeight: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
}

export interface AutoScrollDelta {
  readonly x: number;
  readonly y: number;
}

export interface AutoScrollVelocityOptions {
  readonly point: DragPoint;
  readonly rect: DragRect;
  readonly metrics: AutoScrollMetrics;
  readonly edgeThreshold: number;
  readonly maxSpeed: number;
  readonly elapsedMilliseconds: number;
}

export interface AutoScrollContainer {
  getRect(): DragRect;
  getMetrics(): AutoScrollMetrics;
  scrollBy(delta: AutoScrollDelta): void;
}

export interface AnimationFrameEnvironment {
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
}

export interface AutoScrollerOptions {
  readonly environment: AnimationFrameEnvironment;
  readonly getContainers: () => readonly AutoScrollContainer[];
  readonly edgeThreshold?: number;
  readonly maxSpeed?: number;
  readonly onScroll?: (container: AutoScrollContainer, delta: AutoScrollDelta) => void;
}

export interface AutoScroller {
  updatePointer(point: DragPoint | null): void;
  stop(): void;
  dispose(): void;
  readonly running: boolean;
}

const assertFinite = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
};

const assertPositive = (value: number, name: string): void => {
  assertFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero`);
};

const validateMetrics = (metrics: AutoScrollMetrics): AutoScrollMetrics => {
  const entries: readonly (readonly [string, number])[] = [
    ['scrollLeft', metrics.scrollLeft],
    ['scrollTop', metrics.scrollTop],
    ['scrollWidth', metrics.scrollWidth],
    ['scrollHeight', metrics.scrollHeight],
    ['clientWidth', metrics.clientWidth],
    ['clientHeight', metrics.clientHeight],
  ];
  for (const [name, value] of entries) {
    assertFinite(value, `metrics.${name}`);
    if (value < 0) throw new RangeError(`metrics.${name} must be non-negative`);
  }
  if (metrics.scrollWidth < metrics.clientWidth || metrics.scrollHeight < metrics.clientHeight) {
    throw new RangeError('scroll extents must not be smaller than client extents');
  }
  return metrics;
};

const edgeIntensity = (
  coordinate: number,
  start: number,
  size: number,
  threshold: number,
): number => {
  const before = (start + threshold - coordinate) / threshold;
  if (before > 0) return -Math.min(1, before);
  const after = (coordinate - (start + size - threshold)) / threshold;
  if (after > 0) return Math.min(1, after);
  return 0;
};

const clampDelta = (delta: number, current: number, maximum: number): number =>
  Math.max(-current, Math.min(maximum - current, delta));

export const calculateAutoScrollDelta = (options: AutoScrollVelocityOptions): AutoScrollDelta => {
  const point = validateDragPoint(options.point);
  const rect = validateDragRect(options.rect);
  const metrics = validateMetrics(options.metrics);
  assertPositive(options.edgeThreshold, 'edgeThreshold');
  assertPositive(options.maxSpeed, 'maxSpeed');
  assertFinite(options.elapsedMilliseconds, 'elapsedMilliseconds');
  if (options.elapsedMilliseconds < 0 || options.elapsedMilliseconds > 100) {
    throw new RangeError('elapsedMilliseconds must be between 0 and 100');
  }
  const maximumDelta = options.maxSpeed * (options.elapsedMilliseconds / 1_000);
  const xIntensity = edgeIntensity(point.x, rect.x, rect.width, options.edgeThreshold);
  const yIntensity = edgeIntensity(point.y, rect.y, rect.height, options.edgeThreshold);
  return Object.freeze({
    x: clampDelta(
      xIntensity * maximumDelta,
      metrics.scrollLeft,
      metrics.scrollWidth - metrics.clientWidth,
    ),
    y: clampDelta(
      yIntensity * maximumDelta,
      metrics.scrollTop,
      metrics.scrollHeight - metrics.clientHeight,
    ),
  });
};

export const createAutoScroller = (options: AutoScrollerOptions): AutoScroller => {
  const edgeThreshold = options.edgeThreshold ?? 48;
  const maxSpeed = options.maxSpeed ?? 1_200;
  assertPositive(edgeThreshold, 'edgeThreshold');
  assertPositive(maxSpeed, 'maxSpeed');
  let pointer: DragPoint | null = null;
  let frame: number | null = null;
  let previousTimestamp: number | null = null;
  let disposed = false;

  const cancelFrame = (): void => {
    if (frame !== null) options.environment.cancelAnimationFrame(frame);
    frame = null;
    previousTimestamp = null;
  };

  const requestFrame = (): void => {
    if (frame === null && pointer !== null && !disposed) {
      frame = options.environment.requestAnimationFrame(tick);
    }
  };

  function tick(timestamp: number): void {
    frame = null;
    if (disposed || pointer === null) return;
    const elapsedMilliseconds = Math.min(
      100,
      previousTimestamp === null ? 1000 / 60 : Math.max(0, timestamp - previousTimestamp),
    );
    previousTimestamp = timestamp;
    let xHandled = false;
    let yHandled = false;
    let moved = false;
    for (const container of options.getContainers()) {
      const delta = calculateAutoScrollDelta({
        point: pointer,
        rect: container.getRect(),
        metrics: container.getMetrics(),
        edgeThreshold,
        maxSpeed,
        elapsedMilliseconds,
      });
      const applied = Object.freeze({
        x: xHandled ? 0 : delta.x,
        y: yHandled ? 0 : delta.y,
      });
      if (applied.x === 0 && applied.y === 0) continue;
      container.scrollBy(applied);
      if (applied.x !== 0) xHandled = true;
      if (applied.y !== 0) yHandled = true;
      moved = true;
      options.onScroll?.(container, applied);
      if (xHandled && yHandled) break;
    }
    if (moved) requestFrame();
    else previousTimestamp = null;
  }

  return Object.freeze({
    updatePointer(nextPoint: DragPoint | null) {
      if (disposed) throw new Error('autoscroller is disposed');
      pointer = nextPoint === null ? null : validateDragPoint(nextPoint);
      if (pointer === null) cancelFrame();
      else requestFrame();
    },
    stop() {
      pointer = null;
      cancelFrame();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pointer = null;
      cancelFrame();
    },
    get running() {
      return frame !== null;
    },
  });
};
