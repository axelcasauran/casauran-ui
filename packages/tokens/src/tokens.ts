export const primitiveTokens = {
  spacing: { 0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem' },
  radius: { none: '0', sm: '0.25rem', md: '0.5rem', full: '9999px' },
  motion: { fast: '120ms', normal: '180ms' },
} as const;

export const semanticTokenNames = [
  'surface.canvas',
  'surface.raised',
  'text.primary',
  'text.secondary',
  'border.default',
  'interactive.primary',
  'focus.ring',
  'status.danger',
] as const;
