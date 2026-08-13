# Security Policy

Security architecture is governed by `SECURITY_ARCHITECTURE.md`.

During development:
- never commit credentials, tokens, production data or private keys;
- treat dependency advisories as release-blocking according to severity/exploitability;
- security-sensitive changes receive explicit review evidence;
- suspected vulnerabilities are not converted into public examples/tests containing exploitable secrets or production targets;
- fixes add regression tests at the owning layer.

Before public distribution, add an externally reachable vulnerability-reporting contact/process appropriate to the organization. This scaffold intentionally does not invent a security mailbox or disclosure SLA that the project owner has not established.
