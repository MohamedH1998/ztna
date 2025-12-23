---
product: zero-trust
section:
  id: the-decision
  badgeTitle: Decision Semantics
  title: How a request is decided
  description: Deterministic evaluation - explicit rules, ordered matches, default deny.
  order: 4
depth: technical
---

Authorization is deterministic: policies evaluate in order, first match wins. If no rule matches, deny is the default (fail-closed). This makes outcomes predictable and debuggable — rule order and scope matter.

Debug flow: confirm identity assertion → confirm device posture → confirm policy match → confirm transport reachability.
