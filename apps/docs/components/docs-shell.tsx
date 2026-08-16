import Link from 'next/link';
import type { ReactNode } from 'react';

import { docsDocuments, plannedComponent } from '../lib/content';
import { CurrentLink } from './current-link';
import { PresentationControls } from './presentation-controls';

function Brand() {
  return (
    <Link aria-label="Casauran UI documentation home" className="docs-brand" href="/">
      <span aria-hidden="true" className="docs-brand-mark">
        <span />
        <span />
      </span>
      <span className="docs-brand-wordmark">
        <strong>Casauran</strong>
        <small>UI documentation</small>
      </span>
    </Link>
  );
}

function Navigation() {
  return (
    <nav aria-label="Documentation" className="docs-navigation">
      <div className="docs-nav-group">
        <p>Start here</p>
        <CurrentLink className="docs-nav-link" href="/">
          Overview
        </CurrentLink>
      </div>
      <div className="docs-nav-group">
        <p>Components</p>
        {docsDocuments.map((document) => (
          <div className="docs-nav-component" key={document.stageId}>
            <CurrentLink className="docs-nav-link" href={document.href}>
              <span>{document.title}</span>
              <span className="docs-nav-stage">{document.stageId}</span>
            </CurrentLink>
            <ul aria-label={`${document.title} topics`} className="docs-nav-topics">
              {document.headings
                .filter((heading) => heading.id !== 'overview')
                .map((heading) => (
                  <li key={heading.id}>
                    <CurrentLink
                      className="docs-nav-topic-link"
                      href={`${document.href}/${heading.id}`}
                    >
                      {heading.title}
                    </CurrentLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {plannedComponent ? (
          <span className="docs-nav-link docs-nav-link-planned">
            <span>{plannedComponent.title}</span>
            <span className="docs-nav-stage">next</span>
          </span>
        ) : null}
      </div>
      <div className="docs-nav-group">
        <p>Foundations</p>
        <a className="docs-nav-link" href="/#documentation-contract">
          Documentation contract
        </a>
        <a className="docs-nav-link" href="/docs-index.json">
          Search metadata
        </a>
      </div>
    </nav>
  );
}

export function DocsShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="docs-shell">
      <a className="docs-skip-link" href="#main-content">
        Skip to documentation
      </a>
      <header className="docs-header">
        <Brand />
        <div className="docs-header-meta">
          <span className="docs-version">Foundation · 0.x</span>
          <PresentationControls />
        </div>
      </header>
      <details className="docs-mobile-navigation">
        <summary>Browse documentation</summary>
        <Navigation />
      </details>
      <div className="docs-shell-body">
        <aside aria-label="Documentation sidebar" className="docs-sidebar">
          <Navigation />
          <div className="docs-sidebar-note">
            <span aria-hidden="true" className="docs-pulse" />
            Built stage by stage from supported APIs.
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
}
