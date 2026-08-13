
# Naming Conventions

## Product

Use **Casauran UI** for the React UI platform and **Casauran** for the umbrella brand.

## Packages

Supported:
- `@casauran/react`
- `@casauran/tokens`
- `@casauran/theme`
- `@casauran/icons`

Internal:
- `@casauran-internal/<domain>`

Do not mix the two namespaces.

## Components

Use domain-standard names without a brand prefix:
- Button
- Dialog
- DatePicker
- DataGrid
- Scheduler

## TypeScript

Prefer:
- `DataState`
- `SelectionModel`
- `Virtualizer`
- `PositioningResult`

Avoid:
- `CasauranDataState`
- `CasauranSelectionModel`

A public package provides sufficient namespace.

## CSS

Prefix project-owned CSS variables and intentionally stable DOM hooks with `csn`.

Do not guarantee arbitrary internal class names as public API.

## Files and folders

Use lowercase kebab-case for folders and filenames unless ecosystem conventions require otherwise.

## Docs and examples

Customer-facing docs use Casauran terminology only. Historical/reference names stay confined to reference and parity material.

## Diagnostics

Use `Casauran UI:` in user-visible development warnings and `CSN` for stable diagnostic code families.
