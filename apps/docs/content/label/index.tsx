import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { AssociationExample } from './examples/association';
import { ComposedCaptionExample } from './examples/composed-caption';
import { EmptyCaptionExample } from './examples/empty-caption';
import { LocalizedMarkerExample } from './examples/localized-marker';
import { NonLabelableExample } from './examples/non-labelable';
import { RequirementExample } from './examples/requirement';
import { StatesExample } from './examples/states';
import { UntrustedCaptionExample } from './examples/untrusted-caption';

const slug = 'label';

const apiRows = [
  {
    name: 'htmlFor',
    type: 'string',
    defaultValue: '—',
    description:
      "The editor's id, written to the element's own for attribute. For any labelable control this is the whole association.",
  },
  {
    name: 'children',
    type: 'ReactNode',
    defaultValue: '—',
    description:
      'The caption. Omit it deliberately to keep a field row aligned with no visible caption.',
  },
  {
    name: 'requirement',
    type: "'none' | 'optional' | 'required'",
    defaultValue: "'none'",
    description: 'Which requirement marker to render after the caption.',
  },
  {
    name: 'requirementText',
    type: 'string',
    defaultValue: '—',
    description:
      'The already-localized marker text. Required whenever a marker is requested and rejected when it is not; the pair is typed as one decision.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Reflects that the editor is invalid. Label never marks anything invalid; aria-invalid on the editor is the signal.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Reflects that the editor is disabled. Label never disables anything; the editor owns that state.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: '—',
    description: 'Appended after the stable .csn-label root hook; the hook is never replaced.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLLabelElement>',
    defaultValue: '—',
    description: 'Forwards the native element; no custom imperative handle is introduced.',
  },
] as const;

const styleHookRows = [
  {
    name: '.csn-label',
    type: 'class',
    defaultValue: '—',
    description: 'Stable root hook for consumer overrides written in the overrides cascade layer.',
  },
  {
    name: '.csn-label__requirement',
    type: 'class',
    defaultValue: '—',
    description: 'The marker element, present only when a marker is requested.',
  },
  {
    name: '--csn-label-font-family / -font-size / -font-weight / -line-height',
    type: 'token',
    defaultValue: 'typography.*',
    description: 'The caption type step. Every state keeps them, so an override applies uniformly.',
  },
  {
    name: '--csn-label-color',
    type: 'token',
    defaultValue: 'text.primary',
    description: 'Caption foreground. Each state assigns it rather than the CSS property.',
  },
  {
    name: '--csn-label-requirement-color',
    type: 'token',
    defaultValue: 'text.muted',
    description: 'Marker foreground, so the marker can be de-emphasised or brought forward.',
  },
  {
    name: '--csn-label-invalid-color',
    type: 'token',
    defaultValue: 'status.danger',
    description: 'Caption and marker foreground while the editor is invalid.',
  },
  {
    name: '--csn-label-disabled-opacity',
    type: 'token',
    defaultValue: 'opacity.disabled',
    description: 'Caption opacity while the editor is disabled.',
  },
  {
    name: '--csn-label-gap',
    type: 'token',
    defaultValue: 'space.1',
    description: 'Logical inline gap between the caption and its marker.',
  },
  {
    name: 'data-requirement',
    type: 'attribute',
    defaultValue: "'none'",
    description: 'Reflects the resolved marker.',
  },
  {
    name: 'data-invalid / data-disabled',
    type: 'attribute',
    defaultValue: "'false'",
    description: 'Reflect the editor state the caption was told about. Both stay observable.',
  },
  {
    name: 'data-empty',
    type: 'attribute',
    defaultValue: "'false'",
    description: 'Reflects a deliberately omitted caption.',
  },
] as const;

export const labelTopics: ComponentTopics = {
  overview: {
    summary: 'A real label element that names an editor, and costs nothing on the client.',
    content: (
      <>
        <p>
          Label renders a native <code>&lt;label&gt;</code>. That single decision is what makes a
          caption an association rather than a piece of text that happens to sit above a field: the
          browser derives the control&apos;s accessible name from it, and forwards a click to the
          control without any JavaScript.
        </p>
        <p>
          On top of that it carries the two signals a form actually needs — whether the field is
          required or optional, and whether its editor is invalid or disabled — so those are
          declared once instead of being reimplemented per screen with conditional class names.
        </p>
        <Example example="association" slug={slug} title="Naming an editor">
          <AssociationExample />
        </Example>
        <Callout title="Label describes; the editor owns">
          <p>
            Label never disables anything, never marks anything invalid, and never makes a field
            required. <code>required</code>, <code>aria-required</code>, <code>aria-invalid</code>{' '}
            and <code>disabled</code> belong to the control. Label reflects them so the caption
            matches, and the documentation is explicit about it because the opposite assumption is
            the likely misuse.
          </p>
        </Callout>
      </>
    ),
  },

  forms: {
    summary: 'Two supported association paths, and no third.',
    content: (
      <>
        <p>
          For any labelable control — every <code>input</code>, <code>select</code> and{' '}
          <code>textarea</code> — <code>htmlFor</code> is the whole association. It is the native{' '}
          <code>for</code> attribute under its React name, so what you write is what the DOM
          contains. Associating a checkbox or radio this way also enlarges its effective activation
          area, because the caption becomes part of the target.
        </p>
        <Example example="association" slug={slug} title="The native association">
          <AssociationExample />
        </Example>
        <p>
          A widget that renders no native control cannot be reached by <code>for</code>, so the
          relationship runs the other way: the Label publishes an <code>id</code> and the widget
          points at it with <code>aria-labelledby</code>. That is the supported path, and it is the
          part assistive technology depends on.
        </p>
        <Example example="non-labelable" slug={slug} title="An editor with no native control">
          <NonLabelableExample />
        </Example>
        <Callout title="Visual adjacency is not an association">
          <p>
            A caption with neither <code>htmlFor</code> nor an <code>id</code> that something points
            at names nothing at all, however close to the field it is drawn. Label renders it
            without complaint, because an intentionally unassociated caption is legitimate — but if
            a control has no accessible name, this is the first thing to check.
          </p>
        </Callout>
        <p>
          Label participates in no form state. It submits nothing, has no name and no value, and
          holds no validation logic; a form library associates it with a field by passing the same
          identifier to both.
        </p>
      </>
    ),
  },

  content: {
    summary: 'Requirement markers, the text they render, and composed captions.',
    content: (
      <>
        <p>
          <code>requirement</code> selects a marker from a closed vocabulary and{' '}
          <code>requirementText</code> supplies the word it renders. The marker sits after the
          caption, separated by a governed logical gap, and is part of the caption — so assistive
          technology announces it with the field name.
        </p>
        <Example example="requirement" slug={slug} title="Marking a field required or optional">
          <RequirementExample />
        </Example>
        <p>
          The two props are typed as one decision: requesting a marker without text, and supplying
          text without a marker, are both compile errors. That is deliberate. It means the component
          ships no default word in any language, reads no ambient locale, and needs no message
          catalogue or provider — the word arrives from your translation pipeline like every other
          string on the page.
        </p>
        <Example example="localized-marker" slug={slug} title="A marker in another language">
          <LocalizedMarkerExample />
        </Example>
        <Callout title="Use a word, not a glyph">
          <p>
            A bare asterisk is announced inconsistently or not at all, so a caption marked only with
            one reads as unmarked to many users. Give <code>requirementText</code> a word, and keep{' '}
            <code>required</code> on the editor as the machine-readable signal.
          </p>
        </Callout>
        <p>
          A caption is ordinary children, so it can carry composed content — a code fragment, a
          unit, a second phrase. It stays part of the accessible name, and it stays inline text, so
          a long caption wraps and the marker wraps with it.
        </p>
        <Example example="composed-caption" slug={slug} title="A composed caption">
          <ComposedCaptionExample />
        </Example>
      </>
    ),
  },

  states: {
    summary: 'Invalid, disabled, both at once, and a deliberately empty caption.',
    content: (
      <>
        <p>
          <code>invalid</code> and <code>disabled</code> are positive booleans that reflect the
          editor&apos;s state onto its caption. They are reflections, not sources: the editor still
          carries <code>aria-invalid</code> and <code>disabled</code>, and the caption follows.
        </p>
        <Example example="states" slug={slug} title="Editor states">
          <StatesExample />
        </Example>
        <p>
          When both are set, the disabled presentation wins, because an editor the user cannot
          change should not be presented as a problem to fix. Both values stay reflected on the
          element as <code>data-invalid</code> and <code>data-disabled</code>, so a test or a
          consumer selector still sees the full state rather than the resolved one.
        </p>
        <p>
          A caption may be omitted on purpose — for a field whose name is carried by a heading, a
          preceding field, or its own <code>aria-label</code>. The Label then reserves one line of
          height so the row stays aligned with the fields beside it, and reflects{' '}
          <code>data-empty</code> so the choice is visible rather than looking like a bug.
        </p>
        <Example example="empty-caption" slug={slug} title="A deliberately empty caption">
          <EmptyCaptionExample />
        </Example>
      </>
    ),
  },

  api: {
    summary: 'The component props, the reserved props, and the styling hooks.',
    content: (
      <>
        <p>
          Label also accepts the non-conflicting native attributes of a <code>label</code> —{' '}
          <code>id</code>, <code>style</code>, <code>title</code>, <code>lang</code>,{' '}
          <code>dir</code>, <code>data-*</code>, pointer and mouse handlers — and forwards its ref
          to that element.
        </p>
        <ApiReference caption="Label properties" rows={apiRows} />
        <p>
          Three props are reserved and rejected by the type: React&apos;s raw-markup escape hatch,
          because a caption is children and there is no markup path; <code>color</code>, a legacy
          presentational attribute that would compete with the state colours; and <code>role</code>,
          because the semantics come from the <code>label</code> element and an ARIA role would
          contradict them.
        </p>
        <p>
          Every resolved value is reflected as a <code>data-*</code> attribute, so a consumer
          stylesheet or a test can select on state without reading the component&apos;s internals.
        </p>
        <ApiReference caption="Styling hooks" rows={styleHookRows} />
        <p>
          The component publishes no imperative handle. The forwarded ref is the native element,
          which already provides everything a caller needs.
        </p>
      </>
    ),
  },

  accessibility: {
    summary: 'A real label element, two association paths, and an announced marker.',
    content: (
      <>
        <AccessibilityChecklist
          items={[
            'A native label element is rendered, so the browser establishes the relationship and computes the editor’s accessible name from the caption.',
            'htmlFor names any labelable control; a widget with no native control is named by pointing its aria-labelledby at the Label’s id.',
            'The requirement marker is text inside the label, so it is announced with the field name — use a word rather than a bare glyph.',
            'The marker is a convention, not the mechanism: required and aria-required stay on the editor.',
            'Invalid is never signalled by colour alone; aria-invalid on the editor and the accompanying message carry it.',
            'Disabled styling is presentation only; the editor owns the disabled state that removes it from the tab order.',
            'Associating a checkbox or radio enlarges its effective activation area, which helps the WCAG 2.2 target-size criterion.',
            'The caption, the marker and the invalid colour each meet the WCAG 2.2 AA 4.5:1 contrast baseline; the dimmed disabled caption is exempt under WCAG 1.4.3.',
            'Sizes are rem values, so the caption scales with the reader’s font-size preference and at 200% zoom.',
            'At 320 CSS pixels a long caption wraps and the marker wraps with it; nothing overflows horizontally.',
            'Under forced colours the caption takes a system foreground and the disabled caption a system grey, so that distinction survives.',
            'The component owns no focus, tab stop, key model, announcement, or motion.',
          ]}
        />
        <p>
          Label meets the WCAG 2.2 AA baseline that ADR-009 fixed for this platform. It publishes no
          keyboard table because it owns no interaction: the tab stop and key handling belong to the
          editor, and the only interaction Label participates in is the browser&apos;s own
          click-forwarding.
        </p>
        <Callout title="Consumer responsibilities">
          <p>
            Give every editor a caption or another accessible name. Keep the marker word in your
            translation catalogue. Put <code>required</code>, <code>aria-required</code>,{' '}
            <code>aria-invalid</code> and <code>disabled</code> on the editor, and let the caption
            reflect them. Do not nest a control inside a Label that already has <code>htmlFor</code>
            .
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
          Import <code>@casauran/react/label.css</code> once from a layout. Label consumes nine
          governed component tokens, and every state assigns the token rather than the CSS property,
          so a consumer override written in the <code>overrides</code> cascade layer applies to a
          default and to an invalid or disabled caption alike:
        </p>
        <pre>
          <code>{`@layer overrides {\n  .brand-field .csn-label {\n    --csn-label-font-weight: 600;\n    --csn-label-requirement-color: var(--csn-status-danger);\n  }\n}`}</code>
        </pre>
        <p>
          Light and dark themes, comfortable and compact densities, and nested theme scopes are
          inherited from the theme package. The caption does not rescale with density, for the
          reason Typography records: density governs control spacing, and rescaling text would fight
          the reader&apos;s own font-size preference.
        </p>
        <p>
          Direction is inherited from the ambient <code>dir</code>; the gap before the marker is a
          logical inline margin, so the marker follows the caption in a right-to-left layout with no
          property to set. Label owns no message catalogue, number format, or date format — the
          caption and the marker text both arrive already localized, which is exactly what the
          mandatory <code>requirementText</code> is for.
        </p>
      </>
    ),
  },

  nextjs: {
    summary: 'Server-renderable with no client boundary and no hydration state.',
    content: (
      <p>
        Label is a Server Component. It declares no <code>&apos;use client&apos;</code> boundary,
        reads no browser global, and holds no effect, observer, listener, timer, portal, random
        value, or generated identifier, so its server and client markup are identical and it adds
        nothing to the client bundle. That is a consequence of the API rather than a coincidence:
        the two designs that would have forced a client boundary — resolving the marker word from an
        ambient locale, and forwarding a click through a reference to the editor — were both
        rejected, and the browser&apos;s native click-forwarding covers the case that mattered.
      </p>
    ),
  },

  performance: {
    summary: 'A recorded server-render budget with scenario, ceiling, and result.',
    content: (
      <p>
        A form of fifty fields renders fifty captions, so the governed scenario is server rendering:
        5,000 renders through <code>react-dom/server</code> after a production package build,
        cycling the requirement, invalid, disabled and empty surfaces so the marker path, both state
        paths and the empty path are all exercised, with a 500 ms ceiling.{' '}
        <code>pnpm benchmark:label</code> runs it and prints the observed result with its Node
        version, platform, and architecture; the recorded figure lives in{' '}
        <code>.agent/performance-budgets.md</code>. This is a bounded regression guard, not a
        universal speed claim.
      </p>
    ),
  },

  security: {
    summary: 'A caption is text, and field names are often not yours.',
    content: (
      <>
        <Callout title="No markup path" tone="security">
          <p>
            React&apos;s raw-markup escape hatch is rejected by the type, so the caption and the
            marker reach the document only as children, which React escapes. There is no sanitizer
            to keep correct because there is nothing to sanitize.
          </p>
        </Callout>
        <p>
          This matters more here than it looks. Field names are frequently not written by the
          application: they come from a JSON schema, a CMS row, a spreadsheet import, or model
          output. A caption is exactly the value an injection path would be exploited through.
        </p>
        <Example example="untrusted-caption" slug={slug} title="A caption from elsewhere">
          <UntrustedCaptionExample />
        </Example>
        <p>
          <code>htmlFor</code> is an identifier, not a URL: it is written to an attribute and never
          dereferenced, fetched, or used to build a selector, so a hostile value can only fail to
          match. Label fetches nothing, stores nothing and evaluates nothing, and introduces no
          content-security-policy allowance of its own. The one surface that remains yours is{' '}
          <code>style</code>, which is a <code>CSSProperties</code> object rather than a string.
        </p>
      </>
    ),
  },

  limitations: {
    summary: 'What Label deliberately does not do, and why.',
    content: (
      <ul>
        <li>
          <strong>No click forwarding through a reference to the editor.</strong> Looking on an
          arbitrary ref for a <code>focus</code> method is duck-typing another component&apos;s
          internals: it does nothing when the shape does not match, and it would force a client
          boundary and a listener onto every label in an application. Activation belongs to the
          component that owns the widget; Label supplies the naming relationship it needs.
        </li>
        <li>
          <strong>No inverted validity prop.</strong> <code>invalid</code> is positive. A boolean
          whose meaningful value is <code>false</code> has to be read as a double negative.
        </li>
        <li>
          <strong>No built-in marker word.</strong> Shipping a default English string would make the
          most common label in a form the one untranslated string on the page.
        </li>
        <li>
          <strong>No size or tone scale.</strong> A caption should match the control it names, and
          the control that would set that scale has not shipped yet. The component tokens are the
          seam in the meantime, and a scale added now would be guesswork.
        </li>
        <li>
          <strong>No direction property.</strong> The stylesheet is logical throughout, so a caption
          inside a right-to-left region is already correct.
        </li>
        <li>
          <strong>No floating or animated caption.</strong> That is a different component with a
          different anatomy — it wraps its editor and animates on focus and value.
        </li>
        <li>
          <strong>No hint or error message.</strong> Those are associated by description rather than
          by label, are announced differently, and are their own components.
        </li>
        <li>
          <strong>No nested control.</strong> HTML forbids nesting a labelable element inside a
          label that already has <code>htmlFor</code>, and the implicit-association alternative
          gives up the explicit relationship. The type does not prevent it; the platform does not
          support it.
        </li>
        <li>
          <strong>No layout.</strong> Whether a caption sits above, beside, or after its editor is
          the surrounding form&apos;s decision.
        </li>
      </ul>
    ),
  },
};
