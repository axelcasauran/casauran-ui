import { Icon, type IconName } from '@casauran/react';
import { iconNames } from '@casauran/icons';

export function NamedDefinitionsExample() {
  return (
    <>
      {iconNames.map((name: IconName) => (
        <span className="docs-icon-swatch" key={name}>
          <Icon name={name} size="lg" />
          <code>{name}</code>
        </span>
      ))}
    </>
  );
}
