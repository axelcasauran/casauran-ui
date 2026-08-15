import assert from 'node:assert/strict';
import test from 'node:test';

import {
  capabilityRows,
  validateParityDocument,
  validatePendingEntry,
} from './capability-completeness.mjs';

const rationale = 'A written rationale long enough to explain the decision to a reviewer later on.';

const document = (rows, counts) =>
  [
    '# Example Parity Audit',
    '',
    '| # | Capability | Disposition | Casauran evidence and rationale |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
    `Disposition counts: \`IMPLEMENTED\` ${String(counts.implemented ?? 0)}, ` +
      `\`IMPLEMENTED_DIFFERENTLY\` ${String(counts.differently ?? 0)}, ` +
      `\`DEFERRED_TO_DECLARED_DEPENDENCY\` ${String(counts.deferred ?? 0)}, ` +
      `\`NOT_APPLICABLE\` ${String(counts.notApplicable ?? 0)}, ` +
      `\`INTENTIONALLY_DIVERGED\` ${String(counts.diverged ?? 0)}, ` +
      `\`BLOCKED\` ${String(counts.blocked ?? 0)}.`,
    '',
  ].join('\n');

const implementedRow =
  '| 1 | Native semantics | IMPLEMENTED | Native element and browser evidence |';

test('accepts a complete disposition table', () => {
  const markdown = document([implementedRow], { implemented: 1 });
  assert.deepEqual(validateParityDocument('example', markdown), []);
});

test('rejects a parity document with no disposition table', () => {
  const errors = validateParityDocument('example', '# Parity\n\nEverything passes.\n');
  assert.equal(errors.length, 1);
  assert.match(errors[0] ?? '', /no capability table/u);
});

test('rejects a capability row with no disposition', () => {
  const markdown = document(['| 1 | Icons | pass | evidence |'], {});
  assert.ok(
    validateParityDocument('example', markdown).some((error) =>
      /exactly one governed disposition/u.test(error),
    ),
  );
});

test('rejects a capability row carrying two dispositions', () => {
  const markdown = document(['| 1 | Icons | IMPLEMENTED NOT_APPLICABLE | evidence |'], {
    implemented: 1,
  });
  assert.ok(
    validateParityDocument('example', markdown).some((error) =>
      /exactly one governed disposition/u.test(error),
    ),
  );
});

test('rejects a forbidden non-final state used inside an audit table', () => {
  for (const forbidden of ['UNKNOWN', 'NOT_CHECKED', 'TODO']) {
    const markdown = document([implementedRow, `| 2 | Icons | ${forbidden} | pending |`], {
      implemented: 1,
    });
    assert.ok(
      validateParityDocument('example', markdown).some((error) =>
        new RegExp(`forbidden state ${forbidden}`, 'u').test(error),
      ),
    );
  }
});

test('allows prose that names a forbidden state while defining the vocabulary', () => {
  const markdown = `${document([implementedRow], { implemented: 1 })}\nUNKNOWN is never a final state.\n`;
  assert.deepEqual(validateParityDocument('example', markdown), []);
});

test('rejects a deferral that names no owning stage', () => {
  const markdown = document(
    [`| 1 | SVG icons | DEFERRED_TO_DECLARED_DEPENDENCY | ${rationale} |`],
    { deferred: 1 },
  );
  assert.ok(
    validateParityDocument('example', markdown).some((error) =>
      /defers without naming an owning stage/u.test(error),
    ),
  );
});

test('accepts a deferral that names its owning stage', () => {
  const markdown = document(
    [
      '| 1 | SVG icons | DEFERRED_TO_DECLARED_DEPENDENCY | Owner: stage `1.03 SVGIcon` introduces the supported definition surface. |',
    ],
    { deferred: 1 },
  );
  assert.deepEqual(validateParityDocument('example', markdown), []);
});

test('rejects a not-applicable or diverged capability without a rationale', () => {
  for (const disposition of [
    'NOT_APPLICABLE',
    'INTENTIONALLY_DIVERGED',
    'IMPLEMENTED_DIFFERENTLY',
  ]) {
    const markdown = document([`| 1 | Ripple | ${disposition} | n/a |`], {
      notApplicable: disposition === 'NOT_APPLICABLE' ? 1 : 0,
      diverged: disposition === 'INTENTIONALLY_DIVERGED' ? 1 : 0,
      differently: disposition === 'IMPLEMENTED_DIFFERENTLY' ? 1 : 0,
    });
    assert.ok(
      validateParityDocument('example', markdown).some((error) =>
        /without a written rationale/u.test(error),
      ),
      `${disposition} must require a rationale`,
    );
  }
});

test('rejects a disposition summary that disagrees with the table', () => {
  const markdown = document([implementedRow], { implemented: 4 });
  assert.ok(
    validateParityDocument('example', markdown).some((error) =>
      /disposition summary claims 4 IMPLEMENTED rows; the table has 1/u.test(error),
    ),
  );
});

test('rejects a missing disposition summary', () => {
  const markdown = [
    '# Example Parity Audit',
    '',
    '| # | Capability | Disposition | Evidence |',
    '| --- | --- | --- | --- |',
    implementedRow,
    '',
  ].join('\n');
  assert.ok(
    validateParityDocument('example', markdown).some((error) =>
      /must publish a "Disposition counts:" summary/u.test(error),
    ),
  );
});

test('rejects a registry not-applicable dimension with no reason in the document', () => {
  const markdown = document([implementedRow], { implemented: 1 });
  assert.ok(
    validateParityDocument('example', markdown, ['keyboard']).some((error) =>
      /not-applicable in the registry with no reason/u.test(error),
    ),
  );
});

test('reads capability rows only from the disposition table', () => {
  const markdown = [
    document([implementedRow], { implemented: 1 }),
    '| Dimension | Result |',
    '| --- | --- |',
    '| Accessibility | pass |',
  ].join('\n');
  assert.equal(capabilityRows(markdown)?.length, 1);
});

test('rejects a pending revalidation entry that is unnamed, unowned, or unexplained', () => {
  assert.ok(validatePendingEntry({}).length >= 5);
  assert.ok(
    validatePendingEntry({
      component: 'Icon',
      slug: 'icon',
      stage: 'later',
      reason: 'Closed before the contract existed and still carries a prose audit rather than one.',
      requiredBy: 'a governed revalidation',
    }).some((error) => /does not name a stage identifier/u.test(error)),
  );
  assert.ok(
    validatePendingEntry({
      component: 'Icon',
      slug: 'icon',
      stage: '1.02',
      reason: 'legacy',
      requiredBy: 'a governed revalidation',
    }).some((error) => /does not explain why it is still pending/u.test(error)),
  );
});

test('accepts a fully described pending revalidation entry', () => {
  assert.deepEqual(
    validatePendingEntry({
      component: 'Icon',
      slug: 'icon',
      stage: '1.02',
      reason: 'Icon closed before ADR-022 required a per-capability disposition table for parity.',
      requiredBy: 'a governed 1.02 capability revalidation with a fresh reference analysis',
    }),
    [],
  );
});
