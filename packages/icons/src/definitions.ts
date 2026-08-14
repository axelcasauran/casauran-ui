import type { IconDefinition } from './types.js';

const definitions = [
  { name: 'add', viewBox: '0 0 24 24', paths: ['M12 5v14M5 12h14'] },
  { name: 'arrow-left', viewBox: '0 0 24 24', paths: ['m14 5-7 7 7 7M7 12h12'] },
  { name: 'arrow-right', viewBox: '0 0 24 24', paths: ['m10 5 7 7-7 7M5 12h12'] },
  { name: 'close', viewBox: '0 0 24 24', paths: ['m6 6 12 12M18 6 6 18'] },
  {
    name: 'file-zip',
    viewBox: '0 0 24 24',
    paths: ['M6 3h8l4 4v14H6zM14 3v5h5M11 8h2M11 11h2M11 14h2M10 18h4'],
  },
  { name: 'home', viewBox: '0 0 24 24', paths: ['m3 11 9-8 9 8v10h-6v-6H9v6H3z'] },
  { name: 'image', viewBox: '0 0 24 24', paths: ['M4 5h16v14H4zM7 9h.01M5 17l5-5 3 3 2-2 4 4'] },
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
] as const satisfies readonly IconDefinition[];

const definitionsByName: ReadonlyMap<string, IconDefinition> = new Map(
  definitions.map((definition) => [definition.name, definition]),
);

export function getIconDefinition(name: string): IconDefinition | undefined {
  return definitionsByName.get(name);
}

export const iconNames = definitions.map((definition) => definition.name);
