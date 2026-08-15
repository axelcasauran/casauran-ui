const REQUIRED_OWNER_ROLES = ['maintainer', 'evidence-reviewer'];
const REQUIRED_SECTION = '## Scope and ownership';
const MINIMUM_SECTIONS = 8;
const MINIMUM_LINES = 40;
const BOUNDARY_HEADING = /boundary|future .*contract/iu;
const STAGE_BOUNDARY_HEADING = /^## (F0\.[0-9]{2}) boundary$/u;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);

const validateUnique = (values, label, errors) => {
  for (const value of duplicates(values)) errors.push(`duplicate ${label} ${value}`);
};

/**
 * Parses the governed two-line header every foundation specification must carry.
 *
 * ```text
 * Stage: `F0.09`
 * Status: implemented
 * ```
 */
export const parseSpecificationHeader = (source) => {
  const stage = /^Stage:\s*`?(F0\.[0-9]{2})`?\s*$/mu.exec(source ?? '');
  const status = /^Status:\s*([a-z-]+)\s*$/mu.exec(source ?? '');
  return {
    stage: stage?.[1] ?? null,
    status: status?.[1] ?? null,
  };
};

const validateSpecificationShape = (specification, source, ownStage, knownStages, errors) => {
  const lines = source.split(/\r?\n/u);
  if (lines.length < MINIMUM_LINES) {
    errors.push(`${specification}: ${lines.length} lines; expected >= ${MINIMUM_LINES}`);
  }
  const headings = lines.filter((line) => line.startsWith('## ')).map((line) => line.trim());
  if (!headings.includes(REQUIRED_SECTION)) {
    errors.push(`${specification} missing required section ${REQUIRED_SECTION}`);
  }
  if (headings.length < MINIMUM_SECTIONS) {
    errors.push(
      `${specification} declares ${headings.length} sections; expected >= ${MINIMUM_SECTIONS}`,
    );
  }

  // Every foundation contract closes by naming what it does not own, so the next owner is explicit
  // instead of inferred.
  const closing = headings.at(-1);
  if (closing === undefined || !BOUNDARY_HEADING.test(closing)) {
    errors.push(`${specification} must close with an explicit stage boundary section`);
    return;
  }
  const named = STAGE_BOUNDARY_HEADING.exec(closing);
  if (named === null) return;
  const namedStage = named[1];
  if (namedStage === ownStage) {
    errors.push(`${specification} closes with a self-referential ${namedStage} boundary`);
  }
  if (!knownStages.has(namedStage)) {
    errors.push(`${specification} boundary names unknown stage ${namedStage}`);
  }
};

export const validateFoundationSpecifications = (
  contract,
  { stages = [], specificationSources = {}, specificationFiles = [], governanceRoles = [] } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['foundation specification contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== 'foundation-specifications.schema.json') {
    errors.push('$schema must identify foundation-specifications.schema.json');
  }

  const ownerRoles = Array.isArray(contract.ownerRoles) ? contract.ownerRoles : [];
  for (const role of REQUIRED_OWNER_ROLES) {
    if (!ownerRoles.includes(role)) errors.push(`missing required owner role ${role}`);
  }
  for (const role of ownerRoles) {
    if (!governanceRoles.includes(role)) errors.push(`unknown contract owner role ${role}`);
  }

  const vocabulary = Array.isArray(contract.statusVocabulary) ? contract.statusVocabulary : [];
  validateUnique(
    vocabulary.map((entry) => entry.id),
    'specification status',
    errors,
  );
  const stageStatusToSpecStatus = new Map();
  for (const entry of vocabulary) {
    for (const stageStatus of entry.stageStatuses ?? []) {
      if (stageStatusToSpecStatus.has(stageStatus)) {
        errors.push(`stage status ${stageStatus} maps to more than one specification status`);
        continue;
      }
      stageStatusToSpecStatus.set(stageStatus, entry.id);
    }
  }
  const allowedSpecStatuses = new Set(vocabulary.map((entry) => entry.id));

  const declared = Array.isArray(contract.stages) ? contract.stages : [];
  validateUnique(
    declared.map((entry) => entry.stage),
    'declared foundation stage',
    errors,
  );
  validateUnique(
    declared.map((entry) => entry.specification).filter((value) => typeof value === 'string'),
    'declared specification',
    errors,
  );

  const foundationStages = stages.filter((stage) => stage.type === 'foundation');
  const declaredIds = declared.map((entry) => entry.stage);
  for (const stage of foundationStages) {
    if (!declaredIds.includes(stage.id)) {
      errors.push(`foundation stage ${stage.id} has no specification binding`);
    }
  }
  const stageById = new Map(foundationStages.map((stage) => [stage.id, stage]));

  const root = typeof contract.specificationRoot === 'string' ? contract.specificationRoot : '';
  const boundFiles = new Set();

  for (const entry of declared) {
    const stage = stageById.get(entry.stage);
    if (stage === undefined) {
      errors.push(`specification binding names unknown foundation stage ${entry.stage}`);
      continue;
    }
    if (entry.title !== stage.title) {
      errors.push(`${entry.stage} specification binding title does not match the stage ledger`);
    }

    if (entry.specification === null) {
      if (typeof entry.exemptReason !== 'string' || entry.exemptReason.trim().length === 0) {
        errors.push(`${entry.stage} must record why it owns no specification`);
      }
      continue;
    }
    if (entry.exemptReason !== undefined) {
      errors.push(`${entry.stage} declares a specification and must not also claim exemption`);
    }
    if (!entry.specification.startsWith(`${root}/`)) {
      errors.push(`${entry.stage} specification must live under ${root}`);
      continue;
    }
    boundFiles.add(entry.specification);

    const source = specificationSources[entry.specification];
    if (typeof source !== 'string') {
      errors.push(`${entry.stage} specification does not exist: ${entry.specification}`);
      continue;
    }

    const header = parseSpecificationHeader(source);
    if (header.stage === null) {
      errors.push(`${entry.specification} must declare a Stage header`);
    } else if (header.stage !== entry.stage) {
      errors.push(`${entry.specification} declares ${header.stage} but is bound to ${entry.stage}`);
    }

    if (header.status === null) {
      errors.push(`${entry.specification} must declare a Status header`);
    } else if (!allowedSpecStatuses.has(header.status)) {
      errors.push(`${entry.specification} uses ungoverned status ${header.status}`);
    } else {
      const expected = stageStatusToSpecStatus.get(stage.status);
      if (expected === undefined) {
        errors.push(`stage status ${stage.status} has no governed specification status`);
      } else if (header.status !== expected) {
        errors.push(
          `${entry.specification} status ${header.status} contradicts ${entry.stage} stage status ${stage.status}`,
        );
      }
    }

    validateSpecificationShape(
      entry.specification,
      source,
      entry.stage,
      new Set(stages.map((candidate) => candidate.id)),
      errors,
    );
  }

  for (const file of specificationFiles) {
    if (!boundFiles.has(file)) {
      errors.push(`unbound foundation specification: ${file}`);
    }
  }

  return errors;
};
