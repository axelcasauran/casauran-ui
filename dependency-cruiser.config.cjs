module.exports = {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    { name: 'no-cross-package-internals', severity: 'error', from: { path: '^packages/([^/]+)/' }, to: { path: '^packages/([^/]+)/(src/internal|internal)/' } },
    { name: 'no-app-import-from-package-src', severity: 'error', from: { path: '^apps/' }, to: { path: '^packages/.+/src/' } },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import','types','default'] },
  },
};
