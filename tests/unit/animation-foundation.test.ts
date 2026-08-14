import { describe, expect, it } from 'vitest';

import {
  completePresence,
  createAnimationRegistry,
  createPresenceState,
  createReducedMotionController,
  getReducedMotionPreference,
  parseMotionTime,
  playElementAnimation,
  resolveMotionTiming,
  transitionPresence,
  type AnimatableElement,
  type MotionPreferenceEnvironment,
  type MotionPreferenceQuery,
} from '../../packages/animation/src/index.js';

class FakeMotionQuery implements MotionPreferenceQuery {
  matches: boolean;
  readonly listeners = new Set<(event: MediaQueryListEvent) => void>();

  constructor(matches: boolean) {
    this.matches = matches;
  }

  addEventListener(_type: 'change', listener: (event: MediaQueryListEvent) => void): void {
    this.listeners.add(listener);
  }

  removeEventListener(_type: 'change', listener: (event: MediaQueryListEvent) => void): void {
    this.listeners.delete(listener);
  }

  emit(matches: boolean): void {
    this.matches = matches;
    const event = { matches } as MediaQueryListEvent;
    for (const listener of this.listeners) listener(event);
  }
}

class FakeAnimation extends EventTarget {
  finish(): void {
    this.dispatchEvent(new Event('finish'));
  }

  cancel(): void {
    this.dispatchEvent(new Event('cancel'));
  }
}

const createFakeTarget = () => {
  const animations: FakeAnimation[] = [];
  const target: AnimatableElement = {
    isConnected: true,
    animate() {
      const animation = new FakeAnimation();
      animations.push(animation);
      return animation as unknown as Animation;
    },
  };
  return { target, animations };
};

describe('animation motion timing', () => {
  it('parses finite CSS millisecond and second values', () => {
    expect(parseMotionTime('120ms')).toBe(120);
    expect(parseMotionTime(' .2s ')).toBe(200);
    expect(parseMotionTime('0MS')).toBe(0);
  });

  it.each(['-1ms', '10', 'calc(1s)', 'Infinityms', '1m', ''])(
    'rejects invalid time %s',
    (value) => {
      expect(() => parseMotionTime(value)).toThrow(TypeError);
    },
  );

  it('resolves caller timing and removes delay/repetition for reduced motion', () => {
    expect(
      resolveMotionTiming({
        duration: '200ms',
        delay: '20ms',
        endDelay: 10,
        easing: ' ease-out ',
        fill: 'forwards',
        direction: 'alternate',
        iterations: 4,
      }),
    ).toEqual({
      duration: 200,
      delay: 20,
      endDelay: 10,
      easing: 'ease-out',
      fill: 'forwards',
      direction: 'alternate',
      iterations: 4,
    });
    expect(
      resolveMotionTiming({ duration: '200ms', iterations: 4 }, { reducedMotion: true }),
    ).toMatchObject({ duration: 0, delay: 0, endDelay: 0, iterations: 1 });
  });

  it('rejects non-finite time and iteration input', () => {
    expect(() => resolveMotionTiming({ duration: Number.NaN })).toThrow(TypeError);
    expect(() => resolveMotionTiming({ duration: Number.NaN }, { reducedMotion: true })).toThrow(
      TypeError,
    );
    expect(() =>
      resolveMotionTiming({ duration: 10, iterations: Number.POSITIVE_INFINITY }),
    ).toThrow(TypeError);
  });
});

describe('reduced-motion preference', () => {
  it('observes real changes once and disposes its listener', () => {
    const query = new FakeMotionQuery(false);
    const environment: MotionPreferenceEnvironment = { matchMedia: () => query };
    const changes: boolean[] = [];
    expect(getReducedMotionPreference(environment)).toBe(false);
    const controller = createReducedMotionController(environment, (value) => changes.push(value));
    query.emit(false);
    query.emit(true);
    query.emit(true);
    expect(controller.reducedMotion).toBe(true);
    expect(changes).toEqual([true]);
    controller.dispose();
    controller.dispose();
    query.emit(false);
    expect(changes).toEqual([true]);
    expect(query.listeners.size).toBe(0);
  });
});

describe('WAAPI playback and keyed ownership', () => {
  it('settles finish, cancel, reduced motion, and abort exactly once', async () => {
    const { target } = createFakeTarget();
    const normal = playElementAnimation(target, [], { duration: 20 });
    normal.finish();
    normal.cancel();
    await expect(normal.finished).resolves.toEqual({ status: 'finished' });

    const reduced = playElementAnimation(target, [], { duration: 20, reducedMotion: true });
    await expect(reduced.finished).resolves.toEqual({ status: 'finished' });

    const abortController = new AbortController();
    const aborted = playElementAnimation(target, [], {
      duration: 20,
      signal: abortController.signal,
    });
    abortController.abort();
    await expect(aborted.finished).resolves.toEqual({ status: 'cancelled' });
  });

  it('owns 1000 keys and prevents interrupted completion from removing replacements', async () => {
    const { target } = createFakeTarget();
    const registry = createAnimationRegistry<number>();
    for (let index = 0; index < 1000; index += 1)
      registry.play(index, target, [], { duration: 20 });
    expect(registry.size).toBe(1000);
    const first = registry.get(999);
    const replacement = registry.play(999, target, [], { duration: 20 });
    await expect(first?.finished).resolves.toEqual({ status: 'cancelled' });
    expect(registry.get(999)).toBe(replacement);
    registry.clear();
    expect(registry.size).toBe(0);
    registry.dispose();
    expect(() => registry.play(1, target, [], { duration: 20 })).toThrow('disposed');
  });
});

describe('presence state', () => {
  it('enters, exits, and ignores stale completion revisions', () => {
    const absent = createPresenceState(false);
    const entering = transitionPresence(absent, true);
    expect(entering).toEqual({ phase: 'entering', mounted: true, revision: 1 });
    const exiting = transitionPresence(entering, false);
    expect(exiting).toEqual({ phase: 'exiting', mounted: true, revision: 2 });
    expect(completePresence(exiting, entering.revision)).toBe(exiting);
    expect(completePresence(exiting, exiting.revision)).toEqual({
      phase: 'unmounted',
      mounted: false,
      revision: 2,
    });
  });

  it('returns existing immutable state for duplicate transitions/completions', () => {
    const entered = createPresenceState(true);
    expect(transitionPresence(entered, true)).toBe(entered);
    expect(completePresence(entered, entered.revision)).toBe(entered);
    expect(Object.isFrozen(entered)).toBe(true);
  });
});
