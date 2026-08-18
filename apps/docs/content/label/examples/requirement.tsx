import { Label } from '@casauran/react';

export function RequirementExample() {
  return (
    <>
      <div className="docs-field">
        <Label htmlFor="middle-name" requirement="none">
          Middle name
        </Label>
        <input className="docs-input" id="middle-name" type="text" />
      </div>

      <div className="docs-field">
        {/* The marker is a convention; `required` on the editor is the mechanism. */}
        <Label htmlFor="full-name" requirement="required" requirementText="(required)">
          Full name
        </Label>
        <input className="docs-input" id="full-name" required type="text" />
      </div>

      <div className="docs-field">
        <Label htmlFor="nickname" requirement="optional" requirementText="(optional)">
          Nickname
        </Label>
        <input className="docs-input" id="nickname" type="text" />
      </div>
    </>
  );
}
