import { describe, expect, it } from 'vitest';

import {
  canonicalizeLocale,
  compareLocalized,
  createCollator,
  createDateTimeFormatter,
  createMessageCatalog,
  createNumberFormatter,
  formatDateTime,
  formatMessage,
  formatNumber,
  getLocaleDirection,
  getLocaleFallbackChain,
  resolveDirection,
  resolveMessage,
  selectPluralMessage,
} from '../../packages/i18n/src/index.js';

describe('locale resolution and direction', () => {
  it('canonicalizes locales and creates a frozen duplicate-free fallback chain', () => {
    expect(canonicalizeLocale('EN-us')).toBe('en-US');
    const chain = getLocaleFallbackChain('zh-Hant-TW-u-nu-hanidec', 'en-GB');
    expect(chain).toEqual([
      'zh-Hant-TW-u-nu-hanidec',
      'zh-Hant-TW',
      'zh-Hant',
      'zh',
      'en-GB',
      'en',
    ]);
    expect(Object.isFrozen(chain)).toBe(true);
    expect(() => canonicalizeLocale('')).toThrow(RangeError);
    expect(() => canonicalizeLocale('not_a_locale')).toThrow(RangeError);
  });

  it('derives script direction without reversing text and validates explicit overrides', () => {
    expect(getLocaleDirection('ar-EG')).toBe('rtl');
    expect(getLocaleDirection('he-IL')).toBe('rtl');
    expect(getLocaleDirection('en-US')).toBe('ltr');
    expect(resolveDirection('ar', 'ltr')).toBe('ltr');
    expect(() => resolveDirection('en', 'sideways' as 'ltr')).toThrow(TypeError);
  });
});

describe('plain-text message catalogs', () => {
  const english = createMessageCatalog('en', {
    'greeting.user': 'Hello, {name}.',
    unsafe: '<img src=x onerror=alert(1)>',
  });
  const french = createMessageCatalog('fr', { 'greeting.user': 'Bonjour, {name}.' });

  it('copies own entries and does not retain mutable catalog input', () => {
    const source: Record<string, string> = { stable: 'before' };
    const catalog = createMessageCatalog('en-US', source);
    source['stable'] = 'after';
    expect(catalog.messages['stable']).toBe('before');
    expect(Object.isFrozen(catalog)).toBe(true);
    expect(Object.isFrozen(catalog.messages)).toBe(true);

    const inherited = Object.create({ inherited: 'not copied' }) as Record<string, string>;
    inherited['own'] = 'copied';
    expect(Object.entries(createMessageCatalog('en', inherited).messages)).toEqual([
      ['own', 'copied'],
    ]);
    expect(() =>
      createMessageCatalog('en', { empty: 42 } as unknown as Record<string, string>),
    ).toThrow(TypeError);
  });

  it('resolves exact, parent, explicit fallback, default, and missing messages', () => {
    expect(
      resolveMessage([english, french], 'fr-CA', 'greeting.user', { values: { name: 'Ari' } }),
    ).toMatchObject({
      locale: 'fr',
      message: 'Bonjour, Ari.',
      source: 'catalog',
      usedFallback: true,
    });
    expect(
      resolveMessage([english], 'de-DE', 'greeting.user', {
        fallbackLocale: 'en-US',
        values: { name: 'Ari' },
      }),
    ).toMatchObject({ locale: 'en', message: 'Hello, Ari.', usedFallback: true });
    expect(resolveMessage([english], 'en', 'missing')).toBeUndefined();
    expect(resolveMessage([], 'en', 'missing', { defaultMessage: 'Default' })).toMatchObject({
      source: 'default',
      message: 'Default',
    });
    expect(() =>
      resolveMessage([english, createMessageCatalog('EN', {})], 'en', 'missing'),
    ).toThrow('Duplicate');
  });

  it('interpolates own primitive values only and preserves plain untrusted text', () => {
    const inheritedValues = Object.create({ name: 'prototype' }) as Record<string, string>;
    expect(formatMessage('Hello, {name}.', inheritedValues)).toBe('Hello, {name}.');
    expect(formatMessage('{count} files', { count: 12n })).toBe('12 files');
    expect(() => formatMessage('{missing}', {}, { missingVariable: 'error' })).toThrow('Missing');
    expect(() =>
      formatMessage('{value}', { value: (() => 'executed') as unknown as string }),
    ).toThrow(TypeError);
    expect(resolveMessage([english], 'en', 'unsafe')?.message).toBe('<img src=x onerror=alert(1)>');
  });
});

describe('plural, number, date-time, and collation formatting', () => {
  it('selects cardinal and ordinal plural messages with required other fallback', () => {
    expect(selectPluralMessage('en', 1, { one: 'one item', other: 'many items' })).toEqual({
      category: 'one',
      message: 'one item',
    });
    expect(
      selectPluralMessage('en', 22, { two: 'second', other: 'not second' }, 'ordinal'),
    ).toEqual({
      category: 'two',
      message: 'second',
    });
    expect(selectPluralMessage('en', 2, { other: 'fallback' }).message).toBe('fallback');
    expect(() => selectPluralMessage('en', Number.NaN, { other: 'invalid' })).toThrow(RangeError);
    expect(() =>
      selectPluralMessage('en', 1, Object.create({ other: 'prototype' }) as { other: string }),
    ).toThrow(TypeError);
  });

  it('formats numbers through immutable reusable wrappers and explicit locale switching', () => {
    const currency = createNumberFormatter('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    expect(currency.format(1234.5)).toBe('$1,234.50');
    expect(currency.format(12n)).toBe('$12.00');
    expect(currency.resolvedOptions().locale).toBe('en-US');
    expect(Object.isFrozen(currency)).toBe(true);
    expect(Object.isFrozen(currency.formatToParts(1))).toBe(true);
    expect(formatNumber(1234.5, 'de-DE')).not.toBe(formatNumber(1234.5, 'en-US'));
  });

  it('formats valid instants in an explicit zone and rejects invalid date-time values', () => {
    const formatter = createDateTimeFormatter('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const instant = new Date('2026-01-02T03:04:05.000Z');
    expect(formatter.format(instant)).toBe('01/02/2026');
    expect(formatter.resolvedOptions().timeZone).toBe('UTC');
    expect(Object.isFrozen(formatter.formatToParts(instant))).toBe(true);
    expect(formatDateTime(instant.getTime(), 'en-GB', { timeZone: 'UTC' })).toBe('02/01/2026');
    expect(() => formatter.format(new Date('invalid'))).toThrow(RangeError);
    expect(() => formatter.format(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('collates strings only when an owner explicitly selects localized comparison', () => {
    const collator = createCollator('en', { sensitivity: 'base' });
    expect(collator.compare('resume', 'résumé')).toBe(0);
    expect(compareLocalized('2', '10', 'en', { numeric: true })).toBeLessThan(0);
    expect(Object.isFrozen(collator)).toBe(true);
    expect(Object.isFrozen(collator.resolvedOptions())).toBe(true);
  });
});
