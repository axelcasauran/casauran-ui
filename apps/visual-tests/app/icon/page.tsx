import { Button, Icon, type IconName } from '@casauran/react';

import './icon-probe.css';

/**
 * A name that crossed a runtime boundary — a CMS field, a route segment, a data row — is not
 * type-checked, so the catalog still has to fail closed for one. `isIconName` is the supported way
 * to narrow such a value; this probe deliberately skips it to prove the fallback.
 */
const untrustedName = 'missing' as IconName;

export default function IconPage() {
  return (
    <main className="icon-probe" data-testid="icon-server-probe">
      <h1>Icon</h1>
      <div className="icon-probe__matrix" data-testid="icon-visual-matrix">
        <article className="icon-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Size scale</h2>
          <div className="icon-probe__row" data-testid="icon-size-scale">
            <Icon name="home" size="xs" />
            <Icon name="home" size="sm" />
            <Icon name="home" size="md" />
            <Icon name="home" size="lg" />
            <Icon name="home" size="xl" />
            <Icon name="home" size="2xl" />
            <Icon name="home" size="3xl" />
          </div>
        </article>
        <article className="icon-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Tone scale</h2>
          <div className="icon-probe__row" data-testid="icon-tone-scale">
            <Icon name="palette" size="xl" tone="inherit" />
            <Icon name="palette" size="xl" tone="accent" />
            <Icon name="palette" size="xl" tone="muted" />
            <Icon name="check" size="xl" tone="positive" />
            <Icon name="warning" size="xl" tone="caution" />
            <Icon name="error" size="xl" tone="critical" />
          </div>
          <div className="icon-probe__inverse">
            <Icon name="info" size="xl" tone="inverse" />
          </div>
        </article>
        <article className="icon-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark flips and override</h2>
          <div className="icon-probe__row" data-testid="icon-flip-scale">
            <Icon flip="none" name="arrow-left" size="xl" />
            <Icon flip="horizontal" name="arrow-left" size="xl" tone="accent" />
            <Icon flip="vertical" name="file-zip" size="xl" tone="caution" />
            <Icon flip="both" name="arrow-left" size="xl" tone="positive" />
          </div>
          <div className="icon-probe__row">
            <Icon className="icon-probe__override" name="palette" />
          </div>
        </article>
        <article className="icon-probe__panel" dir="rtl">
          <h2>RTL and semantic label</h2>
          <div className="icon-probe__row">
            <Icon label="بحث" name="search" size="xl" tone="accent" />
            <Icon name="arrow-right" size="xl" tone="muted" />
            <span className="icon-probe__inline">
              <Icon name="menu" /> قائمة
            </span>
          </div>
        </article>
        <article className="icon-probe__panel" data-testid="icon-composition-panel">
          <h2>Composition and inherited colour</h2>
          <div className="icon-probe__row">
            <Button startContent={<Icon name="add" />} tone="accent">
              New record
            </Button>
            <Button
              iconOnly
              aria-label="Close"
              startContent={<Icon name="close" />}
              tone="accent"
            />
            <p className="icon-probe__toned" data-testid="icon-inherit-sample">
              <Icon data-testid="icon-inherit-probe" name="info" /> Inherited colour
            </p>
          </div>
        </article>
      </div>
      <section data-testid="icon-client-probe">
        <Icon data-testid="labelled-icon" label="Search records" name="search" />
        <Icon data-testid="decorative-icon" name="menu" />
        <Icon data-testid="blank-label-icon" label="   " name="home" />
        <Icon data-testid="unknown-icon" name={untrustedName} />
        <span className="icon-probe__seam" data-testid="icon-seam-probe">
          <Icon name="home" tone="accent" />
        </span>
      </section>
    </main>
  );
}
