---
product: zero-trust
section:
  id: vpn-vs-ztna
  badgeTitle: VPN vs ZTNA
  title: Why this isn't a feature upgrade
  description: Different trust model, different blast radius, different architecture.
  order: 5
depth: technical
---

VPNs grant network-level access after a single authentication, increasing lateral movement risk. ZTNA grants app-scoped access, enforcing policy per request and per destination.

With outbound-only connectivity (tunnels), private apps can avoid inbound exposure and direct Internet reachability. This is an architectural shift: membership vs authorization.
