# Capability Registry

`registry/capabilities/*.json` records shared behavior ownership independently from component names.

A capability entry identifies owner package, current status, known consumers and external-adapter policy. Components may consume capabilities without owning their algorithms.

The capability registry prevents Grid/Scheduler/Editor/etc. from creating private copies of selection, data, positioning, virtualization, commands, date or other reusable engines.
