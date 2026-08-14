import { describe, expect, it } from 'vitest';

import {
  aggregateData,
  filterData,
  getFieldValue,
  groupData,
  pageData,
  processData,
  sortData,
  type DataGroup,
  type FilterExpression,
} from '../../packages/data/src/index.js';

interface Row {
  readonly id: number;
  readonly name: string;
  readonly region: string;
  readonly score: number | null;
  readonly active: boolean;
  readonly created: Date;
  readonly note?: string;
}

const rows: readonly Row[] = Object.freeze([
  { id: 1, name: 'Ada', region: 'APAC', score: 90, active: true, created: new Date('2026-01-01') },
  { id: 2, name: 'Ben', region: 'EMEA', score: 70, active: true, created: new Date('2026-01-02') },
  { id: 3, name: 'Cara', region: 'APAC', score: 80, active: true, created: new Date('2026-01-03') },
  { id: 4, name: 'Dan', region: 'AMER', score: 60, active: false, created: new Date('2026-01-04') },
  { id: 5, name: 'Eli', region: 'EMEA', score: 95, active: true, created: new Date('2026-01-05') },
  { id: 6, name: 'Fay', region: 'APAC', score: 75, active: true, created: new Date('2026-01-06') },
  { id: 7, name: 'Nil', region: 'APAC', score: null, active: true, created: new Date('invalid') },
]);

describe('data fields and filtering', () => {
  it('reads only own properties and treats inherited/prototype fields as missing', () => {
    const inherited = Object.create({ score: 99 }) as unknown as Row;
    Object.assign(inherited, {
      id: 8,
      name: 'Own',
      region: 'APAC',
      active: true,
      created: new Date('2026-01-08'),
    });
    expect(getFieldValue(inherited, 'score')).toBeUndefined();
    const firstRow = rows[0];
    expect(firstRow).toBeDefined();
    if (firstRow === undefined) throw new Error('Fixture must contain a first row');
    expect(getFieldValue(firstRow, 'name')).toBe('Ada');
    expect(getFieldValue(4, 'value')).toBeUndefined();
    expect(getFieldValue(firstRow, '__proto__')).toBeUndefined();
  });

  it('evaluates nested filters with locale-neutral case handling', () => {
    const result = filterData(rows, {
      logic: 'and',
      filters: [
        { field: 'active', operator: 'eq', value: true },
        {
          logic: 'or',
          filters: [
            { field: 'name', operator: 'contains', value: 'AD', ignoreCase: true },
            { field: 'score', operator: 'gte', value: 90 },
          ],
        },
      ],
    });
    expect(result.map((item) => item.id)).toEqual([1, 5]);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('supports null, empty, string, equality, and relational operators', () => {
    expect(filterData(rows, { field: 'score', operator: 'isNull' }).map((row) => row.id)).toEqual([
      7,
    ]);
    expect(filterData(rows, { field: 'note', operator: 'isNotNull' })).toEqual([]);
    expect(filterData(rows, { field: 'name', operator: 'startsWith', value: 'Ca' })[0]?.id).toBe(3);
    expect(filterData(rows, { field: 'name', operator: 'endsWith', value: 'ay' })[0]?.id).toBe(6);
    expect(filterData(rows, { field: 'note', operator: 'isEmpty' })).toEqual([]);
    expect(filterData(rows, { field: 'name', operator: 'neq', value: 'Ada' })).toHaveLength(6);
    expect(
      filterData(rows, { field: 'created', operator: 'lt', value: new Date('2026-01-03') }),
    ).toHaveLength(2);
  });

  it('rejects unknown, cyclic, and over-deep untrusted filter descriptors', () => {
    expect(() =>
      filterData(rows, { field: 'id', operator: 'unknown' } as unknown as FilterExpression<Row>),
    ).toThrow('Unknown filter operator');

    const cyclic: { logic: 'and'; filters: unknown[] } = { logic: 'and', filters: [] };
    cyclic.filters.push(cyclic);
    expect(() => filterData(rows, cyclic as unknown as FilterExpression<Row>)).toThrow('cycles');

    let deep: unknown = { field: 'id', operator: 'eq', value: 1 };
    for (let depth = 0; depth < 66; depth += 1) deep = { logic: 'and', filters: [deep] };
    expect(() => filterData(rows, deep as FilterExpression<Row>)).toThrow(RangeError);
  });
});

describe('sorting, aggregation, and grouping', () => {
  it('sorts stably, orders unsupported values last, and leaves inputs unchanged', () => {
    const before = [...rows];
    const result = sortData(rows, [
      { field: 'region', direction: 'asc' },
      { field: 'score', direction: 'desc' },
    ]);
    expect(result.map((row) => row.id)).toEqual([4, 1, 3, 6, 7, 5, 2]);
    expect(rows).toEqual(before);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('supports trusted field comparers and rejects invalid comparer results', () => {
    const byNameLength = sortData(rows, [{ field: 'name', direction: 'asc' }], {
      comparers: { name: (left, right) => String(left).length - String(right).length },
    });
    expect(byNameLength.map((row) => row.id)).toEqual([1, 2, 4, 5, 6, 7, 3]);
    expect(() =>
      sortData(rows, [{ field: 'name', direction: 'asc' }], {
        comparers: { name: () => Number.NaN },
      }),
    ).toThrow('finite');
  });

  it('calculates ordered aggregate results with deterministic empty semantics', () => {
    const results = aggregateData(rows, [
      { field: 'score', aggregate: 'count' },
      { field: 'score', aggregate: 'sum' },
      { field: 'score', aggregate: 'average' },
      { field: 'score', aggregate: 'min' },
      { field: 'score', aggregate: 'max' },
    ]);
    expect(results.map((result) => result.value)).toEqual([6, 470, 470 / 6, 60, 95]);
    expect(aggregateData([], [{ field: 'score', aggregate: 'average' }])[0]?.value).toBeNull();
    expect(Object.isFrozen(results[0])).toBe(true);
  });

  it('builds nested stable groups with leaf counts and group aggregates', () => {
    const sorted = sortData(rows, [
      { field: 'region', direction: 'asc' },
      { field: 'active', direction: 'desc' },
    ]);
    const groups = groupData(sorted, [
      { field: 'region', aggregates: [{ field: 'score', aggregate: 'sum' }] },
      { field: 'active' },
    ]);
    expect(groups.map((group) => [group.value, group.leafCount])).toEqual([
      ['AMER', 1],
      ['APAC', 4],
      ['EMEA', 2],
    ]);
    expect((groups[1]?.items[0] as DataGroup<Row>).leafCount).toBe(4);
    expect(groups[1]?.aggregates[0]?.value).toBe(245);
    expect(Object.isFrozen(groups[1]?.items)).toBe(true);
  });

  it('rejects invalid and duplicate descriptors', () => {
    expect(() =>
      sortData(rows, [
        { field: 'id', direction: 'asc' },
        { field: 'id', direction: 'desc' },
      ]),
    ).toThrow('unique');
    expect(() => aggregateData(rows, [{ field: 'score', aggregate: 'median' } as never])).toThrow(
      'Unknown aggregate',
    );
    expect(() => groupData(rows, [{ field: 'region' }, { field: 'region' }])).toThrow('unique');
  });
});

describe('paging and composite processing', () => {
  it('validates paging and accepts a zero-sized page', () => {
    expect(pageData(rows, { skip: 1, take: 2 }).map((row) => row.id)).toEqual([2, 3]);
    expect(pageData(rows, { skip: 0, take: 0 })).toEqual([]);
    expect(() => pageData(rows, { skip: -1, take: 2 })).toThrow(TypeError);
    expect(() => pageData(rows, { skip: 0.5, take: 2 })).toThrow(TypeError);
  });

  it('runs filter, group sort, whole aggregates, leaf paging, then page-local grouping', () => {
    const result = processData(rows.slice(0, 6), {
      filter: { field: 'active', operator: 'eq', value: true },
      sort: [{ field: 'score', direction: 'desc' }],
      group: [{ field: 'region', aggregates: [{ field: 'score', aggregate: 'sum' }] }],
      aggregates: [{ field: 'score', aggregate: 'sum' }],
      page: { skip: 1, take: 3 },
    });
    expect(result.total).toBe(5);
    expect(result.aggregateResults[0]?.value).toBe(410);
    const groups = result.data as readonly DataGroup<Row>[];
    expect(groups.map((group) => group.value)).toEqual(['APAC', 'EMEA']);
    expect((groups[0]?.items as readonly Row[]).map((row) => row.id)).toEqual([3, 6]);
    expect(groups[0]?.aggregates[0]?.value).toBe(155);
    expect((groups[1]?.items as readonly Row[]).map((row) => row.id)).toEqual([5]);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('processes a deterministic 100_000-row large-data scenario without mutation', () => {
    const large = Array.from({ length: 100_000 }, (_, id) => ({
      id,
      bucket: id % 10,
      rank: 100_000 - id,
    }));
    const first = large[0];
    const result = processData(large, {
      filter: { field: 'bucket', operator: 'eq', value: 4 },
      sort: [{ field: 'rank', direction: 'desc' }],
      page: { skip: 100, take: 25 },
    });
    expect(result.total).toBe(10_000);
    expect((result.data as readonly (typeof large)[number][])[0]?.id).toBe(1004);
    expect(result.data).toHaveLength(25);
    expect(large[0]).toBe(first);
  }, 10_000);
});
