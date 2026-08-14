import type { ReactNode } from 'react';

import type { TocItem } from '../lib/content';

export function DocsPage({
  children,
  eyebrow,
  summary,
  title,
  toc,
}: {
  readonly children: ReactNode;
  readonly eyebrow: string;
  readonly summary: string;
  readonly title: string;
  readonly toc: readonly TocItem[];
}) {
  return (
    <main className="docs-page" id="main-content" tabIndex={-1}>
      <article className="docs-article">
        <header className="docs-page-header">
          <p className="docs-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="docs-lead">{summary}</p>
        </header>
        {children}
      </article>
      <aside aria-label="On this page" className="docs-toc">
        <p>On this page</p>
        <ol>
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ol>
      </aside>
    </main>
  );
}

export function DocsSection({
  children,
  id,
  title,
}: {
  readonly children: ReactNode;
  readonly id: string;
  readonly title: string;
}) {
  return (
    <section className="docs-section" id={id}>
      <h2>
        <a aria-label={`Link to ${title}`} href={`#${id}`}>
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

export function Callout({
  children,
  title,
  tone = 'note',
}: {
  readonly children: ReactNode;
  readonly title: string;
  readonly tone?: 'note' | 'success' | 'caution' | 'security';
}) {
  return (
    <div aria-label={title} className="docs-callout" data-tone={tone} role="note">
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export function Example({
  children,
  source,
  title,
}: {
  readonly children: ReactNode;
  readonly source: string;
  readonly title: string;
}) {
  const previewId = `example-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
  return (
    <figure className="docs-example">
      <figcaption id={previewId}>{title}</figcaption>
      <div aria-labelledby={previewId} className="docs-example-preview" role="group">
        {children}
      </div>
      <details className="docs-source">
        <summary>View source</summary>
        <pre tabIndex={0}>
          <code>{source}</code>
        </pre>
      </details>
    </figure>
  );
}

export interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

export function ApiReference({
  caption,
  rows,
}: {
  readonly caption: string;
  readonly rows: readonly ApiRow[];
}) {
  return (
    <div className="docs-table-scroll" tabIndex={0}>
      <table className="docs-api-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <code>{row.name}</code>
              </th>
              <td>
                <code>{row.type}</code>
              </td>
              <td>
                <code>{row.defaultValue}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface KeyboardRow {
  readonly keys: string;
  readonly result: string;
}

export function KeyboardTable({ rows }: { readonly rows: readonly KeyboardRow[] }) {
  return (
    <div className="docs-table-scroll" tabIndex={0}>
      <table className="docs-keyboard-table">
        <caption>Keyboard interactions</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys}>
              <th scope="row">
                <kbd>{row.keys}</kbd>
              </th>
              <td>{row.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccessibilityChecklist({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="docs-checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
