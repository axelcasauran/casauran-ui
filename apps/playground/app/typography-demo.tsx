import { Button, Typography } from '@casauran/react';

/** Stands in for a snippet arriving from a CMS row, a log line, or model output. */
const untrusted = '<script>alert("typography")</script>';

export function TypographyDemo() {
  return (
    <section aria-labelledby="typography-demo-heading">
      <h2 id="typography-demo-heading">Typography playground</h2>
      <Typography as="h3" variant="display">
        A level-three heading at display size
      </Typography>
      <Typography as="h3" variant="caption">
        A level-three heading at caption size — the level and the size are separate decisions
      </Typography>
      <Typography spacing={{ blockEnd: 'sm', blockStart: 'md' }} tone="muted" variant="body-small">
        Muted supporting prose with per-side logical spacing.
      </Typography>
      <Typography align="justify" variant="quote">
        A quotation carries its own rule on the inline-start edge, so it is correct in a
        right-to-left layout without a second declaration.
      </Typography>
      <Typography variant="code-block">
        {'const overdue = invoices.filter((invoice) => invoice.dueAt < now);'}
      </Typography>
      <Typography variant="code-block">{untrusted}</Typography>
      <p style={{ color: 'rebeccapurple' }}>
        <Typography as="span">The default inherit tone follows the surrounding colour.</Typography>
      </p>
      <Button tone="accent">
        <Typography as="span" variant="body-small">
          Composed into Button
        </Typography>
      </Button>
      <div dir="rtl">
        <Typography align="start" variant="heading">
          محاذاة منطقية
        </Typography>
      </div>
    </section>
  );
}
