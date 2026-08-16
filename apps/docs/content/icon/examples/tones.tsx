import { Icon } from '@casauran/react';

export function TonesExample() {
  return (
    <>
      <Icon name="palette" size="xl" tone="inherit" />
      <Icon name="palette" size="xl" tone="accent" />
      <Icon name="palette" size="xl" tone="muted" />
      <Icon name="check" size="xl" tone="positive" />
      <Icon name="warning" size="xl" tone="caution" />
      <Icon name="error" size="xl" tone="critical" />
      <span className="docs-icon-inverse">
        <Icon name="info" size="xl" tone="inverse" />
      </span>
    </>
  );
}
