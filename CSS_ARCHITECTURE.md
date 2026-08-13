# CSS Architecture
Use static CSS and custom properties. Cascade: `reset → tokens → base → components → utilities → overrides`.

Keep specificity low. Prefer documented `data-*` state hooks. Use logical properties for RTL. Honor reduced motion and forced colors. Theme differences flow through tokens before component forks. Portal content must receive theme variables correctly. No runtime CSS-in-JS by default. Package sideEffects must retain CSS.
