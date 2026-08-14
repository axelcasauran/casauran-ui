'use client';

import {
  createElementMeasurementObserver,
  createVirtualAxis,
  type VirtualAxis,
  type VirtualWindow,
} from '@casauran-internal/virtualization';
import { useEffect, useRef, useState } from 'react';

const createProbeAxis = () =>
  createVirtualAxis({
    count: 30,
    estimateSize: 30,
    getKey: (index) => `row-${String(index)}`,
    overscan: 1,
  });

export default function VirtualizationClientProbe() {
  const axisRef = useRef<VirtualAxis | null>(null);
  if (axisRef.current === null) axisRef.current = createProbeAxis();
  const axis = axisRef.current;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [window, setWindow] = useState<VirtualWindow>(() =>
    axis.getWindow({ offset: 120, viewportSize: 90, includeIndexes: [0] }),
  );
  const [scrollAdjustment, setScrollAdjustment] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null) return;
    viewport.scrollTop = 120;
    const measurement = createElementMeasurementObserver({
      axis,
      ResizeObserver,
      getAnchor: () => ({ key: 'row-4' }),
      onMeasure: (mutation) => {
        if (mutation.scrollAdjustment !== 0) {
          viewport.scrollTop += mutation.scrollAdjustment;
          setScrollAdjustment((current) => current + mutation.scrollAdjustment);
        }
        setWindow(
          axis.getWindow({ offset: viewport.scrollTop, viewportSize: 90, includeIndexes: [0] }),
        );
      },
    });
    for (const element of viewport.querySelectorAll<HTMLElement>('[data-virtual-index]')) {
      const index = Number(element.dataset['virtualIndex']);
      measurement.observe(element, index);
    }
    return () => {
      measurement.disconnect();
    };
  }, [axis]);

  return (
    <section aria-label="Virtualization client measurement">
      <p data-testid="virtual-scroll-adjustment">{scrollAdjustment}</p>
      <div
        ref={viewportRef}
        data-testid="virtual-viewport"
        style={{ position: 'relative', blockSize: 90, overflow: 'auto', inlineSize: 240 }}
        onScroll={(event) => {
          setWindow(
            axis.getWindow({
              offset: event.currentTarget.scrollTop,
              viewportSize: event.currentTarget.clientHeight,
              includeIndexes: [0],
            }),
          );
        }}
      >
        <div style={{ position: 'relative', blockSize: axis.getTotalSize() }}>
          {window.items.map((item) => (
            <button
              key={item.key}
              data-testid={`virtual-row-${String(item.index)}`}
              data-virtual-index={item.index}
              style={{
                position: 'absolute',
                insetBlockStart: item.start,
                blockSize: item.index === 3 ? 60 : 30,
                inlineSize: 200,
              }}
            >
              Row {item.index}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
