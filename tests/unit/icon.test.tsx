import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Icon, type IconProps } from '../../packages/react/src/index.js';

describe('Icon server contract', () => {
  it('renders a decorative named SVG icon with safe defaults', () => {
    const markup = renderToString(<Icon className="consumer-icon" name="home" />);

    expect(markup).toContain('class="csn-icon consumer-icon"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-icon-name="home"');
    expect(markup).toContain('data-size="md"');
    expect(markup).toContain('<svg');
    expect(markup).not.toContain('role=');
  });

  it('exposes explicit labelled icons as images and preserves native attributes', () => {
    const markup = renderToString(
      <Icon
        data-owner="billing"
        flip="horizontal"
        label="Search records"
        name="search"
        tone="accent"
      />,
    );

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Search records"');
    expect(markup).toContain('data-flip="horizontal"');
    expect(markup).toContain('data-owner="billing"');
  });

  it('fails closed for an unknown name without rendering caller text or unsafe markup', () => {
    const markup = renderToString(<Icon name={'<script>alert(1)</script>'} />);

    expect(markup).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(markup).not.toContain('<script>');
    expect(markup).not.toContain('<svg');
  });

  it('keeps supported size, tone, and flip values typed', () => {
    const valid: IconProps = { flip: 'both', name: 'home', size: '2xl', tone: 'critical' };
    void valid;
    // @ts-expect-error invalid visual vocabulary is rejected
    const invalid: IconProps = { name: 'home', size: 'huge' };
    void invalid;
  });
});
