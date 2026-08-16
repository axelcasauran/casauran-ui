import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function TonesExample() {
  const beacon: SVGIconDefinition = {
    name: 'beacon',
    paths: ['M12 4 21 20H3z', 'M12 11v4'],
  };

  return (
    <>
      <SVGIcon icon={beacon} size="xl" tone="inherit" />
      <SVGIcon icon={beacon} size="xl" tone="accent" />
      <SVGIcon icon={beacon} size="xl" tone="muted" />
      <SVGIcon icon={beacon} size="xl" tone="positive" />
      <SVGIcon icon={beacon} size="xl" tone="caution" />
      <SVGIcon icon={beacon} size="xl" tone="critical" />
      <span className="docs-icon-inverse">
        <SVGIcon icon={beacon} size="xl" tone="inverse" />
      </span>
    </>
  );
}
