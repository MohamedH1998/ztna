---
product: zero-trust
section:
  id: the-decision
  badgeTitle: Decision Semantics
  title: How a request is decided
  description: Deterministic evaluation - explicit rules, ordered matches, default deny.
  order: 4
depth: non-technical
---

Every access request is evaluated against an ordered list of policy rules. The first matching rule determines the outcome. If a rule matches and allows access, the request proceeds. If it matches and blocks, access is denied. If no rules match at all, access is denied by default.

This default-deny behavior is intentional. It prevents accidental access from misconfigured or missing rules. When debugging access issues: verify identity claims are correct, check device posture passes requirements, confirm a policy rule matches the request, and ensure transport connectivity works.
