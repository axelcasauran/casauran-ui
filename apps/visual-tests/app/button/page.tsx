import { Button, Icon } from '@casauran/react';

import './button-probe.css';
import { ButtonClientProbe } from './client-probe';

const appearances = ['solid', 'soft', 'outline', 'ghost', 'link'] as const;
const tones = ['neutral', 'accent', 'positive', 'caution', 'critical', 'inverse'] as const;
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

export default function ButtonPage() {
  return (
    <main className="button-probe" data-testid="button-server-probe">
      <h1>Button</h1>
      <div className="button-probe__matrix" data-testid="button-visual-matrix">
        <article className="button-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Light comfortable appearances</h2>
          <div className="button-probe__row">
            {appearances.map((appearance) => (
              <Button appearance={appearance} key={appearance} tone="accent">
                {appearance}
              </Button>
            ))}
          </div>
          <div className="button-probe__row" data-testid="neutral-appearances">
            {appearances.map((appearance) => (
              <Button
                appearance={appearance}
                data-testid={`neutral-${appearance}`}
                key={appearance}
                tone="neutral"
              >
                {appearance}
              </Button>
            ))}
          </div>
        </article>

        <article className="button-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark compact tones</h2>
          <div className="button-probe__row">
            {tones.map((tone) => (
              <Button appearance="solid" key={tone} tone={tone}>
                {tone}
              </Button>
            ))}
          </div>
        </article>

        <article className="button-probe__panel" data-theme="light" dir="rtl">
          <h2>RTL content slots</h2>
          <div className="button-probe__row">
            <Button endContent="←" startContent="→" tone="accent">
              حفظ
            </Button>
            <Button aria-label="إضافة" iconOnly tone="accent">
              +
            </Button>
          </div>
        </article>

        <article className="button-probe__panel" data-theme="light">
          <h2>State, size, and radius</h2>
          <div className="button-probe__row">
            <Button radius="none" size="sm">
              Small
            </Button>
            <Button defaultPressed radius="full" toggleable tone="accent">
              Pressed
            </Button>
            <Button disabled size="lg" tone="critical">
              Disabled
            </Button>
            <Button className="button-probe__override" data-testid="token-override">
              Token override
            </Button>
          </div>
          <div className="button-probe__narrow">
            <Button>Long localized action that may wrap safely</Button>
          </div>
        </article>

        <article className="button-probe__panel" data-testid="button-size-scale" data-theme="light">
          <h2>Control size scale</h2>
          <div className="button-probe__row">
            {sizes.map((size) => (
              <Button key={size} size={size} tone="accent">
                {size}
              </Button>
            ))}
          </div>
          <div className="button-probe__row">
            {sizes.map((size) => (
              <Button
                aria-label={`Search ${size}`}
                data-testid={`icon-only-${size}`}
                iconOnly
                key={size}
                size={size}
              >
                <Icon name="search" size={size === 'lg' ? 'lg' : 'md'} />
              </Button>
            ))}
          </div>
        </article>

        <article
          className="button-probe__panel"
          data-testid="button-icon-composition"
          data-theme="light"
        >
          <h2>Canonical Icon composition</h2>
          <div className="button-probe__row">
            <Button appearance="solid" startContent={<Icon name="add" />} tone="accent">
              Add record
            </Button>
            <Button appearance="outline" endContent={<Icon name="arrow-right" />}>
              Continue
            </Button>
            <Button appearance="ghost" startContent={<Icon name="image" />} tone="neutral">
              Media
            </Button>
          </div>
        </article>
      </div>

      <ButtonClientProbe />
    </main>
  );
}
