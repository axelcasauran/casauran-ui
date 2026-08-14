export type MotionTime = number | string;
export type MotionFillMode = 'none' | 'forwards' | 'backwards' | 'both';
export type MotionDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export interface MotionTimingInput {
  readonly duration: MotionTime;
  readonly delay?: MotionTime | undefined;
  readonly endDelay?: MotionTime | undefined;
  readonly easing?: string | undefined;
  readonly fill?: MotionFillMode | undefined;
  readonly direction?: MotionDirection | undefined;
  readonly iterations?: number | undefined;
}

export interface ResolvedMotionTiming {
  readonly duration: number;
  readonly delay: number;
  readonly endDelay: number;
  readonly easing: string;
  readonly fill: MotionFillMode;
  readonly direction: MotionDirection;
  readonly iterations: number;
}

const CSS_TIME_PATTERN = /^(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)$/u;

export function parseMotionTime(value: string): number {
  const normalized = value.trim().toLowerCase();
  if (!CSS_TIME_PATTERN.test(normalized)) {
    throw new TypeError(`Invalid finite CSS motion time: ${value}`);
  }
  const milliseconds = normalized.endsWith('ms')
    ? Number(normalized.slice(0, -2))
    : Number(normalized.slice(0, -1)) * 1000;
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    throw new TypeError(`Invalid finite CSS motion time: ${value}`);
  }
  return milliseconds;
}

function resolveTime(value: MotionTime | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const resolved = typeof value === 'number' ? value : parseMotionTime(value);
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new TypeError('Motion times must be finite nonnegative values');
  }
  return resolved;
}

export function resolveMotionTiming(
  input: MotionTimingInput,
  options: { readonly reducedMotion?: boolean | undefined } = {},
): ResolvedMotionTiming {
  const iterations = input.iterations ?? 1;
  if (!Number.isFinite(iterations) || iterations < 0) {
    throw new TypeError('Motion iterations must be a finite nonnegative value');
  }
  const easing = input.easing?.trim() || 'linear';
  const reduced = options.reducedMotion === true;
  const duration = resolveTime(input.duration, 0);
  const delay = resolveTime(input.delay, 0);
  const endDelay = resolveTime(input.endDelay, 0);
  return Object.freeze({
    duration: reduced ? 0 : duration,
    delay: reduced ? 0 : delay,
    endDelay: reduced ? 0 : endDelay,
    easing,
    fill: input.fill ?? 'both',
    direction: input.direction ?? 'normal',
    iterations: reduced ? 1 : iterations,
  });
}
