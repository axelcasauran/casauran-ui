import { Icon } from '@casauran/react';

export function LabellingExample() {
  return (
    <>
      <span className="docs-icon-inline">
        <Icon name="warning" tone="caution" /> Decorative: the sentence already says it
      </span>
      <span className="docs-icon-inline">
        <Icon label="Verified account" name="check" size="lg" tone="positive" /> Labelled: the
        artwork is the only thing that carries the meaning
      </span>
    </>
  );
}
