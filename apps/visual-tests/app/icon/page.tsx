import { Icon } from '@casauran/react';

import './icon-probe.css';

export default function IconPage() {
  return (
    <main className="icon-probe" data-testid="icon-server-probe">
      <h1>Icon</h1>
      <div className="icon-probe__matrix" data-testid="icon-visual-matrix">
        <article className="icon-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Light sizes and tones</h2>
          <div className="icon-probe__row">
            <Icon name="home" size="xs" />
            <Icon name="home" size="sm" />
            <Icon name="home" />
            <Icon name="home" size="lg" tone="accent" />
            <Icon name="home" size="xl" tone="positive" />
            <Icon name="home" size="2xl" tone="critical" />
          </div>
        </article>
        <article className="icon-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark flips and override</h2>
          <div className="icon-probe__row">
            <Icon name="arrow-left" size="xl" />
            <Icon flip="horizontal" name="arrow-left" size="xl" tone="accent" />
            <Icon flip="vertical" name="file-zip" size="xl" tone="caution" />
            <Icon className="icon-probe__override" name="palette" />
          </div>
        </article>
        <article className="icon-probe__panel" dir="rtl">
          <h2>RTL and semantic label</h2>
          <div className="icon-probe__row">
            <Icon label="Search" name="search" size="xl" tone="info" />
            <Icon name="arrow-right" size="xl" tone="muted" />
          </div>
        </article>
      </div>
      <section data-testid="icon-client-probe">
        <Icon data-testid="labelled-icon" label="Search records" name="search" />
        <Icon data-testid="decorative-icon" name="menu" />
        <Icon data-testid="unknown-icon" name="missing" />
      </section>
    </main>
  );
}
