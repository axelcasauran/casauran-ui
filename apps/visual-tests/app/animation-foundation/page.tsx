import {
  createPresenceState,
  resolveMotionTiming,
  transitionPresence,
} from '@casauran-internal/animation';

import { AnimationFoundationClientProbe } from './client-probe';

export default function AnimationFoundationPage() {
  const timing = resolveMotionTiming({ duration: '120ms' });
  const presence = transitionPresence(createPresenceState(false), true);

  return (
    <main>
      <h1>Animation foundation</h1>
      <p
        data-testid="animation-server-probe"
        data-duration={timing.duration}
        data-phase={presence.phase}
      >
        server-safe package import from SSR.
      </p>
      <AnimationFoundationClientProbe />
    </main>
  );
}
