import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DocsPage, DocsSection } from '../../../components/docs-primitives';
import { componentSlugs, getComponentTopics, getDocumentBySlug } from '../../../lib/content';
import { getTopic, orderTopics } from '../../../lib/topics';

export function generateStaticParams() {
  return componentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!componentSlugs.includes(slug)) return {};
  const document = getDocumentBySlug(slug);
  return { title: document.title, description: document.summary };
}

export default async function ComponentOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!componentSlugs.includes(slug)) notFound();

  const document = getDocumentBySlug(slug);
  const topics = getComponentTopics(slug);
  const published = orderTopics(topics);
  const overview = topics['overview'];

  return (
    <DocsPage
      eyebrow={`Component · ${document.stageId}`}
      summary={document.summary}
      title={document.title}
      toc={document.headings}
    >
      {overview ? (
        <DocsSection id="overview" title={getTopic('overview').title}>
          {overview.content}
        </DocsSection>
      ) : null}

      <DocsSection id="topics" title="Documentation topics">
        <p>
          Each topic below is its own page. Every published section anchor from earlier releases
          still resolves here and links to the topic that now owns it.
        </p>
        <div className="docs-card-grid">
          {published
            .filter((topic) => topic.id !== 'overview')
            .map((topic) => (
              <Link
                className="docs-card"
                href={`${document.href}/${topic.id}`}
                id={topic.id}
                key={topic.id}
              >
                <small>{document.title}</small>
                <strong>{topic.title}</strong>
                <span>{topics[topic.id]?.summary ?? topic.summary}</span>
              </Link>
            ))}
        </div>
      </DocsSection>
    </DocsPage>
  );
}
