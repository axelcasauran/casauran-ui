import { createDragSession, createDropTargetRegistry } from '@casauran-internal/drag-drop';

import DragDropClientProbe from './client-probe';

export default function DragDropPage() {
  const targets = createDropTargetRegistry<string, string>();
  targets.register({
    id: 'server-target',
    data: 'accepted',
    rect: () => ({ x: 40, y: 0, width: 40, height: 40 }),
  });
  const session = createDragSession({ targets });
  session.beginKeyboard({ point: { x: 0, y: 20 }, payload: 'server-payload' });
  const snapshot = session.moveKeyboardBy({ x: 50, y: 0 });
  const completion = session.dropKeyboard();
  return (
    <main>
      <h1>Drag and drop foundation</h1>
      <section aria-label="Drag and drop server result">
        <p data-testid="drag-drop-server-probe">server-safe package import from production SSR.</p>
        <p data-testid="drag-drop-server-target">{snapshot.target?.id ?? 'none'}</p>
        <p data-testid="drag-drop-server-completion">{completion.kind}</p>
      </section>
      <DragDropClientProbe />
    </main>
  );
}
