import { Button, Typography } from '@casauran/react';

import './typography-probe.css';

/**
 * Multi-line code arrives as children. The analysed model reached for React's raw-markup escape
 * hatch to render a snippet containing newlines; `variant="code-block"` preserves whitespace in
 * CSS instead, so there is no markup sink to review.
 */
const snippet = `const overdue = invoices\n  .filter((invoice) => invoice.dueAt < now)\n  .map((invoice) => invoice.id);`;

/** Stands in for text arriving from a CMS row, a log line, or model output. */
const untrusted = '<script>alert("typography")</script>';

export default function TypographyPage() {
  return (
    <main className="typography-probe" data-testid="typography-server-probe">
      <h1>Typography</h1>
      <div className="typography-probe__matrix" data-testid="typography-visual-matrix">
        <article className="typography-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Type ramp</h2>
          <div data-testid="typography-variant-ramp">
            <Typography variant="display">Display</Typography>
            <Typography variant="title">Title</Typography>
            <Typography variant="heading">Heading</Typography>
            <Typography variant="subheading">Subheading</Typography>
            <Typography variant="body">Body</Typography>
            <Typography variant="body-small">Body small</Typography>
            <Typography variant="caption">Caption</Typography>
            <Typography transform="uppercase" variant="overline">
              Overline
            </Typography>
            <Typography variant="code">inline code</Typography>
            <Typography variant="quote">A quotation keeps its own rule and rhythm.</Typography>
          </div>
        </article>

        <article className="typography-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Size scale</h2>
          <div data-testid="typography-size-scale">
            <Typography size="xs">Extra small</Typography>
            <Typography size="sm">Small</Typography>
            <Typography size="md">Medium</Typography>
            <Typography size="lg">Large</Typography>
            <Typography size="xl">Extra large</Typography>
            <Typography size="2xl">Two extra large</Typography>
            <Typography size="3xl">Three extra large</Typography>
          </div>
          <div data-testid="typography-weight-scale">
            <Typography weight="regular">Regular</Typography>
            <Typography weight="medium">Medium</Typography>
            <Typography weight="semibold">Semibold</Typography>
            <Typography weight="bold">Bold</Typography>
          </div>
        </article>

        <article className="typography-probe__panel" data-density="comfortable" data-theme="light">
          <h2>Tone scale</h2>
          <div data-testid="typography-tone-scale">
            <Typography tone="inherit">Inherited</Typography>
            <Typography tone="default">Default</Typography>
            <Typography tone="muted">Muted</Typography>
            <Typography tone="accent">Accent</Typography>
            <Typography tone="positive">Positive</Typography>
            <Typography tone="caution">Caution</Typography>
            <Typography tone="critical">Critical</Typography>
          </div>
          <div className="typography-probe__inverse">
            <Typography tone="inverse">Inverse on an inverse surface</Typography>
          </div>
          <div className="typography-probe__toned" data-testid="typography-inherit-sample">
            <Typography data-testid="typography-inherit-probe">
              The default tone follows this context.
            </Typography>
          </div>
        </article>

        <article className="typography-probe__panel" data-density="compact" data-theme="dark">
          <h2>Dark, compact, alignment and casing</h2>
          <div data-testid="typography-align-scale">
            <Typography align="start">Start aligned</Typography>
            <Typography align="center">Centre aligned</Typography>
            <Typography align="end">End aligned</Typography>
            <Typography align="justify">
              Justified text stretches each line to both edges of its container so that the block
              forms an even rectangle of prose.
            </Typography>
          </div>
          <div data-testid="typography-transform-scale">
            <Typography transform="none">Casing untouched</Typography>
            <Typography transform="uppercase">Uppercased visually</Typography>
            <Typography transform="lowercase">LOWERCASED VISUALLY</Typography>
            <Typography transform="capitalize">capitalized visually</Typography>
          </div>
          <Typography className="typography-probe__override" tone="muted" variant="caption">
            Component token override
          </Typography>
        </article>

        <article className="typography-probe__panel" data-testid="typography-structure-panel">
          <h2>Structure and style are separate</h2>
          {/* A level-two heading carrying display type, and a span carrying caption type. */}
          <Typography as="h2" data-testid="typography-big-heading" variant="display">
            Quarterly revenue
          </Typography>
          <Typography as="h3" data-testid="typography-small-heading" variant="caption">
            A level-three heading set at caption size
          </Typography>
          <Typography as="span" data-testid="typography-inline-caption" variant="caption">
            Updated 3 minutes ago
          </Typography>
          <Typography as="p" data-testid="typography-titled-paragraph" variant="title">
            A paragraph with title type and no heading semantics
          </Typography>
        </article>

        <article className="typography-probe__panel" data-testid="typography-element-panel">
          <h2>Element vocabulary</h2>
          {/* Every element the closed `as` union admits; none of them is interactive. */}
          <Typography as="h1" variant="body">
            h1
          </Typography>
          <Typography as="h2" variant="body">
            h2
          </Typography>
          <Typography as="h3" variant="body">
            h3
          </Typography>
          <Typography as="h4" variant="body">
            h4
          </Typography>
          <Typography as="h5" variant="body">
            h5
          </Typography>
          <Typography as="h6" variant="body">
            h6
          </Typography>
          <Typography as="p">p</Typography>
          <Typography as="div">div</Typography>
          <Typography as="blockquote" variant="body">
            blockquote
          </Typography>
          <Typography as="pre" variant="body">
            pre
          </Typography>
          <Typography as="p">
            <Typography as="span">span</Typography> <Typography as="strong">strong</Typography>{' '}
            <Typography as="em">em</Typography> <Typography as="code">code</Typography>
          </Typography>
        </article>

        <article className="typography-probe__panel" data-testid="typography-spacing-panel">
          <h2>Spacing</h2>
          <Typography spacing="xs">Extra small block spacing</Typography>
          <Typography spacing="sm">Small block spacing</Typography>
          <Typography spacing="md">Medium block spacing</Typography>
          <Typography spacing="xl">Extra large block spacing</Typography>
          <Typography data-testid="typography-spacing-shorthand" spacing="lg">
            Shorthand spacing sets both block sides
          </Typography>
          <Typography
            data-testid="typography-spacing-sides"
            spacing={{ blockEnd: 'sm', blockStart: 'xl', inlineEnd: 'none', inlineStart: 'lg' }}
          >
            Object spacing addresses each logical side
          </Typography>
          <Typography data-testid="typography-spacing-none" spacing="none">
            No spacing at all
          </Typography>
        </article>

        <article className="typography-probe__panel" data-testid="typography-code-panel">
          <h2>Code as content</h2>
          <Typography data-testid="typography-code-block" variant="code-block">
            {snippet}
          </Typography>
          <Typography data-testid="typography-untrusted" variant="code-block">
            {untrusted}
          </Typography>
          <div className="typography-probe__narrow">
            <Typography data-testid="typography-code-long" variant="code-block">
              {'const veryLongIdentifierName = anotherVeryLongIdentifierName + oneMoreLongOne;'}
            </Typography>
          </div>
        </article>

        <article className="typography-probe__panel" dir="rtl">
          <h2>RTL</h2>
          <Typography align="start" data-testid="typography-rtl-start" variant="heading">
            عنوان القسم
          </Typography>
          <Typography data-testid="typography-rtl-body">
            يرث هذا النص اتجاه الصفحة، وتتبع المحاذاة المنطقية الاتجاه بدلاً من أن تقاومه.
          </Typography>
          <Typography
            data-testid="typography-rtl-quote"
            spacing={{ blockStart: 'md' }}
            variant="quote"
          >
            اقتباس بحدّ منطقي على جانب البداية.
          </Typography>
        </article>

        <article className="typography-probe__panel" data-testid="typography-composition-panel">
          <h2>Composition</h2>
          <Button tone="accent">
            <Typography as="span" data-testid="typography-in-button" variant="body-small">
              Composed label
            </Typography>
          </Button>
          <Typography as="p" data-testid="typography-nested-host">
            Prose containing{' '}
            <Typography as="code" data-testid="typography-nested-code">
              inline code
            </Typography>{' '}
            and{' '}
            <Typography as="strong" weight="bold">
              emphasis
            </Typography>
            .
          </Typography>
        </article>
      </div>

      <section data-testid="typography-semantics-probe">
        <Typography as="h2" data-testid="typography-real-heading" variant="body">
          A real level-two heading
        </Typography>
        <Typography data-testid="typography-not-a-heading" variant="title">
          Title type on a paragraph
        </Typography>
      </section>
    </main>
  );
}
