import { canonicalizeLocale } from './locale.js';

export interface LocalizedCollator {
  readonly compare: (left: string, right: string) => number;
  readonly resolvedOptions: () => Readonly<Intl.ResolvedCollatorOptions>;
}

export const createCollator = (
  locale: string,
  options: Intl.CollatorOptions = {},
): LocalizedCollator => {
  const collator = new Intl.Collator(canonicalizeLocale(locale), options);
  return Object.freeze({
    compare: (left: string, right: string) => collator.compare(left, right),
    resolvedOptions: () => Object.freeze({ ...collator.resolvedOptions() }),
  });
};

export const compareLocalized = (
  left: string,
  right: string,
  locale: string,
  options?: Intl.CollatorOptions,
): number => createCollator(locale, options).compare(left, right);
