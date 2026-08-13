# Component Registry

`registry/components/*.json` is the canonical component inventory. Each entry owns lifecycle status, phase/stage, reference provenance, composition dependencies, rendering characteristics, parity dimensions and seeded feature inventory.

`requiredBy` is generated from `composition.uses`; it is not manually duplicated.

Registry state is evidence-driven. The validator prevents invalid lifecycle/status patterns. Component source directories are created only when implementation begins.
