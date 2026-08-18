import { Typography } from '@casauran/react';

/** Stands in for text arriving from a CMS row, a log line, an upload, or model output. */
const fromElsewhere = '<script>alert("xss")</script> and <img src=x onerror=alert(1)>';

export function UntrustedTextExample() {
  return (
    <>
      {/* Content is children, so React escapes it. There is nothing to sanitize. */}
      <Typography variant="code-block">{fromElsewhere}</Typography>
      <Typography tone="muted" variant="caption">
        Rendered as text, in a code block, with no markup path of any kind.
      </Typography>
    </>
  );
}
