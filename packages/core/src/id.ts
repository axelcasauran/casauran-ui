const INVALID_ID_PART = /[^A-Za-z0-9_-]+/gu;
const EDGE_SEPARATORS = /^[-_]+|[-_]+$/gu;

export function normalizeIdPart(value: string): string {
  const normalized = value.trim().replace(INVALID_ID_PART, '-').replace(EDGE_SEPARATORS, '');
  return normalized.length === 0 ? 'id' : normalized;
}

export function createScopedId(prefix: string, generatedId: string): string {
  return `${normalizeIdPart(prefix)}-${normalizeIdPart(generatedId)}`;
}
