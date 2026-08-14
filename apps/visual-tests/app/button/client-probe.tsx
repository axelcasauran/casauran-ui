'use client';

import { Button } from '@casauran/react';
import { useRef, useState } from 'react';

export function ButtonClientProbe() {
  const [controlledPressed, setControlledPressed] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [focusCount, setFocusCount] = useState(0);
  const focusTarget = useRef<HTMLButtonElement>(null);

  return (
    <section aria-labelledby="button-interaction-heading" data-testid="button-client-probe">
      <h2 id="button-interaction-heading">Interaction probes</h2>
      <div className="button-probe__row">
        <Button data-testid="uncontrolled-toggle" toggleable>
          Uncontrolled pin
        </Button>
        <Button
          data-testid="controlled-toggle"
          onPressedChange={(event) => {
            setControlledPressed(event.pressed);
          }}
          pressed={controlledPressed}
          toggleable
        >
          Controlled pin
        </Button>
        <Button
          data-testid="cancelled-toggle"
          onClick={(event) => {
            event.preventDefault();
          }}
          toggleable
        >
          Cancelled pin
        </Button>
        <Button data-testid="disabled-button" disabled>
          Disabled action
        </Button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitCount((count) => count + 1);
        }}
      >
        <Button name="intent" type="submit" value="save">
          Submit form
        </Button>
        <output aria-label="Submit count">{submitCount}</output>
      </form>

      <div className="button-probe__row">
        <Button
          ref={focusTarget}
          onFocus={() => {
            setFocusCount((count) => count + 1);
          }}
        >
          Focus target
        </Button>
        <Button
          onClick={() => {
            focusTarget.current?.focus();
          }}
        >
          Focus through ref
        </Button>
        <output aria-label="Focus count">{focusCount}</output>
      </div>
    </section>
  );
}
