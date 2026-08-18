import '@casauran/theme/theme.css';
import '@casauran/react/button.css';
import '@casauran/react/icon.css';
import '@casauran/react/svg-icon.css';
import '@casauran/react/typography.css';
import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
