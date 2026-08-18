import { Typography } from '@casauran/react';

const snippet = `const overdue = invoices
  .filter((invoice) => invoice.dueAt < now)
  .map((invoice) => invoice.id);`;

export function CodeBlockExample() {
  return (
    <>
      {/* Multi-line code is children. Whitespace is preserved in CSS, not by injecting markup. */}
      <Typography variant="code-block">{snippet}</Typography>
      <Typography>
        An inline reference such as <Typography as="code">invoice.dueAt</Typography> sits in the run
        of prose.
      </Typography>
    </>
  );
}
