import stageRegistry from '../../../.agent/stages/index.json';
import { buttonTopics } from '../content/button';
import { iconTopics } from '../content/icon';
import { type ComponentTopics, orderTopics, type TocItem } from './topics';

export type { TocItem };

export interface DocsDocument {
  readonly stageId: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly category: 'Components';
  readonly href: string;
  /** Published topics, ordered by the governed topic model. */
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

interface ComponentSource {
  readonly stageId: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly keywords: readonly string[];
  readonly topics: ComponentTopics;
}

// Route content is declared, not hand-authored per page (F0.19). Every component publishes a
// subset of the governed topic model, and routes, navigation, tables of contents and search
// metadata are all derived from this one declaration.
const componentSources: readonly ComponentSource[] = [
  {
    stageId: '1.01',
    slug: 'button',
    title: 'Button',
    summary: 'Native action semantics, visual variants, toggle state, and form behavior.',
    keywords: ['action', 'button', 'pressed', 'form', 'toggle', 'icon', 'appearance', 'size'],
    topics: buttonTopics,
  },
  {
    stageId: '1.02',
    slug: 'icon',
    title: 'Icon',
    summary: 'Tree-shakeable Casauran SVG definitions with decorative and labelled modes.',
    keywords: ['icon', 'svg', 'symbol', 'accessible image', 'direction'],
    topics: iconTopics,
  },
];

const stages = stageRegistry as readonly StageRecord[];

export const docsDocuments: readonly DocsDocument[] = componentSources.map((source) => {
  const stage = stages.find((candidate) => candidate.id === source.stageId);
  if (stage?.type !== 'public-component' || stage.status !== 'complete') {
    throw new Error(`Documentation route /components/${source.slug} requires a completed stage`);
  }
  return Object.freeze({
    stageId: source.stageId,
    slug: source.slug,
    title: source.title,
    summary: source.summary,
    category: 'Components' as const,
    href: `/components/${source.slug}`,
    headings: orderTopics(source.topics).map((topic) => ({ id: topic.id, title: topic.title })),
    keywords: source.keywords,
  });
});

const topicsBySlug = new Map(componentSources.map((source) => [source.slug, source.topics]));

export const componentSlugs: readonly string[] = componentSources.map((source) => source.slug);

export const getComponentTopics = (slug: string): ComponentTopics => {
  const topics = topicsBySlug.get(slug);
  if (!topics) throw new Error(`Unknown documented component ${slug}`);
  return topics;
};

export const getDocumentBySlug = (slug: string): DocsDocument => {
  const document = docsDocuments.find((candidate) => candidate.slug === slug);
  if (!document) throw new Error(`Missing documentation metadata for ${slug}`);
  return document;
};

/** Every generated component route, used for static params and for route contract checks. */
export const componentRoutes: readonly { slug: string; topic: string }[] = componentSources.flatMap(
  (source) => orderTopics(source.topics).map((topic) => ({ slug: source.slug, topic: topic.id })),
);

export const plannedComponent = (() => {
  const stage = stages.find((candidate) => candidate.status === 'not-started');
  return stage?.type === 'public-component' && stage.component
    ? { stageId: stage.id, title: stage.component }
    : undefined;
})();

export const docsIndex = Object.freeze({
  schemaVersion: 1,
  source: '.agent/stages/index.json',
  documents: docsDocuments.map((document) => ({
    ...document,
    topics: document.headings.map((heading) => ({
      id: heading.id,
      title: heading.title,
      href: `${document.href}/${heading.id}`,
    })),
  })),
});

export const getDocument = (stageId: string): DocsDocument => {
  const document = docsDocuments.find((candidate) => candidate.stageId === stageId);
  if (!document) throw new Error(`Missing documentation metadata for ${stageId}`);
  return document;
};
