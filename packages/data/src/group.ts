import { aggregateData } from './aggregate.js';
import type { DataGroup, GroupDescriptor } from './descriptors.js';
import { getFieldValue } from './fields.js';
import { assertGroupDescriptors } from './validation.js';

const groupAtDepth = <T extends object>(
  data: readonly T[],
  descriptors: readonly GroupDescriptor<T>[],
  depth: number,
): readonly DataGroup<T>[] => {
  const descriptor = descriptors[depth];
  if (descriptor === undefined) return Object.freeze([]);
  const buckets = new Map<unknown, T[]>();
  for (const item of data) {
    const value = getFieldValue(item, descriptor.field);
    const bucket = buckets.get(value);
    if (bucket === undefined) buckets.set(value, [item]);
    else bucket.push(item);
  }
  const groups: DataGroup<T>[] = [];
  for (const [value, rows] of buckets) {
    const items =
      depth + 1 < descriptors.length
        ? groupAtDepth(rows, descriptors, depth + 1)
        : Object.freeze([...rows]);
    groups.push(
      Object.freeze({
        field: descriptor.field,
        value,
        leafCount: rows.length,
        aggregates: aggregateData(rows, descriptor.aggregates ?? []),
        items,
      }),
    );
  }
  return Object.freeze(groups);
};

export function groupData<T extends object>(
  data: readonly T[],
  descriptors: readonly GroupDescriptor<T>[] = [],
): readonly DataGroup<T>[] {
  assertGroupDescriptors(descriptors);
  if (descriptors.length === 0) return Object.freeze([]);
  return groupAtDepth(data, descriptors, 0);
}
