'use client';

import { useState } from 'react';

export function ClientProbe() {
  const [count, setCount] = useState(0);
  return (
    <section aria-labelledby="client-probe-heading">
      <h2 id="client-probe-heading">Hydration probe</h2>
      <p aria-live="polite">Client count: {count}</p>
      <button
        type="button"
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        Increment probe
      </button>
    </section>
  );
}
