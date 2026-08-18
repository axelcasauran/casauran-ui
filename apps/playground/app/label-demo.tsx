import { Label, Typography } from '@casauran/react';

/** Stands in for a field name arriving from a schema, a CMS row, or model output. */
const untrusted = '<img src=x onerror=alert(1)> Reference';

export function LabelDemo() {
  return (
    <section aria-labelledby="label-demo-heading">
      <h2 id="label-demo-heading">Label playground</h2>
      <p>
        <Label htmlFor="demo-email" requirement="required" requirementText="(required)">
          Email address
        </Label>{' '}
        <input id="demo-email" type="email" />
      </p>
      <p>
        <input id="demo-terms" type="checkbox" />{' '}
        <Label htmlFor="demo-terms">Clicking this caption toggles the checkbox natively</Label>
      </p>
      <p>
        <Label htmlFor="demo-invalid" invalid>
          Invalid editor
        </Label>{' '}
        <input aria-invalid="true" id="demo-invalid" type="text" />
      </p>
      <p>
        <Label
          disabled
          htmlFor="demo-disabled"
          invalid
          requirement="optional"
          requirementText="(optional)"
        >
          Disabled wins over invalid
        </Label>{' '}
        <input disabled id="demo-disabled" type="text" />
      </p>
      <p>
        <Label htmlFor="demo-code">
          {'Product code '}
          <Typography as="code">SKU-000</Typography>
        </Label>{' '}
        <input id="demo-code" type="text" />
      </p>
      <p>
        <Label htmlFor="demo-untrusted">{untrusted}</Label>{' '}
        <input id="demo-untrusted" type="text" />
      </p>
      <p>
        {/* No native control to point at: the caption publishes an id and the widget points back. */}
        <Label id="demo-size-label">Shirt size</Label>{' '}
        <span aria-labelledby="demo-size-label" role="group">
          Medium
        </span>
      </p>
      <div dir="rtl">
        <Label htmlFor="demo-rtl" requirement="required" requirementText="(مطلوب)">
          البريد الإلكتروني
        </Label>{' '}
        <input id="demo-rtl" type="text" />
      </div>
    </section>
  );
}
