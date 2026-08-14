import { aggregateData } from './aggregate.js';
import type {
  DataProcessingOptions,
  DataResult,
  DataState,
  PageDescriptor,
  SortDescriptor,
} from './descriptors.js';
import { filterData } from './filter.js';
import { groupData } from './group.js';
import { sortData } from './sort.js';
import { assertGroupDescriptors, assertPageDescriptor } from './validation.js';

export function pageData<T>(data: readonly T[], page?: PageDescriptor): readonly T[] {
  if (page === undefined) return Object.freeze([...data]);
  assertPageDescriptor(page);
  return Object.freeze(data.slice(page.skip, page.skip + page.take));
}

export function processData<T extends object>(
  data: readonly T[],
  state: DataState<T> = {},
  options: DataProcessingOptions<T> = {},
): DataResult<T> {
  const groups = state.group ?? [];
  assertGroupDescriptors(groups);
  const groupedFields = new Set(groups.map((group) => group.field));
  const sortDescriptors: SortDescriptor<T>[] = [
    ...groups.map(
      (group) => ({ field: group.field, direction: group.direction ?? 'asc' }) as const,
    ),
    ...(state.sort ?? []).filter((sort) => !groupedFields.has(sort.field)),
  ];
  const filtered = filterData(data, state.filter);
  const sorted = sortData(filtered, sortDescriptors, options);
  const paged = pageData(sorted, state.page);
  const processed = groups.length === 0 ? paged : groupData(paged, groups);
  return Object.freeze({
    data: processed,
    total: filtered.length,
    aggregateResults: aggregateData(filtered, state.aggregates ?? []),
  });
}
