import { Label } from '@casauran/react';

export function NonLabelableExample() {
  return (
    <div className="docs-field">
      {/* No native control to point at, so the caption publishes an id and the widget points back. */}
      <Label id="shirt-size-label">Shirt size</Label>
      <div
        aria-controls="shirt-size-listbox"
        aria-expanded="false"
        aria-labelledby="shirt-size-label"
        className="docs-widget"
        role="combobox"
        tabIndex={0}
      >
        Medium
      </div>
    </div>
  );
}
