import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DocsPage, DocsSection } from '../../../../components/docs-primitives';
import {
  componentRoutes,
  componentSlugs,
  getComponentTopics,
  getDocumentBySlug,
} from '../../../../lib/content';
import { getTopic, orderTopics } from '../../../../lib/topics';

export function generateStaticParams() {
  return componentRoutes.map((route) => ({ slug: route.slug, topic: route.topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { slug, topic } = await params;
  if (!componentSlugs.includes(slug)) return {};
  const topics = getComponentTopics(slug);
  const page = topics[topic];
  if (!page) return {};
  const document = getDocumentBySlug(slug);
  return { title: `${document.title} · ${getTopic(topic).title}`, description: page.summary };
}

export default async function ComponentTopicPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic } = await params;
  if (!componentSlugs.includes(slug)) notFound();

  const topics = getComponentTopics(slug);
  const page = topics[topic];
  if (!page) notFound();

  const document = getDocumentBySlug(slug);
  const definition = getTopic(topic);
  const published = orderTopics(topics);
  const position = published.findIndex((candidate) => candidate.id === topic);
  const previous = position > 0 ? published[position - 1] : undefined;
  const next = published[position + 1];

  return (
    <DocsPage
      eyebrow={`${document.title} · ${document.stageId}`}
      summary={page.summary}
      title={definition.title}
      toc={document.headings.map((heading) => ({
        id: heading.id,
        title: heading.title,
        href: `${document.href}/${heading.id}`,
      }))}
    >
      <p className="docs-breadcrumb">
        <Link href="/components">Components</Link> <span aria-hidden="true">/</span>{' '}
        <Link href={document.href}>{document.title}</Link> <span aria-hidden="true">/</span>{' '}
        <span aria-current="page">{definition.title}</span>
      </p>

      <DocsSection id={topic} title={definition.title}>
        {page.content}
      </DocsSection>

      <nav aria-label="Topic navigation" className="docs-topic-nav">
        {previous ? (
          <Link href={`${document.href}/${previous.id}`}>
            <small>Previous</small>
            <span>{previous.title}</span>
          </Link>
        ) : (
          <Link href={document.href}>
            <small>Previous</small>
            <span>{document.title} overview</span>
          </Link>
        )}
        {next ? (
          <Link href={`${document.href}/${next.id}`}>
            <small>Next</small>
            <span>{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </DocsPage>
  );
}
