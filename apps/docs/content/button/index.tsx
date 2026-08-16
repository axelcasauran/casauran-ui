import { Button } from '@casauran/react';

import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
  KeyboardTable,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { ActionHierarchyExample } from './examples/action-hierarchy';
import { AppearancesExample } from './examples/appearances';
import { CancellableActivationExample } from './examples/cancellable-activation';
import { ControlledToggleExample } from './examples/controlled-toggle';
import { FormActionsExample } from './examples/form-actions';
import { IconCompositionExample } from './examples/icon-composition';
import { RadiiExample } from './examples/radii';
import { SizesExample } from './examples/sizes';
import { StatesExample } from './examples/states';
import { TonesExample } from './examples/tones';

const slug = 'button';

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

export const buttonTopics: ComponentTopics = {
  overview: {
    summary: 'The canonical native action: semantic, form-safe, and composable.',
    content: (
      <>
        <p>
          Button is Casauran UI&apos;s canonical native action. It renders a semantic{' '}
          <code>button</code>, defaults to <code>type=&quot;button&quot;</code>, and keeps
          appearance, semantic tone, size, radius, and pressed state orthogonal.
        </p>
        <Example example="action-hierarchy" slug={slug} title="Action hierarchy">
          <ActionHierarchyExample />
        </Example>
        <Callout title="Form safety">
          <p>
            Choose <code>type=&quot;submit&quot;</code> or <code>type=&quot;reset&quot;</code>{' '}
            explicitly when the action owns native form behavior.
          </p>
        </Callout>
      </>
    ),
  },

  appearance: {
    summary: 'Five visual treatments and six semantic tones, chosen independently.',
    content: (
      <>
        <p>
          <code>appearance</code> selects the visual treatment and <code>tone</code> selects the
          semantic intent. The two are independent, so any tone works with any appearance.
        </p>
        <Example example="appearances" slug={slug} title="Appearances">
          <AppearancesExample />
        </Example>
        <Example example="tones" slug={slug} title="Semantic tones">
          <TonesExample />
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
      </>
    ),
  },

  sizes: {
    summary: 'Four control sizes and five corner treatments, square when icon-only.',
    content: (
      <>
        <p>
          Four control sizes and five corner treatments cover dense desktop toolbars through primary
          page actions. Icon-only buttons stay square at every size.
        </p>
        <Example example="sizes" slug={slug} title="Control sizes">
          <SizesExample />
        </Example>
        <Example example="radii" slug={slug} title="Corner radii">
          <RadiiExample />
        </Example>
        <Callout title="Target size" tone="caution">
          <p>
            The default comfortable <code>md</code> and <code>lg</code> presentations meet a 44 CSS
            pixel minimum target. <code>xs</code> and <code>sm</code>, and the compact density, are
            intended for pointer-dense desktop surfaces; keep a touch-sized action available on
            touch-first screens.
          </p>
        </Callout>
      </>
    ),
  },

  states: {
    summary: 'Native interaction states plus opt-in pressed semantics.',
    content: (
      <>
        <p>
          Enabled, hover, active, focus-visible, and disabled come from the native element. Pressed
          state is opt-in through <code>toggleable</code> and is exposed as{' '}
          <code>aria-pressed</code>.
        </p>
        <Example example="states" slug={slug} title="Disabled and pressed">
          <StatesExample />
        </Example>
        <p>
          A disabled button keeps its rendered pressed state visible but cannot change it, and
          leaves the tab order through the native <code>disabled</code> attribute. Button has no
          read-only state; a command that must stay focusable and explain itself should stay enabled
          and report the reason on activation.
        </p>
      </>
    ),
  },

  content: {
    summary: 'Composed artwork in decorative slots — no icon names, URLs, or raw SVG.',
    content: (
      <>
        <p>
          <code>startContent</code> and <code>endContent</code> take any decorative node — most
          often the canonical <code>Icon</code> component. Both slots are hidden from the accessible
          name and must not contain interactive descendants. Button parses no icon name string,
          image URL, or raw SVG of its own; you compose the artwork you already trust.
        </p>
        <Example example="icon-composition" slug={slug} title="Icon composition">
          <IconCompositionExample />
        </Example>
        <Callout title="Icon-only actions" tone="caution">
          <p>
            <code>iconOnly</code> is a layout declaration, not an accessible name. Always supply{' '}
            <code>aria-label</code> or <code>aria-labelledby</code>, and keep the icon decorative
            rather than labelling the artwork itself.
          </p>
        </Callout>
        <p>
          An image you own works the same way: pass an <code>img</code> element with an empty{' '}
          <code>alt</code> into a slot, and let the button&apos;s own accessible name describe the
          action.
        </p>
      </>
    ),
  },

  events: {
    summary: 'Native events, with cancellation that stops the pressed-state request.',
    content: (
      <>
        <p>
          Button forwards every native button event. <code>onClick</code> runs before the internal
          pressed-state transition, so calling <code>preventDefault()</code> cancels the toggle
          request while leaving the native event intact. <code>onPressedChange</code> reports the
          requested state with the originating native event.
        </p>
        <Example example="cancellable-activation" slug={slug} title="Cancellable activation">
          <CancellableActivationExample />
        </Example>
      </>
    ),
  },

  forms: {
    summary: 'Submit, reset, and submitter attributes pass through unchanged.',
    content: (
      <>
        <p>
          Button participates in native form behavior. It defaults to{' '}
          <code>type=&quot;button&quot;</code> so an action inside a form never submits by accident;
          declare <code>type=&quot;submit&quot;</code> or <code>type=&quot;reset&quot;</code>{' '}
          deliberately. Native <code>name</code>, <code>value</code>, <code>form</code>,{' '}
          <code>formAction</code>, and <code>formMethod</code> attributes pass through unchanged, so
          submitter-specific values and Next.js server actions work as they do with a plain button.
        </p>
        <Example example="form-actions" slug={slug} title="Submit, reset, and cancel">
          <FormActionsExample />
        </Example>
      </>
    ),
  },

  'controlled-state': {
    summary: 'Pressed state follows the project-wide ownership convention.',
    content: (
      <>
        <p>
          Pressed state follows the project-wide convention. <code>defaultPressed</code> keeps
          ownership inside Button; supplying <code>pressed</code> moves ownership to the caller, and
          Button then renders exactly what it is given. Only <code>undefined</code> selects
          uncontrolled ownership, so <code>pressed={'{false}'}</code> is a controlled value.
        </p>
        <Example example="controlled-toggle" slug={slug} title="Controlled toggle">
          <ControlledToggleExample />
        </Example>
        <Callout title="State ownership" tone="caution">
          <p>
            Do not switch between controlled and uncontrolled pressed ownership while mounted.
            Cancelling <code>onClick</code> cancels the pressed-state request, and a controlled
            button does not move until its owner supplies the next value.
          </p>
        </Callout>
      </>
    ),
  },

  api: {
    summary: 'Props, defaults, ref behaviour, and the supported styling hooks.',
    content: (
      <>
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
      </>
    ),
  },

  accessibility: {
    summary: 'Native button semantics, standard keys, and consumer responsibilities.',
    content: (
      <>
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
      </>
    ),
  },

  theming: {
    summary: 'Token seams, density, logical layout, and localization posture.',
    content: (
      <>
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
        <div className="docs-example-preview">
          <Button appearance="solid" tone="accent">
            Themed action
          </Button>
          <Button appearance="outline">Themed secondary</Button>
        </div>
      </>
    ),
  },

  nextjs: {
    summary: 'Server-renderable, with a narrow local client boundary.',
    content: (
      <p>
        Import Button from <code>@casauran/react</code> in Server or Client Components. Its narrow
        package client boundary supports events and uncontrolled pressed state while producing
        stable server markup. Browser listeners and globals are not read at package-root module
        evaluation, and the component adds no portal, observer, or timer.
      </p>
    ),
  },

  performance: {
    summary: 'A recorded regression budget, not a universal speed claim.',
    content: (
      <p>
        Button adds no runtime dependency, observer, listener, portal, or timer. Its recorded
        regression scenario renders 1,000 toggleable buttons on the server and projects 1,000
        pressed updates; the governed ceiling is 1,000 ms on the pinned Node runtime. That budget is
        a regression guard for a specific scenario, not a universal speed claim.
      </p>
    ),
  },

  security: {
    summary: 'No raw HTML, URL, icon-name, or SVG input crosses the boundary.',
    content: (
      <Callout title="Trust boundary" tone="security">
        <p>
          Button renders normal escaped React content and parses no raw HTML, image URL, icon name
          string, or SVG source. Content and event callbacks you pass are treated as trusted
          application code, so validate anything that originates from user input before it becomes a
          label. Decorative slots prohibit interactive descendants to keep activation and focus
          unambiguous.
        </p>
      </Callout>
    ),
  },

  limitations: {
    summary: 'What Button deliberately does not do.',
    content: (
      <ul className="docs-checklist">
        <li>
          Button renders a native <code>button</code> only; it is not polymorphic and never renders
          an anchor.
        </li>
        <li>
          Grouped selection, split and dropdown actions, floating placement, toolbars, and
          asynchronous loading orchestration are separate components in later stages.
        </li>
        <li>
          There is no built-in busy or loading state; disable the action and render your own status
          message while work is in flight.
        </li>
        <li>
          Decorative slots are hidden from assistive technology by design, so meaningful artwork
          must be described by the button&apos;s own accessible name.
        </li>
      </ul>
    ),
  },
};
