# Public API Policy

Supported initial packages: `@casauran/react`, `@casauran/tokens`, `@casauran/theme`, `@casauran/icons`.

Only documented package `exports` are supported. Consumer imports from `/src`, `/internal` or undeclared deep paths are forbidden. Internal workspace packages are not stable consumer APIs unless promoted via ADR.

Experimental APIs are explicitly marked and never silently become stable.
