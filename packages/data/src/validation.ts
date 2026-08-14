import type {
  AggregateDescriptor,
  GroupDescriptor,
  PageDescriptor,
  SortDescriptor,
} from './descriptors.js';

const SORT_DIRECTIONS = new Set(['asc', 'desc']);
const AGGREGATES = new Set(['count', 'sum', 'average', 'min', 'max']);
const MAX_GROUP_DEPTH = 32;

export const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const assertField: (field: unknown) => asserts field is string = (field) => {
  if (typeof field !== 'string' || field.length === 0) {
    throw new TypeError('Data descriptor field must be a nonempty string');
  }
};

export function assertSortDescriptors<T extends object>(
  descriptors: readonly SortDescriptor<T>[],
): void {
  if (!Array.isArray(descriptors)) throw new TypeError('Sort descriptors must be an array');
  const fields = new Set<string>();
  for (const descriptor of descriptors as readonly unknown[]) {
    if (!isRecord(descriptor)) throw new TypeError('Sort descriptor must be an object');
    assertField(descriptor['field']);
    if (
      typeof descriptor['direction'] !== 'string' ||
      !SORT_DIRECTIONS.has(descriptor['direction'])
    ) {
      throw new TypeError('Sort direction must be asc or desc');
    }
    if (fields.has(descriptor['field'])) throw new TypeError('Sort fields must be unique');
    fields.add(descriptor['field']);
  }
}

export function assertAggregateDescriptors<T extends object>(
  descriptors: readonly AggregateDescriptor<T>[],
): void {
  if (!Array.isArray(descriptors)) throw new TypeError('Aggregate descriptors must be an array');
  const identities = new Set<string>();
  for (const descriptor of descriptors as readonly unknown[]) {
    if (!isRecord(descriptor)) throw new TypeError('Aggregate descriptor must be an object');
    assertField(descriptor['field']);
    if (typeof descriptor['aggregate'] !== 'string' || !AGGREGATES.has(descriptor['aggregate'])) {
      throw new TypeError('Unknown aggregate function');
    }
    const identity = `${descriptor['field']}\u0000${descriptor['aggregate']}`;
    if (identities.has(identity)) throw new TypeError('Aggregate descriptors must be unique');
    identities.add(identity);
  }
}

export function assertGroupDescriptors<T extends object>(
  descriptors: readonly GroupDescriptor<T>[],
): void {
  if (!Array.isArray(descriptors)) throw new TypeError('Group descriptors must be an array');
  if (descriptors.length > MAX_GROUP_DEPTH) throw new RangeError('Group depth exceeds 32');
  const fields = new Set<string>();
  for (const descriptor of descriptors as readonly unknown[]) {
    if (!isRecord(descriptor)) throw new TypeError('Group descriptor must be an object');
    assertField(descriptor['field']);
    const direction = descriptor['direction'];
    if (
      direction !== undefined &&
      (typeof direction !== 'string' || !SORT_DIRECTIONS.has(direction))
    ) {
      throw new TypeError('Group direction must be asc or desc');
    }
    if (fields.has(descriptor['field'])) throw new TypeError('Group fields must be unique');
    fields.add(descriptor['field']);
    const aggregates = descriptor['aggregates'];
    if (aggregates !== undefined) {
      assertAggregateDescriptors(aggregates as readonly AggregateDescriptor<T>[]);
    }
  }
}

export function assertPageDescriptor(descriptor: PageDescriptor): void {
  if (!isRecord(descriptor)) throw new TypeError('Page descriptor must be an object');
  for (const key of ['skip', 'take'] as const) {
    const value = descriptor[key];
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new TypeError(`Page ${key} must be a nonnegative safe integer`);
    }
  }
}
