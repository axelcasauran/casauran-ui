import { json, read, fail, pass } from './lib.mjs';

const cfg = json('reference/local-reference.json');

if (cfg.mode !== 'local-only') fail('reference mode must be local-only');
if (cfg.environmentVariable !== 'CASAURAN_KENDO_DOCS_PATH') {
  fail('unexpected local reference environment variable');
}
if (cfg.defaultRelativePath !== '../references/kendo-react-docs/docs/content') {
  fail('unexpected default local reference path');
}
if (cfg.onlineFallback !== false) fail('online fallback must be false');

const agents = read('AGENTS.md');
const policy = read('KENDO_REFERENCE_POLICY.md');
const prompt = read('.agent/prompts/component-stage.md');

if (!agents.includes('strictly local-only'))
  fail('AGENTS.md missing strict local-only reference rule');
if (!policy.includes('Online fallback is disabled'))
  fail('reference policy does not disable online fallback');
if (!prompt.includes('Mandatory local reference preflight'))
  fail('component-stage prompt missing local preflight');

pass('local-only reference configuration contract');
