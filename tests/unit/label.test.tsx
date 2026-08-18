import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  Label,
  type LabelProps,
  type LabelRequirement,
  Typography,
} from '../../packages/react/src/index.js';

const REQUIREMENTS: readonly LabelRequirement[] = ['none', 'optional', 'required'];

describe('Label server contract', () => {
  it('renders a native label with every resolved state reflected', () => {
    const markup = renderToString(
      <Label className="consumer-label" htmlFor="email">
        Email address
      </Label>,
    );

    expect(markup).toContain('<label ');
    expect(markup).toContain('class="csn-label consumer-label"');
    expect(markup).toContain('for="email"');
    expect(markup).toContain('data-csn-component="label"');
    expect(markup).toContain('data-requirement="none"');
    expect(markup).toContain('data-invalid="false"');
    expect(markup).toContain('data-disabled="false"');
    expect(markup).toContain('data-empty="false"');
    expect(markup).toContain('Email address');
    // Semantics come from the element; the component never adds a role of its own.
    expect(markup).not.toContain('role=');
    // No marker element exists when no marker was requested.
    expect(markup).not.toContain('csn-label__requirement');
  });

  it('associates through the native for attribute only when asked', () => {
    expect(renderToString(<Label htmlFor="first-name">Name</Label>)).toContain('for="first-name"');
    // A caption that names nothing is legal, and is not silently associated with anything.
    expect(renderToString(<Label>Name</Label>)).not.toContain('for=');
  });

  it('supports the non-labelable path by publishing its own identifier', () => {
    const markup = renderToString(<Label id="size-label">Shirt size</Label>);
    expect(markup).toContain('id="size-label"');
    expect(markup).not.toContain('for=');
  });
});

describe('Label requirement marker', () => {
  it('reflects every requirement value', () => {
    for (const requirement of REQUIREMENTS) {
      const markup =
        requirement === 'none'
          ? renderToString(<Label requirement="none">Email</Label>)
          : renderToString(
              <Label requirement={requirement} requirementText="marker">
                Email
              </Label>,
            );
      expect(markup).toContain(`data-requirement="${requirement}"`);
    }
  });

  it('renders the supplied text as part of the caption', () => {
    const optional = renderToString(
      <Label htmlFor="nickname" requirement="optional" requirementText="(optional)">
        Nickname
      </Label>,
    );
    expect(optional).toContain('class="csn-label__requirement"');
    expect(optional).toContain('data-part="requirement"');
    expect(optional).toContain('(optional)');
    // The marker follows the caption, so the accessible name reads in that order.
    expect(optional.indexOf('Nickname')).toBeLessThan(optional.indexOf('(optional)'));
    // A literal space separates them in the content. Accessible-name computation concatenates the
    // text of inline descendants without inserting one, and a CSS margin contributes nothing to a
    // name, so without this the field is announced as "Nickname(optional)".
    // React writes a comment separator between adjacent text nodes; the space itself is what counts.
    expect(optional).toMatch(/Nickname(?:<!-- -->)?\s<span class="csn-label__requirement"/u);

    const required = renderToString(
      <Label htmlFor="email" requirement="required" requirementText="(required)">
        Email
      </Label>,
    );
    expect(required).toContain('(required)');
  });

  it('renders no marker element for the default requirement', () => {
    const markup = renderToString(<Label>Email</Label>);
    expect(markup).toContain('data-requirement="none"');
    expect(markup).not.toContain('data-part="requirement"');
  });

  it('renders a localized marker exactly as supplied', () => {
    // The component ships no default word in any language and reads no ambient locale.
    const markup = renderToString(
      <Label lang="de" requirement="required" requirementText="(Pflichtfeld)">
        E-Mail
      </Label>,
    );
    expect(markup).toContain('(Pflichtfeld)');
    expect(markup).toContain('lang="de"');
  });
});

describe('Label editor state reflection', () => {
  it('reflects invalid and disabled independently', () => {
    expect(renderToString(<Label invalid>Email</Label>)).toContain('data-invalid="true"');
    expect(renderToString(<Label disabled>Email</Label>)).toContain('data-disabled="true"');

    const both = renderToString(
      <Label disabled invalid>
        Email
      </Label>,
    );
    // Both stay observable; the stylesheet decides which presentation wins.
    expect(both).toContain('data-invalid="true"');
    expect(both).toContain('data-disabled="true"');
  });

  it('does not disable or invalidate anything itself', () => {
    const markup = renderToString(
      <Label disabled htmlFor="email" invalid>
        Email
      </Label>,
    );
    // A label carries no disabled attribute and no aria-invalid; those belong to the editor.
    expect(markup).not.toContain('disabled=""');
    expect(markup).not.toContain('aria-invalid');
  });
});

describe('Label empty caption', () => {
  it('reflects every value React renders as nothing', () => {
    for (const caption of [undefined, null, '', false] as const) {
      expect(renderToString(<Label htmlFor="x">{caption}</Label>)).toContain('data-empty="true"');
    }
    expect(renderToString(<Label htmlFor="x" />)).toContain('data-empty="true"');
  });

  it('does not treat a rendered caption as empty', () => {
    for (const caption of ['Email', 0, <span key="s">Email</span>] as const) {
      expect(renderToString(<Label htmlFor="x">{caption}</Label>)).toContain('data-empty="false"');
    }
  });

  it('still renders a marker beside an empty caption', () => {
    const markup = renderToString(
      <Label requirement="required" requirementText="(required)">
        {null}
      </Label>,
    );
    expect(markup).toContain('data-empty="true"');
    expect(markup).toContain('(required)');
  });
});

describe('Label content and passthrough', () => {
  it('escapes a caption rather than interpreting it as markup', () => {
    const fromSchema = '<img src=x onerror=alert(1)>';
    const markup = renderToString(<Label htmlFor="x">{fromSchema}</Label>);

    expect(markup).toContain('&lt;img');
    expect(markup).not.toContain('<img src=x');
  });

  it('accepts composed text and preserves native attributes', () => {
    const markup = renderToString(
      <Label data-testid="caption" dir="rtl" htmlFor="code" id="code-label" title="Product code">
        {'Code '}
        <Typography as="code">SKU</Typography>
      </Label>,
    );

    expect(markup).toContain('id="code-label"');
    expect(markup).toContain('for="code"');
    expect(markup).toContain('dir="rtl"');
    expect(markup).toContain('title="Product code"');
    expect(markup).toContain('data-testid="caption"');
    expect(markup).toContain('<code ');
    expect(markup).toContain('csn-typography');
  });

  it('types the forwarded ref as the label element', () => {
    const ref = createRef<HTMLLabelElement>();
    // Server rendering never attaches, but the prop must type-check as the native element.
    const props: LabelProps & { ref: typeof ref } = { children: 'Email', ref };
    expect(props.ref).toBe(ref);
  });

  it('produces identical markup for identical input', () => {
    const render = () =>
      renderToString(
        <Label htmlFor="email" invalid requirement="required" requirementText="(required)">
          Email
        </Label>,
      );
    expect(render()).toBe(render());
  });
});

describe('Label compile-level guards', () => {
  it('rejects props that would contradict owned semantics', () => {
    // @ts-expect-error a caption is children; there is no markup sink
    const withMarkup: LabelProps = { dangerouslySetInnerHTML: { __html: '<b>x</b>' } };
    void withMarkup;
    // @ts-expect-error colour comes from state and the component tokens
    const withColor: LabelProps = { children: 'x', color: 'red' };
    void withColor;
    // @ts-expect-error semantics come from the label element
    const withRole: LabelProps = { children: 'x', role: 'note' };
    void withRole;
    // @ts-expect-error the requirement vocabulary is closed
    const unknownRequirement: LabelProps = { children: 'x', requirement: 'mandatory' };
    void unknownRequirement;
    // @ts-expect-error a marker without text would publish an untranslated or empty word
    const markerWithoutText: LabelProps = { children: 'x', requirement: 'required' };
    void markerWithoutText;
    // @ts-expect-error text without a marker would silently render nothing
    const textWithoutMarker: LabelProps = { children: 'x', requirementText: '(required)' };
    void textWithoutMarker;
    // @ts-expect-error the default requirement takes no text
    const noneWithText: LabelProps = {
      children: 'x',
      requirement: 'none',
      requirementText: '(required)',
    };
    void noneWithText;
    // @ts-expect-error validity is expressed positively; there is no inverted boolean
    const invertedValidity: LabelProps = { children: 'x', editorValid: false };
    void invertedValidity;
    // @ts-expect-error activation belongs to the component that owns the editor
    const withEditorRef: LabelProps = { children: 'x', editorRef: { current: null } };
    void withEditorRef;
  });
});
