---
product: zero-trust
section:
  id: the-decision
  badgeTitle: Decision Semantics
  title: How a request is decided
  description: Deterministic evaluation - explicit rules, ordered matches, default deny.
  order: 4
depth: deep
---

The policy engine behaves like a routing table for authorization: ordered rules with scoped predicates and deterministic first-match resolution.

Evaluation: extract identity claims from JWT/session, fetch device posture signals, evaluate request context (source IP, destination, method, path) against rule predicates in order. First satisfied rule returns Allow or Block. No match = implicit Deny.

Fail-closed prevents accidental exposure from misconfigurations, missing predicates, or IdP/posture provider failures. If upstream signals are unavailable, requests fail.

Best practices: avoid overlapping predicates to keep rule order predictable. Use explicit Deny rules when you want to document blocked patterns. Version and test policy changes with canary users/devices before rollout.

Troubleshooting path: (1) verify identity claims in JWT (groups, email match expected values), (2) check device posture evaluation logs (which checks failed), (3) validate rule predicate match and order (use policy preview/dry-run), (4) confirm transport health (tunnel status, DNS resolution, edge routing).
