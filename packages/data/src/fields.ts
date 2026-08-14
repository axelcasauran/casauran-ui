import type { DataField } from './descriptors.js';

export function getFieldValue<T extends object>(item: T, field: DataField<T>): unknown;
export function getFieldValue(item: unknown, field: string): unknown;
export function getFieldValue(item: unknown, field: string): unknown {
  if (typeof item !== 'object' || item === null) return undefined;
  if (!Object.prototype.hasOwnProperty.call(item, field)) return undefined;
  return (item as Readonly<Record<string, unknown>>)[field];
}
