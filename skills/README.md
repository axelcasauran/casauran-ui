# Skills and Routing

Skills are specialist operating manuals loaded under the authority of `AGENTS.md`. They are not separate autonomous agents and cannot override accepted ADRs.

## Always-loaded reasoning for component stages

- `component`
- `api-design`
- `testing`
- `accessibility`
- `composition`
- `nextjs-rsc`
- `documentation`
- `parity-audit`

## Load by domain

- tokens/CSS/theme → `design-tokens`, `css-architecture`, `theming`
- popup/menu/dropdown/dialog → `overlay-positioning`
- lists/tree/dropdowns → `collections`, and `tree` where hierarchical
- forms/validation → `forms`
- sorting/filtering/grouping/paging → `data-operations`
- large rendering → `virtualization`, `performance`
- reorder/drag/resize → `drag-drop`
- date/schedule → `date-time`, `internationalization`
- Grid/TreeList/PivotGrid → `grid` plus `tree` as needed
- Scheduler/Gantt → `scheduler` / `gantt`
- Spreadsheet → `spreadsheet`
- Editor → `editor`, `security`
- Chart/Gauges/Sparkline → `charting`
- Diagram/Drawing/Map → `diagram`
- upload/file/save → `files-upload`, `security`
- PDF/Excel/export → `pdf-export`, `security` as applicable
- AI UI/tools → `ai-components`, `ai-tooling`, `security`
- dependency → `dependency-evaluation`
- architecture → `architecture`, `adr`
- parity certification → `parity-audit`

## Cross-cutting escalation

Load `security` whenever untrusted content/files/URLs/SVG/clipboard/serialization/AI output crosses a trust boundary. Load `performance` when the stage can materially affect large-data, scrolling, rendering, memory or bundle budgets.

## Earlier conceptual names

Older discussion labels map to canonical skills:
- design-system → design-tokens + theming + css-architecture
- positioning → overlay-positioning
- scheduling → scheduler + date-time + internationalization
- diagrams → diagram
- complex-widget → complex-widget + domain skill

## Skill contract

Every `SKILL.md` defines when to load, prerequisites, hard rules, analysis checklist, implementation discipline, forbidden shortcuts, required records and Definition of Done. Skills should evolve when recurring domain lessons are discovered, but architecture changes still require an ADR.
