const assertLocale = (locale: string): void => {
  if (typeof locale !== 'string' || locale.trim().length === 0) {
    throw new RangeError('Locale must be a nonempty BCP 47 language tag');
  }
};

export const canonicalizeLocale = (locale: string): string => {
  assertLocale(locale);
  const canonical = Intl.getCanonicalLocales(locale)[0];
  if (canonical === undefined) throw new RangeError(`Invalid locale: ${locale}`);
  return canonical;
};

const appendLocaleHierarchy = (target: string[], seen: Set<string>, locale: string): void => {
  const canonical = canonicalizeLocale(locale);
  if (!seen.has(canonical)) {
    target.push(canonical);
    seen.add(canonical);
  }

  const baseParts = new Intl.Locale(canonical).baseName.split('-');
  while (baseParts.length > 0) {
    const candidate = canonicalizeLocale(baseParts.join('-'));
    if (!seen.has(candidate)) {
      target.push(candidate);
      seen.add(candidate);
    }
    baseParts.pop();
  }
};

export const getLocaleFallbackChain = (
  locale: string,
  fallbackLocale?: string,
): readonly string[] => {
  const chain: string[] = [];
  const seen = new Set<string>();
  appendLocaleHierarchy(chain, seen, locale);
  if (fallbackLocale !== undefined) appendLocaleHierarchy(chain, seen, fallbackLocale);
  return Object.freeze(chain);
};
