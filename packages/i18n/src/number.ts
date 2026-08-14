import { canonicalizeLocale } from './locale.js';

export type NumberValue = number | bigint;

export interface NumberFormatter {
  readonly format: (value: NumberValue) => string;
  readonly formatToParts: (value: NumberValue) => readonly Intl.NumberFormatPart[];
  readonly resolvedOptions: () => Readonly<Intl.ResolvedNumberFormatOptions>;
}

export const createNumberFormatter = (
  locale: string,
  options: Intl.NumberFormatOptions = {},
): NumberFormatter => {
  const formatter = new Intl.NumberFormat(canonicalizeLocale(locale), options);
  return Object.freeze({
    format: (value: NumberValue) => formatter.format(value),
    formatToParts: (value: NumberValue) =>
      Object.freeze(formatter.formatToParts(value).map((part) => Object.freeze({ ...part }))),
    resolvedOptions: () => Object.freeze({ ...formatter.resolvedOptions() }),
  });
};

export const formatNumber = (
  value: NumberValue,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => createNumberFormatter(locale, options).format(value);
