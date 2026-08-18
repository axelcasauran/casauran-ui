import { Label } from '@casauran/react';

/** Stands in for a field name from a schema, a CMS row, an import, or model output. */
const fieldName = '<img src=x onerror=alert(1)> Account reference';

export function UntrustedCaptionExample() {
  return (
    <div className="docs-field">
      {/* Children are escaped by React. There is no markup path and nothing to sanitize. */}
      <Label htmlFor="account-reference">{fieldName}</Label>
      <input className="docs-input" id="account-reference" type="text" />
    </div>
  );
}
