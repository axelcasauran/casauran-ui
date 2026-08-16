import type { IconDefinition } from './types.js';

// Independently authored 24×24 stroke geometry. The catalog is deliberately small and grows only
// when a Casauran surface needs a glyph; every entry is drawn for this platform rather than
// derived from any third-party icon set.
const definitions = [
  { name: 'add', viewBox: '0 0 24 24', paths: ['M12 5v14M5 12h14'] },
  { name: 'arrow-left', viewBox: '0 0 24 24', paths: ['m14 5-7 7 7 7M7 12h12'] },
  { name: 'arrow-right', viewBox: '0 0 24 24', paths: ['m10 5 7 7-7 7M5 12h12'] },
  { name: 'check', viewBox: '0 0 24 24', paths: ['m5 12.5 4.5 4.5L19 7.5'] },
  { name: 'close', viewBox: '0 0 24 24', paths: ['m6 6 12 12M18 6 6 18'] },
  {
    name: 'error',
    viewBox: '0 0 24 24',
    paths: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'm9.5 9.5 5 5M14.5 9.5l-5 5'],
  },
  {
    name: 'file-zip',
    viewBox: '0 0 24 24',
    paths: ['M6 3h8l4 4v14H6zM14 3v5h5M11 8h2M11 11h2M11 14h2M10 18h4'],
  },
  { name: 'home', viewBox: '0 0 24 24', paths: ['m3 11 9-8 9 8v10h-6v-6H9v6H3z'] },
  { name: 'image', viewBox: '0 0 24 24', paths: ['M4 5h16v14H4zM7 9h.01M5 17l5-5 3 3 2-2 4 4'] },
  {
    name: 'info',
    viewBox: '0 0 24 24',
    paths: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M12 11v5.5M12 7.8h.01'],
  },
  { name: 'menu', viewBox: '0 0 24 24', paths: ['M4 7h16M4 12h16M4 17h16'] },
  {
    name: 'palette',
    viewBox: '0 0 24 24',
    paths: [
      'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8Z',
      'M7.5 10h.01M10 7.5h.01M14 7.5h.01M16.5 10h.01',
    ],
  },
  {
    name: 'search',
    viewBox: '0 0 24 24',
    paths: ['m20 20-4.5-4.5M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z'],
  },
  {
    name: 'warning',
    viewBox: '0 0 24 24',
    paths: ['M12 4.2 2.7 20.2h18.6z', 'M12 10v4.6M12 17.4h.01'],
  },
] as const satisfies readonly IconDefinition[];

/**
 * The catalog's names as a closed union.
 *
 * `Icon` accepts this rather than `string`, so a glyph that does not exist is a compile error
 * instead of an element that silently renders nothing. Names resolved at runtime are narrowed with
 * {@link isIconName}.
 */
export type IconName = (typeof definitions)[number]['name'];

const definitionsByName: ReadonlyMap<string, IconDefinition> = new Map(
  definitions.map((definition) => [definition.name, definition]),
);

/** Resolves a definition, or `undefined` for any name the catalog does not ship. */
export function getIconDefinition(name: string): IconDefinition | undefined {
  return definitionsByName.get(name);
}

/** Narrows an arbitrary runtime string — a value from a CMS, a route, or a data row. */
export function isIconName(value: string): value is IconName {
  return definitionsByName.has(value);
}

export const iconNames: readonly IconName[] = definitions.map((definition) => definition.name);
