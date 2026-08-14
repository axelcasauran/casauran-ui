# Upstream Reference Sync

Use `.agent/workflows/reference-sync.md`. The baseline is immutable during ordinary work. A newer
upstream commit is diffed, classified and explicitly approved before changing scope/provenance.
Only after approval may maintainers run `pnpm reference:inventory:write`, update the baseline
snapshot summary and component map, and re-run both reference validators.
