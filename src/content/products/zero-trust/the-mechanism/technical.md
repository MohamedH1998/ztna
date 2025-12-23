---
product: zero-trust
section:
  id: the-mechanism
  badgeTitle: The Mechanism
  title: So, what is Zero Trust (at Cloudflare)?
  description: Per-request decisions + app-scoped access (not network membership).
  order: 2
  alignment: horizontal
depth: technical
---

Cloudflare Zero Trust is a contract: every request is evaluated and only the requested resource is authorized. Users don't gain broad network access; applications don't need to be directly exposed to the Internet.

A typical decision shape: User → Identity → Device context → Policy → Transport → Application. Keep this mental model fixed; everything else is implementation detail.
