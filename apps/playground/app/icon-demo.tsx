import { Icon } from '@casauran/react';

export function IconDemo() {
  return (
    <section aria-labelledby="icon-demo-heading">
      <h2 id="icon-demo-heading">Icon playground</h2>
      <p>
        <Icon label="Search" name="search" tone="accent" /> Search uses an explicit semantic label.
      </p>
      <p>
        <Icon aria-hidden name="arrow-left" flip="horizontal" /> Decorative icons remain hidden.
      </p>
    </section>
  );
}
