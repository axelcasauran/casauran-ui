# KendoReact Capability / Feature Matrix

This is a planning index, not a parity claim. The approved baseline is the pinned public documentation commit in `reference/kendo-react-baseline.json`. Component-level feature truth lives in `registry/components/*.json`; platform parity lives in `registry/platform/*.json`.

## Public component inventory by reference domain

| Reference domain | Planned components                                                                                                                                                                                              | Count |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----: |
| `ai-components`  | AIPrompt, Chat, InlineAIPrompt, PromptBox                                                                                                                                                                       |     4 |
| `ai-tools`       | SmartPasteButton, SpeechToTextButton                                                                                                                                                                            |     2 |
| `animation`      | Expand, Fade, Push, Reveal, Slide, Zoom                                                                                                                                                                         |     6 |
| `barcodes`       | Barcode, QRCode                                                                                                                                                                                                 |     2 |
| `buttons`        | ButtonGroup, Button, ChipList, Chip, DropDownButton, FloatingActionButton, SegmentedControl, SplitButton, Toolbar                                                                                               |     9 |
| `chart-wizard`   | ChartWizard                                                                                                                                                                                                     |     1 |
| `charts`         | Chart, Sankey, Sparkline, StockChart                                                                                                                                                                            |     4 |
| `common`         | FileSaver                                                                                                                                                                                                       |     1 |
| `datatools`      | Filter, Pager                                                                                                                                                                                                   |     2 |
| `dateinputs`     | Calendar, DateInput, DatePicker, DateRangePicker, DateTimePicker, MultiViewCalendar, TimePicker                                                                                                                 |     7 |
| `diagram`        | Diagram                                                                                                                                                                                                         |     1 |
| `dialogs`        | Dialog, Window                                                                                                                                                                                                  |     2 |
| `drawing`        | Drawing                                                                                                                                                                                                         |     1 |
| `dropdowns`      | AutoComplete, ComboBox, DropDownList, DropDownTree, MultiColumnComboBox, MultiSelectTree, MultiSelect                                                                                                           |     7 |
| `editor`         | Editor                                                                                                                                                                                                          |     1 |
| `excel`          | ExcelExport                                                                                                                                                                                                     |     1 |
| `form`           | Form                                                                                                                                                                                                            |     1 |
| `gantt`          | Gantt                                                                                                                                                                                                           |     1 |
| `gauges`         | ArcGauge, CircularGauge, LinearGauge, RadialGauge                                                                                                                                                               |     4 |
| `grid`           | DataGrid                                                                                                                                                                                                        |     1 |
| `icons`          | Icon, SVGIcon                                                                                                                                                                                                   |     2 |
| `indicators`     | Badge, Loader, Skeleton                                                                                                                                                                                         |     3 |
| `inputs`         | Checkbox, ColorGradient, ColorPalette, ColorPicker, FlatColorPicker, Input, MaskedTextBox, NumericTextBox, OTPInput, RadioButton, RadioGroup, RangeSlider, Rating, Signature, Slider, Switch, TextArea, TextBox |    18 |
| `labels`         | Error, FloatingLabel, Hint, Label                                                                                                                                                                               |     4 |
| `layout`         | ActionSheet, AppBar, Avatar, BottomNavigation, Breadcrumb, Card, ContextMenu, Drawer, ExpansionPanel, GridLayout, Menu, PanelBar, Splitter, StackLayout, Stepper, TabStrip, TileLayout, Timeline                |    18 |
| `listbox`        | ListBox                                                                                                                                                                                                         |     1 |
| `listview`       | ListView                                                                                                                                                                                                        |     1 |
| `map`            | Map                                                                                                                                                                                                             |     1 |
| `notification`   | Notification                                                                                                                                                                                                    |     1 |
| `orgchart`       | OrgChart                                                                                                                                                                                                        |     1 |
| `pdf`            | PDFProcessing                                                                                                                                                                                                   |     1 |
| `pdf-viewer`     | PDFViewer                                                                                                                                                                                                       |     1 |
| `pivotgrid`      | PivotGrid                                                                                                                                                                                                       |     1 |
| `popup`          | Popover, Popup                                                                                                                                                                                                  |     2 |
| `progressbars`   | ChunkProgressBar, ProgressBar                                                                                                                                                                                   |     2 |
| `ripple`         | Ripple                                                                                                                                                                                                          |     1 |
| `scheduler`      | Scheduler                                                                                                                                                                                                       |     1 |
| `scrollview`     | ScrollView                                                                                                                                                                                                      |     1 |
| `sortable`       | Sortable                                                                                                                                                                                                        |     1 |
| `spreadsheet`    | Spreadsheet                                                                                                                                                                                                     |     1 |
| `taskboard`      | TaskBoard                                                                                                                                                                                                       |     1 |
| `tooltip`        | Tooltip                                                                                                                                                                                                         |     1 |
| `treelist`       | TreeList                                                                                                                                                                                                        |     1 |
| `treeview`       | TreeView                                                                                                                                                                                                        |     1 |
| `typography`     | Typography                                                                                                                                                                                                      |     1 |
| `upload`         | ExternalDropZone, Upload                                                                                                                                                                                        |     2 |

**Total planned public components:** 127.

## Architecture-defining feature seeds

These are initial seeds only; the stage's reference-analysis workflow expands them before implementation.

### Chart

`line`, `bar`, `column`, `area`, `pie`, `donut`, `scatter`, `bubble`, `bullet`, `box-plot`, `heatmap`, `waterfall`, `funnel`, `pyramid`, `polar`, `radar`, `range-area`, `range-bar`, `tooltip`, `legend`, `axes`, `labels`, `pan-zoom`, `accessibility`, `globalization`, `export`

### DataGrid

`adaptive-rendering`, `accessibility`, `cells`, `columns`, `sorting`, `filtering`, `grouping`, `aggregates`, `paging`, `selection`, `editing`, `hierarchy`, `virtualization`, `keyboard-navigation`, `globalization`, `export`, `column-resize`, `column-reorder`, `column-locking`

### Diagram

`nodes`, `edges`, `connectors`, `routing`, `layout`, `selection`, `drag-drop`, `resize`, `zoom-pan`, `hit-testing`, `commands`, `serialization`, `accessibility`

### Editor

`rich-text`, `toolbar`, `commands`, `selection`, `history`, `clipboard`, `paste`, `links`, `images`, `tables`, `lists`, `keyboard-navigation`, `accessibility`, `sanitization`

### Gantt

`tasks`, `dependencies`, `timeline`, `editing`, `drag-drop`, `resize`, `date-ranges`, `columns`, `keyboard-navigation`, `accessibility`, `globalization`

### Map

`layers`, `markers`, `shapes`, `navigation`, `zoom-pan`, `events`, `accessibility`

### PivotGrid

`multidimensional-data`, `dimensions`, `measures`, `aggregates`, `configuration`, `keyboard-navigation`, `accessibility`, `globalization`

### Scheduler

`views`, `events`, `resources`, `editing`, `selection`, `drag-drop`, `resize`, `recurrence`, `timezones`, `date-navigation`, `keyboard-navigation`, `accessibility`, `globalization`

### Spreadsheet

`workbooks`, `sheets`, `cells`, `ranges`, `selection`, `editing`, `formula-engine`, `formatting`, `clipboard`, `history`, `keyboard-navigation`, `virtualization`, `import-export`, `globalization`, `accessibility`

### TreeList

`hierarchical-data`, `columns`, `sorting`, `filtering`, `paging`, `selection`, `editing`, `virtualization`, `keyboard-navigation`, `globalization`, `export`

## Platform parity

Cross-cutting parity is tracked separately so a component cannot be called complete while the platform lacks security, internationalization, server behavior or migration/support infrastructure.

| Domain                  | Reference                                    | Initial status |
| ----------------------- | -------------------------------------------- | -------------- |
| accessibility           | `docs/content/common-features/accessibility` | unreviewed     |
| ai-components           | `docs/content/ai-components`                 | unreviewed     |
| ai-tools                | `docs/content/ai-tools`                      | unreviewed     |
| cloud-integration       | `docs/content/common-features/cloud`         | unreviewed     |
| data-binding            | `docs/content/common-features/data-binding`  | unreviewed     |
| date-math               | `docs/content/date-math`                     | unreviewed     |
| internationalization    | `docs/content/intl`                          | unreviewed     |
| migration               | `docs/content/migration`                     | unreviewed     |
| project-setup           | `docs/content/project-setup`                 | unreviewed     |
| security                | `docs/content/common-features/security`      | unreviewed     |
| server-capabilities     | `docs/content/server-components`             | unreviewed     |
| styling                 | `docs/content/styling`                       | unreviewed     |
| third-party-integration | `docs/content/common-features/integration`   | unreviewed     |
| troubleshooting         | `docs/content/troubleshooting`               | unreviewed     |
| web-ai-tooling          | `docs/content/webmcp`                        | unreviewed     |
