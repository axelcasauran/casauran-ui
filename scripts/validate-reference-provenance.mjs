import { json, fail, pass } from './lib.mjs';
const b = json('reference/kendo-react-baseline.json');
if (b.commit !== '6a05c926c4f08b89782c25336fc159fea3a3f26b') fail('reference baseline changed without deliberate sync');
if (b.path !== 'docs/content') fail('unexpected reference path');
if (b.purpose !== 'functional-behavioral-reference-only') fail('invalid reference purpose');
pass('reference provenance pinned');
