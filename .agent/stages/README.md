# Stage Ledger

173 stages total:

- 19 foundation
- 127 public component
- 10 patterns
- 10 blocks
- 6 templates
- 1 certification

`index.json` is the machine-readable order and the source of truth for these counts. The
`stages` validator compares this file, `scaffold-manifest.json`, and `VERIFICATION_REPORT.md`
against it, so a stage added by ADR cannot leave a stale inventory behind.

The one-public-component rule is mechanically validated.
