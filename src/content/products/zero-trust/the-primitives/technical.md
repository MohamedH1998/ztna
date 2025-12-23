---
product: zero-trust
section:
  id: the-primitives
  badgeTitle: The Four Primitives
  title: The building blocks
  description: Identity, Device, Policy, Transport — each with clear scope and failure modes.
  order: 3
depth: technical
---

Cloudflare Zero Trust is the composition of four primitives: Identity, Device, Policy, and Transport. Identity provides WHO (from your IdP). Device provides WHAT (posture signals). Policy provides the allow/deny logic. Transport provides the controlled path to the destination.

They're separable: you can adopt them incrementally, and you can debug them independently. Most failures map cleanly to one primitive: identity assertion, device signal, policy match, or transport reachability.
