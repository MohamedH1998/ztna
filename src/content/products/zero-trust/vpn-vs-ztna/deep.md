---
product: zero-trust
section:
  id: vpn-vs-ztna
  badgeTitle: VPN vs ZTNA
  title: Why this isn't a feature upgrade
  description: Different trust model, different blast radius, different architecture.
  order: 5
depth: deep
---

VPNs extend layer-3 connectivity to remote endpoints. Clients get routing access to RFC1918 space (full tunnel) or split-tunnel to specific subnets. Segmentation relies on firewall rules, VLANs, or ACLs downstream.

Attack surface expansion: compromised endpoint can scan reachable IP ranges, exploit lateral movement paths, and pivot to other systems without re-authentication. VPN concentrator sees one authenticated session, not per-app authorization.

ZTNA inverts this: authorize at request-time per destination. Client never gets layer-3 routing to private networks. Access is proxied through Cloudflare edge after policy evaluation. Each connection is a distinct authorization event.

For private apps using cloudflared: origin connects outbound to Cloudflare edge via long-lived HTTP/2 or QUIC tunnel. No inbound ports listening on public IPs. Firewall rules can block all inbound. Attackers can't directly reach origin even with valid credentials unless authorized request flows through edge.

Key difference: VPNs solve connectivity first, authorization second. ZTNA solves authorization first, provides connectivity only for authorized flows. This decouples network reachability from security posture.
