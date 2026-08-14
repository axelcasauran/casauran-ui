import { compareComparableValues, equalValues } from './comparison.js';
import type {
  CompositeFilterDescriptor,
  FilterDescriptor,
  FilterExpression,
} from './descriptors.js';
import { getFieldValue } from './fields.js';
import { assertField, isRecord } from './validation.js';

const FILTER_OPERATORS = new Set([
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'startsWith',
  'endsWith',
  'isNull',
  'isNotNull',
  'isEmpty',
  'isNotEmpty',
]);
const FILTER_LOGIC = new Set(['and', 'or']);
const MAX_FILTER_DEPTH = 64;

const assertFilterExpression = (
  expression: unknown,
  depth: number,
  active: Set<Readonly<Record<string, unknown>>>,
): void => {
  if (depth > MAX_FILTER_DEPTH) throw new RangeError('Filter depth exceeds 64');
  if (!isRecord(expression)) throw new TypeError('Filter descriptor must be an object');
  if (active.has(expression)) throw new TypeError('Filter descriptors must not contain cycles');
  active.add(expression);
  try {
    if ('filters' in expression) {
      if (!FILTER_LOGIC.has(String(expression['logic']))) {
        throw new TypeError('Composite filter logic must be and or or');
      }
      const filters = expression['filters'];
      if (!Array.isArray(filters)) throw new TypeError('Composite filters must be an array');
      for (const filter of filters) assertFilterExpression(filter, depth + 1, active);
      return;
    }
    assertField(expression['field']);
    if (!FILTER_OPERATORS.has(String(expression['operator']))) {
      throw new TypeError('Unknown filter operator');
    }
    const ignoreCase = expression['ignoreCase'];
    if (ignoreCase !== undefined && typeof ignoreCase !== 'boolean') {
      throw new TypeError('Filter ignoreCase must be boolean');
    }
  } finally {
    active.delete(expression);
  }
};

const stringMatch = (
  actual: unknown,
  expected: unknown,
  ignoreCase: boolean,
  operation: 'contains' | 'startsWith' | 'endsWith',
): boolean => {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false;
  const source = ignoreCase ? actual.toLowerCase() : actual;
  const search = ignoreCase ? expected.toLowerCase() : expected;
  if (operation === 'contains') return source.includes(search);
  if (operation === 'startsWith') return source.startsWith(search);
  return source.endsWith(search);
};

const matchesSimple = <T extends object>(item: T, descriptor: FilterDescriptor<T>): boolean => {
  const actual = getFieldValue(item, descriptor.field);
  const ignoreCase = descriptor.ignoreCase === true;
  switch (descriptor.operator) {
    case 'eq':
      return equalValues(actual, descriptor.value, ignoreCase);
    case 'neq':
      return !equalValues(actual, descriptor.value, ignoreCase);
    case 'lt':
      return (compareComparableValues(actual, descriptor.value) ?? 1) < 0;
    case 'lte':
      return (compareComparableValues(actual, descriptor.value) ?? 1) <= 0;
    case 'gt':
      return (compareComparableValues(actual, descriptor.value) ?? -1) > 0;
    case 'gte':
      return (compareComparableValues(actual, descriptor.value) ?? -1) >= 0;
    case 'contains':
    case 'startsWith':
    case 'endsWith':
      return stringMatch(actual, descriptor.value, ignoreCase, descriptor.operator);
    case 'isNull':
      return actual === null || actual === undefined;
    case 'isNotNull':
      return actual !== null && actual !== undefined;
    case 'isEmpty':
      return actual === '';
    case 'isNotEmpty':
      return actual !== '';
  }
};

const matchesExpression = <T extends object>(item: T, expression: FilterExpression<T>): boolean => {
  if ('filters' in expression) {
    const composite: CompositeFilterDescriptor<T> = expression;
    return composite.logic === 'and'
      ? composite.filters.every((filter) => matchesExpression(item, filter))
      : composite.filters.some((filter) => matchesExpression(item, filter));
  }
  return matchesSimple(item, expression);
};

export function filterData<T extends object>(
  data: readonly T[],
  filter?: FilterExpression<T>,
): readonly T[] {
  if (filter === undefined) return Object.freeze([...data]);
  assertFilterExpression(filter, 0, new Set());
  return Object.freeze(data.filter((item) => matchesExpression(item, filter)));
}
