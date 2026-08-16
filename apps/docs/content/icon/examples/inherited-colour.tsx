import { Button, Icon } from '@casauran/react';

export function InheritedColourExample() {
  return (
    <>
      <p style={{ color: 'var(--csn-status-danger)' }}>
        <Icon name="error" /> The default tone takes the colour of the text around it.
      </p>
      <Button startContent={<Icon name="add" />} tone="accent">
        New record
      </Button>
      <Button appearance="solid" startContent={<Icon name="check" />} tone="positive">
        Approve
      </Button>
    </>
  );
}
