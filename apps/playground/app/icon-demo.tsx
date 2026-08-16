import { Icon } from '@casauran/react';
import { isIconName } from '@casauran/icons';

const untrustedName = 'not-in-the-catalog';

export function IconDemo() {
  return (
    <section aria-labelledby="icon-demo-heading">
      <h2 id="icon-demo-heading">Icon playground</h2>
      <p>
        <Icon label="Search" name="search" tone="accent" /> Search uses an explicit semantic label.
      </p>
      <p>
        <Icon flip="horizontal" name="arrow-left" /> Decorative icons are hidden without a label.
      </p>
      <p style={{ color: 'rebeccapurple' }}>
        <Icon name="info" /> The default <code>inherit</code> tone follows the surrounding colour.
      </p>
      <p>
        <Icon name={isIconName(untrustedName) ? untrustedName : 'error'} tone="critical" /> A name
        from an untyped source is narrowed with <code>isIconName</code> before it is rendered.
      </p>
    </section>
  );
}
