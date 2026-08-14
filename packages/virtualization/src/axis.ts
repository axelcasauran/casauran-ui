export type VirtualKey = string | number;

export type VirtualAlignment = 'auto' | 'start' | 'center' | 'end';

export interface VirtualAnchor {
  readonly key: VirtualKey;
}

export interface VirtualMeasurement {
  readonly index: number;
  readonly size: number;
}

export interface VirtualAxisOptions {
  readonly count: number;
  readonly estimateSize: number | ((index: number) => number);
  readonly getKey?: (index: number) => VirtualKey;
  readonly overscan?: number | Readonly<{ before: number; after: number }>;
}

export interface VirtualWindowOptions {
  readonly offset: number;
  readonly viewportSize: number;
  readonly overscan?: number | Readonly<{ before: number; after: number }>;
  readonly includeIndexes?: readonly number[];
}

export interface VirtualScrollOptions {
  readonly viewportSize: number;
  readonly currentOffset: number;
  readonly alignment?: VirtualAlignment;
}

export interface VirtualItem {
  readonly index: number;
  readonly key: VirtualKey;
  readonly start: number;
  readonly size: number;
  readonly end: number;
  readonly measured: boolean;
}

export interface VirtualWindow {
  readonly items: readonly VirtualItem[];
  readonly startIndex: number;
  readonly endIndex: number;
  readonly visibleStartIndex: number;
  readonly visibleEndIndex: number;
  readonly paddingStart: number;
  readonly paddingEnd: number;
  readonly totalSize: number;
}

export interface VirtualAxisMutation {
  readonly changedIndexes: readonly number[];
  readonly previousTotalSize: number;
  readonly totalSize: number;
  readonly scrollAdjustment: number;
}

export interface VirtualAxis {
  readonly count: number;
  getKey(index: number): VirtualKey;
  getIndex(key: VirtualKey): number | undefined;
  getSize(index: number): number;
  getOffset(index: number): number;
  getTotalSize(): number;
  getWindow(options: VirtualWindowOptions): VirtualWindow;
  getScrollOffsetForIndex(index: number, options: VirtualScrollOptions): number;
  measure(measurements: readonly VirtualMeasurement[], anchor?: VirtualAnchor): VirtualAxisMutation;
  setCount(count: number, anchor?: VirtualAnchor): VirtualAxisMutation;
  clearMeasurements(anchor?: VirtualAnchor): VirtualAxisMutation;
}

export const MAX_VIRTUAL_ITEMS = 2_000_000;

const assertFiniteNonNegative = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
};

const assertSize = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero`);
};

const assertCount = (count: number): void => {
  if (!Number.isInteger(count)) throw new TypeError('count must be an integer');
  if (count < 0 || count > MAX_VIRTUAL_ITEMS) {
    throw new RangeError(`count must be between 0 and ${String(MAX_VIRTUAL_ITEMS)}`);
  }
};

const assertIndex = (index: number, count: number): void => {
  if (!Number.isInteger(index)) throw new TypeError('index must be an integer');
  if (index < 0 || index >= count) throw new RangeError('index is outside the virtual axis');
};

const isVirtualKey = (value: unknown): value is VirtualKey =>
  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

const justBefore = (value: number): number =>
  value - Math.max(1, Math.abs(value)) * Number.EPSILON * 2;

class FenwickTree {
  readonly #tree: Float64Array;

  constructor(values: Float64Array) {
    this.#tree = new Float64Array(values.length + 1);
    for (let index = 0; index < values.length; index += 1) {
      const treeIndex = index + 1;
      this.#tree[treeIndex] = (this.#tree[treeIndex] ?? 0) + (values[index] ?? 0);
      const parent = treeIndex + (treeIndex & -treeIndex);
      if (parent < this.#tree.length) {
        this.#tree[parent] = (this.#tree[parent] ?? 0) + (this.#tree[treeIndex] ?? 0);
      }
    }
  }

  add(index: number, delta: number): void {
    for (
      let treeIndex = index + 1;
      treeIndex < this.#tree.length;
      treeIndex += treeIndex & -treeIndex
    ) {
      this.#tree[treeIndex] = (this.#tree[treeIndex] ?? 0) + delta;
    }
  }

  prefix(endExclusive: number): number {
    let result = 0;
    for (let treeIndex = endExclusive; treeIndex > 0; treeIndex -= treeIndex & -treeIndex) {
      result += this.#tree[treeIndex] ?? 0;
    }
    return result;
  }

  findIndexAtOffset(offset: number, count: number): number {
    let index = 0;
    let sum = 0;
    let step = 1;
    while (step * 2 <= count) step *= 2;
    for (; step > 0; step = Math.floor(step / 2)) {
      const next = index + step;
      const nextValue = this.#tree[next] ?? 0;
      if (next <= count && sum + nextValue <= offset) {
        index = next;
        sum += nextValue;
      }
    }
    return Math.min(index, count - 1);
  }
}

interface OverscanRange {
  readonly before: number;
  readonly after: number;
}

const normalizeOverscan = (
  overscan: VirtualAxisOptions['overscan'] | VirtualWindowOptions['overscan'],
): OverscanRange => {
  if (overscan === undefined) return { before: 1, after: 1 };
  if (typeof overscan === 'number') {
    if (!Number.isInteger(overscan)) throw new TypeError('overscan must be an integer');
    if (overscan < 0) throw new RangeError('overscan must be non-negative');
    return { before: overscan, after: overscan };
  }
  if (!Number.isInteger(overscan.before) || !Number.isInteger(overscan.after)) {
    throw new TypeError('overscan values must be integers');
  }
  if (overscan.before < 0 || overscan.after < 0) {
    throw new RangeError('overscan values must be non-negative');
  }
  return { before: overscan.before, after: overscan.after };
};

class VirtualAxisEngine implements VirtualAxis {
  #count = 0;
  readonly #estimateSize: number | ((index: number) => number);
  readonly #keyForIndex: (index: number) => VirtualKey;
  readonly #defaultOverscan: OverscanRange;
  readonly #measuredByKey = new Map<VirtualKey, number>();
  #keys: VirtualKey[] = [];
  #indexByKey = new Map<VirtualKey, number>();
  #sizes = new Float64Array(0);
  #measured = new Uint8Array(0);
  #tree = new FenwickTree(this.#sizes);

  constructor(options: VirtualAxisOptions) {
    assertCount(options.count);
    if (typeof options.estimateSize === 'number') assertSize(options.estimateSize, 'estimateSize');
    this.#estimateSize = options.estimateSize;
    this.#keyForIndex = options.getKey ?? ((index) => index);
    this.#defaultOverscan = normalizeOverscan(options.overscan);
    this.#rebuild(options.count);
  }

  get count(): number {
    return this.#count;
  }

  getKey(index: number): VirtualKey {
    assertIndex(index, this.#count);
    return this.#keys[index] as VirtualKey;
  }

  getIndex(key: VirtualKey): number | undefined {
    return this.#indexByKey.get(key);
  }

  getSize(index: number): number {
    assertIndex(index, this.#count);
    return this.#sizes[index] as number;
  }

  getOffset(index: number): number {
    if (!Number.isInteger(index)) throw new TypeError('index must be an integer');
    if (index < 0 || index > this.#count) throw new RangeError('index is outside the virtual axis');
    return this.#tree.prefix(index);
  }

  getTotalSize(): number {
    return this.#tree.prefix(this.#count);
  }

  getWindow(options: VirtualWindowOptions): VirtualWindow {
    assertFiniteNonNegative(options.offset, 'offset');
    assertFiniteNonNegative(options.viewportSize, 'viewportSize');
    const totalSize = this.getTotalSize();
    if (this.#count === 0) {
      return Object.freeze({
        items: Object.freeze([]),
        startIndex: -1,
        endIndex: -1,
        visibleStartIndex: -1,
        visibleEndIndex: -1,
        paddingStart: 0,
        paddingEnd: 0,
        totalSize: 0,
      });
    }

    const clampedOffset = Math.min(options.offset, Math.max(0, totalSize - 1));
    const endExclusive = clampedOffset + options.viewportSize;
    const visibleEndOffset = Math.min(
      justBefore(totalSize),
      options.viewportSize === 0
        ? clampedOffset
        : Math.max(clampedOffset, justBefore(endExclusive)),
    );
    const visibleStartIndex = this.#tree.findIndexAtOffset(clampedOffset, this.#count);
    const visibleEndIndex = this.#tree.findIndexAtOffset(visibleEndOffset, this.#count);
    const overscan =
      options.overscan === undefined ? this.#defaultOverscan : normalizeOverscan(options.overscan);
    const indexes = new Set<number>();
    const contiguousStart = Math.max(0, visibleStartIndex - overscan.before);
    const contiguousEnd = Math.min(this.#count - 1, visibleEndIndex + overscan.after);
    for (let index = contiguousStart; index <= contiguousEnd; index += 1) indexes.add(index);
    for (const index of options.includeIndexes ?? []) {
      assertIndex(index, this.#count);
      indexes.add(index);
    }
    const orderedIndexes = [...indexes].sort((left, right) => left - right);
    const items = Object.freeze(orderedIndexes.map((index) => this.#item(index)));
    const startIndex = orderedIndexes[0] as number;
    const endIndex = orderedIndexes.at(-1) as number;
    return Object.freeze({
      items,
      startIndex,
      endIndex,
      visibleStartIndex,
      visibleEndIndex,
      paddingStart: this.getOffset(contiguousStart),
      paddingEnd: totalSize - this.getOffset(contiguousEnd + 1),
      totalSize,
    });
  }

  getScrollOffsetForIndex(index: number, options: VirtualScrollOptions): number {
    assertIndex(index, this.#count);
    assertFiniteNonNegative(options.viewportSize, 'viewportSize');
    assertFiniteNonNegative(options.currentOffset, 'currentOffset');
    const alignment = options.alignment ?? 'auto';
    const start = this.getOffset(index);
    const end = start + this.getSize(index);
    const maxOffset = Math.max(0, this.getTotalSize() - options.viewportSize);
    let target = start;
    if (alignment === 'end') target = end - options.viewportSize;
    if (alignment === 'center') target = start - (options.viewportSize - this.getSize(index)) / 2;
    if (alignment === 'auto') {
      if (start < options.currentOffset) target = start;
      else if (end > options.currentOffset + options.viewportSize)
        target = end - options.viewportSize;
      else target = options.currentOffset;
    }
    return Math.min(maxOffset, Math.max(0, target));
  }

  measure(
    measurements: readonly VirtualMeasurement[],
    anchor?: VirtualAnchor,
  ): VirtualAxisMutation {
    const previousTotalSize = this.getTotalSize();
    const previousAnchorOffset = this.#anchorOffset(anchor);
    const seen = new Set<number>();
    for (const measurement of measurements) {
      assertIndex(measurement.index, this.#count);
      assertSize(measurement.size, 'measurement size');
      if (seen.has(measurement.index))
        throw new RangeError('measurements must not repeat an index');
      seen.add(measurement.index);
    }
    const changedIndexes: number[] = [];
    for (const measurement of measurements) {
      const previous = this.#sizes[measurement.index] as number;
      const key = this.#keys[measurement.index] as VirtualKey;
      this.#measuredByKey.set(key, measurement.size);
      this.#measured[measurement.index] = 1;
      if (measurement.size !== previous) {
        this.#sizes[measurement.index] = measurement.size;
        this.#tree.add(measurement.index, measurement.size - previous);
        changedIndexes.push(measurement.index);
      }
    }
    return this.#mutation(previousTotalSize, previousAnchorOffset, changedIndexes, anchor);
  }

  setCount(count: number, anchor?: VirtualAnchor): VirtualAxisMutation {
    assertCount(count);
    const previousTotalSize = this.getTotalSize();
    const previousAnchorOffset = this.#anchorOffset(anchor);
    this.#rebuild(count);
    return this.#mutation(previousTotalSize, previousAnchorOffset, [], anchor);
  }

  clearMeasurements(anchor?: VirtualAnchor): VirtualAxisMutation {
    const previousTotalSize = this.getTotalSize();
    const previousAnchorOffset = this.#anchorOffset(anchor);
    const changedIndexes = [...this.#measuredByKey.keys()]
      .map((key) => this.#indexByKey.get(key))
      .filter((index): index is number => index !== undefined);
    this.#measuredByKey.clear();
    this.#rebuild(this.#count);
    return this.#mutation(previousTotalSize, previousAnchorOffset, changedIndexes, anchor);
  }

  #estimate(index: number): number {
    const value =
      typeof this.#estimateSize === 'number' ? this.#estimateSize : this.#estimateSize(index);
    assertSize(value, `estimated size for index ${String(index)}`);
    return value;
  }

  #rebuild(count: number): void {
    const keys: VirtualKey[] = [];
    const indexByKey = new Map<VirtualKey, number>();
    const sizes = new Float64Array(count);
    const measured = new Uint8Array(count);
    for (let index = 0; index < count; index += 1) {
      const key = this.#keyForIndex(index);
      if (!isVirtualKey(key)) throw new TypeError('virtual keys must be finite numbers or strings');
      if (indexByKey.has(key)) throw new RangeError(`duplicate virtual key ${String(key)}`);
      keys.push(key);
      indexByKey.set(key, index);
      const measuredSize = this.#measuredByKey.get(key);
      sizes[index] = measuredSize ?? this.#estimate(index);
      if (measuredSize !== undefined) measured[index] = 1;
    }
    this.#keys = keys;
    this.#indexByKey = indexByKey;
    this.#sizes = sizes;
    this.#measured = measured;
    this.#tree = new FenwickTree(sizes);
    this.#count = count;
  }

  #item(index: number): VirtualItem {
    const start = this.getOffset(index);
    const size = this.getSize(index);
    return Object.freeze({
      index,
      key: this.#keys[index] as VirtualKey,
      start,
      size,
      end: start + size,
      measured: this.#measured[index] === 1,
    });
  }

  #anchorOffset(anchor: VirtualAnchor | undefined): number | undefined {
    if (anchor === undefined) return undefined;
    const index = this.#indexByKey.get(anchor.key);
    return index === undefined ? undefined : this.getOffset(index);
  }

  #mutation(
    previousTotalSize: number,
    previousAnchorOffset: number | undefined,
    changedIndexes: readonly number[],
    anchor: VirtualAnchor | undefined,
  ): VirtualAxisMutation {
    const nextAnchorOffset = this.#anchorOffset(anchor);
    return Object.freeze({
      changedIndexes: Object.freeze([...changedIndexes].sort((left, right) => left - right)),
      previousTotalSize,
      totalSize: this.getTotalSize(),
      scrollAdjustment:
        previousAnchorOffset === undefined || nextAnchorOffset === undefined
          ? 0
          : nextAnchorOffset - previousAnchorOffset,
    });
  }
}

export const createVirtualAxis = (options: VirtualAxisOptions): VirtualAxis =>
  new VirtualAxisEngine(options);
