---
'@casauran/react': minor
'@casauran/tokens': minor
'@casauran/theme': minor
---

Add the `Label` component, the platform's form-caption primitive.

`Label` renders a real `<label>` element, which is what turns a caption into an association: the
browser derives the editor's accessible name from it and forwards a click to the control, with no
JavaScript. `htmlFor` names any labelable control; a widget that renders no native control is named
by the inverse path, giving the Label an `id` and pointing the widget's `aria-labelledby` at it.

On top of that it carries the two signals a form needs. `requirement` is `none`, `optional` or
`required`, and `requirementText` supplies the already-localized marker word — the two are typed as
one decision, so a marker without text is a compile error and the component needs no localization
provider, no message catalogue and no client boundary. `invalid` and `disabled` reflect the editor's
state positively, with disabled presentation taking precedence when both are set, and both values
staying reflected as `data-*` attributes. A deliberately omitted caption reserves one line of height
so an unlabelled field keeps its row's alignment.

`@casauran/tokens` and `@casauran/theme` gain the nine `label.*` component tokens that form the
customization seam.

New public exports: `Label`, and the `LabelProps` and `LabelRequirement` types. New CSS entry point:
`@casauran/react/label.css`.
