import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  Typography,
  type TypographyAlign,
  type TypographyElement,
  type TypographyProps,
  type TypographySize,
  type TypographySpace,
  type TypographyTone,
  type TypographyTransform,
  type TypographyVariant,
  type TypographyWeight,
} from '../../packages/react/src/index.js';

const ELEMENTS: readonly TypographyElement[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'div',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
];

const VARIANTS: readonly TypographyVariant[] = [
  'display',
  'title',
  'heading',
  'subheading',
  'body',
  'body-small',
  'caption',
  'overline',
  'code',
  'code-block',
  'quote',
];

const SIZES: readonly TypographySize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const WEIGHTS: readonly TypographyWeight[] = ['regular', 'medium', 'semibold', 'bold'];
const ALIGNS: readonly TypographyAlign[] = ['start', 'end', 'center', 'justify'];
const TRANSFORMS: readonly TypographyTransform[] = ['none', 'uppercase', 'lowercase', 'capitalize'];
const TONES: readonly TypographyTone[] = [
  'inherit',
  'default',
  'muted',
  'accent',
  'positive',
  'caution',
  'critical',
  'inverse',
];
const SPACES: readonly TypographySpace[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

/** The element a role renders when the caller names only the role. */
const ELEMENT_FOR_VARIANT: Readonly<Record<TypographyVariant, string>> = {
  display: 'p',
  title: 'p',
  heading: 'p',
  subheading: 'p',
  body: 'p',
  'body-small': 'p',
  caption: 'p',
  overline: 'p',
  code: 'code',
  'code-block': 'pre',
  quote: 'blockquote',
};

/** The role an element renders when the caller names only the element. */
const VARIANT_FOR_ELEMENT: Readonly<Record<TypographyElement, TypographyVariant>> = {
  h1: 'title',
  h2: 'heading',
  h3: 'subheading',
  h4: 'subheading',
  h5: 'subheading',
  h6: 'subheading',
  p: 'body',
  span: 'body',
  div: 'body',
  strong: 'body',
  em: 'body',
  code: 'code',
  pre: 'code-block',
  blockquote: 'quote',
};

describe('Typography server contract', () => {
  it('renders a paragraph with the body role and every resolved value reflected', () => {
    const markup = renderToString(<Typography className="consumer-text">Release notes</Typography>);

    expect(markup).toContain('<p ');
    expect(markup).toContain('class="csn-typography consumer-text"');
    expect(markup).toContain('data-csn-component="typography"');
    expect(markup).toContain('data-as="p"');
    expect(markup).toContain('data-variant="body"');
    expect(markup).toContain('data-size="auto"');
    expect(markup).toContain('data-weight="auto"');
    expect(markup).toContain('data-align="auto"');
    expect(markup).toContain('data-transform="none"');
    expect(markup).toContain('data-tone="inherit"');
    expect(markup).toContain('data-space-block-start="none"');
    expect(markup).toContain('data-space-block-end="none"');
    expect(markup).toContain('data-space-inline-start="none"');
    expect(markup).toContain('data-space-inline-end="none"');
    expect(markup).toContain('data-spacing="none"');
    expect(markup).toContain('Release notes');
    // Semantics come from the element; the component never adds a role of its own.
    expect(markup).not.toContain('role=');
  });

  it('renders every element in the closed vocabulary', () => {
    for (const element of ELEMENTS) {
      const markup = renderToString(<Typography as={element}>Text</Typography>);
      expect(markup).toContain(`<${element} `);
      expect(markup).toContain(`data-as="${element}"`);
      expect(markup).toContain(`</${element}>`);
    }
  });

  it('renders every typographic role', () => {
    for (const variant of VARIANTS) {
      const markup = renderToString(<Typography variant={variant}>Text</Typography>);
      expect(markup).toContain(`data-variant="${variant}"`);
    }
  });

  it('preserves an empty element rather than failing', () => {
    const markup = renderToString(<Typography as="p" />);
    expect(markup).toContain('data-as="p"');
    expect(markup).toContain('class="csn-typography"');
  });
});

describe('Typography element and role defaulting', () => {
  it('derives the element from the role when only the role is given', () => {
    for (const variant of VARIANTS) {
      const markup = renderToString(<Typography variant={variant}>Text</Typography>);
      expect(markup).toContain(`data-as="${ELEMENT_FOR_VARIANT[variant]}"`);
    }
  });

  it('derives the role from the element when only the element is given', () => {
    for (const element of ELEMENTS) {
      const markup = renderToString(<Typography as={element}>Text</Typography>);
      expect(markup).toContain(`data-variant="${VARIANT_FOR_ELEMENT[element]}"`);
    }
  });

  it('honours both independently when both are given', () => {
    // The document outline and the visual size are separate decisions: a level-two heading may
    // carry display type, and a span may carry caption type, without either dragging the other.
    const heading = renderToString(
      <Typography as="h2" variant="display">
        Quarterly revenue
      </Typography>,
    );
    expect(heading).toContain('<h2 ');
    expect(heading).toContain('data-as="h2"');
    expect(heading).toContain('data-variant="display"');

    const inline = renderToString(
      <Typography as="span" variant="caption">
        Updated 3 minutes ago
      </Typography>,
    );
    expect(inline).toContain('<span ');
    expect(inline).toContain('data-variant="caption"');
  });

  it('never promotes a role to a heading element', () => {
    // A size is not a document-structure claim. Every role that sounds like a heading still
    // renders a paragraph until the caller asks for a heading element.
    for (const variant of ['display', 'title', 'heading', 'subheading'] as const) {
      const markup = renderToString(<Typography variant={variant}>Text</Typography>);
      expect(markup).toContain('<p ');
      expect(markup).not.toContain('<h1');
      expect(markup).not.toContain('<h2');
    }
  });
});

describe('Typography appearance overrides', () => {
  it('reflects every size step', () => {
    for (const size of SIZES) {
      expect(renderToString(<Typography size={size}>Text</Typography>)).toContain(
        `data-size="${size}"`,
      );
    }
  });

  it('reflects every weight step', () => {
    for (const weight of WEIGHTS) {
      expect(renderToString(<Typography weight={weight}>Text</Typography>)).toContain(
        `data-weight="${weight}"`,
      );
    }
  });

  it('reflects every logical alignment', () => {
    for (const align of ALIGNS) {
      expect(renderToString(<Typography align={align}>Text</Typography>)).toContain(
        `data-align="${align}"`,
      );
    }
  });

  it('reflects every casing transform', () => {
    for (const transform of TRANSFORMS) {
      expect(renderToString(<Typography transform={transform}>Text</Typography>)).toContain(
        `data-transform="${transform}"`,
      );
    }
  });

  it('reflects every semantic tone', () => {
    for (const tone of TONES) {
      expect(renderToString(<Typography tone={tone}>Text</Typography>)).toContain(
        `data-tone="${tone}"`,
      );
    }
  });

  it('keeps an override independent of the role that supplied the default', () => {
    const markup = renderToString(
      <Typography as="h1" size="sm" weight="regular">
        Compact title
      </Typography>,
    );
    expect(markup).toContain('data-as="h1"');
    expect(markup).toContain('data-variant="title"');
    expect(markup).toContain('data-size="sm"');
    expect(markup).toContain('data-weight="regular"');
  });
});

describe('Typography spacing', () => {
  it('applies a shorthand step to both block sides and neither inline side', () => {
    for (const space of SPACES) {
      const markup = renderToString(<Typography spacing={space}>Text</Typography>);
      expect(markup).toContain(`data-spacing="${space}"`);
      expect(markup).toContain(`data-space-block-start="${space}"`);
      expect(markup).toContain(`data-space-block-end="${space}"`);
      expect(markup).toContain('data-space-inline-start="none"');
      expect(markup).toContain('data-space-inline-end="none"');
    }
  });

  it('applies each logical side of the object form independently', () => {
    const markup = renderToString(
      <Typography
        spacing={{ blockEnd: 'lg', blockStart: 'xs', inlineEnd: 'sm', inlineStart: 'md' }}
      >
        Text
      </Typography>,
    );
    expect(markup).toContain('data-spacing="sides"');
    expect(markup).toContain('data-space-block-start="xs"');
    expect(markup).toContain('data-space-block-end="lg"');
    expect(markup).toContain('data-space-inline-start="md"');
    expect(markup).toContain('data-space-inline-end="sm"');
  });

  it('leaves an omitted side with no margin', () => {
    const markup = renderToString(<Typography spacing={{ blockEnd: 'md' }}>Text</Typography>);
    expect(markup).toContain('data-space-block-end="md"');
    expect(markup).toContain('data-space-block-start="none"');
    expect(markup).toContain('data-space-inline-start="none"');
  });
});

describe('Typography content and passthrough', () => {
  it('escapes content rather than interpreting it as markup', () => {
    const untrusted = '<script>alert(1)</script>';
    const markup = renderToString(<Typography variant="code-block">{untrusted}</Typography>);

    expect(markup).toContain('&lt;script&gt;');
    expect(markup).not.toContain('<script>alert(1)</script>');
  });

  it('renders multi-line code as children, with no markup sink', () => {
    const snippet = 'const total = rows\n  .filter(Boolean)\n  .length;';
    const markup = renderToString(<Typography variant="code-block">{snippet}</Typography>);

    expect(markup).toContain('<pre ');
    expect(markup).toContain('const total = rows');
    expect(markup).toContain('.length;');
  });

  it('preserves nested Typography and native attributes', () => {
    const markup = renderToString(
      <Typography data-testid="passage" dir="rtl" id="intro" lang="ar" title="Introduction">
        {'مرحبا '}
        <Typography as="code">npm i</Typography>
      </Typography>,
    );

    expect(markup).toContain('id="intro"');
    expect(markup).toContain('lang="ar"');
    expect(markup).toContain('dir="rtl"');
    expect(markup).toContain('title="Introduction"');
    expect(markup).toContain('data-testid="passage"');
    expect(markup).toContain('<code ');
    expect(markup).toContain('data-variant="code"');
  });

  it('types the forwarded ref as the rendered element', () => {
    const ref = createRef<HTMLElement>();
    // Server rendering never attaches, but the prop must type-check as the native element.
    const props: TypographyProps & { ref: typeof ref } = { children: 'Text', ref };
    expect(props.ref).toBe(ref);
  });

  it('produces identical markup for identical input', () => {
    const render = () =>
      renderToString(
        <Typography as="h2" spacing="md" tone="accent" variant="display">
          Deterministic
        </Typography>,
      );
    expect(render()).toBe(render());
  });
});

describe('Typography compile-level guards', () => {
  it('rejects props that would contradict owned semantics', () => {
    // @ts-expect-error content is children; there is no markup sink
    const withMarkup: TypographyProps = { dangerouslySetInnerHTML: { __html: '<b>x</b>' } };
    void withMarkup;
    // @ts-expect-error colour comes from tone
    const withColor: TypographyProps = { children: 'x', color: 'red' };
    void withColor;
    // @ts-expect-error semantics come from the rendered element
    const withRole: TypographyProps = { children: 'x', role: 'heading' };
    void withRole;
    // @ts-expect-error a heading level is the element, never an ARIA override
    const withLevel: TypographyProps = { 'aria-level': 2, children: 'x' };
    void withLevel;
    // @ts-expect-error the element vocabulary is closed and holds no interactive element
    const withAnchor: TypographyProps = { as: 'a', children: 'x' };
    void withAnchor;
    // @ts-expect-error a control is owned by the component that owns the primitive
    const withButton: TypographyProps = { as: 'button', children: 'x' };
    void withButton;
    // @ts-expect-error the role vocabulary is closed
    const unknownVariant: TypographyProps = { children: 'x', variant: 'hero' };
    void unknownVariant;
    // @ts-expect-error alignment is logical, never physical
    const physicalAlign: TypographyProps = { align: 'left', children: 'x' };
    void physicalAlign;
    // @ts-expect-error there is no light weight step in the governed scale
    const lightWeight: TypographyProps = { children: 'x', weight: 'light' };
    void lightWeight;
    // @ts-expect-error the size vocabulary is closed
    const namedSize: TypographyProps = { children: 'x', size: 'xsmall' };
    void namedSize;
    // @ts-expect-error the tone vocabulary is closed and carries no second name for one colour
    const legacyTone: TypographyProps = { children: 'x', tone: 'info' };
    void legacyTone;
    // @ts-expect-error spacing is a named scale, not an unbounded numeric multiplier
    const numericSpacing: TypographyProps = { children: 'x', spacing: 3 };
    void numericSpacing;
    // @ts-expect-error spacing sides are logical, never physical
    const physicalSides: TypographyProps = { children: 'x', spacing: { top: 'md' } };
    void physicalSides;
  });
});
