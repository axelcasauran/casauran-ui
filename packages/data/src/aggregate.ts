import { compareComparableValues } from './comparison.js';
import type { AggregateDescriptor, AggregateResult } from './descriptors.js';
import { getFieldValue } from './fields.js';
import { assertAggregateDescriptors } from './validation.js';

const aggregateValue = <T extends object>(
  data: readonly T[],
  descriptor: AggregateDescriptor<T>,
): unknown => {
  const values = data.map((item) => getFieldValue(item, descriptor.field));
  switch (descriptor.aggregate) {
    case 'count':
      return values.filter((value) => value !== null && value !== undefined).length;
    case 'sum':
    case 'average': {
      const numbers = values.filter(
        (value): value is number => typeof value === 'number' && Number.isFinite(value),
      );
      const sum = numbers.reduce((total, value) => total + value, 0);
      return descriptor.aggregate === 'sum'
        ? sum
        : numbers.length === 0
          ? null
          : sum / numbers.length;
    }
    case 'min':
    case 'max': {
      let result: unknown = null;
      for (const value of values) {
        if (result === null) {
          if (compareComparableValues(value, value) !== undefined) result = value;
          continue;
        }
        const comparison = compareComparableValues(value, result);
        if (
          comparison !== undefined &&
          ((descriptor.aggregate === 'min' && comparison < 0) ||
            (descriptor.aggregate === 'max' && comparison > 0))
        ) {
          result = value;
        }
      }
      return result;
    }
  }
};

export function aggregateData<T extends object>(
  data: readonly T[],
  descriptors: readonly AggregateDescriptor<T>[] = [],
): readonly AggregateResult<T>[] {
  assertAggregateDescriptors(descriptors);
  return Object.freeze(
    descriptors.map((descriptor) =>
      Object.freeze({
        field: descriptor.field,
        aggregate: descriptor.aggregate,
        value: aggregateValue(data, descriptor),
      }),
    ),
  );
}
