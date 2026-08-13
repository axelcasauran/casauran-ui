# Component Composition Rules
Composite components reuse canonical lower-level components when equivalent semantics exist.

Examples: Toolbar→Button/Icon; DatePicker→field+Popup+Calendar+trigger; Editor→Toolbar/Button/dropdowns; Form→Label/Hint/Error; Upload→Button/ProgressBar.

Primitives/components that own semantics use native HTML directly: Button should use `<button>`. The rule prevents higher layers from inventing alternate buttons/inputs.

Do not force visual composition when only behavior should be shared. Registry exceptions require semantic or measured performance justification.
