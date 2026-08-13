# Accessibility Foundation Contract

Status: approved and implemented by F0.07.

## Scope and ownership

`@casauran-internal/accessibility` owns framework-neutral focus, roving-focus, directional-keyboard, live-region, and visually-hidden primitives. It is an internal implementation package beneath `@casauran/react`, not a supported consumer API. The canonical inventory is `registry/accessibility/foundation.json`. WCAG 2.2 AA is the baseline, semantic HTML precedes ARIA, and each public component remains responsible for its applicable APG pattern.

This stage introduces no public React component, hook, context, provider, collection registry, overlay, focus trap, or controlled-state convention. It uses native DOM/platform APIs and has no runtime dependency.

## Focus and tabbability

`isElementTabbable(element)` identifies connected, rendered, enabled elements participating in sequential focus order. It excludes hidden, inert, `aria-hidden`, disabled, negative-tabindex, and non-rendered descendants. `getTabbableElements(root)` returns document-order descendants using native selectors. `tryFocus(element, options)` performs one explicit programmatic focus attempt and reports whether the element became active; it does not own restoration timing, traps, or overlay lifecycle.

Native elements and platform focus behavior remain authoritative. The helpers do not make a non-semantic element interactive and do not add ARIA.

## Roving focus and keyboard

Roving-focus functions operate on caller-supplied `{ id, disabled? }` records without registration, selection, mutation, or React state. `resolveRovingTabStop` selects a valid preferred or first enabled item. `getRovingTabIndex` yields exactly `0` or `-1`. `moveRovingFocus` handles previous/next/first/last, disabled-item skipping, optional looping, and empty/all-disabled input.

`getDirectionalNavigationIntent` maps Arrow/Home/End keys for horizontal, vertical, or both-axis patterns and reverses horizontal direction in RTL. Modified or IME-composing key events return no navigation intent. Activation and dismissal checks are separate because owning APG patterns decide whether and when those keys apply. Page movement, typeahead, grid geometry, selection, and component commands remain their owning engines/stages.

## Live regions and visually hidden content

`getLiveRegionAttributes` returns explicit `aria-live`, `aria-atomic`, and `aria-relevant` values with polite/atomic/additions-text defaults. It does not invent a user-facing message; localization remains the caller's responsibility. `createLiveRegionController` writes only `textContent`, clears before an announcement, coalesces pending announcements so the newest wins, supports explicit clearing, and never parses HTML.

`data-csn-visually-hidden` is a documented static utility in `@layer utilities`. It visually clips content while retaining it in the accessibility tree. It must not be used for content that sighted users need to operate or understand.

## Accessibility requirements

Consumers preserve native roles/names/states, provide pattern-specific keyboard tables, keep one roving tab stop, skip disabled items, retain visible focus from the theme foundation, localize announcements, and test pointer/touch/IME alongside keyboard behavior where applicable. Automated unit/browser/accessibility-tree evidence supplements but does not replace manual keyboard and screen-reader review for complex components.

Disabled and read-only semantics remain distinct. Density must not remove target-size obligations. Forced colors, reduced motion, zoom/reflow, RTL, and translated/long text remain component acceptance requirements even when these primitives are reused.

## SSR, security, and performance

All modules are safe at server evaluation: no document/window query runs until a DOM helper is called. Pure keyboard/roving/live-region attribute functions work without browser globals. Live-region messages use `textContent`, so markup-like untrusted strings remain text. The package performs no network, storage, URL, HTML, clipboard, or script execution.

Keyboard and roving operations are constant-time except disabled-item traversal; tabbable discovery is linear in matching descendants. Live-region scheduling uses one microtask and coalesces superseded messages. No universal performance claim is made.

## Compatibility and integration

The internal contract is consumed through package exports by Casauran implementation packages. Types are provider-independent and contain no React or third-party types. Browser behavior is verified in Chromium, Firefox, and WebKit; server-safe imports are verified by a production Next.js route. Changes coordinate with affected internal consumers even though semver is not promised directly to consumers.

The stylesheet is a retained CSS side effect and uses a stable `data-csn-visually-hidden` hook. Other internal selectors or DOM shapes are not API.

## F0.08 boundary

F0.08 owns reusable React controlled/uncontrolled state conventions and hooks. F0.07 exposes only stateless algorithms, one-shot DOM operations, and an explicit live-region controller; it does not start F0.08. Collection registration belongs to F0.09 and overlay focus lifecycle belongs to F0.10.
