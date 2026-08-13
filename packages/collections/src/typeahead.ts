import type { CollectionKey, CollectionSnapshot } from './types.js';

export interface TypeaheadState {
  readonly search: string;
  readonly lastInputAt: number | null;
}

export const emptyTypeaheadState: TypeaheadState = Object.freeze({
  search: '',
  lastInputAt: null,
});

export function updateTypeaheadState(
  state: TypeaheadState,
  input: string,
  timestamp: number,
  timeout = 500,
): TypeaheadState {
  if (input.length === 0) return state;
  const elapsed =
    state.lastInputAt === null ? Number.POSITIVE_INFINITY : timestamp - state.lastInputAt;
  const reset = elapsed < 0 || elapsed > timeout;
  return Object.freeze({
    search: reset ? input : `${state.search}${input}`,
    lastInputAt: timestamp,
  });
}

export function getTypeaheadQuery(search: string): string {
  const characters = Array.from(search);
  const first = characters[0];
  if (first === undefined) return '';
  const normalizedFirst = first.toLowerCase();
  return characters.every((character) => character.toLowerCase() === normalizedFirst)
    ? first
    : search;
}

const defaultNormalizeText = (value: string): string => value.normalize('NFKC').toLowerCase();

export function findTypeaheadMatch<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  search: string,
  currentKey: Key | null | undefined,
  options: { readonly normalizeText?: ((value: string) => string) | undefined } = {},
): Key | null {
  const normalizeText = options.normalizeText ?? defaultNormalizeText;
  const query = normalizeText(getTypeaheadQuery(search));
  const keys = snapshot.enabledKeys;
  if (query.length === 0 || keys.length === 0) return null;
  const currentIndex =
    currentKey === null || currentKey === undefined ? -1 : keys.indexOf(currentKey);
  for (let offset = 1; offset <= keys.length; offset += 1) {
    const key = keys[(currentIndex + offset + keys.length) % keys.length];
    if (key === undefined) continue;
    const textValue = snapshot.getItem(key)?.textValue;
    if (textValue !== undefined && normalizeText(textValue).startsWith(query)) return key;
  }
  return null;
}
