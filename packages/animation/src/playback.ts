import { resolveMotionTiming, type MotionTimingInput } from './timing.js';

export type MotionPlaybackState = 'running' | 'finished' | 'cancelled';
export type MotionPlaybackResult = Readonly<{ status: 'finished' | 'cancelled' }>;

export interface MotionPlaybackOptions extends MotionTimingInput {
  readonly reducedMotion?: boolean | undefined;
  readonly signal?: AbortSignal | undefined;
}

export interface MotionPlaybackHandle {
  readonly animation: Animation;
  readonly state: MotionPlaybackState;
  readonly finished: Promise<MotionPlaybackResult>;
  finish(): void;
  cancel(): void;
}

export interface AnimatableElement {
  readonly isConnected: boolean;
  animate(
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ): Animation;
}

export function playElementAnimation(
  element: AnimatableElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options: MotionPlaybackOptions,
): MotionPlaybackHandle {
  if (!element.isConnected) throw new TypeError('Animation target must be connected');
  const { reducedMotion, signal, ...timingInput } = options;
  const timing = resolveMotionTiming(timingInput, { reducedMotion });
  const animation = element.animate(keyframes, timing);
  let state: MotionPlaybackState = 'running';
  let resolveFinished: ((result: MotionPlaybackResult) => void) | undefined;
  const finished = new Promise<MotionPlaybackResult>((resolve) => {
    resolveFinished = resolve;
  });

  const settle = (result: MotionPlaybackResult) => {
    if (state !== 'running') return;
    state = result.status;
    animation.removeEventListener('finish', handleFinish);
    animation.removeEventListener('cancel', handleCancel);
    signal?.removeEventListener('abort', handleAbort);
    resolveFinished?.(Object.freeze(result));
  };
  const handleFinish = () => {
    settle({ status: 'finished' });
  };
  const handleCancel = () => {
    settle({ status: 'cancelled' });
  };
  const handleAbort = () => {
    animation.cancel();
    settle({ status: 'cancelled' });
  };

  animation.addEventListener('finish', handleFinish);
  animation.addEventListener('cancel', handleCancel);
  signal?.addEventListener('abort', handleAbort, { once: true });

  const handle: MotionPlaybackHandle = {
    animation,
    get state() {
      return state;
    },
    finished,
    finish() {
      if (state !== 'running') return;
      animation.finish();
      settle({ status: 'finished' });
    },
    cancel() {
      if (state !== 'running') return;
      animation.cancel();
      settle({ status: 'cancelled' });
    },
  };

  if (signal?.aborted === true) handle.cancel();
  else if (timing.duration === 0) handle.finish();
  return handle;
}
