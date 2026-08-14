import Link from 'next/link';

import { Callout, DocsPage, DocsSection } from '../components/docs-primitives';
import { docsDocuments } from '../lib/content';

const toc = [
  { id: 'overview', title: 'Overview' },
  { id: 'component-library', title: 'Component library' },
  { id: 'documentation-contract', title: 'Documentation contract' },
] as const;

export default function Page() {
  return (
    <DocsPage
      eyebrow="Documentation foundation · F0.18"
      summary="A governed, accessible home for building serious interfaces with Casauran UI—clear contracts, executable examples, and enterprise integration guidance."
      title="Build with clarity."
      toc={toc}
    >
      <div className="docs-hero-panel">
        <p className="docs-hero-kicker">Independent by design</p>
        <h2>Product documentation that grows with the system.</h2>
        <p>
          Every page is composed from one reusable documentation architecture while component
          behavior stays owned by supported Casauran packages.
        </p>
      </div>

      <DocsSection id="overview" title="A dependable product surface">
        <p>
          Casauran UI is an enterprise React component platform built around durable capability
          ownership, semantic HTML, WCAG 2.2 AA, static theming, and Next.js-first integration.
          Documentation ships alongside behavior—not as an afterthought.
        </p>
        <div className="docs-metrics">
          <div className="docs-metric">
            <strong>{docsDocuments.length}</strong>
            <span>documented public components</span>
          </div>
          <div className="docs-metric">
            <strong>3</strong>
            <span>production browser engines</span>
          </div>
          <div className="docs-metric">
            <strong>AA</strong>
            <span>accessibility baseline</span>
          </div>
        </div>
        <Callout title="Stage boundary" tone="success">
          <p>
            F0.18 establishes documentation infrastructure only. It does not begin SVGIcon or
            another public component.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="component-library" title="Explore components">
        <p>Only completed public stages receive customer documentation routes.</p>
        <div className="docs-card-grid">
          {docsDocuments.map((document) => (
            <Link className="docs-card" href={document.href} key={document.stageId}>
              <small>{document.stageId}</small>
              <strong>{document.title}</strong>
              <span>{document.summary}</span>
            </Link>
          ))}
        </div>
      </DocsSection>

      <DocsSection id="documentation-contract" title="One documentation contract">
        <p>
          Component pages use stable routes and anchors, a page-level contents model, executable
          examples with escaped source, typed API tables, and reusable accessibility and keyboard
          structures. Navigation and future search indexing come from the governed stage registry.
        </p>
        <Callout title="Search-ready metadata">
          <p>
            The deterministic <a href="/docs-index.json">documentation index</a> exposes normalized
            routes, headings, keywords, and stage IDs without adding a search vendor or client
            payload.
          </p>
        </Callout>
      </DocsSection>
    </DocsPage>
  );
}
