---
product: zero-trust
section:
  id: the-shift
  badgeTitle: The Shift
  title: Why Zero Trust exists
  description: The perimeter collapsed. Network-level trust became the liability.
  order: 1
depth: deep
---

Perimeter-based security assumed stable network boundaries. Modern enterprises have remote endpoints, SaaS sprawl, multi-cloud infrastructure, and third-party contractor access.

VPNs solve reachability by extending layer-3 connectivity. This creates implicit trust domains with broad routing access and lateral movement paths (RFC1918 space, split tunneling, or full tunneling with routing policies).

Zero Trust reframes access as a request-time authorization problem: bind identity assertions (OIDC/SAML claims), device signals (posture, certificates, MDM state), and request metadata (IP, time, method) to explicit policy evaluation per destination.

Design goals: eliminate implicit trust, minimize reachable attack surface, make authorization decisions auditable and reversible, and decouple authentication from network connectivity.
