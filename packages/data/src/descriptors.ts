export type DataField<T extends object> = Extract<keyof T, string>;
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isNull'
  | 'isNotNull'
  | 'isEmpty'
  | 'isNotEmpty';
export type FilterLogic = 'and' | 'or';
export type SortDirection = 'asc' | 'desc';
export type AggregateFunction = 'count' | 'sum' | 'average' | 'min' | 'max';

export interface FilterDescriptor<T extends object> {
  readonly field: DataField<T>;
  readonly operator: FilterOperator;
  readonly value?: unknown;
  readonly ignoreCase?: boolean | undefined;
}

export interface CompositeFilterDescriptor<T extends object> {
  readonly logic: FilterLogic;
  readonly filters: readonly FilterExpression<T>[];
}

export type FilterExpression<T extends object> = FilterDescriptor<T> | CompositeFilterDescriptor<T>;

export interface SortDescriptor<T extends object> {
  readonly field: DataField<T>;
  readonly direction: SortDirection;
}

export interface AggregateDescriptor<T extends object> {
  readonly field: DataField<T>;
  readonly aggregate: AggregateFunction;
}

export interface GroupDescriptor<T extends object> {
  readonly field: DataField<T>;
  readonly direction?: SortDirection | undefined;
  readonly aggregates?: readonly AggregateDescriptor<T>[] | undefined;
}

export interface PageDescriptor {
  readonly skip: number;
  readonly take: number;
}

export interface DataState<T extends object> {
  readonly filter?: FilterExpression<T> | undefined;
  readonly sort?: readonly SortDescriptor<T>[] | undefined;
  readonly group?: readonly GroupDescriptor<T>[] | undefined;
  readonly aggregates?: readonly AggregateDescriptor<T>[] | undefined;
  readonly page?: PageDescriptor | undefined;
}

export interface AggregateResult<T extends object> {
  readonly field: DataField<T>;
  readonly aggregate: AggregateFunction;
  readonly value: unknown;
}

export interface DataGroup<T extends object> {
  readonly field: DataField<T>;
  readonly value: unknown;
  readonly leafCount: number;
  readonly aggregates: readonly AggregateResult<T>[];
  readonly items: readonly (T | DataGroup<T>)[];
}

export interface DataResult<T extends object> {
  readonly data: readonly (T | DataGroup<T>)[];
  readonly total: number;
  readonly aggregateResults: readonly AggregateResult<T>[];
}

export type DataComparer = (left: unknown, right: unknown) => number;
export type DataComparers<T extends object> = Partial<Record<DataField<T>, DataComparer>>;

export interface DataProcessingOptions<T extends object> {
  readonly comparers?: DataComparers<T> | undefined;
}
