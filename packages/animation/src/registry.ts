import {
  playElementAnimation,
  type AnimatableElement,
  type MotionPlaybackHandle,
  type MotionPlaybackOptions,
} from './playback.js';

export type AnimationKey = string | number | symbol;

export interface AnimationRegistry<Key extends AnimationKey> {
  readonly size: number;
  readonly disposed: boolean;
  play(
    key: Key,
    element: AnimatableElement,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options: MotionPlaybackOptions,
  ): MotionPlaybackHandle;
  get(key: Key): MotionPlaybackHandle | undefined;
  cancel(key: Key): boolean;
  finish(key: Key): boolean;
  clear(): void;
  dispose(): void;
}

interface AnimationRegistration {
  readonly token: symbol;
  readonly handle: MotionPlaybackHandle;
}

export function createAnimationRegistry<Key extends AnimationKey>(): AnimationRegistry<Key> {
  const registrations = new Map<Key, AnimationRegistration>();
  let disposed = false;

  const remove = (key: Key, token: symbol) => {
    if (registrations.get(key)?.token === token) registrations.delete(key);
  };
  const cancel = (key: Key): boolean => {
    const registration = registrations.get(key);
    if (registration === undefined) return false;
    registrations.delete(key);
    registration.handle.cancel();
    return true;
  };
  const clear = () => {
    const active = [...registrations.values()];
    registrations.clear();
    for (const registration of active) registration.handle.cancel();
  };

  return {
    get size() {
      return registrations.size;
    },
    get disposed() {
      return disposed;
    },
    play(key, element, keyframes, options) {
      if (disposed) throw new Error('Animation registry is disposed');
      cancel(key);
      const handle = playElementAnimation(element, keyframes, options);
      const token = Symbol('animation-registration');
      registrations.set(key, { token, handle });
      void handle.finished.then(() => {
        remove(key, token);
      });
      return handle;
    },
    get(key) {
      return registrations.get(key)?.handle;
    },
    cancel,
    finish(key) {
      const registration = registrations.get(key);
      if (registration === undefined) return false;
      registration.handle.finish();
      return true;
    },
    clear,
    dispose() {
      if (disposed) return;
      disposed = true;
      clear();
    },
  };
}
