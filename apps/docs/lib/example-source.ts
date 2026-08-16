import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Reads an example's own source file (F0.19).
 *
 * Before this stage the displayed source was a hand-written template literal sitting beside the
 * JSX it claimed to describe, so the two could disagree and nothing detected it. Now the string a
 * reader sees is read from the very module that renders the preview, at build time, during static
 * generation. There is one source of truth and it is executable.
 */
const examplesRoot = path.join(process.cwd(), 'content');

export const readExampleSource = (slug: string, example: string): string => {
  const file = path.join(examplesRoot, slug, 'examples', `${example}.tsx`);
  const source = readFileSync(file, 'utf8');
  // The leading directive and imports are build plumbing, not the lesson. Everything from the
  // exported component onwards is what a reader copies.
  const start = source.indexOf('export function');
  return (start === -1 ? source : source.slice(start)).trimEnd();
};
