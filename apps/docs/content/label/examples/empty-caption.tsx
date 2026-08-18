import { Label } from '@casauran/react';

export function EmptyCaptionExample() {
  return (
    <>
      <div className="docs-field">
        <Label htmlFor="area-code">Area code</Label>
        <input className="docs-input" id="area-code" type="text" />
      </div>

      <div className="docs-field">
        {/* No visible caption, but the row still lines up with the field beside it. */}
        <Label htmlFor="extension" />
        <input aria-label="Extension" className="docs-input" id="extension" type="text" />
      </div>
    </>
  );
}
