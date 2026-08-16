import { getIconDefinition } from '@casauran/icons';
import { Button, Icon, SVGIcon, type SVGIconDefinition } from '@casauran/react';

import { beacon, bolt, flag, shield, stamp } from './definitions';
import './svg-icon-probe.css';

/**
 * A definition that crossed a runtime boundary — a CMS row, a JSON payload, a build step — is not
 * type-checked, so the component still has to fail closed for one. `isSVGIconDefinition` is the
 * supported way to narrow such a value; this probe deliberately skips it to prove the fallback.
 */
const untrusted = { name: 'broken', paths: [] } as SVGIconDefinition;

/** The Casauran catalog definition, rendered through the caller-owned surface unchanged. */
const catalogHome = getIconDefinition('home') as SVGIconDefinition;

export default function SVGIconPage() {
  return (
    <main className="svg-icon-probe" data-testid="svg-icon-server-probe">
      <h1>SVGIcon</h1>
      <div className="svg-icon-probe__matrix" data-testid="svg-icon-visual-matrix">
        <article className="svg-icon-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Size scale</h2>
          <div className="svg-icon-probe__row" data-testid="svg-icon-size-scale">
            <SVGIcon icon={bolt} size="xs" />
            <SVGIcon icon={bolt} size="sm" />
            <SVGIcon icon={bolt} size="md" />
            <SVGIcon icon={bolt} size="lg" />
            <SVGIcon icon={bolt} size="xl" />
            <SVGIcon icon={bolt} size="2xl" />
            <SVGIcon icon={bolt} size="3xl" />
          </div>
        </article>

        <article className="svg-icon-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Tone scale</h2>
          <div className="svg-icon-probe__row" data-testid="svg-icon-tone-scale">
            <SVGIcon icon={bolt} size="xl" tone="inherit" />
            <SVGIcon icon={bolt} size="xl" tone="accent" />
            <SVGIcon icon={bolt} size="xl" tone="muted" />
            <SVGIcon icon={shield} size="xl" tone="positive" />
            <SVGIcon icon={flag} size="xl" tone="caution" />
            <SVGIcon icon={beacon} size="xl" tone="critical" />
          </div>
          <div className="svg-icon-probe__inverse">
            <SVGIcon icon={bolt} size="xl" tone="inverse" />
          </div>
        </article>

        <article className="svg-icon-probe__panel" data-testid="svg-icon-variant-panel">
          <h2>Drawing variants</h2>
          <div className="svg-icon-probe__row" data-testid="svg-icon-variant-scale">
            <SVGIcon icon={beacon} size="2xl" variant="solid" />
            <SVGIcon icon={beacon} size="2xl" variant="outline" />
            <SVGIcon icon={beacon} size="2xl" variant="duotone" />
            <SVGIcon icon={beacon} size="2xl" />
          </div>
          <div className="svg-icon-probe__row" data-testid="svg-icon-variant-fallback">
            {/* `shield` ships only `solid`, so `duotone` must fall back to the default drawing. */}
            <SVGIcon icon={shield} size="2xl" variant="solid" />
            <SVGIcon icon={shield} size="2xl" variant="duotone" />
          </div>
        </article>

        <article className="svg-icon-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark flips and override</h2>
          <div className="svg-icon-probe__row" data-testid="svg-icon-flip-scale">
            <SVGIcon flip="none" icon={flag} size="xl" />
            <SVGIcon flip="horizontal" icon={flag} size="xl" tone="accent" />
            <SVGIcon flip="vertical" icon={flag} size="xl" tone="caution" />
            <SVGIcon flip="both" icon={flag} size="xl" tone="positive" />
          </div>
          <div className="svg-icon-probe__row">
            <SVGIcon className="svg-icon-probe__override" icon={bolt} />
          </div>
        </article>

        <article className="svg-icon-probe__panel" data-testid="svg-icon-paint-panel">
          <h2>Layer paint and catalog interoperability</h2>
          <div className="svg-icon-probe__row">
            <SVGIcon data-testid="svg-icon-filled" icon={stamp} size="2xl" tone="accent" />
            {/* The same catalog definition through both components must be identical. */}
            <SVGIcon data-testid="svg-icon-catalog" icon={catalogHome} size="2xl" />
            <Icon data-testid="svg-icon-catalog-peer" name="home" size="2xl" />
          </div>
        </article>

        <article className="svg-icon-probe__panel" dir="rtl">
          <h2>RTL and semantic label</h2>
          <div className="svg-icon-probe__row">
            <SVGIcon icon={beacon} label="منارة" size="xl" tone="accent" />
            <SVGIcon data-testid="svg-icon-rtl-probe" icon={flag} size="xl" tone="muted" />
            <span className="svg-icon-probe__inline">
              <SVGIcon icon={bolt} /> طاقة
            </span>
          </div>
        </article>

        <article className="svg-icon-probe__panel" data-testid="svg-icon-composition-panel">
          <h2>Composition and inherited colour</h2>
          <div className="svg-icon-probe__row">
            <Button startContent={<SVGIcon icon={bolt} />} tone="accent">
              Run now
            </Button>
            <Button
              iconOnly
              aria-label="Dismiss alert"
              startContent={<SVGIcon icon={beacon} variant="solid" />}
              tone="accent"
            />
            <p className="svg-icon-probe__toned" data-testid="svg-icon-inherit-sample">
              <SVGIcon data-testid="svg-icon-inherit-probe" icon={shield} /> Inherited colour
            </p>
          </div>
        </article>
      </div>

      <section data-testid="svg-icon-semantics-probe">
        <SVGIcon data-testid="labelled-svg-icon" icon={beacon} label="Signal strength" />
        <SVGIcon data-testid="decorative-svg-icon" icon={bolt} />
        <SVGIcon data-testid="blank-label-svg-icon" icon={bolt} label="   " />
        <SVGIcon data-testid="invalid-svg-icon" icon={untrusted} />
        <span className="svg-icon-probe__seam" data-testid="svg-icon-seam-probe">
          <SVGIcon icon={bolt} tone="accent" />
        </span>
      </section>
    </main>
  );
}
