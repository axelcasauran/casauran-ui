import { compareForSort } from './comparison.js';
import type { DataProcessingOptions, SortDescriptor } from './descriptors.js';
import { getFieldValue } from './fields.js';
import { assertSortDescriptors } from './validation.js';

export function sortData<T extends object>(
  data: readonly T[],
  descriptors: readonly SortDescriptor<T>[] = [],
  options: DataProcessingOptions<T> = {},
): readonly T[] {
  assertSortDescriptors(descriptors);
  const decorated = data.map((item, index) => ({ item, index }));
  decorated.sort((left, right) => {
    for (const descriptor of descriptors) {
      const comparer = options.comparers?.[descriptor.field];
      const result = compareForSort(
        getFieldValue(left.item, descriptor.field),
        getFieldValue(right.item, descriptor.field),
        descriptor.direction,
        comparer,
      );
      if (result !== 0) return result;
    }
    return left.index - right.index;
  });
  return Object.freeze(decorated.map(({ item }) => item));
}
