---
product: zero-trust
section:
  id: vpn-vs-ztna
  badgeTitle: VPN vs ZTNA
  title: Why this isn't a feature upgrade
  description: Different trust model, different blast radius, different architecture.
  order: 5
depth: non-technical
---

VPNs grant network-level access. Once authenticated, you can reach any system on that network (unless additional segmentation is configured). If your VPN-connected device gets compromised, an attacker can access everything reachable on that network. The VPN doesn't re-check authorization for each internal connection.

Zero Trust grants app-scoped access. Every connection requires authorization. A compromised device only gets access to resources that device and user are explicitly authorized for. This reduces blast radius significantly. An attacker would need to compromise credentials AND device posture AND pass policy checks for each target application.
