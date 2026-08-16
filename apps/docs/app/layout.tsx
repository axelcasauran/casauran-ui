import '@casauran/theme/theme.css';
import '@casauran/react/button.css';
import '@casauran/react/icon.css';
import '@casauran/react/svg-icon.css';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { DocsShell } from '../components/docs-shell';

export const metadata: Metadata = {
  title: { default: 'Casauran UI Documentation', template: '%s · Casauran UI' },
  description: 'Enterprise React components, foundations, accessibility, and integration guidance.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-density="comfortable" data-theme="light" dir="ltr" lang="en">
      <body>
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
