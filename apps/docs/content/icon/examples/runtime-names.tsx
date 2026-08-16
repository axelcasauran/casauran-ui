import { Icon } from '@casauran/react';
import { isIconName } from '@casauran/icons';

/** A value that arrived from outside the type system: a CMS field, a route segment, a data row. */
const statusIcon = 'shipped';

export function RuntimeNamesExample() {
  return (
    <>
      <Icon name={isIconName(statusIcon) ? statusIcon : 'info'} size="lg" tone="accent" />
      <code>{isIconName(statusIcon) ? statusIcon : 'info (fallback)'}</code>
    </>
  );
}
