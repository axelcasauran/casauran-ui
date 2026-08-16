import {
  AccessibilityChecklist,
  ApiReference,
  Callout,
  Example,
} from '../../components/docs-primitives';
import type { ComponentTopics } from '../../lib/topics';
import { SizeToneDirectionExample } from './examples/size-tone-direction';

const slug = 'icon';

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

export const iconTopics: ComponentTopics = {
  overview: {
    summary: 'A named, tree-shakeable SVG definition with no icon font.',
    content: (
      <>
        <p>
          Icon renders a named, tree-shakeable Casauran SVG definition without an icon font. It is
          decorative by default, inherits the surrounding text direction and color, and remains
          server-renderable with no component client boundary.
        </p>
        <Example example="size-tone-direction" slug={slug} title="Size, tone, and direction">
          <SizeToneDirectionExample />
        </Example>
        <Callout title="Actions own semantics">
          <p>
            Do not attach click behavior to a standalone Icon. Compose it inside Button or another
            component that owns the interaction semantics.
          </p>
        </Callout>
      </>
    ),
  },

  api: {
    summary: 'Definition name, size, tone, direction, and accessible labelling.',
    content: (
      <>
        <p>
          Icon also accepts non-conflicting SVG presentation attributes and a standard style object.
        </p>
        <ApiReference caption="Icon properties" rows={apiRows} />
      </>
    ),
  },

  accessibility: {
    summary: 'Decorative by default; labelled only when the artwork carries meaning.',
    content: (
      <AccessibilityChecklist
        items={[
          'Decorative icons are hidden from assistive technology by default.',
          'A non-empty label changes the element to an accessible image.',
          'Icons inside labelled controls remain decorative so names are not repeated.',
          'Semantic tones retain meaning in forced colors without relying on color alone.',
          'The component has no keyboard behavior because it does not own an interaction.',
        ]}
      />
    ),
  },

  theming: {
    summary: 'Semantic color and size tokens, inherited direction, explicit mirroring.',
    content: (
      <p>
        Import <code>@casauran/react/icon.css</code> once from a layout. Icon consumes semantic
        color and size tokens, supports light/dark and forced-color presentation, and inherits
        direction. Use <code>flip</code> only when the artwork&apos;s meaning is directional; RTL
        does not automatically mirror every symbol.
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
            SVG, HTML, URLs, data URIs, external resources, or executable markup.
          </p>
        </Callout>
        <p>
          Unknown names produce an empty decorative element. The package root reads no browser
          global, listener, current time, or random value, so server and client markup remain
          stable.
        </p>
      </>
    ),
  },
};
