# Prompt Plan by Phase and Stage

## Governing rule

Execution hierarchy: **Program → Phase → Stage → internal vertical slices.**

Every public-component stage delivers exactly one public component. A stage may extend an existing shared engine or create a required shared capability through the approved engine workflow, but it may not silently ship another public component. Phase 0 is the deliberate exception because it contains foundation work rather than public components.

## Prompt routing

- Phase preparation → `.agent/prompts/start-phase.md`
- Foundation work → `.agent/prompts/foundation-stage.md`
- Normal public component → `.agent/prompts/component-stage.md`
- Architecture-defining widget → component prompt + `.agent/prompts/complex-widget.md`
- Bug → `.agent/prompts/bug-fix.md` + bug-fix workflow
- Parity certification → `.agent/prompts/parity-audit.md` + parity workflow
- Phase close → `.agent/prompts/close-phase.md`

## Standard stage sequence

Load rules/skills → analyze pinned public reference → independent spec → registry/feature matrix → API review → shared-engine/composition review → implementation → tests → docs/examples → parity audit → stage evidence → stop.

## Phase execution plan

### Phase 0 — Product Foundation

Repository, governance, engines, build/test hosts and reference baseline are ready before public component work.

| Stage   | Type       | Deliverable                   |
| ------- | ---------- | ----------------------------- |
| `F0.01` | foundation | Repository Governance         |
| `F0.02` | foundation | Agent Operating System        |
| `F0.03` | foundation | Mechanical Governance         |
| `F0.04` | foundation | Build and Test Infrastructure |
| `F0.05` | foundation | Tokens                        |
| `F0.06` | foundation | CSS and Theme Runtime         |
| `F0.07` | foundation | Accessibility Foundation      |
| `F0.08` | foundation | React State Foundation        |
| `F0.09` | foundation | Collection Engine             |
| `F0.10` | foundation | Overlay Foundation            |
| `F0.11` | foundation | Animation Foundation          |
| `F0.12` | foundation | Data Engine                   |
| `F0.13` | foundation | Internationalization          |
| `F0.14` | foundation | Date Math                     |
| `F0.15` | foundation | Virtualization                |
| `F0.16` | foundation | Drag and Drop                 |
| `F0.17` | foundation | Reference Baseline            |
| `F0.18` | foundation | Documentation Experience      |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

F0.18 is a governed remediation accepted by ADR-020 after stages 1.01 and 1.02 had already closed.
The machine ledger inserts it at the current boundary before 1.03 rather than rewriting historical
completion order.

### Phase 1 — Core Interaction Proof

Prove tokens, state, events, focus, overlay, selection and collection architecture with small public components.

| Stage  | Type             | Deliverable |
| ------ | ---------------- | ----------- |
| `1.01` | public-component | Button      |
| `1.02` | public-component | Icon        |
| `1.03` | public-component | SVGIcon     |
| `1.04` | public-component | Typography  |
| `1.05` | public-component | Label       |
| `1.06` | public-component | Input       |
| `1.07` | public-component | Checkbox    |
| `1.08` | public-component | RadioButton |
| `1.09` | public-component | Switch      |
| `1.10` | public-component | Popup       |
| `1.11` | public-component | Tooltip     |
| `1.12` | public-component | Dialog      |
| `1.13` | public-component | ListBox     |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 2 — Standard Controls

Establish API consistency and design-system breadth across standard inputs/buttons.

| Stage  | Type             | Deliverable          |
| ------ | ---------------- | -------------------- |
| `2.01` | public-component | Hint                 |
| `2.02` | public-component | Error                |
| `2.03` | public-component | FloatingLabel        |
| `2.04` | public-component | TextBox              |
| `2.05` | public-component | TextArea             |
| `2.06` | public-component | RadioGroup           |
| `2.07` | public-component | NumericTextBox       |
| `2.08` | public-component | MaskedTextBox        |
| `2.09` | public-component | Slider               |
| `2.10` | public-component | RangeSlider          |
| `2.11` | public-component | Rating               |
| `2.12` | public-component | OTPInput             |
| `2.13` | public-component | Signature            |
| `2.14` | public-component | ColorPalette         |
| `2.15` | public-component | ColorGradient        |
| `2.16` | public-component | ColorPicker          |
| `2.17` | public-component | FlatColorPicker      |
| `2.18` | public-component | ButtonGroup          |
| `2.19` | public-component | Chip                 |
| `2.20` | public-component | ChipList             |
| `2.21` | public-component | SegmentedControl     |
| `2.22` | public-component | FloatingActionButton |
| `2.23` | public-component | DropDownButton       |
| `2.24` | public-component | SplitButton          |
| `2.25` | public-component | Toolbar              |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 3 — Date, Selection and Dropdown Systems

Stress collection + overlay + date/i18n/IME systems through selection, date and dropdown controls.

| Stage  | Type             | Deliverable         |
| ------ | ---------------- | ------------------- |
| `3.01` | public-component | Calendar            |
| `3.02` | public-component | MultiViewCalendar   |
| `3.03` | public-component | DateInput           |
| `3.04` | public-component | TimePicker          |
| `3.05` | public-component | DatePicker          |
| `3.06` | public-component | DateTimePicker      |
| `3.07` | public-component | DateRangePicker     |
| `3.08` | public-component | TreeView            |
| `3.09` | public-component | AutoComplete        |
| `3.10` | public-component | DropDownList        |
| `3.11` | public-component | ComboBox            |
| `3.12` | public-component | MultiSelect         |
| `3.13` | public-component | MultiColumnComboBox |
| `3.14` | public-component | DropDownTree        |
| `3.15` | public-component | MultiSelectTree     |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 4 — Layout, Navigation and Feedback

Complete the standard application UI vocabulary and certify theme consistency.

| Stage  | Type             | Deliverable      |
| ------ | ---------------- | ---------------- |
| `4.01` | public-component | Badge            |
| `4.02` | public-component | Loader           |
| `4.03` | public-component | Skeleton         |
| `4.04` | public-component | ProgressBar      |
| `4.05` | public-component | ChunkProgressBar |
| `4.06` | public-component | Avatar           |
| `4.07` | public-component | Card             |
| `4.08` | public-component | StackLayout      |
| `4.09` | public-component | GridLayout       |
| `4.10` | public-component | ExpansionPanel   |
| `4.11` | public-component | PanelBar         |
| `4.12` | public-component | Splitter         |
| `4.13` | public-component | TabStrip         |
| `4.14` | public-component | Stepper          |
| `4.15` | public-component | Breadcrumb       |
| `4.16` | public-component | Menu             |
| `4.17` | public-component | ContextMenu      |
| `4.18` | public-component | Drawer           |
| `4.19` | public-component | AppBar           |
| `4.20` | public-component | BottomNavigation |
| `4.21` | public-component | ActionSheet      |
| `4.22` | public-component | TileLayout       |
| `4.23` | public-component | Timeline         |
| `4.24` | public-component | Popover          |
| `4.25` | public-component | Notification     |
| `4.26` | public-component | Window           |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 5 — Enterprise Data Platform

Prove independent data-state engines and enterprise data widgets.

| Stage  | Type             | Deliverable |
| ------ | ---------------- | ----------- |
| `5.01` | public-component | Pager       |
| `5.02` | public-component | Filter      |
| `5.03` | public-component | ListView    |
| `5.04` | public-component | DataGrid    |
| `5.05` | public-component | TreeList    |
| `5.06` | public-component | OrgChart    |
| `5.07` | public-component | PivotGrid   |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 6 — Interaction and Planning Systems

Prove drag/drop, time, recurrence and planning interactions.

| Stage  | Type             | Deliverable |
| ------ | ---------------- | ----------- |
| `6.01` | public-component | Sortable    |
| `6.02` | public-component | ScrollView  |
| `6.03` | public-component | TaskBoard   |
| `6.04` | public-component | Scheduler   |
| `6.05` | public-component | Gantt       |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 7 — Forms, Files and Editing

Prove forms, untrusted file/content handling, rich editing and export.

| Stage  | Type             | Deliverable      |
| ------ | ---------------- | ---------------- |
| `7.01` | public-component | Form             |
| `7.02` | public-component | Upload           |
| `7.03` | public-component | ExternalDropZone |
| `7.04` | public-component | Editor           |
| `7.05` | public-component | FileSaver        |
| `7.06` | public-component | ExcelExport      |
| `7.07` | public-component | PDFProcessing    |
| `7.08` | public-component | PDFViewer        |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 8 — Visualization

Prove rendering/visualization engines from animation/barcodes through Chart/Diagram/Map.

| Stage  | Type             | Deliverable   |
| ------ | ---------------- | ------------- |
| `8.01` | public-component | Expand        |
| `8.02` | public-component | Fade          |
| `8.03` | public-component | Push          |
| `8.04` | public-component | Reveal        |
| `8.05` | public-component | Slide         |
| `8.06` | public-component | Zoom          |
| `8.07` | public-component | Ripple        |
| `8.08` | public-component | Barcode       |
| `8.09` | public-component | QRCode        |
| `8.10` | public-component | ArcGauge      |
| `8.11` | public-component | LinearGauge   |
| `8.12` | public-component | RadialGauge   |
| `8.13` | public-component | CircularGauge |
| `8.14` | public-component | Chart         |
| `8.15` | public-component | Sparkline     |
| `8.16` | public-component | StockChart    |
| `8.17` | public-component | Sankey        |
| `8.18` | public-component | ChartWizard   |
| `8.19` | public-component | Drawing       |
| `8.20` | public-component | Diagram       |
| `8.21` | public-component | Map           |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 9 — Advanced Application Systems

Prove workbook/formula/history/clipboard virtualization through Spreadsheet.

| Stage  | Type             | Deliverable |
| ------ | ---------------- | ----------- |
| `9.01` | public-component | Spreadsheet |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 10 — AI Components

Add optional provider-neutral AI UI without contaminating core packages.

| Stage   | Type             | Deliverable        |
| ------- | ---------------- | ------------------ |
| `10.01` | public-component | PromptBox          |
| `10.02` | public-component | AIPrompt           |
| `10.03` | public-component | InlineAIPrompt     |
| `10.04` | public-component | Chat               |
| `10.05` | public-component | SmartPasteButton   |
| `10.06` | public-component | SpeechToTextButton |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 11 — Patterns

Prove reusable application interaction patterns using public components only.

| Stage   | Type    | Deliverable       |
| ------- | ------- | ----------------- |
| `11.01` | pattern | SearchForm        |
| `11.02` | pattern | FilterPanel       |
| `11.03` | pattern | CommandPalette    |
| `11.04` | pattern | MasterDetail      |
| `11.05` | pattern | EditableDataTable |
| `11.06` | pattern | Wizard            |
| `11.07` | pattern | PropertyPanel     |
| `11.08` | pattern | DateRangeFilter   |
| `11.09` | pattern | BulkActionBar     |
| `11.10` | pattern | SettingsPanel     |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 12 — UI Blocks

Prove larger product UI blocks without private imports.

| Stage   | Type  | Deliverable          |
| ------- | ----- | -------------------- |
| `12.01` | block | AppShell             |
| `12.02` | block | AdminSidebar         |
| `12.03` | block | DashboardHeader      |
| `12.04` | block | KPIGrid              |
| `12.05` | block | AnalyticsDashboard   |
| `12.06` | block | DataManagementScreen |
| `12.07` | block | AuthenticationScreen |
| `12.08` | block | PricingSection       |
| `12.09` | block | ProfileSettings      |
| `12.10` | block | NotificationCenter   |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 13 — Templates

Prove serious domain templates from supported blocks/patterns/components.

| Stage   | Type     | Deliverable       |
| ------- | -------- | ----------------- |
| `13.01` | template | Analytics         |
| `13.02` | template | CRM               |
| `13.03` | template | ERP               |
| `13.04` | template | CMS               |
| `13.05` | template | Ecommerce         |
| `13.06` | template | ProjectManagement |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

### Phase 14 — Enterprise 1.0 Certification

Certify the entire product for 1.0 through real applications and cross-cutting quality gates.

| Stage   | Type          | Deliverable                  |
| ------- | ------------- | ---------------------------- |
| `14.01` | certification | Enterprise 1.0 Certification |

**Exit:** run the phase-close prompt and record `PASS`, `PASS WITH DEBT`, or `BLOCKED`. A `BLOCKED` phase cannot activate the next phase.

## Complex-widget rule

`DataGrid`, `TreeList`, `PivotGrid`, `Scheduler`, `Gantt`, `Editor`, `Chart`, `Diagram`, `Map`, and `Spreadsheet` are single public stages with internal subsystem slices. The slices exist to manage risk and review; they do not become extra public component stages.

## Parallelism rule

Serialize foundation and architecture-defining stages. Parallelize only leaf stages after shared contracts are stable and only when package ownership is disjoint. Do not parallelize related enterprise widgets while their shared engine model is still evolving.

## Source of truth

`.agent/stages/index.json` is the machine-readable stage order. The stage Markdown files contain the execution ledger/evidence slot. This document is the human-readable plan and must be regenerated/reviewed when an ADR deliberately changes sequencing.

## Reference-analysis precondition

Any stage requiring KendoReact analysis first runs:

```bash
pnpm reference:check
```

The source is strictly local through `CASAURAN_KENDO_DOCS_PATH`. Online fallback is prohibited.
