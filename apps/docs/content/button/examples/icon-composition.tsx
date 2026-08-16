import { Button, Icon } from '@casauran/react';

export function IconCompositionExample() {
  return (
    <>
      <Button startContent={<Icon name="add" />} tone="accent">
        Add record
      </Button>
      <Button appearance="outline" endContent={<Icon name="arrow-right" />}>
        Continue
      </Button>
      <Button aria-label="Search records" iconOnly>
        <Icon name="search" />
      </Button>
    </>
  );
}
