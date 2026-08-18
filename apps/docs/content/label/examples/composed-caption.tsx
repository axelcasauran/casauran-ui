import { Label, Typography } from '@casauran/react';

export function ComposedCaptionExample() {
  return (
    <div className="docs-field">
      <Label htmlFor="product-code">
        {'Product code '}
        <Typography as="code">SKU-000</Typography>
      </Label>
      <input className="docs-input" id="product-code" type="text" />
    </div>
  );
}
