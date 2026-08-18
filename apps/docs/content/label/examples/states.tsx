import { Label } from '@casauran/react';

export function StatesExample() {
  return (
    <>
      <div className="docs-field">
        <Label htmlFor="state-default">Default</Label>
        <input className="docs-input" id="state-default" type="text" />
      </div>

      <div className="docs-field">
        {/* aria-invalid on the editor is the machine-readable signal; the colour reinforces it. */}
        <Label htmlFor="state-invalid" invalid>
          Invalid editor
        </Label>
        <input aria-invalid="true" className="docs-input" id="state-invalid" type="text" />
      </div>

      <div className="docs-field">
        <Label disabled htmlFor="state-disabled">
          Disabled editor
        </Label>
        <input className="docs-input" disabled id="state-disabled" type="text" />
      </div>

      <div className="docs-field">
        <Label disabled htmlFor="state-both" invalid>
          Disabled and invalid
        </Label>
        <input className="docs-input" disabled id="state-both" type="text" />
      </div>
    </>
  );
}
