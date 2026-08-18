import { Label } from '@casauran/react';

export function AssociationExample() {
  return (
    <>
      {/* htmlFor names the editor. The browser does the rest: the accessible name and the click. */}
      <div className="docs-field">
        <Label htmlFor="email-address">Email address</Label>
        <input className="docs-input" id="email-address" name="email" type="email" />
      </div>

      <div className="docs-field-row">
        <input className="docs-input" id="accept-terms" name="terms" type="checkbox" />
        <Label htmlFor="accept-terms">Accept the terms</Label>
      </div>

      <div className="docs-field-row">
        <input className="docs-input" id="contact-post" name="contact" type="radio" />
        <Label htmlFor="contact-post">Contact me by post</Label>
      </div>
    </>
  );
}
