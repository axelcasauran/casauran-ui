const REQUIRED_LIFECYCLE = [
  'preflight',
  'classify',
  'route',
  'acceptance',
  'execute',
  'validate',
  'record',
  'stop',
];

const REQUIRED_TASK_CLASSES = [
  'foundation',
  'public-component',
  'engine',
  'bug',
  'documentation',
  'accessibility',
  'performance',
  'dependency',
  'architecture',
  'migration',
  'release',
  'composed-artifact',
];

const REQUIRED_OPERATIONS = [
  'phase-preparation',
  'phase-certification',
  'reference-baseline',
  'reference-sync',
  'reference-to-spec',
  'parity-audit',
  'toolchain-upgrade',
];

const REQUIRED_MODIFIERS = [
  'complex-widget',
  'theme-change',
  'security-sensitive',
  'internationalization-sensitive',
  'large-data',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);

const validateRequiredIds = (entries, required, label, errors) => {
  const ids = entries.map((entry) => entry.id);
  for (const id of duplicates(ids)) errors.push(`duplicate ${label} ${id}`);
  for (const id of required) {
    if (!ids.includes(id)) errors.push(`missing required ${label} ${id}`);
  }
};

const addRoute = (target, route) => {
  for (const kind of ['prompts', 'workflows', 'skills']) {
    for (const id of route[kind] ?? []) target[kind].add(id);
  }
};

export const resolveAgentRoute = (
  contract,
  { taskClass, operations = [], modifiers = [], domains = [] },
) => {
  const resolved = {
    prompts: new Set(),
    workflows: new Set(),
    skills: new Set(),
  };
  const select = (entries, id, label) => {
    const route = entries.find((entry) => entry.id === id);
    if (!route) throw new Error(`unknown ${label} ${id}`);
    addRoute(resolved, route);
  };

  select(contract.taskClasses, taskClass, 'task class');
  for (const id of operations) select(contract.operations, id, 'operation');
  for (const id of modifiers) select(contract.modifiers, id, 'modifier');
  for (const id of domains) {
    const route = contract.domainRoutes.find((entry) => entry.id === id);
    if (!route) throw new Error(`unknown domain route ${id}`);
    for (const skill of route.skills) resolved.skills.add(skill);
  }

  return Object.fromEntries(
    Object.entries(resolved).map(([kind, values]) => [kind, [...values].sort()]),
  );
};

export const validateAgentOperatingSystem = (contract, catalogs, sourceExists = () => true) => {
  const errors = [];
  if (!isObject(contract)) return ['agent operating system contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!sourceExists(contract.authorityContract ?? '')) {
    errors.push(`authority contract does not exist: ${contract.authorityContract}`);
  }

  if (!Array.isArray(contract.ownerRoles) || contract.ownerRoles.length === 0) {
    errors.push('ownerRoles must not be empty');
  } else {
    for (const role of duplicates(contract.ownerRoles)) errors.push(`duplicate owner role ${role}`);
  }
  if (!isObject(contract.catalogs)) {
    errors.push('catalog roots are required');
  } else {
    for (const key of ['skillsRoot', 'workflowsRoot', 'promptsRoot']) {
      const root = contract.catalogs[key];
      if (typeof root !== 'string' || root.length === 0) {
        errors.push(`catalog root ${key} is required`);
      } else if (!sourceExists(root)) {
        errors.push(`catalog root does not exist: ${root}`);
      }
    }
  }
  if (!Array.isArray(contract.requiredInputs) || contract.requiredInputs.length === 0) {
    errors.push('requiredInputs must not be empty');
  }

  const lifecycle = Array.isArray(contract.executionLifecycle) ? contract.executionLifecycle : [];
  validateRequiredIds(lifecycle, REQUIRED_LIFECYCLE, 'lifecycle step', errors);
  for (const step of lifecycle) {
    if (!Array.isArray(step.requirements) || step.requirements.length === 0) {
      errors.push(`lifecycle step ${step.id} must define requirements`);
    }
  }

  const taskClasses = Array.isArray(contract.taskClasses) ? contract.taskClasses : [];
  const operations = Array.isArray(contract.operations) ? contract.operations : [];
  const modifiers = Array.isArray(contract.modifiers) ? contract.modifiers : [];
  const domainRoutes = Array.isArray(contract.domainRoutes) ? contract.domainRoutes : [];
  validateRequiredIds(taskClasses, REQUIRED_TASK_CLASSES, 'task class', errors);
  validateRequiredIds(operations, REQUIRED_OPERATIONS, 'operation', errors);
  validateRequiredIds(modifiers, REQUIRED_MODIFIERS, 'modifier', errors);

  const routeIds = [
    ...taskClasses.map((entry) => entry.id),
    ...operations.map((entry) => entry.id),
    ...modifiers.map((entry) => entry.id),
    ...domainRoutes.map((entry) => entry.id),
  ];
  for (const id of duplicates(routeIds)) errors.push(`route id is not globally unique: ${id}`);

  const registered = {
    prompts: new Set(),
    workflows: new Set(),
    skills: new Set(),
  };
  for (const route of [...taskClasses, ...operations, ...modifiers]) {
    for (const kind of ['prompts', 'workflows', 'skills']) {
      if (!Array.isArray(route[kind])) {
        errors.push(`${route.id} must define ${kind}`);
        continue;
      }
      for (const id of duplicates(route[kind])) errors.push(`${route.id} repeats ${kind} ${id}`);
    }
    addRoute(registered, route);
  }
  for (const route of domainRoutes) {
    if (!Array.isArray(route.skills) || route.skills.length === 0) {
      errors.push(`domain route ${route.id} must define skills`);
      continue;
    }
    for (const skill of route.skills) registered.skills.add(skill);
  }

  for (const kind of ['prompts', 'workflows', 'skills']) {
    const available = new Set(catalogs[kind] ?? []);
    for (const id of registered[kind]) {
      if (!available.has(id)) errors.push(`unknown ${kind.slice(0, -1)} route ${id}`);
    }
    for (const id of available) {
      if (!registered[kind].has(id)) errors.push(`unrouted ${kind.slice(0, -1)} ${id}`);
    }
  }

  if (!Array.isArray(contract.blockingConditions) || contract.blockingConditions.length === 0) {
    errors.push('blockingConditions must not be empty');
  }
  if (!Array.isArray(contract.stopConditions) || contract.stopConditions.length === 0) {
    errors.push('stopConditions must not be empty');
  }
  return errors;
};
