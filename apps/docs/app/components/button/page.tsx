import { Button, Icon } from '@casauran/react';
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

const appearanceSource = `<Button appearance="solid" tone="accent">Solid</Button>
<Button appearance="soft" tone="accent">Soft</Button>
<Button appearance="outline" tone="accent">Outline</Button>
<Button appearance="ghost" tone="accent">Ghost</Button>
<Button appearance="link" tone="accent">Link</Button>`;

const toneSource = `<Button appearance="solid" tone="neutral">Neutral</Button>
<Button appearance="solid" tone="accent">Accent</Button>
<Button appearance="solid" tone="positive">Positive</Button>
<Button appearance="solid" tone="caution">Caution</Button>
<Button appearance="solid" tone="critical">Critical</Button>
<Button appearance="solid" tone="inverse">Inverse</Button>`;

const sizeSource = `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`;

const radiusSource = `<Button radius="none">None</Button>
<Button radius="sm">Small</Button>
<Button radius="md">Medium</Button>
<Button radius="lg">Large</Button>
<Button radius="full">Pill</Button>`;

const stateSource = `<Button disabled>Unavailable</Button>
<Button defaultPressed toggleable>Pinned</Button>
<Button toggleable>Not pinned</Button>`;

const contentSource = `import { Button, Icon } from '@casauran/react';

<Button startContent={<Icon name="add" />} tone="accent">Add record</Button>
<Button endContent={<Icon name="arrow-right" />} appearance="outline">Continue</Button>
<Button aria-label="Search records" iconOnly>
  <Icon name="search" />
</Button>

// Any decorative node works, including an image you own.
<Button startContent={<img alt="" height={16} src="/brand.svg" width={16} />}>
  Export
</Button>`;

const eventsSource = `<Button
  onClick={(event) => {
    if (!canPin) event.preventDefault(); // cancels the pressed-state request
    track('pin-clicked');
  }}
  onPressedChange={({ pressed, nativeEvent }) => setPinned(pressed)}
  toggleable
>
  Pin record
</Button>`;

const formSource = `<form action={saveRecord}>
  <Button name="intent" type="submit" value="save" tone="accent">Save</Button>
  <Button type="reset" appearance="ghost">Reset</Button>
  <Button onClick={closeDrawer}>Cancel</Button>
</form>`;

const controlledSource = `const [pinned, setPinned] = useState(false);

<Button
  onPressedChange={(event) => setPinned(event.pressed)}
  pressed={pinned}
  toggleable
>
  {pinned ? 'Pinned' : 'Pin'}
</Button>`;

const apiRows = [
  {
    name: 'appearance',
    type: "'solid' | 'soft' | 'outline' | 'ghost' | 'link'",
    defaultValue: "'soft'",
    description: 'Visual treatment independent of semantic tone.',
  },
  {
    name: 'tone',
    type: "'neutral' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse'",
    defaultValue: "'neutral'",
    description: 'Semantic color intent. Informational actions use accent.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Control size from the shared scale; xs and sm serve dense desktop surfaces.',
  },
  {
    name: 'radius',
    type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
    defaultValue: "'md'",
    description: 'Corner treatment, including a full pill shape.',
  },
  {
    name: 'startContent',
    type: 'ReactNode',
    defaultValue: '—',
    description: 'Decorative leading slot; hidden from the accessible name and non-interactive.',
  },
  {
    name: 'endContent',
    type: 'ReactNode',
    defaultValue: '—',
    description: 'Decorative trailing slot; hidden from the accessible name and non-interactive.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Applies square icon-only layout; an accessible name is still required.',
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
    type: '(event: ButtonPressedChangeEvent) => void',
    defaultValue: '—',
    description: 'Reports requested pressed state after a non-cancelled click.',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    defaultValue: "'button'",
    description: 'Native form behavior; the safe default never submits by accident.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Native disabled attribute; removes the control from the tab order.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLButtonElement>',
    defaultValue: '—',
    description: 'Forwards the native element; no custom imperative handle is introduced.',
  },
] as const;

const styleHookRows = [
  {
    name: '.csn-button',
    type: 'class',
    defaultValue: '—',
    description: 'Stable root hook for consumer overrides in the overrides cascade layer.',
  },
  {
    name: 'data-appearance',
    type: 'attribute',
    defaultValue: "'soft'",
    description: 'Reflects the rendered appearance.',
  },
  {
    name: 'data-tone',
    type: 'attribute',
    defaultValue: "'neutral'",
    description: 'Reflects the rendered semantic tone.',
  },
  {
    name: 'data-size / data-radius',
    type: 'attribute',
    defaultValue: "'md'",
    description: 'Reflect the rendered size and corner treatment.',
  },
  {
    name: 'data-icon-only',
    type: 'attribute',
    defaultValue: '—',
    description: 'Present when the icon-only layout is active.',
  },
  {
    name: 'data-disabled / data-pressed',
    type: 'attribute',
    defaultValue: '—',
    description: 'Reflect the rendered disabled and pressed state for styling.',
  },
  {
    name: '--csn-button-*',
    type: 'custom property',
    defaultValue: 'theme value',
    description:
      'Component tokens for background, foreground, border, focus ring, spacing, typography, radius, minimum size, icon slot, disabled opacity, and transition duration.',
  },
] as const;

export default function ButtonDocumentationPage() {
  return (
    <DocsPage
      eyebrow="Component · 1.01 · parity verified · capability revalidated"
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
      </DocsSection>

      <DocsSection id="appearance" title="Appearance and tone">
        <p>
          <code>appearance</code> selects the visual treatment and <code>tone</code> selects the
          semantic intent. The two are independent, so any tone works with any appearance.
        </p>
        <Example source={appearanceSource} title="Appearances">
          <Button appearance="solid" tone="accent">
            Solid
          </Button>
          <Button appearance="soft" tone="accent">
            Soft
          </Button>
          <Button appearance="outline" tone="accent">
            Outline
          </Button>
          <Button appearance="ghost" tone="accent">
            Ghost
          </Button>
          <Button appearance="link" tone="accent">
            Link
          </Button>
        </Example>
        <Example source={toneSource} title="Semantic tones">
          <Button appearance="solid" tone="neutral">
            Neutral
          </Button>
          <Button appearance="solid" tone="accent">
            Accent
          </Button>
          <Button appearance="solid" tone="positive">
            Positive
          </Button>
          <Button appearance="solid" tone="caution">
            Caution
          </Button>
          <Button appearance="solid" tone="critical">
            Critical
          </Button>
          <Button appearance="solid" tone="inverse">
            Inverse
          </Button>
        </Example>
        <Callout title="Choosing a tone">
          <p>
            Casauran resolves informational emphasis to <code>tone=&quot;accent&quot;</code>, the
            same primary ramp <code>Icon</code> uses for its informational tone. Lower-emphasis
            secondary and tertiary actions are expressed by keeping{' '}
            <code>tone=&quot;neutral&quot;</code> and stepping the appearance down from{' '}
            <code>soft</code> to <code>outline</code> to <code>ghost</code>, rather than by adding
            extra colour ramps.
          </p>
        </Callout>
        <p>
          <code>appearance=&quot;link&quot;</code> is a visual treatment for an action that still
          performs a command. Real navigation belongs to an anchor element; Button never renders
          one.
        </p>
      </DocsSection>

      <DocsSection id="sizes" title="Sizes and shapes">
        <p>
          Four control sizes and five corner treatments cover dense desktop toolbars through primary
          page actions. Icon-only buttons stay square at every size.
        </p>
        <Example source={sizeSource} title="Control sizes">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Example>
        <Example source={radiusSource} title="Corner radii">
          <Button radius="none">None</Button>
          <Button radius="sm">Small</Button>
          <Button radius="md">Medium</Button>
          <Button radius="lg">Large</Button>
          <Button radius="full">Pill</Button>
        </Example>
        <Callout title="Target size" tone="caution">
          <p>
            The default comfortable <code>md</code> and <code>lg</code> presentations meet a 44 CSS
            pixel minimum target. <code>xs</code> and <code>sm</code>, and the compact density, are
            intended for pointer-dense desktop surfaces; keep a touch-sized action available on
            touch-first screens.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="states" title="States">
        <p>
          Enabled, hover, active, focus-visible, and disabled come from the native element. Pressed
          state is opt-in through <code>toggleable</code> and is exposed as{' '}
          <code>aria-pressed</code>.
        </p>
        <Example source={stateSource} title="Disabled and pressed">
          <Button disabled>Unavailable</Button>
          <Button defaultPressed toggleable>
            Pinned
          </Button>
          <Button toggleable>Not pinned</Button>
        </Example>
        <p>
          A disabled button keeps its rendered pressed state visible but cannot change it, and
          leaves the tab order through the native <code>disabled</code> attribute. Button has no
          read-only state; a command that must stay focusable and explain itself should stay enabled
          and report the reason on activation.
        </p>
      </DocsSection>

      <DocsSection id="content" title="Icons, images, and content">
        <p>
          <code>startContent</code> and <code>endContent</code> take any decorative node — most
          often the canonical <code>Icon</code> component. Both slots are hidden from the accessible
          name and must not contain interactive descendants. Button parses no icon name string,
          image URL, or raw SVG of its own; you compose the artwork you already trust.
        </p>
        <Example source={contentSource} title="Icon composition">
          <Button startContent={<Icon name="add" />} tone="accent">
            Add record
          </Button>
          <Button appearance="outline" endContent={<Icon name="arrow-right" />}>
            Continue
          </Button>
          <Button aria-label="Search records" iconOnly>
            <Icon name="search" />
          </Button>
        </Example>
        <Callout title="Icon-only actions" tone="caution">
          <p>
            <code>iconOnly</code> is a layout declaration, not an accessible name. Always supply{' '}
            <code>aria-label</code> or <code>aria-labelledby</code>, and keep the icon decorative
            rather than labelling the artwork itself.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="events" title="Events">
        <p>
          Button forwards every native button event. <code>onClick</code> runs before the internal
          pressed-state transition, so calling <code>preventDefault()</code> cancels the toggle
          request while leaving the native event intact. <code>onPressedChange</code> reports the
          requested state with the originating native event.
        </p>
        <Example source={eventsSource} title="Cancellable activation">
          <Button toggleable>Pin record</Button>
        </Example>
        <p>
          Documentation examples render on the server, so the handlers above appear in the source
          rather than being wired into the preview. The interactive equivalent — cancellation,
          controlled ownership, form submission, and focus through a ref — runs in the production
          browser suite for this component.
        </p>
      </DocsSection>

      <DocsSection id="forms" title="Forms">
        <p>
          Button participates in native form behavior. It defaults to{' '}
          <code>type=&quot;button&quot;</code> so an action inside a form never submits by accident;
          declare <code>type=&quot;submit&quot;</code> or <code>type=&quot;reset&quot;</code>{' '}
          deliberately. Native <code>name</code>, <code>value</code>, <code>form</code>,{' '}
          <code>formAction</code>, and <code>formMethod</code> attributes pass through unchanged, so
          submitter-specific values and Next.js server actions work as they do with a plain button.
        </p>
        <Example source={formSource} title="Submit, reset, and cancel">
          <Button name="intent" tone="accent" type="submit" value="save">
            Save
          </Button>
          <Button appearance="ghost" type="reset">
            Reset
          </Button>
          <Button>Cancel</Button>
        </Example>
      </DocsSection>

      <DocsSection id="controlled-state" title="Controlled and uncontrolled state">
        <p>
          Pressed state follows the project-wide convention. <code>defaultPressed</code> keeps
          ownership inside Button; supplying <code>pressed</code> moves ownership to the caller, and
          Button then renders exactly what it is given. Only <code>undefined</code> selects
          uncontrolled ownership, so <code>pressed={'{false}'}</code> is a controlled value.
        </p>
        <Example source={controlledSource} title="Controlled toggle">
          <Button pressed toggleable>
            Pinned
          </Button>
        </Example>
        <Callout title="State ownership" tone="caution">
          <p>
            Do not switch between controlled and uncontrolled pressed ownership while mounted.
            Cancelling <code>onClick</code> cancels the pressed-state request, and a controlled
            button does not move until its owner supplies the next value.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="api" title="API reference">
        <p>
          Button also accepts compatible native button attributes, including form and ARIA
          attributes. <code>aria-pressed</code>, <code>children</code>, and the legacy HTML{' '}
          <code>color</code> attribute are owned by the component.
        </p>
        <ApiReference caption="Button properties" rows={apiRows} />
        <p>
          Styling hooks are part of the supported surface. Internal child structure beyond the
          documented start, content, and end slots is not a compatibility promise.
        </p>
        <ApiReference caption="Styling hooks" rows={styleHookRows} />
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <AccessibilityChecklist
          items={[
            'Native button semantics provide role, focus, and activation behavior.',
            'Toggle mode exposes aria-pressed; action mode does not invent pressed state.',
            'Icon-only actions require aria-label or aria-labelledby.',
            'Disabled buttons use the native disabled attribute and leave the tab order.',
            'Decorative start and end slots are hidden from the accessible name.',
            'Visible focus, forced colors, touch targets, and reduced motion come from the shared style contract.',
            'Content wraps and stays operable at 320 CSS pixels and 200% zoom.',
          ]}
        />
        <KeyboardTable
          rows={[
            { keys: 'Tab', result: 'Moves focus to the enabled button in document order.' },
            { keys: 'Enter', result: 'Activates the focused button through native behavior.' },
            { keys: 'Space', result: 'Activates the focused button through native behavior.' },
          ]}
        />
        <p>
          Button follows the WAI-ARIA button pattern by using the native element rather than
          recreating it, so screen readers announce the platform role, name, and pressed state. As
          the consumer you own the accessible name, the disabled decision, and any live announcement
          that follows the action.
        </p>
      </DocsSection>

      <DocsSection id="theming" title="Theming, density, RTL, and globalization">
        <p>
          Import <code>@casauran/react/button.css</code> once from an application layout. Button
          consumes semantic and component custom properties for light/dark presentation,
          comfortable/compact density, forced colors, and reduced motion. Logical spacing follows
          the nearest <code>dir</code> value without a mirrored component implementation.
        </p>
        <p>
          Button ships no message catalog and formats no values: visible labels, accessible names,
          and any localized number or date inside them are supplied by the application. Override the{' '}
          <code>--csn-button-*</code> custom properties at a scoped theme boundary, or target{' '}
          <code>.csn-button</code> in the <code>overrides</code> cascade layer, instead of forking
          the stylesheet.
        </p>
      </DocsSection>

      <DocsSection id="nextjs" title="Next.js and rendering">
        <p>
          Import Button from <code>@casauran/react</code> in Server or Client Components. Its narrow
          package client boundary supports events and uncontrolled pressed state while producing
          stable server markup. Browser listeners and globals are not read at package-root module
          evaluation, and the component adds no portal, observer, or timer.
        </p>
      </DocsSection>

      <DocsSection id="performance" title="Performance">
        <p>
          Button adds no runtime dependency, observer, listener, portal, or timer. Its recorded
          regression scenario renders 1,000 toggleable buttons on the server and projects 1,000
          pressed updates; the governed ceiling is 1,000 ms on the pinned Node runtime. That budget
          is a regression guard for a specific scenario, not a universal speed claim.
        </p>
      </DocsSection>

      <DocsSection id="security" title="Security">
        <Callout title="Trust boundary" tone="security">
          <p>
            Button renders normal escaped React content and parses no raw HTML, image URL, icon name
            string, or SVG source. Content and event callbacks you pass are treated as trusted
            application code, so validate anything that originates from user input before it becomes
            a label. Decorative slots prohibit interactive descendants to keep activation and focus
            unambiguous.
          </p>
        </Callout>
      </DocsSection>

      <DocsSection id="limitations" title="Known limitations">
        <ul className="docs-checklist">
          <li>
            Button renders a native <code>button</code> only; it is not polymorphic and never
            renders an anchor.
          </li>
          <li>
            Grouped selection, split and dropdown actions, floating placement, toolbars, and
            asynchronous loading orchestration are separate components in later stages.
          </li>
          <li>
            There is no built-in busy or loading state; disable the action and render your own
            status message while work is in flight.
          </li>
          <li>
            Decorative slots are hidden from assistive technology by design, so meaningful artwork
            must be described by the button&apos;s own accessible name.
          </li>
        </ul>
      </DocsSection>
    </DocsPage>
  );
}
