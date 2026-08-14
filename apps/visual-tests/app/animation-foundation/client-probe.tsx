'use client';

import {
  completePresence,
  createAnimationRegistry,
  createPresenceState,
  createReducedMotionController,
  parseMotionTime,
  transitionPresence,
  type AnimationRegistry,
} from '@casauran-internal/animation';
import { useEffect, useRef, useState } from 'react';

export function AnimationFoundationClientProbe() {
  const targetRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<AnimationRegistry<string> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playback, setPlayback] = useState('idle');
  const [interruption, setInterruption] = useState('idle');
  const [presence, setPresence] = useState('idle');

  useEffect(() => {
    const registry = createAnimationRegistry<string>();
    registryRef.current = registry;
    const preference = createReducedMotionController(window, setReducedMotion);
    setReducedMotion(preference.reducedMotion);
    return () => {
      preference.dispose();
      registry.dispose();
      registryRef.current = null;
    };
  }, []);

  const tokenTiming = () => {
    const target = targetRef.current;
    if (target === null) throw new Error('Motion target unavailable');
    const styles = getComputedStyle(target);
    return {
      duration: parseMotionTime(styles.getPropertyValue('--csn-motion-duration-fast')),
      easing: styles.getPropertyValue('--csn-motion-easing-standard').trim(),
    };
  };

  const play = () => {
    const target = targetRef.current;
    const registry = registryRef.current;
    if (target === null || registry === null) return;
    const handle = registry.play(
      'normal',
      target,
      [
        { opacity: 0.4, transform: 'translateX(0px)' },
        { opacity: 1, transform: 'translateX(24px)' },
      ],
      { ...tokenTiming(), reducedMotion },
    );
    setPlayback(handle.state);
    void handle.finished.then((result) => {
      setPlayback(result.status);
    });
  };

  const startAbortable = () => {
    const target = targetRef.current;
    const registry = registryRef.current;
    if (target === null || registry === null) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const handle = registry.play('abortable', target, [{ opacity: 0.2 }, { opacity: 1 }], {
      duration: 60_000,
      signal: controller.signal,
    });
    setPlayback(handle.state);
    void handle.finished.then((result) => {
      setPlayback(result.status);
    });
  };

  const interrupt = () => {
    const target = targetRef.current;
    const registry = registryRef.current;
    if (target === null || registry === null) return;
    const first = registry.play('interrupted', target, [{ opacity: 0.2 }, { opacity: 0.8 }], {
      duration: 1000,
    });
    const replacement = registry.play(
      'interrupted',
      target,
      [{ transform: 'translateX(0px)' }, { transform: 'translateX(24px)' }],
      { duration: 0 },
    );
    void Promise.all([first.finished, replacement.finished]).then(([oldResult, newResult]) => {
      setInterruption(`${oldResult.status}:${newResult.status}:${String(registry.size)}`);
    });
  };

  const exercisePresence = () => {
    const entering = transitionPresence(createPresenceState(false), true);
    const exiting = transitionPresence(entering, false);
    const stale = completePresence(exiting, entering.revision);
    const complete = completePresence(stale, exiting.revision);
    setPresence(
      `${stale.phase}:${String(stale.revision)}|${complete.phase}:${String(complete.revision)}`,
    );
  };

  return (
    <section aria-label="Animation lifecycle probe">
      <p data-testid="reduced-motion">{String(reducedMotion)}</p>
      <div
        ref={targetRef}
        data-testid="motion-target"
        style={{ inlineSize: 48, blockSize: 48, background: 'CanvasText' }}
      />
      <button type="button" onClick={play}>
        Play motion
      </button>
      <button type="button" onClick={startAbortable}>
        Start abortable motion
      </button>
      <button type="button" onClick={() => abortRef.current?.abort()}>
        Abort motion
      </button>
      <button type="button" onClick={interrupt}>
        Interrupt motion
      </button>
      <button type="button" onClick={exercisePresence}>
        Exercise presence revisions
      </button>
      <p role="status" aria-label="Playback status" data-testid="playback-status">
        {playback}
      </p>
      <p data-testid="interruption-status">{interruption}</p>
      <p data-testid="presence-status">{presence}</p>
    </section>
  );
}
