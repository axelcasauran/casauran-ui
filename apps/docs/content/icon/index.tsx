import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { DirectionExample } from './examples/direction';
import { InheritedColourExample } from './examples/inherited-colour';
import { LabellingExample } from './examples/labelling';
import { NamedDefinitionsExample } from './examples/named-definitions';
import { RuntimeNamesExample } from './examples/runtime-names';
import { SizesExample } from './examples/sizes';
import { TonesExample } from './examples/tones';

const slug = 'icon';

const apiRows = [
  {
    name: 'name',
    type: 'IconName',
    defaultValue: 'required',
    description:
      'A definition shipped by @casauran/icons. The type is the catalog itself, so an unknown glyph is a compile error.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
    defaultValue: "'md'",
    description: 'Logical box size from the shared scale; the glyph fills the box on both axes.',
  },
  {
    name: 'tone',
    type: "'inherit' | 'accent' | 'muted' | 'positive' | 'caution' | 'critical' | 'inverse'",
    defaultValue: "'inherit'",
    description:
      'Semantic colour intent. The default follows the surrounding text colour; informational artwork uses accent.',
  },
  {
    name: 'flip',
    type: "'none' | 'horizontal' | 'vertical' | 'both'",
    defaultValue: "'none'",
    description: 'Explicitly mirrors directional artwork. Direction is never inferred from dir.',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: '—',
    description:
      'Promotes the icon to an accessible image with this name. An empty or whitespace-only value keeps it decorative.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: '—',
    description: 'Appended after the stable .csn-icon root hook; the hook is never replaced.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLSpanElement>',
    defaultValue: '—',
    description: 'Forwards the native element; no custom imperative handle is introduced.',
  },
] as const;

const styleHookRows = [
  {
    name: '.csn-icon',
    type: 'class',
    defaultValue: '—',
    description: 'Stable root hook for consumer overrides written in the overrides cascade layer.',
  },
  {
    name: '--csn-icon-size',
    type: 'token',
    defaultValue: 'typography.body-size',
    description: 'Box size for both axes. Every size step assigns it, including the md default.',
  },
  {
    name: '--csn-icon-color',
    type: 'token',
    defaultValue: 'currentColor',
    description: 'Foreground. Each tone assigns it; inherit assigns currentColor.',
  },
  {
    name: 'data-size',
    type: 'attribute',
    defaultValue: "'md'",
    description: 'Reflects the resolved size for consumer selectors and tests.',
  },
  {
    name: 'data-tone',
    type: 'attribute',
    defaultValue: "'inherit'",
    description: 'Reflects the resolved tone.',
  },
  {
    name: 'data-flip',
    type: 'attribute',
    defaultValue: "'none'",
    description: 'Reflects the resolved mirroring.',
  },
  {
    name: 'data-icon-name',
    type: 'attribute',
    defaultValue: '—',
    description: 'Reflects the requested definition name, including one the catalog does not ship.',
  },
] as const;

export const iconTopics: ComponentTopics = {
  overview: {
    summary: 'A named, tree-shakeable SVG definition with no icon font.',
    content: (
      <>
        <p>
          Icon renders a named, tree-shakeable Casauran SVG definition without an icon font. It is
          decorative by default, inherits the surrounding text direction and colour, and remains
          server-renderable with no component client boundary.
        </p>
        <p>
          The catalog is the type. <code>name</code> accepts <code>IconName</code>, the union of the
          definitions <code>@casauran/icons</code> ships, so a glyph that does not exist fails at
          compile time rather than rendering an empty box.
        </p>
        <Example example="named-definitions" slug={slug} title="The definition catalog">
          <NamedDefinitionsExample />
        </Example>
        <Callout title="Actions own semantics">
          <p>
            Do not attach click behaviour or a tab stop to a standalone Icon; the component accepts
            neither <code>tabIndex</code> nor an interactive role. Compose it inside Button or
            another component that owns the interaction.
          </p>
        </Callout>
      </>
    ),
  },

  appearance: {
    summary: 'Seven semantic tones, with the default following the surrounding text colour.',
    content: (
      <>
        <p>
          <code>tone</code> expresses intent rather than a colour value. The default,{' '}
          <code>inherit</code>, resolves to <code>currentColor</code>, so an icon placed inside
          toned text, an inverse surface, or a solid Button takes that context&apos;s foreground.
          Informational artwork uses <code>accent</code>; Casauran keeps one brand ramp rather than
          a separate informational colour.
        </p>
        <Example example="tones" slug={slug} title="Tone scale">
          <TonesExample />
        </Example>
        <Example example="inherited-colour" slug={slug} title="Inheriting the surrounding colour">
          <InheritedColourExample />
        </Example>
        <Callout title="Colour is never the only signal" tone="security">
          <p>
            A tone communicates status to sighted users only. Pair a critical or caution icon with
            text, or give it a <code>label</code>, so the meaning survives forced colours and
            colour-vision differences.
          </p>
        </Callout>
      </>
    ),
  },

  sizes: {
    summary: 'A seven-step box scale from dense metadata to display artwork.',
    content: (
      <>
        <p>
          <code>size</code> sets one box that both axes resolve from, so an icon is always square.
          The scale runs from <code>xs</code> for dense table metadata to <code>3xl</code> for empty
          states and feature panels; <code>md</code> matches body text.
        </p>
        <Example example="sizes" slug={slug} title="Size scale">
          <SizesExample />
        </Example>
      </>
    ),
  },

  content: {
    summary: 'Direction, mirroring, and how a definition reaches the component.',
    content: (
      <>
        <p>
          Icon takes no children: the artwork comes from <code>name</code>. Mirroring is explicit,
          because most symbols must not flip in a right-to-left layout even though a few directional
          ones should.
        </p>
        <Example example="direction" slug={slug} title="Mirroring directional artwork">
          <DirectionExample />
        </Example>
        <p>
          A name that arrives from outside the type system — a CMS field, a route segment, a data
          row — is narrowed with <code>isIconName</code> before it is rendered. An unnarrowed
          unknown name still fails closed: the element renders with no glyph rather than broken
          markup.
        </p>
        <Example example="runtime-names" slug={slug} title="Names resolved at runtime">
          <RuntimeNamesExample />
        </Example>
      </>
    ),
  },

  api: {
    summary: 'Definition name, size, tone, mirroring, accessible labelling, and styling hooks.',
    content: (
      <>
        <p>
          Icon also accepts the non-conflicting native attributes of a <code>span</code> —{' '}
          <code>id</code>, <code>style</code>, <code>title</code>, <code>data-*</code>, pointer and
          mouse handlers — and forwards its ref to that element. It reserves <code>children</code>,{' '}
          <code>color</code>, <code>role</code>, <code>aria-hidden</code>, <code>aria-label</code>{' '}
          and <code>tabIndex</code>, because each of those would contradict semantics the component
          derives from <code>label</code>.
        </p>
        <ApiReference caption="Icon properties" rows={apiRows} />
        <ApiReference caption="Styling hooks" rows={styleHookRows} />
        <p>
          <code>@casauran/icons</code> exports the data surface: <code>iconNames</code> to enumerate
          the catalog, <code>isIconName</code> to narrow a runtime string,{' '}
          <code>getIconDefinition</code> to read one definition, and the <code>IconName</code> and{' '}
          <code>IconDefinition</code> types.
        </p>
      </>
    ),
  },

  accessibility: {
    summary: 'Decorative by default; labelled only when the artwork carries meaning.',
    content: (
      <>
        <Example example="labelling" slug={slug} title="Decorative and labelled icons">
          <LabellingExample />
        </Example>
        <AccessibilityChecklist
          items={[
            'Decorative icons are hidden from assistive technology by default with aria-hidden.',
            'A non-empty label changes the element to role="img" with that accessible name.',
            'A whitespace-only label names nothing, so it keeps the icon decorative instead of publishing an unnamed image.',
            'Icons inside labelled controls remain decorative so names are not repeated.',
            'The nested SVG is always hidden and unfocusable, in every mode.',
            'The component owns no focus, tab stop, or key model, and does not accept tabIndex; an aria-hidden element must never be reachable by keyboard.',
            'Semantic tones retain their shape in forced colours, where the glyph paints a system foreground.',
            'Meaning is never carried by colour alone; pair a tone with text or a label.',
          ]}
        />
        <p>
          Icon meets the WCAG 2.2 AA baseline that ADR-009 fixed for this platform. It publishes no
          keyboard table because it owns no interaction: a composed icon inherits the tab stop,
          focus ring, and key model of the control it sits inside.
        </p>
      </>
    ),
  },

  theming: {
    summary: 'Token seams, density, inherited direction, forced colours, and globalization.',
    content: (
      <>
        <p>
          Import <code>@casauran/react/icon.css</code> once from a layout. Icon consumes two
          governed component tokens, <code>--csn-icon-size</code> and <code>--csn-icon-color</code>.
          Every enumerated size and tone assigns them at the same specificity, including the
          defaults, so a consumer override written in the <code>overrides</code> cascade layer
          applies uniformly:
        </p>
        <pre>
          <code>{`@layer overrides {\n  .brand-icon {\n    --csn-icon-color: var(--csn-status-success);\n    --csn-icon-size: 1.5rem;\n  }\n}`}</code>
        </pre>
        <p>
          Light and dark themes, comfortable and compact densities, and nested theme scopes are
          inherited from the theme package rather than re-implemented. Direction is inherited from
          the ambient <code>dir</code>; Icon never mirrors artwork automatically, because most
          symbols keep their orientation in a right-to-left layout. Icon owns no message catalogue,
          number, or date formatting — a <code>label</code> is supplied already localized by the
          caller.
        </p>
      </>
    ),
  },

  nextjs: {
    summary: 'Server-renderable with no client boundary and no hydration state.',
    content: (
      <p>
        Icon is a Server Component by default. It declares no <code>&apos;use client&apos;</code>{' '}
        boundary, reads no browser global at module evaluation, and holds no effect, observer,
        listener, timer, portal, random value, or current time, so its server and client markup are
        identical and it adds nothing to the client bundle. Rendering it inside a client component
        works unchanged. The definition data is a plain module, so a route that uses three glyphs
        ships three glyphs.
      </p>
    ),
  },

  performance: {
    summary: 'A recorded server-render budget with scenario, ceiling, and result.',
    content: (
      <p>
        The governed scenario renders 1,000 alternating named icons through{' '}
        <code>react-dom/server</code> after a production package build, with a 500 ms ceiling.{' '}
        <code>pnpm benchmark:icon</code> runs it and prints the observed result with its Node
        version, platform, and architecture; the recorded figure lives in{' '}
        <code>.agent/performance-budgets.md</code>. This is a bounded regression guard, not a
        universal speed claim.
      </p>
    ),
  },

  security: {
    summary: 'A closed definition catalog: no raw SVG, URLs, or external resources.',
    content: (
      <>
        <Callout title="Closed definition catalog" tone="security">
          <p>
            Only definitions shipped by <code>@casauran/icons</code> render. Icon never parses raw
            SVG, HTML, URLs, data URIs, external resources, or executable markup, and it exposes no
            escape hatch that would accept them.
          </p>
        </Callout>
        <p>
          An unknown name — including one built from user input — produces an empty decorative
          element; the name itself is only ever an attribute value escaped by React. Because the
          component fetches nothing, it introduces no request, referrer, or content-security-policy
          consideration of its own.
        </p>
      </>
    ),
  },

  limitations: {
    summary: 'What Icon deliberately does not do, and which stage owns each capability.',
    content: (
      <>
        <ul>
          <li>
            <strong>No caller-supplied SVG.</strong> Rendering a definition the caller owns is the
            supported direct-definition surface introduced by stage 1.03 SVGIcon, not an Icon
            feature.
          </li>
          <li>
            <strong>No icon font.</strong> The accepted styling architecture rules out font-based
            glyphs, so there is no glyph class, ligature, or Unicode escape.
          </li>
          <li>
            <strong>No global icon registry or provider.</strong> Icons are passed where they are
            used; a component whose artwork should be replaceable exposes a slot instead of reading
            an ambient context.
          </li>
          <li>
            <strong>No stroke or fill variants.</strong> Every definition ships one drawing.
          </li>
          <li>
            <strong>No interaction.</strong> Focus, activation, keyboard, and disabled semantics
            belong to the control that composes the icon.
          </li>
          <li>
            <strong>A small catalog.</strong> Definitions are added when a Casauran surface needs
            one; <code>iconNames</code> is the authoritative list at any version.
          </li>
        </ul>
      </>
    ),
  },
};
