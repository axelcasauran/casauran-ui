'use client';

import { Button } from '@casauran/react';
import { useState } from 'react';

export function FormActionsExample() {
  const [submissions, setSubmissions] = useState(0);
  const [note, setNote] = useState('');

  return (
    <form
      onReset={() => {
        setNote('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmissions((count) => count + 1);
      }}
    >
      <label>
        Note
        <input
          name="note"
          onChange={(event) => {
            setNote(event.target.value);
          }}
          value={note}
        />
      </label>
      <Button name="intent" tone="accent" type="submit" value="save">
        Save
      </Button>
      <Button appearance="ghost" type="reset">
        Reset
      </Button>
      <Button>Cancel</Button>
      <output aria-live="polite">Submitted {submissions} times.</output>
    </form>
  );
}
