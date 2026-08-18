import type { LabelHTMLAttributes, ReactNode } from 'react';

/**
 * Whether the field this caption names is optional, required, or neither.
 *
 * The vocabulary is closed and includes `required`, which the analysed model omitted: marking a
 * field required is the more common convention and the one with a real accessibility contract
 * behind it.
 */
export type LabelRequirement = 'none' | 'optional' | 'required';

/**
 * Native attributes of the rendered `label`, minus the ones Label owns.
 *
 * `dangerouslySetInnerHTML` is reserved because a caption is children and the platform ships no
 * markup sink — a field name built from a schema, a CMS row, or model output is exactly the value
 * an injection path would be exploited through. `color` is a legacy presentational attribute and
 * would compete with the state colours and the component tokens. `role` is reserved because the
 * semantics come from the `label` element itself, and an ARIA role would contradict them
 * (`API_GOVERNANCE.md`).
 */
type NativeLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'dangerouslySetInnerHTML' | 'color' | 'role'
>;

interface LabelBaseProps extends NativeLabelProps {
  /**
   * The identifier of the editor this caption names, written to the element's own `for` attribute.
   *
   * For any labelable control this is the whole association: the browser derives the control's
   * accessible name from the caption and forwards a click to it, with no JavaScript. A widget that
   * renders no native control uses the inverse path instead — give the Label an `id` and point the
   * widget at it with `aria-labelledby`.
   */
  readonly htmlFor?: string;
  /** The caption. Omit it deliberately to keep a field row's alignment with no visible label. */
  readonly children?: ReactNode;
  /** Reflects that the editor is invalid. Label never marks anything invalid itself. */
  readonly invalid?: boolean;
  /** Reflects that the editor is disabled. Label never disables anything itself. */
  readonly disabled?: boolean;
}

/**
 * The marker and its text are one decision, so they are typed as one.
 *
 * Requesting a marker without text would publish an untranslated or empty word, and supplying text
 * without a marker would silently render nothing. Both are compile errors rather than runtime
 * surprises, which is also what keeps this component free of an ambient locale lookup: the word is
 * supplied already localized instead of being resolved from a provider.
 */
type LabelRequirementProps =
  | { readonly requirement?: 'none'; readonly requirementText?: never }
  | { readonly requirement: 'optional' | 'required'; readonly requirementText: string };

export type LabelProps = LabelBaseProps & LabelRequirementProps;
