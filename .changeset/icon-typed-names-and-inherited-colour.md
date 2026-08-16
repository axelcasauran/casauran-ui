---
'@casauran/react': minor
'@casauran/icons': minor
---

Icon takes a typed definition name, inherits the colour around it, and refuses the props that would
contradict its own semantics.

`@casauran/icons` exports the `IconName` union and an `isIconName` guard, and adds the `check`,
`error`, `info` and `warning` definitions.

`Icon`'s `name` prop is now `IconName` rather than `string`, so a glyph the catalog does not ship is
a compile error; narrow a name that arrived from data with `isIconName`, and an unnarrowed unknown
name still renders nothing rather than broken markup. `tone="inherit"`, the default, now resolves to
`currentColor`, so a composed icon takes the colour of the text around it instead of the theme's
primary text colour — an icon inside a solid Button, on an inverse surface, or beside toned text
rendered the wrong colour before. The `info` tone is removed because it resolved to the same colour
as `accent`; use `accent`. A blank or whitespace-only `label` now keeps the icon decorative instead
of publishing an image with an empty accessible name, and a label is trimmed. `tabIndex`, `role`,
`aria-hidden` and `aria-label` are no longer accepted: an element hidden from assistive technology
must not be reachable by keyboard, and the other three would contradict the semantics `label`
derives.

Callers passing an arbitrary string name, `tone="info"`, or any of the reserved props must update;
every other use is unchanged.
