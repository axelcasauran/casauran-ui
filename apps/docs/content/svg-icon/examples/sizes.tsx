import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function SizesExample() {
  const bolt: SVGIconDefinition = { name: 'bolt', paths: ['M13 3 5 14h6l-1 7 8-11h-6z'] };

  return (
    <>
      <SVGIcon icon={bolt} size="xs" />
      <SVGIcon icon={bolt} size="sm" />
      <SVGIcon icon={bolt} size="md" />
      <SVGIcon icon={bolt} size="lg" />
      <SVGIcon icon={bolt} size="xl" />
      <SVGIcon icon={bolt} size="2xl" />
      <SVGIcon icon={bolt} size="3xl" />
    </>
  );
}
