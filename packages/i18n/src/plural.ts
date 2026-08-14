import { canonicalizeLocale } from './locale.js';

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type PluralMessageSet = Readonly<
  Partial<Record<PluralCategory, string>> & { readonly other: string }
>;

export interface PluralSelection {
  readonly category: PluralCategory;
  readonly message: string;
}

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const selectPluralMessage = (
  locale: string,
  value: number,
  messages: PluralMessageSet,
  type: 'cardinal' | 'ordinal' = 'cardinal',
): PluralSelection => {
  if (!Number.isFinite(value)) throw new RangeError('Plural value must be finite');
  const rawType: unknown = type;
  if (rawType !== 'cardinal' && rawType !== 'ordinal') {
    throw new TypeError('Plural type must be cardinal or ordinal');
  }
  const rawMessages: unknown = messages;
  if (!isRecord(rawMessages)) {
    throw new TypeError('Plural messages must be a record');
  }
  const other = rawMessages['other'];
  if (!Object.hasOwn(rawMessages, 'other') || typeof other !== 'string') {
    throw new TypeError('Plural messages must define an own string other message');
  }
  const category = new Intl.PluralRules(canonicalizeLocale(locale), { type: rawType }).select(
    value,
  );
  const selected = Object.hasOwn(rawMessages, category) ? rawMessages[category] : undefined;
  if (selected !== undefined && typeof selected !== 'string') {
    throw new TypeError(`Plural message ${category} must be a string`);
  }
  return Object.freeze({ category, message: selected ?? other });
};
