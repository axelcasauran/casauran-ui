import { canonicalizeLocale } from './locale.js';

export type TextDirection = 'ltr' | 'rtl';

const RIGHT_TO_LEFT_SCRIPTS = new Set([
  'Adlm',
  'Arab',
  'Chrs',
  'Elym',
  'Hebr',
  'Khar',
  'Mand',
  'Nkoo',
  'Orkh',
  'Phli',
  'Phlp',
  'Prti',
  'Rohg',
  'Samr',
  'Sarb',
  'Sogd',
  'Sogo',
  'Syrc',
  'Thaa',
  'Yezi',
]);

export const getLocaleDirection = (locale: string): TextDirection => {
  const script = new Intl.Locale(canonicalizeLocale(locale)).maximize().script;
  return script !== undefined && RIGHT_TO_LEFT_SCRIPTS.has(script) ? 'rtl' : 'ltr';
};

export const resolveDirection = (locale: string, direction?: TextDirection): TextDirection => {
  const candidate: unknown = direction;
  if (candidate !== undefined && candidate !== 'ltr' && candidate !== 'rtl') {
    throw new TypeError('Direction must be ltr or rtl');
  }
  return candidate ?? getLocaleDirection(locale);
};
