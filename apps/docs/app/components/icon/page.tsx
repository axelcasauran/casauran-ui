import { Icon } from '@casauran/react';
import type { Metadata } from 'next';

import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  DocsPage,
  DocsSection,
  Example,
} from '../../../components/docs-primitives';
import { getDocument } from '../../../lib/content';

export const metadata: Metadata = { title: 'Icon' };
const document = getDocument('1.02');

const source = `import { Icon } from '@casauran/react';

export function Status() {
  return (
    <>
      <Icon name="home" size="lg" />
      <Icon name="check" tone="positive" label="Complete" />
      <Icon name="arrow-left" flip="horizontal" tone="accent" />
    </>
  );
}`;

const apiRows = [
  {
    name: 'name',
    type: 'IconName',
    defaultValue: 'required',
    description: 'A named definition shipped by @casauran/icons.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
    defaultValue: "'md'",
    description: 'Logical icon size from the shared scale.',
  },
  {
    name: 'tone',
    type: "'current' | 'muted' | 'accent' | 'positive' | 'caution' | 'critical'",
    defaultValue: "'current'",
    description: 'Semantic color or current text color.',
  },
  {
    name: 'flip',
    type: "'horizontal' | 'vertical' | 'both'",
    defaultValue: '—',
    description: 'Explicitly mirrors directional artwork.',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: '—',
    description: 'Makes the icon an accessible image when the artwork itself conveys meaning.',
  },
] as const;

export default function IconDocumentationPage() {
  return (
    <DocsPage
      eyebrow="Component · 1.02 · parity verified"
      summary={document.summary}
      title="Icon"
      toc={document.headings}
    >
      <DocsSection id="overview" title="Overview">
        <p>
          Icon renders a named, tree-shakeable Casauran SVG definition without an icon font. It is
          decorative by default, inherits the surrounding text direction and color, and remains
          server-renderable with no component client boundary.
        </p>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <Example source={source} title="Size, tone, and direction">
          <Icon name="home" size="lg" />
          <Icon label="Complete" name="check" size="xl" tone="positive" />
          <Icon flip="horizontal" name="arrow-left" size="xl" tone="accent" />
        </Example>
        <Callout title="Actions own semantics">
          <p>
            Do not attach click behavior to a standalone Icon. Compose it inside Button or another
            component that owns the interaction semantics.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="api" title="API reference">
        <p>
          Icon also accepts non-conflicting SVG presentation attributes and a standard style object.
        </p>
        <ApiReference caption="Icon properties" rows={apiRows} />
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <AccessibilityChecklist
          items={[
            'Decorative icons are hidden from assistive technology by default.',
            'A non-empty label changes the element to an accessible image.',
            'Icons inside labelled controls remain decorative so names are not repeated.',
            'Semantic tones retain meaning in forced colors without relying on color alone.',
            'The component has no keyboard behavior because it does not own an interaction.',
          ]}
        />
      </DocsSection>

      <DocsSection id="theming" title="Theming and RTL">
        <p>
          Import <code>@casauran/react/icon.css</code> once from a layout. Icon consumes semantic
          color and size tokens, supports light/dark and forced-color presentation, and inherits
          direction. Use <code>flip</code> only when the artwork&apos;s meaning is directional; RTL
          does not automatically mirror every symbol.
        </p>
      </DocsSection>

      <DocsSection id="security" title="Security boundary">
        <Callout title="Closed definition catalog" tone="security">
          <p>
            Only definitions shipped by <code>@casauran/icons</code> render. Icon never parses raw
            SVG, HTML, URLs, data URIs, external resources, or executable markup.
          </p>
        </Callout>
        <p>
          Unknown names produce an empty decorative element. The package root reads no browser
          global, listener, current time, or random value, so server and client markup remain
          stable.
        </p>
      </DocsSection>
    </DocsPage>
  );
}
