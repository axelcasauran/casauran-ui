import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { AlignmentExample } from './examples/alignment';
import { CasingExample } from './examples/casing';
import { CodeBlockExample } from './examples/code-block';
import { CompositionExample } from './examples/composition';
import { HeadingLevelsExample } from './examples/heading-levels';
import { InheritedColourExample } from './examples/inherited-colour';
import { NestingExample } from './examples/nesting';
import { PerSideSpacingExample } from './examples/per-side-spacing';
import { SemanticElementsExample } from './examples/semantic-elements';
import { SizesExample } from './examples/sizes';
import { SpacingExample } from './examples/spacing';
import { StructureAndStyleExample } from './examples/structure-and-style';
import { TonesExample } from './examples/tones';
import { TypeRampExample } from './examples/type-ramp';
import { UntrustedTextExample } from './examples/untrusted-text';
import { WeightsExample } from './examples/weights';

const slug = 'typography';

const apiRows = [
  {
    name: 'as',
    type: "'h1' | … | 'h6' | 'p' | 'span' | 'div' | 'strong' | 'em' | 'code' | 'pre' | 'blockquote'",
    defaultValue: 'derived',
    description:
      'The rendered element — the document-structure decision. Derived from variant when omitted, and p when neither is given.',
  },
  {
    name: 'variant',
    type: "'display' | 'title' | 'heading' | 'subheading' | 'body' | 'body-small' | 'caption' | 'overline' | 'code' | 'code-block' | 'quote'",
    defaultValue: 'derived',
    description:
      'The typographic role — the visual decision. Derived from as when omitted, and body when neither is given.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
    defaultValue: '—',
    description:
      'Overrides the font size the role assigned, and nothing else. Shares the platform scale Icon and SVGIcon publish.',
  },
  {
    name: 'weight',
    type: "'regular' | 'medium' | 'semibold' | 'bold'",
    defaultValue: '—',
    description: 'Overrides the font weight the role assigned, and nothing else.',
  },
  {
    name: 'align',
    type: "'start' | 'end' | 'center' | 'justify'",
    defaultValue: '—',
    description:
      'Logical alignment. start and end follow the ambient direction, so one declaration is correct in both.',
  },
  {
    name: 'transform',
    type: "'none' | 'uppercase' | 'lowercase' | 'capitalize'",
    defaultValue: "'none'",
    description:
      'Visual casing. It does not change the text content or the accessible name, and casing rules are locale-specific.',
  },
  {
    name: 'tone',
    type: "'inherit' | 'default' | 'muted' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse'",
    defaultValue: "'inherit'",
    description:
      'Semantic colour intent. The default follows the surrounding colour; default pins the theme text colour.',
  },
  {
    name: 'spacing',
    type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | { blockStart?, blockEnd?, inlineStart?, inlineEnd? }",
    defaultValue: '—',
    description:
      'Block rhythm from the governed space scale. The shorthand sets both block sides; the object form sets any logical side.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    defaultValue: '—',
    description: 'The text. Content is always children; there is no markup content path.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: '—',
    description: 'Appended after the stable .csn-typography root hook; the hook is never replaced.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    defaultValue: '—',
    description: 'Forwards the rendered element; no custom imperative handle is introduced.',
  },
] as const;

const styleHookRows = [
  {
    name: '.csn-typography',
    type: 'class',
    defaultValue: '—',
    description: 'Stable root hook for consumer overrides written in the overrides cascade layer.',
  },
  {
    name: '--csn-typography-font-family',
    type: 'token',
    defaultValue: 'typography.body-family',
    description: 'Type family. Every role assigns it, including the body default.',
  },
  {
    name: '--csn-typography-font-size',
    type: 'token',
    defaultValue: 'typography.body-size',
    description: 'Font size. Every role and every size step assigns it.',
  },
  {
    name: '--csn-typography-font-weight',
    type: 'token',
    defaultValue: 'typography.body-weight',
    description: 'Font weight. Every role and every weight step assigns it.',
  },
  {
    name: '--csn-typography-line-height',
    type: 'token',
    defaultValue: 'typography.body-line-height',
    description: 'Line height. Assigned per role.',
  },
  {
    name: '--csn-typography-color',
    type: 'token',
    defaultValue: 'currentColor',
    description: 'Foreground. Each tone assigns it; inherit assigns currentColor.',
  },
  {
    name: 'data-as',
    type: 'attribute',
    defaultValue: "'p'",
    description: 'Reflects the resolved element.',
  },
  {
    name: 'data-variant',
    type: 'attribute',
    defaultValue: "'body'",
    description: 'Reflects the resolved typographic role.',
  },
  {
    name: 'data-size / data-weight / data-align',
    type: 'attribute',
    defaultValue: "'auto'",
    description: "Reflect an override, or 'auto' when the role supplied the value.",
  },
  {
    name: 'data-transform / data-tone',
    type: 'attribute',
    defaultValue: "'none' / 'inherit'",
    description: 'Reflect the resolved casing and colour intent.',
  },
  {
    name: 'data-spacing',
    type: 'attribute',
    defaultValue: "'none'",
    description:
      "Reflects the form the caller used: a shorthand step, or 'sides' for the per-side object.",
  },
  {
    name: 'data-space-block-start / -block-end / -inline-start / -inline-end',
    type: 'attribute',
    defaultValue: "'none'",
    description: 'Reflect the resolved step on each logical side.',
  },
] as const;

export const typographyTopics: ComponentTopics = {
  overview: {
    summary: 'One text primitive that keeps the document outline and the type scale separable.',
    content: (
      <>
        <p>
          Typography renders a text-bearing element with a governed typographic role. It exists so
          an application stops re-deriving font sizes, weights and rhythm per view: the scale is a
          contract, and changing it lands in one place.
        </p>
        <p>
          Two props carry that: <code>as</code> is the element — the document-structure decision —
          and <code>variant</code> is the typographic role — the visual decision. Each defaults from
          the other, so the common case is a single prop, and each is honoured independently when
          both are given.
        </p>
        <Example example="structure-and-style" slug={slug} title="Structure and style, separately">
          <StructureAndStyleExample />
        </Example>
        <Callout title="A size is not a heading">
          <p>
            No role ever promotes an element to a heading. <code>display</code>, <code>title</code>,{' '}
            <code>heading</code> and <code>subheading</code> are sizes; a document outline exists
            only where you write <code>as=&quot;h1&quot;</code> through{' '}
            <code>as=&quot;h6&quot;</code>. That is what lets you make a heading smaller without
            deepening its level, and make a number large without inventing one.
          </p>
        </Callout>
        <p>
          The element vocabulary is closed and holds no interactive element. An anchor, a button and
          a form control each belong to the component that owns that primitive, so Typography can
          never become a second, unowned action surface.
        </p>
        <Example example="semantic-elements" slug={slug} title="The element vocabulary">
          <SemanticElementsExample />
        </Example>
      </>
    ),
  },

  appearance: {
    summary: 'Eleven typographic roles, logical alignment, casing, and eight semantic tones.',
    content: (
      <>
        <p>
          A role binds a family, size, weight and line height, and — for <code>quote</code> and{' '}
          <code>code-block</code> — the block treatment that goes with it.
        </p>
        <Example example="type-ramp" slug={slug} title="The type ramp">
          <TypeRampExample />
        </Example>
        <p>
          Alignment is logical rather than physical. <code>start</code> is the reading edge in both
          directions, so one declaration is correct in an English and an Arabic layout alike; there
          is deliberately no <code>left</code> or <code>right</code>.
        </p>
        <Example example="alignment" slug={slug} title="Logical alignment">
          <AlignmentExample />
        </Example>
        <p>
          <code>transform</code> changes how text is drawn, not what it says: the content and the
          accessible name are unchanged. Casing is locale-specific — Turkish dotted and dotless i,
          German eszett, scripts with no case at all — so no role applies one by default, and text
          that must genuinely be uppercase should be written that way.
        </p>
        <Example example="casing" slug={slug} title="Visual casing">
          <CasingExample />
        </Example>
        <p>
          <code>tone</code> expresses intent rather than a colour value, using the vocabulary
          Button, Icon and SVGIcon already publish. The default, <code>inherit</code>, resolves to{' '}
          <code>currentColor</code>, so text placed inside a toned block, an inverse surface, or a
          solid Button takes that context&apos;s foreground; <code>default</code> is the opt-out
          that pins the theme&apos;s primary text colour.
        </p>
        <Example example="tones" slug={slug} title="Tone scale">
          <TonesExample />
        </Example>
        <Example example="inherited-colour" slug={slug} title="Inheriting the surrounding colour">
          <InheritedColourExample />
        </Example>
        <Callout title="Colour is never the only signal" tone="security">
          <p>
            A tone communicates status to sighted users only, and every tone collapses to one system
            colour under forced colours. Say what is wrong in the text itself.
          </p>
        </Callout>
      </>
    ),
  },

  sizes: {
    summary: 'A seven-step size scale, four weights, and block spacing from the governed scale.',
    content: (
      <>
        <p>
          <code>size</code> and <code>weight</code> override exactly the value the role assigned and
          nothing else, so a heading can be set smaller without losing its weight or its level.
          Every step is a <code>rem</code> value, so text scales with the reader&apos;s own
          font-size preference.
        </p>
        <Example example="sizes" slug={slug} title="Size scale">
          <SizesExample />
        </Example>
        <Example example="weights" slug={slug} title="Weight scale">
          <WeightsExample />
        </Example>
        <p>
          Typography resets the browser&apos;s own margins on every element it renders, so vertical
          rhythm is something you declare rather than something you inherit and then fight.{' '}
          <code>spacing</code> is that declaration, bound to the governed space scale. The shorthand
          applies to both block sides, because block rhythm is what a margin on a text block is for.
        </p>
        <Example example="spacing" slug={slug} title="Block spacing">
          <SpacingExample />
        </Example>
        <p>
          The object form addresses any of the four logical sides independently, and an omitted side
          gets no margin. Sides are logical, so an indent stays on the reading edge in both
          directions.
        </p>
        <Example example="per-side-spacing" slug={slug} title="Per-side spacing">
          <PerSideSpacingExample />
        </Example>
      </>
    ),
  },

  content: {
    summary: 'Code as content, nested inline roles, and composition into another component.',
    content: (
      <>
        <p>
          Content is always children. <code>variant=&quot;code-block&quot;</code> renders a{' '}
          <code>&lt;pre&gt;</code> that preserves whitespace in CSS, so multi-line code needs no
          markup injection, wraps rather than overflowing the page, and scrolls inside its own box
          when a single line is too long.
        </p>
        <Example example="code-block" slug={slug} title="Code as content">
          <CodeBlockExample />
        </Example>
        <p>
          Inline roles nest inside a paragraph. A nested element with the default tone takes the
          colour of the passage around it, so emphasis inside toned text stays consistent.
        </p>
        <Example example="nesting" slug={slug} title="Nested inline roles">
          <NestingExample />
        </Example>
        <p>
          Typography composes into another component&apos;s slot as a plain element. It never owns
          the interaction: a control&apos;s focus, keyboard and disabled behaviour belong to the
          control.
        </p>
        <Example example="composition" slug={slug} title="Composed into Button">
          <CompositionExample />
        </Example>
      </>
    ),
  },

  api: {
    summary: 'The component props, the reserved props, and the styling hooks.',
    content: (
      <>
        <p>
          Typography also accepts the non-conflicting native attributes of the element it renders —{' '}
          <code>id</code>, <code>style</code>, <code>title</code>, <code>lang</code>,{' '}
          <code>dir</code>, <code>data-*</code>, pointer and mouse handlers — and forwards its ref
          to that element.
        </p>
        <ApiReference caption="Typography properties" rows={apiRows} />
        <p>
          Four props are reserved and rejected by the type, each because it would contradict
          semantics the component owns: React&apos;s raw-markup escape hatch, because content is
          children and there is no markup path; <code>color</code>, because colour comes from{' '}
          <code>tone</code>; and <code>role</code> and <code>aria-level</code>, because semantics
          come from <code>as</code> and an ARIA override would contradict the element you chose.
        </p>
        <ApiReference caption="Styling hooks" rows={styleHookRows} />
        <p>
          The component publishes no imperative handle. The forwarded ref is the native element,
          which already provides everything a caller needs, and no durable imperative need exists to
          justify a custom one.
        </p>
      </>
    ),
  },

  accessibility: {
    summary: 'Semantics come from the element you choose, and never from a size.',
    content: (
      <>
        <Example example="heading-levels" slug={slug} title="Levels and sizes, decided separately">
          <HeadingLevelsExample />
        </Example>
        <AccessibilityChecklist
          items={[
            'The role comes from the rendered element, so a heading, paragraph, quotation or code sample is announced natively.',
            'No typographic role ever produces a heading; a document outline exists only where you write a heading element.',
            'role and aria-level are rejected by the type, because either would contradict the element you selected.',
            'The accessible name is the text content; transform is a visual effect and does not change it.',
            'Every size is a rem value, so text scales with the reader’s font-size preference and at 200% zoom.',
            'At 320 CSS pixels nothing overflows horizontally; a long code block scrolls inside its own box.',
            'Each tone is bound to a text token meeting the WCAG 2.2 AA 4.5:1 baseline against its intended surface.',
            'Meaning is never carried by colour alone; tones collapse to one system colour under forced colours.',
            'The component owns no focus, tab stop, key model, or announcement, and adds no tab index.',
            'There is no animation, transition, or transform, so reduced-motion behaviour is unconditional.',
          ]}
        />
        <p>
          Typography meets the WCAG 2.2 AA baseline that ADR-009 fixed for this platform. It
          publishes no keyboard table because it owns no interaction: text composed into a control
          inherits that control&apos;s tab stop, focus ring, and key model.
        </p>
        <Callout title="Consumer responsibilities">
          <p>
            Choosing the element is choosing the semantics. Keep heading levels sequential in a
            document, use <code>as=&quot;strong&quot;</code> and <code>as=&quot;em&quot;</code> for
            real importance and emphasis rather than for weight or slant, and give a passage in
            another language its own <code>lang</code>.
          </p>
        </Callout>
      </>
    ),
  },

  theming: {
    summary: 'Token seams, density, inherited direction, forced colours, and globalization.',
    content: (
      <>
        <p>
          Import <code>@casauran/react/typography.css</code> once from a layout. Typography consumes
          five governed component tokens. Every role, size, weight and tone assigns them at the same
          specificity — including the defaults — so a consumer override written in the{' '}
          <code>overrides</code> cascade layer applies uniformly whether the value came from a
          default or from an explicit prop:
        </p>
        <pre>
          <code>{`@layer overrides {\n  .brand-lead {\n    --csn-typography-font-size: 1.375rem;\n    --csn-typography-font-weight: 600;\n    --csn-typography-color: var(--csn-text-secondary);\n  }\n}`}</code>
        </pre>
        <p>
          Light and dark themes, comfortable and compact densities, and nested theme scopes are
          inherited from the theme package rather than re-implemented. Type sizes deliberately do
          not change with density: density governs control spacing on this platform, and rescaling
          body text by density would fight the reader&apos;s own font-size preference.
        </p>
        <p>
          Direction is inherited from the ambient <code>dir</code> and is never set by the
          component. Alignment and every spacing side are logical, and the quotation rule sits on
          the inline-start edge, so a right-to-left layout needs no second declaration. Typography
          owns no message catalogue, number format, or date format — its content arrives already
          localized — and <code>lang</code> and <code>dir</code> pass through for a passage in
          another language or direction.
        </p>
      </>
    ),
  },

  nextjs: {
    summary: 'Server-renderable with no client boundary and no hydration state.',
    content: (
      <p>
        Typography is a Server Component by default. It declares no{' '}
        <code>&apos;use client&apos;</code> boundary, reads no browser global at module evaluation,
        and holds no effect, observer, listener, timer, portal, random value, current-time read, or
        generated identifier, so its server and client markup are identical and it adds nothing to
        the client bundle. Rendering it inside a client component works unchanged.
      </p>
    ),
  },

  performance: {
    summary: 'A recorded server-render budget with scenario, ceiling, and result.',
    content: (
      <p>
        Text is the component used at the highest volume in a page, so the governed scenario is
        server rendering: 5,000 renders through <code>react-dom/server</code> after a production
        package build, cycling the role, size, tone and spacing surfaces so defaulting, overriding
        and the per-side spacing form are all exercised, with a 500 ms ceiling.{' '}
        <code>pnpm benchmark:typography</code> runs it and prints the observed result with its Node
        version, platform, and architecture; the recorded figure lives in{' '}
        <code>.agent/performance-budgets.md</code>. This is a bounded regression guard, not a
        universal speed claim.
      </p>
    ),
  },

  security: {
    summary: 'Text only: no markup path, and no injection sink to review.',
    content: (
      <>
        <Callout title="Content is children, never markup" tone="security">
          <p>
            Typography renders its children through React, which escapes them. React&apos;s
            raw-markup escape hatch is rejected by the type, so there is no way to hand the
            component a markup string — and therefore no sanitizer to keep correct and no
            content-security-policy relaxation to request. That is structural, not a filter.
          </p>
        </Callout>
        <p>
          This matters most for a code block. Multi-line code is the case that tempts a raw-markup
          escape hatch; <code>variant=&quot;code-block&quot;</code> preserves whitespace in CSS
          instead, so a snippet from a CMS, a diff, a log line, or model output renders as text.
        </p>
        <Example example="untrusted-text" slug={slug} title="Text that came from elsewhere">
          <UntrustedTextExample />
        </Example>
        <p>
          Typography fetches nothing, stores nothing, and evaluates nothing, so it introduces no
          request, referrer, or policy consideration of its own. It also does not interpret content:
          it will not linkify a URL, resolve an entity, or transform what it is given. The one
          surface that remains the caller&apos;s is <code>style</code>: it is a{' '}
          <code>CSSProperties</code> object rather than a string, so it cannot carry a declaration
          block, but a value built from untrusted input is still the caller&apos;s decision.
        </p>
      </>
    ),
  },

  limitations: {
    summary: 'What Typography deliberately does not do, and why.',
    content: (
      <ul>
        <li>
          <strong>No markup or rich-text content.</strong> A markup string would be the injection
          sink this API exists without. Rich text is an editor&apos;s job, not a text
          primitive&apos;s.
        </li>
        <li>
          <strong>No interactive elements.</strong> <code>as</code> accepts no anchor, button, or
          form control. Each of those belongs to the component that owns the primitive and carries a
          focus, keyboard and disabled contract Typography has no business reproducing.
        </li>
        <li>
          <strong>No element namespace.</strong> There is no <code>Typography.h2</code>. A namespace
          of bound components publishes entry points that cannot be typed, narrowed or extended
          together, and it is the mechanism that fuses an outline level to a size.
        </li>
        <li>
          <strong>No light weight step.</strong> The governed scale starts at regular. A 300 weight
          in a system font stack fails legibility at body and caption sizes; de-emphasise with{' '}
          <code>tone=&quot;muted&quot;</code> or a smaller role instead.
        </li>
        <li>
          <strong>No physical alignment or physical margin sides.</strong> <code>left</code>,{' '}
          <code>right</code>, <code>top</code> and <code>bottom</code> are right-to-left defects;
          the logical equivalents are the whole vocabulary.
        </li>
        <li>
          <strong>No unbounded numeric spacing.</strong> Spacing is a named scale bound to tokens. A
          free numeric multiplier bypasses the scale, means a different physical size per theme, and
          cannot be validated.
        </li>
        <li>
          <strong>No truncation or line clamping.</strong> Hidden text needs a way to reveal it, and
          that belongs to a component that owns an overlay.
        </li>
        <li>
          <strong>No layout.</strong> Typography spaces its own block; arranging several blocks is a
          layout component&apos;s job.
        </li>
        <li>
          <strong>No published styling target for the rendered element&apos;s internals.</strong>{' '}
          There are none — one element, no wrapper — and the governed seam is the{' '}
          <code>.csn-typography</code> root hook plus its five component tokens.
        </li>
      </ul>
    ),
  },
};
