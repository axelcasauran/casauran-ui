import { Button } from '@casauran/react';
import type { Metadata } from 'next';

import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  DocsPage,
  DocsSection,
  Example,
  KeyboardTable,
} from '../../../components/docs-primitives';
import { getDocument } from '../../../lib/content';

export const metadata: Metadata = { title: 'Button' };
const document = getDocument('1.01');

const basicSource = `import { Button } from '@casauran/react';

export function Actions() {
  return (
    <>
      <Button appearance="solid" tone="accent">Save changes</Button>
      <Button appearance="outline">Cancel</Button>
    </>
  );
}`;

const toggleSource = `<Button
  defaultPressed
  onPressedChange={({ pressed }) => updatePinned(pressed)}
  toggleable
>
  Pin record
</Button>`;

const apiRows = [
  {
    name: 'appearance',
    type: "'solid' | 'soft' | 'outline' | 'ghost' | 'link'",
    defaultValue: "'solid'",
    description: 'Visual treatment independent of semantic tone.',
  },
  {
    name: 'tone',
    type: "'neutral' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse'",
    defaultValue: "'neutral'",
    description: 'Semantic color intent.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Control size from the shared scale.',
  },
  {
    name: 'toggleable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Enables pressed-state semantics and state ownership.',
  },
  {
    name: 'pressed',
    type: 'boolean',
    defaultValue: '—',
    description: 'Controlled pressed state; valid only when toggleable.',
  },
  {
    name: 'defaultPressed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Initial uncontrolled pressed state.',
  },
  {
    name: 'onPressedChange',
    type: '(event) => void',
    defaultValue: '—',
    description: 'Reports requested pressed state after a non-cancelled click.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Applies square icon-only layout; an accessible name is still required.',
  },
] as const;

export default function ButtonDocumentationPage() {
  return (
    <DocsPage
      eyebrow="Component · 1.01 · parity verified"
      summary={document.summary}
      title="Button"
      toc={document.headings}
    >
      <DocsSection id="overview" title="Overview">
        <p>
          Button is Casauran UI&apos;s canonical native action. It renders a semantic{' '}
          <code>button</code>, defaults to <code>type=&quot;button&quot;</code>, and keeps
          appearance, semantic tone, size, radius, and pressed state orthogonal.
        </p>
        <Callout title="Form safety">
          <p>
            Choose <code>type=&quot;submit&quot;</code> or <code>type=&quot;reset&quot;</code>{' '}
            explicitly when the action owns native form behavior.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <p>Examples render the supported package API and expose their source as escaped text.</p>
        <Example source={basicSource} title="Action hierarchy">
          <Button appearance="solid" tone="accent">
            Save changes
          </Button>
          <Button appearance="outline">Cancel</Button>
        </Example>
        <Example source={toggleSource} title="Uncontrolled pressed state">
          <Button defaultPressed toggleable>
            Pin record
          </Button>
        </Example>
      </DocsSection>

      <DocsSection id="api" title="API reference">
        <p>
          Button also accepts compatible native button attributes, including form and ARIA
          attributes.
        </p>
        <ApiReference caption="Button properties" rows={apiRows} />
        <Callout title="State ownership" tone="caution">
          <p>
            Do not switch between controlled and uncontrolled pressed ownership while mounted.
            Cancelling <code>onClick</code> cancels the pressed-state request.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <AccessibilityChecklist
          items={[
            'Native button semantics provide role, focus, and activation behavior.',
            'Toggle mode exposes aria-pressed; action mode does not invent pressed state.',
            'Icon-only actions require aria-label or aria-labelledby.',
            'Disabled buttons use the native disabled attribute and leave the tab order.',
            'Visible focus, forced colors, touch targets, and reduced motion come from the shared style contract.',
          ]}
        />
        <KeyboardTable
          rows={[
            { keys: 'Tab', result: 'Moves focus to the enabled button in document order.' },
            { keys: 'Enter', result: 'Activates the focused button through native behavior.' },
            { keys: 'Space', result: 'Activates the focused button through native behavior.' },
          ]}
        />
      </DocsSection>

      <DocsSection id="theming" title="Theming and RTL">
        <p>
          Import <code>@casauran/react/button.css</code> once from an application layout. Button
          consumes semantic and component custom properties for light/dark presentation,
          comfortable/compact density, forced colors, and reduced motion. Logical spacing follows
          the nearest <code>dir</code> value without a mirrored component implementation.
        </p>
      </DocsSection>

      <DocsSection id="nextjs" title="Next.js">
        <p>
          Import Button from <code>@casauran/react</code> in Server or Client Components. Its narrow
          package client boundary supports events and uncontrolled pressed state while producing
          stable server markup. Browser listeners and globals are not read at package-root module
          evaluation.
        </p>
        <Callout title="Security and localization" tone="security">
          <p>
            Button renders normal escaped React content and parses no raw HTML, image URL, or SVG.
            Supply localized visible and accessible labels; Button has no built-in message catalog.
          </p>
        </Callout>
      </DocsSection>
    </DocsPage>
  );
}
