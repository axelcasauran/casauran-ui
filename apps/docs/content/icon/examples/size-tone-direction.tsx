import { Icon } from '@casauran/react';

export function SizeToneDirectionExample() {
  return (
    <>
      <Icon name="home" size="lg" />
      <Icon label="Complete" name="check" size="xl" tone="positive" />
      <Icon flip="horizontal" name="arrow-left" size="xl" tone="accent" />
    </>
  );
}
