import { canonicalizeLocale } from './locale.js';

export type DateTimeValue = Date | number;

export interface DateTimeFormatter {
  readonly format: (value: DateTimeValue) => string;
  readonly formatToParts: (value: DateTimeValue) => readonly Intl.DateTimeFormatPart[];
  readonly resolvedOptions: () => Readonly<Intl.ResolvedDateTimeFormatOptions>;
}

const getEpoch = (value: DateTimeValue): number => {
  const epoch = value instanceof Date ? value.getTime() : value;
  if (typeof epoch !== 'number' || !Number.isFinite(epoch)) {
    throw new RangeError('Date-time value must be a valid Date or finite epoch number');
  }
  return epoch;
};

export const createDateTimeFormatter = (
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
): DateTimeFormatter => {
  const formatter = new Intl.DateTimeFormat(canonicalizeLocale(locale), options);
  return Object.freeze({
    format: (value: DateTimeValue) => formatter.format(getEpoch(value)),
    formatToParts: (value: DateTimeValue) =>
      Object.freeze(
        formatter.formatToParts(getEpoch(value)).map((part) => Object.freeze({ ...part })),
      ),
    resolvedOptions: () => Object.freeze({ ...formatter.resolvedOptions() }),
  });
};

export const formatDateTime = (
  value: DateTimeValue,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string => createDateTimeFormatter(locale, options).format(value);
