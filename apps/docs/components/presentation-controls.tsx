'use client';

import { Button } from '@casauran/react';
import { useState } from 'react';

type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact';
type Direction = 'ltr' | 'rtl';

export function PresentationControls() {
  const [theme, setTheme] = useState<Theme>('light');
  const [density, setDensity] = useState<Density>('comfortable');
  const [direction, setDirection] = useState<Direction>('ltr');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset['theme'] = next;
    setTheme(next);
  };
  const toggleDensity = () => {
    const next = density === 'comfortable' ? 'compact' : 'comfortable';
    document.documentElement.dataset['density'] = next;
    setDensity(next);
  };
  const toggleDirection = () => {
    const next = direction === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.dir = next;
    setDirection(next);
  };

  return (
    <div aria-label="Documentation presentation" className="docs-controls" role="group">
      <Button
        appearance="ghost"
        aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} presentation`}
        onClick={toggleTheme}
        size="sm"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </Button>
      <Button
        appearance="ghost"
        aria-label={`Use ${density === 'comfortable' ? 'compact' : 'comfortable'} density`}
        onClick={toggleDensity}
        size="sm"
      >
        {density === 'comfortable' ? 'Compact' : 'Comfortable'}
      </Button>
      <Button
        appearance="ghost"
        aria-label="Toggle text direction"
        onClick={toggleDirection}
        size="sm"
      >
        {direction.toUpperCase()}
      </Button>
    </div>
  );
}
