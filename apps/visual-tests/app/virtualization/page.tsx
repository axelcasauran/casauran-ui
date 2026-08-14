import { createVirtualAxis, createVirtualGrid } from '@casauran-internal/virtualization';

import VirtualizationClientProbe from './client-probe';

export default function VirtualizationPage() {
  const axis = createVirtualAxis({ count: 100, estimateSize: 25, overscan: 2 });
  const window = axis.getWindow({ offset: 125, viewportSize: 75, includeIndexes: [0] });
  const grid = createVirtualGrid({
    rowCount: 10,
    columnCount: 20,
    estimateRowSize: 30,
    estimateColumnSize: 40,
  });
  const gridWindow = grid.getWindow({
    scrollTop: 60,
    scrollLeft: 80,
    viewportHeight: 60,
    viewportWidth: 80,
  });
  return (
    <main>
      <h1>Virtualization foundation</h1>
      <section aria-label="Virtualization server result">
        <p data-testid="virtualization-server-probe">server-safe package import from SSR.</p>
        <p data-testid="virtual-axis-window">{window.items.map((item) => item.index).join(',')}</p>
        <p data-testid="virtual-axis-total">{window.totalSize}</p>
        <p data-testid="virtual-grid-window">
          {`${String(gridWindow.rows.visibleStartIndex)}-${String(gridWindow.rows.visibleEndIndex)}:${String(gridWindow.columns.visibleStartIndex)}-${String(gridWindow.columns.visibleEndIndex)}`}
        </p>
      </section>
      <VirtualizationClientProbe />
    </main>
  );
}
