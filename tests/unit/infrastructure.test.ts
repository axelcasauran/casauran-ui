import { describe, expect, it } from 'vitest';

describe('unit test infrastructure', () => {
  it('executes repository-root ESM TypeScript tests', () => {
    expect(import.meta.url).toMatch(/tests\/unit\/infrastructure\.test\.ts$/u);
  });

  it('uses an explicit deterministic fixture', () => {
    const fixture = Object.freeze({ id: 'infrastructure', revision: 1 });
    expect(fixture).toEqual({ id: 'infrastructure', revision: 1 });
  });
});
