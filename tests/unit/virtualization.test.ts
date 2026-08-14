import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  createElementMeasurementObserver,
  createVirtualAxis,
  createVirtualGrid,
  MAX_VIRTUAL_ITEMS,
  type ResizeObserverLike,
  type VirtualAxis,
  type VirtualWindow,
} from '../../packages/virtualization/src/index.js';

describe('virtual axis windowing', () => {
  it('calculates visible ranges, asymmetric overscan, padding, and alignment', () => {
    const axis = createVirtualAxis({
      count: 100,
      estimateSize: 20,
      overscan: { before: 2, after: 3 },
    });
    expectTypeOf(axis).toEqualTypeOf<VirtualAxis>();
    const window = axis.getWindow({ offset: 100, viewportSize: 60 });
    expectTypeOf(window).toEqualTypeOf<VirtualWindow>();
    expect(window.visibleStartIndex).toBe(5);
    expect(window.visibleEndIndex).toBe(7);
    expect(window.items.map((item) => item.index)).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
    expect(window.paddingStart).toBe(60);
    expect(window.paddingEnd).toBe(1_780);
    expect(axis.getScrollOffsetForIndex(10, { viewportSize: 60, currentOffset: 100 })).toBe(160);
    expect(
      axis.getScrollOffsetForIndex(10, {
        viewportSize: 60,
        currentOffset: 100,
        alignment: 'center',
      }),
    ).toBe(180);
  });

  it('handles empty axes and clamps offsets beyond the extent', () => {
    const empty = createVirtualAxis({ count: 0, estimateSize: 10 });
    expect(empty.getWindow({ offset: 0, viewportSize: 0 })).toMatchObject({
      startIndex: -1,
      endIndex: -1,
      totalSize: 0,
    });
    const axis = createVirtualAxis({ count: 3, estimateSize: 10, overscan: 0 });
    expect(axis.getWindow({ offset: 999, viewportSize: 10 }).visibleStartIndex).toBe(2);
  });

  it('applies dynamic measurements and returns stable scroll-anchor adjustment', () => {
    const axis = createVirtualAxis({
      count: 5,
      estimateSize: 20,
      getKey: (index) => `row-${String(index)}`,
    });
    const mutation = axis.measure(
      [
        { index: 0, size: 30 },
        { index: 1, size: 40 },
        { index: 3, size: 25 },
      ],
      { key: 'row-2' },
    );
    expect(mutation).toEqual({
      changedIndexes: [0, 1, 3],
      previousTotalSize: 100,
      totalSize: 135,
      scrollAdjustment: 30,
    });
    expect(axis.getOffset(2)).toBe(70);
    expect(
      axis.getWindow({ offset: 70, viewportSize: 20 }).items.some((item) => item.measured),
    ).toBe(true);
  });

  it('preserves measurements by stable key and anchors across prepended data', () => {
    const keys = ['a', 'b', 'c'];
    const keyAt = (index: number) => {
      const key = keys[index];
      if (key === undefined) throw new RangeError('missing test key');
      return key;
    };
    const axis = createVirtualAxis({ count: keys.length, estimateSize: 10, getKey: keyAt });
    axis.measure([
      { index: 0, size: 20 },
      { index: 1, size: 30 },
    ]);
    keys.unshift('x');
    const mutation = axis.setCount(keys.length, { key: 'b' });
    expect(mutation.scrollAdjustment).toBe(10);
    expect(axis.getIndex('b')).toBe(2);
    expect(axis.getSize(2)).toBe(30);
    expect(axis.getOffset(2)).toBe(30);
  });

  it('keeps disjoint focused/active indexes mounted without owning selection', () => {
    const axis = createVirtualAxis({ count: 1_000, estimateSize: 10, overscan: 1 });
    const window = axis.getWindow({ offset: 5_000, viewportSize: 30, includeIndexes: [0, 999] });
    expect(window.items.map((item) => item.index)).toEqual([0, 499, 500, 501, 502, 503, 999]);
    expect(window.visibleStartIndex).toBe(500);
    expect(Object.isFrozen(window.items)).toBe(true);
  });
});

describe('two-dimensional and browser measurement contracts', () => {
  it('composes independent row/column windows without a cell matrix', () => {
    const grid = createVirtualGrid({
      rowCount: 100_000,
      columnCount: 10_000,
      estimateRowSize: 24,
      estimateColumnSize: 80,
      rowOverscan: 1,
      columnOverscan: 1,
    });
    const window = grid.getWindow({
      scrollTop: 24_000,
      scrollLeft: 8_000,
      viewportHeight: 240,
      viewportWidth: 400,
      includeRowIndexes: [0],
      includeColumnIndexes: [0],
    });
    expect(window.rows.items.length).toBe(13);
    expect(window.columns.items.length).toBe(8);
    expect(window.totalHeight).toBe(2_400_000);
    expect(window.totalWidth).toBe(800_000);
    expect('cells' in window).toBe(false);
  });

  it('feeds explicit ResizeObserver border-box measurements and disconnects', () => {
    let callback: ResizeObserverCallback | undefined;
    const observed: Element[] = [];
    let disconnected = false;
    class FakeResizeObserver implements ResizeObserverLike {
      constructor(next: ResizeObserverCallback) {
        callback = next;
      }
      observe(target: Element): void {
        observed.push(target);
      }
      unobserve(target: Element): void {
        observed.splice(observed.indexOf(target), 1);
      }
      disconnect(): void {
        disconnected = true;
      }
    }
    const axis = createVirtualAxis({
      count: 2,
      estimateSize: 20,
      getKey: (index) => `row-${String(index)}`,
    });
    const mutations: number[] = [];
    const measurement = createElementMeasurementObserver({
      axis,
      ResizeObserver: FakeResizeObserver,
      getAnchor: () => ({ key: 'row-1' }),
      onMeasure: (mutation) => mutations.push(mutation.scrollAdjustment),
    });
    const element = {} as Element;
    measurement.observe(element, 0);
    const entry = {
      target: element,
      borderBoxSize: [{ blockSize: 35, inlineSize: 100 }],
      contentRect: { width: 100, height: 30 },
    } as unknown as ResizeObserverEntry;
    callback?.([entry], {} as ResizeObserver);
    expect(axis.getSize(0)).toBe(35);
    expect(mutations).toEqual([15]);
    measurement.unobserve(element);
    measurement.disconnect();
    expect(observed).toEqual([]);
    expect(disconnected).toBe(true);
  });

  it('rejects unsafe counts, geometry, duplicate keys, indexes, and batches', () => {
    expect(() => createVirtualAxis({ count: MAX_VIRTUAL_ITEMS + 1, estimateSize: 10 })).toThrow(
      RangeError,
    );
    expect(() => createVirtualAxis({ count: 1, estimateSize: 0 })).toThrow(RangeError);
    expect(() => createVirtualAxis({ count: 2, estimateSize: 10, getKey: () => 'same' })).toThrow(
      RangeError,
    );
    const axis = createVirtualAxis({ count: 2, estimateSize: 10 });
    expect(() => axis.getWindow({ offset: Number.NaN, viewportSize: 10 })).toThrow(TypeError);
    expect(() => axis.measure([{ index: 2, size: 10 }])).toThrow(RangeError);
    expect(() => axis.measure([{ index: 0, size: Number.POSITIVE_INFINITY }])).toThrow(TypeError);
    expect(() =>
      axis.measure([
        { index: 0, size: 20 },
        { index: 0, size: 20 },
      ]),
    ).toThrow(RangeError);
    expect(axis.getSize(0)).toBe(10);
  });
});
