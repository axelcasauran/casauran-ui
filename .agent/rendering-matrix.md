# Rendering Matrix

Every registry entry declares serverRenderable, requiresClient, clientReasons, hydrationSensitive, observer and portal implications. RSC-safe import and client interaction are separate concerns.

F0.10 overlay modules are server-safe to import but portal creation, event listeners, focus, and
inert mutation require post-mount browser invocation. Portal hosts synchronize only governed
theme/density/direction attributes. Positioning observers and animation remain separate stages.
