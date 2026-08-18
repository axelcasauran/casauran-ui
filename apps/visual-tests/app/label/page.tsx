import { Label, Typography } from '@casauran/react';

import './label-probe.css';

/** Stands in for a field name arriving from a schema, a CMS row, or model output. */
const untrustedCaption = '<img src=x onerror=alert(1)>';

export default function LabelPage() {
  return (
    <main className="label-probe" data-testid="label-server-probe">
      <h1>Label</h1>
      <div className="label-probe__matrix" data-testid="label-visual-matrix">
        <article className="label-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Association</h2>
          <div className="label-probe__field">
            <Label htmlFor="probe-email">Email address</Label>
            <input
              className="label-probe__editor"
              data-testid="label-email-editor"
              defaultValue="ada@example.com"
              id="probe-email"
              type="email"
            />
          </div>
          <div className="label-probe__row">
            <input
              className="label-probe__editor"
              data-testid="label-checkbox-editor"
              id="probe-terms"
              type="checkbox"
            />
            <Label data-testid="label-checkbox-caption" htmlFor="probe-terms">
              Accept the terms
            </Label>
          </div>
          <div className="label-probe__row">
            <input
              className="label-probe__editor"
              data-testid="label-radio-editor"
              id="probe-post"
              name="probe-contact"
              type="radio"
            />
            <Label htmlFor="probe-post">Contact me by post</Label>
          </div>
        </article>

        <article className="label-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Requirement markers</h2>
          <div className="label-probe__field">
            <Label htmlFor="probe-plain" requirement="none">
              No marker
            </Label>
            <input className="label-probe__editor" id="probe-plain" type="text" />
          </div>
          <div className="label-probe__field">
            <Label
              data-testid="label-required-caption"
              htmlFor="probe-name"
              requirement="required"
              requirementText="(required)"
            >
              Full name
            </Label>
            <input
              aria-required="true"
              className="label-probe__editor"
              id="probe-name"
              required
              type="text"
            />
          </div>
          <div className="label-probe__field">
            <Label htmlFor="probe-nickname" requirement="optional" requirementText="(optional)">
              Nickname
            </Label>
            <input className="label-probe__editor" id="probe-nickname" type="text" />
          </div>
        </article>

        <article className="label-probe__panel" data-testid="label-state-panel">
          <h2>Editor states</h2>
          <div className="label-probe__field">
            <Label data-testid="label-default-state" htmlFor="probe-default">
              Default
            </Label>
            <input className="label-probe__editor" id="probe-default" type="text" />
          </div>
          <div className="label-probe__field">
            <Label
              data-testid="label-invalid-state"
              htmlFor="probe-invalid"
              invalid
              requirement="required"
              requirementText="(required)"
            >
              Invalid editor
            </Label>
            <input
              aria-invalid="true"
              className="label-probe__editor"
              id="probe-invalid"
              type="text"
            />
          </div>
          <div className="label-probe__field">
            <Label data-testid="label-disabled-state" disabled htmlFor="probe-disabled">
              Disabled editor
            </Label>
            <input className="label-probe__editor" disabled id="probe-disabled" type="text" />
          </div>
          <div className="label-probe__field">
            {/* Disabled presentation wins, and both states stay reflected on the element. */}
            <Label
              data-testid="label-both-states"
              disabled
              htmlFor="probe-both"
              invalid
              requirement="required"
              requirementText="(required)"
            >
              Disabled and invalid
            </Label>
            <input className="label-probe__editor" disabled id="probe-both" type="text" />
          </div>
        </article>

        <article className="label-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark, compact, empty and override</h2>
          <div className="label-probe__field">
            <Label data-testid="label-empty-caption" htmlFor="probe-empty" />
            <input
              aria-label="Extension"
              className="label-probe__editor"
              id="probe-empty"
              type="text"
            />
          </div>
          <div className="label-probe__field">
            <Label htmlFor="probe-dark" requirement="optional" requirementText="(optional)">
              Comfortable in the dark
            </Label>
            <input className="label-probe__editor" id="probe-dark" type="text" />
          </div>
          <Label
            className="label-probe__override"
            data-testid="label-override"
            htmlFor="probe-dark"
            invalid
            requirement="required"
            requirementText="(required)"
          >
            Component token override
          </Label>
        </article>

        <article className="label-probe__panel" data-testid="label-content-panel">
          <h2>Caption content</h2>
          <div className="label-probe__field">
            <Label data-testid="label-composed" htmlFor="probe-code">
              {'Product code '}
              <Typography as="code">SKU-000</Typography>
            </Label>
            <input className="label-probe__editor" id="probe-code" type="text" />
          </div>
          <div className="label-probe__field label-probe__narrow">
            <Label data-testid="label-long-caption" htmlFor="probe-long">
              A deliberately long caption that has to wrap across several lines while keeping its
              marker in the text flow
            </Label>
            <input className="label-probe__editor" id="probe-long" type="text" />
          </div>
          <div className="label-probe__field">
            {/* A caption from an untrusted source renders as text, never as elements. */}
            <Label data-testid="label-untrusted" htmlFor="probe-untrusted">
              {untrustedCaption}
            </Label>
            <input className="label-probe__editor" id="probe-untrusted" type="text" />
          </div>
        </article>

        <article className="label-probe__panel" dir="rtl">
          <h2>RTL</h2>
          <div className="label-probe__field">
            <Label
              data-testid="label-rtl-caption"
              htmlFor="probe-rtl"
              requirement="required"
              requirementText="(مطلوب)"
            >
              البريد الإلكتروني
            </Label>
            <input className="label-probe__editor" id="probe-rtl" type="text" />
          </div>
        </article>

        <article className="label-probe__panel" data-testid="label-widget-panel">
          <h2>Editor without a native control</h2>
          {/*
            A widget that renders no labelable element takes the inverse path: the caption publishes
            an identifier and the widget points back at it. Activation belongs to that widget.
          */}
          <div className="label-probe__field">
            <Label data-testid="label-widget-caption" id="probe-size-label">
              Shirt size
            </Label>
            <div
              aria-controls="probe-size-listbox"
              aria-expanded="false"
              aria-labelledby="probe-size-label"
              className="label-probe__widget"
              data-testid="label-widget-editor"
              role="combobox"
              tabIndex={0}
            >
              Medium
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
