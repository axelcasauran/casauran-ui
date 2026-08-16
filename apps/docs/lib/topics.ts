import type { ReactNode } from 'react';

import topicModel from '../../../registry/documentation/topics.json';

export interface TocItem {
  readonly id: string;
  readonly title: string;
  /** Set when the entry points at another topic route rather than a section on this page. */
  readonly href?: string;
}

export interface TopicDefinition {
  readonly id: string;
  readonly title: string;
  readonly required: boolean;
  readonly summary: string;
}

export interface TopicPage {
  /** Short lead paragraph shown under the topic title and used as route metadata. */
  readonly summary: string;
  readonly content: ReactNode;
}

export type ComponentTopics = Readonly<Record<string, TopicPage>>;

const model = topicModel as { readonly topics: readonly TopicDefinition[] };

export const topics: readonly TopicDefinition[] = model.topics;
export const topicIds: readonly string[] = topics.map((topic) => topic.id);
export const requiredTopicIds: readonly string[] = topics
  .filter((topic) => topic.required)
  .map((topic) => topic.id);

const byId = new Map(topics.map((topic) => [topic.id, topic]));

export const getTopic = (id: string): TopicDefinition => {
  const topic = byId.get(id);
  if (!topic) throw new Error(`Unknown documentation topic ${id}`);
  return topic;
};

/**
 * Orders a component's published topics by the model, so navigation and route order never depend
 * on the order someone happened to author them in.
 */
export const orderTopics = (published: ComponentTopics): readonly TopicDefinition[] =>
  topics.filter((topic) => topic.id in published);
