# Public API Policy

Supported initial packages: `@casauran/react`, `@casauran/tokens`, `@casauran/theme`, `@casauran/icons`.

Only documented package `exports` are supported. Consumer imports from `/src`, `/internal` or undeclared deep paths are forbidden. Internal workspace packages are not stable consumer APIs unless promoted via ADR.

`@casauran/react/state` is a supported local client entry point. It exports the governed React
state hooks and types; `@casauran/react` remains the server-safe component root and does not
re-export those hooks. The subpath boundary is part of the compatibility contract.

Experimental APIs are explicitly marked and never silently become stable.

For `@casauran/theme`, the root TypeScript export and `@casauran/theme/theme.css` are supported.
Theme/density names, `data-theme`/`data-density`, cascade order, and documented `--csn-*` override
seams follow API lifecycle governance. Internal stylesheet class names are not supported API.
