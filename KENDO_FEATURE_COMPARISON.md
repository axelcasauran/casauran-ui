# KendoReact Feature Comparison Baseline

## Purpose

This is a scope and gap-management artifact. It compares our planned platform against the approved public KendoReact documentation baseline at commit `6a05c926c4f08b89782c25336fc159fea3a3f26b`. It does not compare proprietary source, DOM internals, CSS implementation, or private architecture.

## Three-dimensional comparison

### 1. Component parity

The registry contains 127 planned public component stages across documented domains including buttons, inputs, dropdowns, date inputs, data widgets, planning, files, editor, charts, diagram/map, spreadsheet and AI surfaces.

### 2. Feature parity

Complex components have seeded feature matrices so a name does not count as parity. Grid, for example, tracks column/data operations, selection, editing, hierarchy, virtualization, keyboard/globalization/export and adaptive behavior independently.

### 3. Platform parity

The platform registry tracks cross-cutting domains independently: accessibility, cloud/integration, data binding, security, server capabilities, styling, internationalization, date math, migration, troubleshooting, AI components/tools, web AI tooling and project setup.

## Deliberate architectural differences

Our project intentionally:

- uses independent APIs and implementation;
- keeps data/date/virtualization/etc. reusable rather than owned by Grid;
- uses a small supported public package surface initially;
- avoids a separate duplicate server-component product by designing server-safe imports and minimal client boundaries;
- uses native-first runtime dependencies with evaluated optional adapters;
- treats AI as optional and isolated;
- separates `parity-verified` from `improved`.

## Gap process

A gap is closed only through:
reference analysis → independent spec → registry feature → API/test design → implementation → enterprise quality gates → parity audit.

Upstream documentation changes do not silently change the active baseline. The reference-sync workflow classifies and approves changes first.
