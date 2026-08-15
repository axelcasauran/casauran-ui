// Capability-completeness contract for component parity documents.
//
// A component that reaches `parity-verified` or `improved` claims that every materially relevant
// reference capability was examined and resolved. Before this contract existed, a parity document
// could record a table of `pass` rows without ever stating what happened to a capability the
// component does not implement, so a missed capability and a deliberately different one looked
// identical. This module holds the pure rules; `validate-capability-completeness.mjs` runs them.

export const AUDITED_STATUSES = new Set(['parity-verified', 'improved']);

export const DISPOSITIONS = [
  'IMPLEMENTED_DIFFERENTLY',
  'DEFERRED_TO_DECLARED_DEPENDENCY',
  'INTENTIONALLY_DIVERGED',
  'NOT_APPLICABLE',
  'IMPLEMENTED',
  'BLOCKED',
];

// `IMPLEMENTED` is a prefix of `IMPLEMENTED_DIFFERENTLY`, so longest-first matching is required.
const DISPOSITION_PATTERN =
  /\b(?:IMPLEMENTED_DIFFERENTLY|DEFERRED_TO_DECLARED_DEPENDENCY|INTENTIONALLY_DIVERGED|NOT_APPLICABLE|IMPLEMENTED|BLOCKED)\b/gu;

export const FORBIDDEN_STATES = ['UNKNOWN', 'NOT_CHECKED', 'TODO', 'TBD', 'FIXME'];

const STAGE_REFERENCE = /(?:F0\.\d{2}|\d{1,2}\.\d{2})/u;
const MINIMUM_RATIONALE_CHARACTERS = 60;

const isTableLine = (line) => line.startsWith('|') && line.endsWith('|');
const cellsOf = (line) =>
  line
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
const isSeparatorRow = (cells) => cells.every((cell) => /^:?-{2,}:?$/u.test(cell));

/** Splits the document into contiguous Markdown table blocks. */
export const tableBlocks = (markdown) => {
  const blocks = [];
  let current = [];
  for (const raw of markdown.split('\n')) {
    const line = raw.trim();
    if (isTableLine(line)) {
      current.push(cellsOf(line));
      continue;
    }
    if (current.length > 0) blocks.push(current);
    current = [];
  }
  if (current.length > 0) blocks.push(current);
  return blocks;
};

export const dispositionsIn = (text) => text.match(DISPOSITION_PATTERN) ?? [];

/**
 * Extracts the body rows of the disposition table: the table whose header carries a `Disposition`
 * column. Returns `undefined` when no such table exists. Other tables in the same document — the
 * enterprise dimension audit, for example — are deliberately ignored.
 */
export const capabilityRows = (markdown) => {
  for (const block of tableBlocks(markdown)) {
    const [header, ...rest] = block;
    if (header === undefined) continue;
    const column = header.findIndex((cell) => cell.toLowerCase() === 'disposition');
    if (column === -1) continue;
    return rest
      .filter((cells) => !isSeparatorRow(cells) && cells.length > column)
      .map((cells) => ({ cells, disposition: cells[column] ?? '' }));
  }
  return undefined;
};

const label = (row) => (row.cells[1] ?? row.cells[0] ?? 'unnamed capability').slice(0, 60);

/**
 * Validates one component's parity document.
 *
 * @param {string} slug component slug, used only in messages
 * @param {string} markdown parity document contents
 * @param {readonly string[]} notApplicableDimensions registry parity dimensions marked not-applicable
 * @returns {string[]} human-readable errors; empty when the document satisfies the contract
 */
export const validateParityDocument = (slug, markdown, notApplicableDimensions = []) => {
  const errors = [];
  const rows = capabilityRows(markdown);

  // Forbidden states are rejected inside audit tables, where they would stand in for a real
  // disposition. Prose that names them — including this contract's own vocabulary section — is
  // documentation, not a claim about a capability.
  for (const block of tableBlocks(markdown)) {
    for (const cells of block) {
      for (const forbidden of FORBIDDEN_STATES) {
        if (cells.some((cell) => new RegExp(`\\b${forbidden}\\b`, 'u').test(cell))) {
          errors.push(`${slug}: audit table contains the forbidden state ${forbidden}`);
        }
      }
    }
  }

  if (rows === undefined) {
    errors.push(`${slug}: parity document has no capability table with a Disposition column`);
    return errors;
  }
  if (rows.length === 0) {
    errors.push(`${slug}: capability table has no capability rows`);
    return errors;
  }

  const counts = Object.fromEntries(DISPOSITIONS.map((name) => [name, 0]));
  for (const row of rows) {
    const found = dispositionsIn(row.disposition);
    if (found.length !== 1) {
      errors.push(
        `${slug}: capability "${label(row)}" must carry exactly one governed disposition, found ${String(found.length)}`,
      );
      continue;
    }
    const [disposition] = found;
    if (disposition === undefined) continue;
    counts[disposition] += 1;

    const rationale = row.cells.slice(-1)[0] ?? '';
    if (
      ['NOT_APPLICABLE', 'INTENTIONALLY_DIVERGED', 'IMPLEMENTED_DIFFERENTLY', 'BLOCKED'].includes(
        disposition,
      ) &&
      rationale.length < MINIMUM_RATIONALE_CHARACTERS
    ) {
      errors.push(
        `${slug}: capability "${label(row)}" is ${disposition} without a written rationale`,
      );
    }
    if (disposition === 'DEFERRED_TO_DECLARED_DEPENDENCY' && !STAGE_REFERENCE.test(rationale)) {
      errors.push(`${slug}: capability "${label(row)}" defers without naming an owning stage`);
    }
  }

  const published = markdown.match(/Disposition counts:([\s\S]*?)\.\n/u)?.[1];
  if (published === undefined) {
    errors.push(`${slug}: parity document must publish a "Disposition counts:" summary`);
  } else {
    for (const name of DISPOSITIONS) {
      const claimed = published.match(new RegExp(`\`${name}\`\\s+(\\d+)`, 'u'))?.[1];
      if (claimed === undefined) {
        errors.push(`${slug}: disposition summary omits ${name}`);
        continue;
      }
      if (Number(claimed) !== counts[name]) {
        errors.push(
          `${slug}: disposition summary claims ${claimed} ${name} rows; the table has ${String(counts[name])}`,
        );
      }
    }
  }

  for (const dimension of notApplicableDimensions) {
    if (!markdown.includes(dimension)) {
      errors.push(
        `${slug}: parity dimension ${dimension} is not-applicable in the registry with no reason in the parity document`,
      );
    }
  }

  return errors;
};

const MINIMUM_PENDING_REASON_CHARACTERS = 60;

/**
 * Validates one `pendingRevalidation` entry. A component completed before this contract was
 * accepted may wait for its own governed revalidation, but only as a named, explained, owned debt —
 * never as a silent exemption.
 *
 * @param {unknown} entry
 * @returns {string[]} human-readable errors
 */
export const validatePendingEntry = (entry) => {
  const errors = [];
  if (entry === null || typeof entry !== 'object') {
    return ['pending revalidation entries must be objects'];
  }
  const record = /** @type {Record<string, unknown>} */ (entry);
  const name = typeof record['slug'] === 'string' ? record['slug'] : 'unnamed entry';
  for (const field of ['component', 'slug', 'stage', 'reason', 'requiredBy']) {
    if (typeof record[field] !== 'string' || record[field] === '') {
      errors.push(`pending revalidation ${name} is missing ${field}`);
    }
  }
  const stage = record['stage'];
  if (typeof stage === 'string' && !STAGE_REFERENCE.test(stage)) {
    errors.push(`pending revalidation ${name} does not name a stage identifier`);
  }
  const reason = record['reason'];
  if (typeof reason === 'string' && reason.length < MINIMUM_PENDING_REASON_CHARACTERS) {
    errors.push(`pending revalidation ${name} does not explain why it is still pending`);
  }
  return errors;
};
