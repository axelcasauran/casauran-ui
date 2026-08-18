import { Label } from '@casauran/react';

/** In a real application this comes from the translation pipeline, not from a literal. */
const t = { nameCaption: 'Vollständiger Name', required: '(Pflichtfeld)' };

export function LocalizedMarkerExample() {
  return (
    <div className="docs-field" lang="de">
      <Label htmlFor="voller-name" requirement="required" requirementText={t.required}>
        {t.nameCaption}
      </Label>
      <input className="docs-input" id="voller-name" required type="text" />
    </div>
  );
}
