import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { CatalogInteropExample } from './examples/catalog-interop';
import { CompositionExample } from './examples/composition';
import { DirectionExample } from './examples/direction';
import { InheritedColourExample } from './examples/inherited-colour';
import { LabellingExample } from './examples/labelling';
import { LayersExample } from './examples/layers';
import { OwnArtworkExample } from './examples/own-artwork';
import { RuntimeDefinitionsExample } from './examples/runtime-definitions';
import { SizesExample } from './examples/sizes';
import { TonesExample } from './examples/tones';
import { VariantFallbackExample } from './examples/variant-fallback';
import { VariantsExample } from './examples/variants';

const slug = 'svg-icon';

const apiRows = [
  {
    name: 'icon',
    type: 'SVGIconDefinition',
    defaultValue: 'required',
    description:
      'The drawing to render. The caller owns it; a definition that fails validation renders no artwork.',
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'duotone'",
    defaultValue: '—',
    description:
      'Selects an alternate drawing. A variant the definition does not ship falls back to the default one.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
    defaultValue: "'md'",
    description: 'Logical box size from the shared scale; the drawing fills the box on both axes.',
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
    description: 'Appended after the stable .csn-svg-icon root hook; the hook is never replaced.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLSpanElement>',
    defaultValue: '—',
    description: 'Forwards the native element; no custom imperative handle is introduced.',
  },
] as const;

const definitionRows = [
  {
    name: 'name',
    type: 'string',
    defaultValue: 'required',
    description:
      'Identifies the drawing. Reflected as data-icon-name once the definition validates.',
  },
  {
    name: 'viewBox',
    type: 'string',
    defaultValue: "'0 0 24 24'",
    description:
      'The box the geometry is drawn on. It belongs to the definition, so one drawing cannot render differently in two places.',
  },
  {
    name: 'paths',
    type: '(string | IconPath)[]',
    defaultValue: 'required',
    description:
      'The default drawing, as ordered layers. A bare string is stroked geometry with the platform defaults.',
  },
  {
    name: 'variants',
    type: 'Partial<Record<SVGIconVariant, (string | IconPath)[]>>',
    defaultValue: '—',
    description: 'Alternate drawings of the same symbol, keyed by the governed variant names.',
  },
  {
    name: 'IconPath.d',
    type: 'string',
    defaultValue: 'required',
    description: 'SVG path geometry. Written to an attribute; never parsed or inserted as markup.',
  },
  {
    name: 'IconPath.paint',
    type: "'stroke' | 'fill'",
    defaultValue: "'stroke'",
    description: 'Whether the resolved colour traces the geometry or fills its interior.',
  },
  {
    name: 'IconPath.strokeWidth',
    type: 'number',
    defaultValue: '1.8',
    description:
      'Weight in view-box units. Per layer, so one drawing can mix weights; the default matches Icon.',
  },
  {
    name: 'IconPath.fillRule',
    type: "'nonzero' | 'evenodd'",
    defaultValue: '—',
    description: 'Interior rule for a filled layer with self-intersections or holes.',
  },
  {
    name: 'IconPath.opacity',
    type: 'number',
    defaultValue: '—',
    description: 'Layer opacity from 0 to 1, used by duotone artwork to recede a background layer.',
  },
] as const;

const styleHookRows = [
  {
    name: '.csn-svg-icon',
    type: 'class',
    defaultValue: '—',
    description: 'Stable root hook for consumer overrides written in the overrides cascade layer.',
  },
  {
    name: '--csn-svg-icon-size',
    type: 'token',
    defaultValue: 'typography.body-size',
    description: 'Box size for both axes. Every size step assigns it, including the md default.',
  },
  {
    name: '--csn-svg-icon-color',
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
    name: 'data-variant',
    type: 'attribute',
    defaultValue: "'default'",
    description:
      'Reflects the drawing that actually rendered, so a variant fallback is observable rather than silent.',
  },
  {
    name: 'data-icon-name',
    type: 'attribute',
    defaultValue: '—',
    description: 'Reflects the definition name. Absent when the definition did not validate.',
  },
] as const;

export const svgIconTopics: ComponentTopics = {
  overview: {
    summary: 'Render artwork your application owns, without a second icon system.',
    content: (
      <>
        <p>
          SVGIcon renders a drawing the caller supplies. Where <code>Icon</code> resolves a name
          from the Casauran catalog, SVGIcon takes a definition you own, so an application ships its
          own artwork without waiting for the catalog to grow.
        </p>
        <p>
          A definition is data, not markup: a name, an optional view box, and an ordered list of
          geometry layers. Everything else — sizing, colour, mirroring, accessibility semantics — is
          identical to <code>Icon</code>, because those are properties of an icon rather than of
          where its drawing came from.
        </p>
        <Example example="own-artwork" slug={slug} title="A definition you own">
          <OwnArtworkExample />
        </Example>
        <Callout title="Actions own semantics">
          <p>
            Do not attach click behaviour or a tab stop to a standalone SVGIcon; the component
            accepts neither <code>tabIndex</code> nor an interactive role. Compose it inside Button
            or another component that owns the interaction.
          </p>
        </Callout>
      </>
    ),
  },

  appearance: {
    summary: 'Three drawing variants and seven semantic tones.',
    content: (
      <>
        <p>
          A definition may ship alternate drawings of the same symbol. <code>variant</code> selects
          one from a closed vocabulary, so a misspelled variant is a compile error rather than
          artwork that quietly changes. Each variant is its own geometry — a solid drawing is not a
          restyled outline.
        </p>
        <Example example="variants" slug={slug} title="Drawing variants">
          <VariantsExample />
        </Example>
        <p>
          <code>tone</code> expresses intent rather than a colour value. The default,{' '}
          <code>inherit</code>, resolves to <code>currentColor</code>, so artwork placed inside
          toned text, an inverse surface, or a solid Button takes that context&apos;s foreground.
        </p>
        <Example example="tones" slug={slug} title="Tone scale">
          <TonesExample />
        </Example>
        <Example example="inherited-colour" slug={slug} title="Inheriting the surrounding colour">
          <InheritedColourExample />
        </Example>
        <Callout title="Colour is never the only signal" tone="security">
          <p>
            A tone communicates status to sighted users only. Pair a critical or caution drawing
            with text, or give it a <code>label</code>, so the meaning survives forced colours and
            colour-vision differences.
          </p>
        </Callout>
      </>
    ),
  },

  sizes: {
    summary: 'A seven-step box scale shared with Icon.',
    content: (
      <>
        <p>
          <code>size</code> sets one box that both axes resolve from, so an icon is always square
          regardless of the aspect ratio its view box declares. The scale runs from <code>xs</code>{' '}
          for dense table metadata to <code>3xl</code> for empty states; <code>md</code> matches
          body text.
        </p>
        <Example example="sizes" slug={slug} title="Size scale">
          <SizesExample />
        </Example>
      </>
    ),
  },

  content: {
    summary: 'Layers, paint, mirroring, catalog interoperability, and composition.',
    content: (
      <>
        <p>
          SVGIcon takes no children: the artwork comes from <code>icon</code>. A drawing is an
          ordered list of layers, each rendered as one <code>&lt;path&gt;</code>. A bare string is
          stroked geometry with the platform defaults; an object adds paint, weight, fill rule and
          opacity, which is how filled, mixed-weight and duotone artwork is expressed.
        </p>
        <Example example="layers" slug={slug} title="Layers and paint">
          <LayersExample />
        </Example>
        <p>
          Mirroring is explicit, because most symbols must not flip in a right-to-left layout even
          though a few directional ones should.
        </p>
        <Example example="direction" slug={slug} title="Mirroring directional artwork">
          <DirectionExample />
        </Example>
        <p>
          A catalog definition is structurally a valid <code>SVGIconDefinition</code>, so{' '}
          <code>getIconDefinition</code> output renders through SVGIcon unchanged and at the same
          weight <code>Icon</code> paints it. The two components are one artwork contract, not two
          parallel worlds.
        </p>
        <Example example="catalog-interop" slug={slug} title="Catalog and caller-owned artwork">
          <CatalogInteropExample />
        </Example>
        <p>
          Composing into a control is the supported way to give artwork an action. Button&apos;s
          content slots and icon-only geometry accept an SVGIcon element exactly as they accept an
          Icon element.
        </p>
        <Example example="composition" slug={slug} title="Composed into Button">
          <CompositionExample />
        </Example>
      </>
    ),
  },

  states: {
    summary: 'Variant fallback and what an unusable definition renders.',
    content: (
      <>
        <p>
          Requesting a variant a definition does not ship is not an error. The default drawing
          renders and <code>data-variant</code> reports <code>default</code>, so the fallback is
          visible to a test or a consumer selector rather than silent.
        </p>
        <Example example="variant-fallback" slug={slug} title="Falling back to the default drawing">
          <VariantFallbackExample />
        </Example>
        <p>
          A definition that does not validate fails closed. The element still renders and keeps its
          decorative semantics, but it emits no <code>&lt;svg&gt;</code> and no{' '}
          <code>data-icon-name</code> — the same shape <code>Icon</code> gives an unknown catalog
          name, and never partial or broken markup. This covers a missing or empty drawing, a layer
          without geometry, a malformed or zero-extent view box, an out-of-range opacity, a
          non-positive stroke weight, and a variant key outside the governed vocabulary.
        </p>
      </>
    ),
  },

  api: {
    summary: 'The component props, the definition shape, and the styling hooks.',
    content: (
      <>
        <p>
          SVGIcon also accepts the non-conflicting native attributes of a <code>span</code> —{' '}
          <code>id</code>, <code>style</code>, <code>title</code>, <code>data-*</code>, pointer and
          mouse handlers — and forwards its ref to that element. It reserves <code>children</code>,{' '}
          <code>color</code>, <code>role</code>, <code>aria-hidden</code>, <code>aria-label</code>{' '}
          and <code>tabIndex</code>, because each of those would contradict semantics the component
          derives from <code>icon</code>, <code>tone</code> and <code>label</code>.
        </p>
        <ApiReference caption="SVGIcon properties" rows={apiRows} />
        <p>
          The definition shape is published by <code>@casauran/icons</code>. The view box lives on
          the definition rather than on the component, so a drawing shared between two positions
          cannot render correctly in one and clipped in the other.
        </p>
        <ApiReference caption="SVGIconDefinition and IconPath" rows={definitionRows} />
        <ApiReference caption="Styling hooks" rows={styleHookRows} />
        <p>
          <code>@casauran/icons</code> also exports <code>isSVGIconDefinition</code> to narrow a
          value that crossed a runtime boundary, <code>resolveSVGIcon</code> to resolve a definition
          and variant to the drawing that will render, <code>svgIconVariants</code> to enumerate the
          vocabulary, and the <code>SVG_ICON_DEFAULT_VIEW_BOX</code> and{' '}
          <code>SVG_ICON_DEFAULT_STROKE_WIDTH</code> constants.
        </p>
      </>
    ),
  },

  accessibility: {
    summary: 'Decorative by default; labelled only when the artwork carries meaning.',
    content: (
      <>
        <Example example="labelling" slug={slug} title="Decorative and labelled artwork">
          <LabellingExample />
        </Example>
        <AccessibilityChecklist
          items={[
            'Decorative artwork is hidden from assistive technology by default with aria-hidden.',
            'A non-empty label changes the element to role="img" with that accessible name.',
            'A whitespace-only label names nothing, so it keeps the icon decorative instead of publishing an unnamed image.',
            'Artwork inside labelled controls remains decorative so names are not repeated.',
            'The nested SVG is always hidden and unfocusable, in every mode.',
            'The component owns no focus, tab stop, or key model, and does not accept tabIndex; an aria-hidden element must never be reachable by keyboard.',
            'In forced colours the drawing paints a system foreground and layer opacity is flattened, so a receded duotone layer cannot disappear.',
            'Meaning is never carried by colour alone; pair a tone with text or a label.',
          ]}
        />
        <p>
          SVGIcon meets the WCAG 2.2 AA baseline that ADR-009 fixed for this platform. It publishes
          no keyboard table because it owns no interaction: composed artwork inherits the tab stop,
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
          Import <code>@casauran/react/svg-icon.css</code> once from a layout. SVGIcon consumes two
          governed component tokens, <code>--csn-svg-icon-size</code> and{' '}
          <code>--csn-svg-icon-color</code>. Every enumerated size and tone assigns them at the same
          specificity, including the defaults, so a consumer override written in the{' '}
          <code>overrides</code> cascade layer applies uniformly:
        </p>
        <pre>
          <code>{`@layer overrides {\n  .brand-icon {\n    --csn-svg-icon-color: var(--csn-status-success);\n    --csn-svg-icon-size: 1.5rem;\n  }\n}`}</code>
        </pre>
        <p>
          Stroke weight is deliberately not a CSS seam. It belongs to the drawing rather than the
          theme, and one drawing may mix weights, so it is a per-layer property of the definition.
        </p>
        <p>
          Light and dark themes, comfortable and compact densities, and nested theme scopes are
          inherited from the theme package rather than re-implemented. Direction is inherited from
          the ambient <code>dir</code>; SVGIcon never mirrors artwork automatically, because most
          symbols keep their orientation in a right-to-left layout. SVGIcon owns no message
          catalogue, number, or date formatting — a <code>label</code> is supplied already localized
          by the caller.
        </p>
      </>
    ),
  },

  nextjs: {
    summary: 'Server-renderable with no client boundary and no hydration state.',
    content: (
      <p>
        SVGIcon is a Server Component by default. It declares no <code>&apos;use client&apos;</code>{' '}
        boundary, reads no browser global at module evaluation, and holds no effect, observer,
        listener, timer, portal, random value, or current time, so its server and client markup are
        identical and it adds nothing to the client bundle. Rendering it inside a client component
        works unchanged. A definition is a plain object, so artwork can be declared in a server
        module and passed down without serialization concerns.
      </p>
    ),
  },

  performance: {
    summary: 'A recorded server-render budget with scenario, ceiling, and result.',
    content: (
      <p>
        The governed scenario renders 1,000 caller-owned three-layer definitions through{' '}
        <code>react-dom/server</code> after a production package build, alternating variants so
        resolution and fallback are both exercised, with a 500 ms ceiling.{' '}
        <code>pnpm benchmark:svg-icon</code> runs it and prints the observed result with its Node
        version, platform, and architecture; the recorded figure lives in{' '}
        <code>.agent/performance-budgets.md</code>. This is a bounded regression guard, not a
        universal speed claim.
      </p>
    ),
  },

  security: {
    summary: 'Structured geometry only: no markup parsing, and no injection sink to review.',
    content: (
      <>
        <Callout title="A definition is data, never markup" tone="security">
          <p>
            SVGIcon renders only <code>&lt;path&gt;</code> elements built from a definition&apos;s
            geometry and a closed set of paint values. It never parses SVG or HTML, never reaches
            for React&apos;s raw-markup escape hatch, and the API cannot express a{' '}
            <code>&lt;script&gt;</code>, a <code>&lt;use&gt;</code> reference, an embedded image, a{' '}
            <code>&lt;foreignObject&gt;</code>, an event attribute, an external URL, or a data URI —
            whatever the definition&apos;s origin. That is structural, not a filter, and there is no
            escape hatch that reintroduces it.
          </p>
        </Callout>
        <p>
          Treat a definition from a CMS, an API, an upload, or model output as untrusted data and
          narrow it with <code>isSVGIconDefinition</code> before rendering. An unnarrowed value
          still fails closed, but narrowing lets you choose the fallback rather than showing an
          empty box.
        </p>
        <Example
          example="runtime-definitions"
          slug={slug}
          title="Definitions that crossed a boundary"
        >
          <RuntimeDefinitionsExample />
        </Example>
        <p>
          Geometry reaches the document only as an attribute value escaped by React. Because the
          component fetches nothing, it introduces no request, referrer, or content-security-policy
          consideration of its own — in particular, rendering caller artwork needs no{' '}
          <code>unsafe-inline</code> relaxation.
        </p>
      </>
    ),
  },

  limitations: {
    summary: 'What SVGIcon deliberately does not do, and why.',
    content: (
      <ul>
        <li>
          <strong>No raw SVG strings or children.</strong> A drawing is structured geometry.
          Accepting markup — as a <code>content</code> string or as inner elements — would mean
          injecting caller-supplied markup, which is the sink this API exists to avoid. Convert an{' '}
          <code>.svg</code> file to a definition in your build instead.
        </li>
        <li>
          <strong>No open variant keyspace.</strong> Variants are <code>solid</code>,{' '}
          <code>outline</code> and <code>duotone</code>. A symbol that needs a genuinely different
          drawing is a second definition, which is clearer than an untyped key.
        </li>
        <li>
          <strong>No icon font.</strong> The accepted styling architecture rules out font-based
          glyphs, so there is no glyph class, ligature, or Unicode escape.
        </li>
        <li>
          <strong>No global icon registry or provider.</strong> Artwork is passed where it is used;
          a component whose artwork should be replaceable exposes a slot instead of reading an
          ambient context.
        </li>
        <li>
          <strong>No published styling target for the inner SVG.</strong> The governed seam is the{' '}
          <code>.csn-svg-icon</code> root hook plus its component tokens; the nested element is not
          a compatibility promise.
        </li>
        <li>
          <strong>No interaction.</strong> Focus, activation, keyboard, and disabled semantics
          belong to the control that composes the artwork.
        </li>
      </ul>
    ),
  },
};
