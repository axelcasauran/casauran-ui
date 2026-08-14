import type { DataComparer, SortDirection } from './descriptors.js';

type Comparable =
  | Readonly<{ domain: 'number' | 'date'; value: number }>
  | Readonly<{ domain: 'bigint'; value: bigint }>
  | Readonly<{ domain: 'string'; value: string }>;

const toComparable = (value: unknown): Comparable | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return { domain: 'number', value };
  if (typeof value === 'bigint') return { domain: 'bigint', value };
  if (typeof value === 'string') return { domain: 'string', value };
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return { domain: 'date', value: value.getTime() };
  }
  return undefined;
};

export const sameValueZero = (left: unknown, right: unknown): boolean =>
  left === right ||
  (typeof left === 'number' &&
    typeof right === 'number' &&
    Number.isNaN(left) &&
    Number.isNaN(right));

export const equalValues = (left: unknown, right: unknown, ignoreCase: boolean): boolean => {
  if (ignoreCase && typeof left === 'string' && typeof right === 'string') {
    return left.toLowerCase() === right.toLowerCase();
  }
  if (left instanceof Date && right instanceof Date) return left.getTime() === right.getTime();
  return sameValueZero(left, right);
};

export const compareComparableValues = (left: unknown, right: unknown): number | undefined => {
  const leftComparable = toComparable(left);
  const rightComparable = toComparable(right);
  if (leftComparable === undefined || rightComparable === undefined) return undefined;
  if (leftComparable.domain !== rightComparable.domain) return undefined;
  if (leftComparable.domain === 'number' || leftComparable.domain === 'date') {
    const rightValue = rightComparable.value as number;
    return leftComparable.value === rightValue ? 0 : leftComparable.value < rightValue ? -1 : 1;
  }
  if (leftComparable.domain === 'bigint') {
    const rightValue = rightComparable.value as bigint;
    return leftComparable.value === rightValue ? 0 : leftComparable.value < rightValue ? -1 : 1;
  }
  const rightValue = rightComparable.value as string;
  return leftComparable.value === rightValue ? 0 : leftComparable.value < rightValue ? -1 : 1;
};

export const compareForSort = (
  left: unknown,
  right: unknown,
  direction: SortDirection,
  comparer?: DataComparer,
): number => {
  if (comparer !== undefined) {
    const result = comparer(left, right);
    if (!Number.isFinite(result)) throw new TypeError('Data comparer must return a finite number');
    const normalized = Math.sign(result);
    return direction === 'desc' ? -normalized : normalized;
  }
  const comparison = compareComparableValues(left, right);
  if (comparison !== undefined) return direction === 'desc' ? -comparison : comparison;
  const leftSupported = toComparable(left) !== undefined;
  const rightSupported = toComparable(right) !== undefined;
  if (leftSupported === rightSupported) return 0;
  return leftSupported ? -1 : 1;
};
