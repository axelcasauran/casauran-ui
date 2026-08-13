import { createOverlayLayerStack } from '@casauran-internal/overlay';

import { OverlayFoundationClientProbe } from './client-probe';

export default function OverlayFoundationPage() {
  const stack = createOverlayLayerStack<string, string>();
  stack.register('server-layer', 'server-safe');

  return (
    <main>
      <h1>Overlay foundation</h1>
      <p data-testid="overlay-server-probe">{stack.top?.value} package import from SSR.</p>
      <OverlayFoundationClientProbe />
    </main>
  );
}
