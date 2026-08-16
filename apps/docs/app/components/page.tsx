import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsPage, DocsSection } from '../../components/docs-primitives';
import { docsDocuments, plannedComponent } from '../../lib/content';

export const metadata: Metadata = {
  title: 'Components',
  description: 'Documented Casauran UI components and their capability topics.',
};

const toc = [{ id: 'library', title: 'Component library' }] as const;

export default function ComponentsIndexPage() {
  return (
    <DocsPage
      eyebrow="Components"
      summary="Every completed public component, with its documentation split by capability topic."
      title="Components"
      toc={toc}
    >
      <DocsSection id="library" title="Component library">
        <p>Only completed public stages receive customer documentation routes.</p>
        <div className="docs-card-grid">
          {docsDocuments.map((document) => (
            <Link className="docs-card" href={document.href} key={document.slug}>
              <small>{document.stageId}</small>
              <strong>{document.title}</strong>
              <span>{document.summary}</span>
              <span className="docs-card-meta">{document.headings.length} topics</span>
            </Link>
          ))}
        </div>
        {plannedComponent ? (
          <p>
            Next public component: <strong>{plannedComponent.title}</strong> (
            {plannedComponent.stageId}).
          </p>
        ) : null}
      </DocsSection>
    </DocsPage>
  );
}
