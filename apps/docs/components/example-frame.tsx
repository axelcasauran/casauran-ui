'use client';

import { useId, useState, type ReactNode } from 'react';

/**
 * The interactive half of an example (F0.19). It is a client island per example rather than a
 * client boundary per page: the surrounding route, shell and prose stay server-rendered.
 *
 * The preview is always mounted, so an example that demonstrates interaction actually interacts.
 * Switching to source hides the preview rather than unmounting it, which keeps demo state intact
 * while a reader checks the code.
 */
export function ExampleFrame({
  children,
  source,
  title,
}: {
  readonly children: ReactNode;
  readonly source: string;
  readonly title: string;
}) {
  const [view, setView] = useState<'preview' | 'source'>('preview');
  const baseId = useId();
  const previewId = `${baseId}-preview`;
  const sourceId = `${baseId}-source`;
  const labelId = `${baseId}-label`;

  return (
    <figure className="docs-example">
      <figcaption id={labelId}>{title}</figcaption>
      <div aria-label={`${title} view`} className="docs-example-tabs" role="tablist">
        <button
          aria-controls={previewId}
          aria-selected={view === 'preview'}
          className="docs-example-tab"
          id={`${baseId}-preview-tab`}
          onClick={() => {
            setView('preview');
          }}
          role="tab"
          type="button"
        >
          Example
        </button>
        <button
          aria-controls={sourceId}
          aria-selected={view === 'source'}
          className="docs-example-tab"
          id={`${baseId}-source-tab`}
          onClick={() => {
            setView('source');
          }}
          role="tab"
          type="button"
        >
          View source
        </button>
      </div>
      <div
        aria-labelledby={`${baseId}-preview-tab`}
        className="docs-example-preview"
        data-hidden={view === 'preview' ? undefined : ''}
        id={previewId}
        role="tabpanel"
      >
        {children}
      </div>
      <div
        aria-labelledby={`${baseId}-source-tab`}
        className="docs-example-source"
        data-hidden={view === 'source' ? undefined : ''}
        id={sourceId}
        role="tabpanel"
      >
        <pre tabIndex={0}>
          <code>{source}</code>
        </pre>
      </div>
    </figure>
  );
}
