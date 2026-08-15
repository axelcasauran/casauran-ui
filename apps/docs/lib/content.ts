import stageRegistry from '../../../.agent/stages/index.json';

export interface TocItem {
  readonly id: string;
  readonly title: string;
}

export interface DocsDocument {
  readonly stageId: string;
  readonly title: string;
  readonly summary: string;
  readonly category: 'Components';
  readonly href: string;
  readonly headings: readonly TocItem[];
  readonly keywords: readonly string[];
}

interface StageRecord {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly component?: string;
  readonly status: string;
}

const componentContent: readonly DocsDocument[] = [
  {
    stageId: '1.01',
    title: 'Button',
    summary: 'Native action semantics, visual variants, toggle state, and form behavior.',
    category: 'Components',
    href: '/components/button',
    headings: [
      { id: 'overview', title: 'Overview' },
      { id: 'examples', title: 'Examples' },
      { id: 'appearance', title: 'Appearance and tone' },
      { id: 'sizes', title: 'Sizes and shapes' },
      { id: 'states', title: 'States' },
      { id: 'content', title: 'Icons, images, and content' },
      { id: 'events', title: 'Events' },
      { id: 'forms', title: 'Forms' },
      { id: 'controlled-state', title: 'Controlled and uncontrolled state' },
      { id: 'api', title: 'API reference' },
      { id: 'accessibility', title: 'Accessibility' },
      { id: 'theming', title: 'Theming, density, RTL, and globalization' },
      { id: 'nextjs', title: 'Next.js and rendering' },
      { id: 'performance', title: 'Performance' },
      { id: 'security', title: 'Security' },
      { id: 'limitations', title: 'Known limitations' },
    ],
    keywords: ['action', 'button', 'pressed', 'form', 'toggle', 'icon', 'appearance', 'size'],
  },
  {
    stageId: '1.02',
    title: 'Icon',
    summary: 'Tree-shakeable Casauran SVG definitions with decorative and labelled modes.',
    category: 'Components',
    href: '/components/icon',
    headings: [
      { id: 'overview', title: 'Overview' },
      { id: 'examples', title: 'Examples' },
      { id: 'api', title: 'API reference' },
      { id: 'accessibility', title: 'Accessibility' },
      { id: 'theming', title: 'Theming and RTL' },
      { id: 'security', title: 'Security boundary' },
    ],
    keywords: ['icon', 'svg', 'symbol', 'accessible image', 'direction'],
  },
];

const stages = stageRegistry as readonly StageRecord[];

export const docsDocuments = componentContent.map((document) => {
  const stage = stages.find((candidate) => candidate.id === document.stageId);
  if (stage?.type !== 'public-component' || stage.status !== 'complete') {
    throw new Error(`Documentation route ${document.href} requires a completed public stage`);
  }
  return Object.freeze(document);
});

export const plannedComponent = (() => {
  const stage = stages.find((candidate) => candidate.status === 'not-started');
  return stage?.type === 'public-component' && stage.component
    ? { stageId: stage.id, title: stage.component }
    : undefined;
})();

export const docsIndex = Object.freeze({
  schemaVersion: 1,
  source: '.agent/stages/index.json',
  documents: docsDocuments,
});

export const getDocument = (stageId: string) => {
  const document = docsDocuments.find((candidate) => candidate.stageId === stageId);
  if (!document) throw new Error(`Missing documentation metadata for ${stageId}`);
  return document;
};
