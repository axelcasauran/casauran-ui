import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Button, type ButtonProps } from '../../packages/react/src/index.js';

describe('Button server contract', () => {
  it('renders native safe defaults and consumer attributes', () => {
    const markup = renderToString(
      <Button aria-label="Save record" className="consumer-button" data-owner="billing">
        Save
      </Button>,
    );

    expect(markup).toContain('<button');
    expect(markup).not.toContain('role=');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('class="csn-button consumer-button"');
    expect(markup).toContain('data-owner="billing"');
    expect(markup).toContain('data-appearance="soft"');
    expect(markup).toContain('data-tone="neutral"');
    expect(markup).toContain('aria-label="Save record"');
  });

  it('renders toggle state with native pressed semantics', () => {
    const markup = renderToString(
      <Button defaultPressed toggleable>
        Pin
      </Button>,
    );

    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('data-pressed="true"');
  });

  it('keeps decorative slots outside the accessible name', () => {
    const markup = renderToString(
      <Button endContent="E" startContent="S">
        Label
      </Button>,
    );

    expect(markup.match(/aria-hidden="true"/gu)).toHaveLength(2);
    expect(markup).toContain('data-slot="start"');
    expect(markup).toContain('data-slot="content"');
    expect(markup).toContain('data-slot="end"');
  });

  it('preserves explicit form behavior and escapes caller text', () => {
    const markup = renderToString(
      <Button name="intent" type="submit" value="save">
        {'<script>alert(1)</script>'}
      </Button>,
    );

    expect(markup).toContain('type="submit"');
    expect(markup).toContain('name="intent"');
    expect(markup).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(markup).not.toContain('<script>');
  });

  it('makes toggle-only state invalid in ordinary action mode', () => {
    const valid: ButtonProps = { toggleable: true, defaultPressed: false };
    void valid;

    // @ts-expect-error pressed state requires explicit toggleable mode
    const invalid: ButtonProps = { pressed: true };
    void invalid;
  });
});
