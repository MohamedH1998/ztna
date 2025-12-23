---
product: zero-trust
section:
  id: the-primitives
  badgeTitle: The Four Primitives
  title: The building blocks
  description: Identity, Device, Policy, Transport — each with clear scope and failure modes.
  order: 3
depth: deep
---

Model the system as four independent concerns with distinct sources of truth and failure modes.

Identity: externalized to IdPs via OIDC/SAML. Cloudflare validates tokens and extracts claims (groups, email, custom attributes). MFA context available via IdP assertion. Cloudflare never stores passwords — it consumes identity, doesn't originate it.

Device: posture signals from WARP client (OS version, disk encryption, firewall state) + MDM/EDR integrations (Intune, Jamf, CrowdStrike, SentinelOne). Also certificate-based device identity. Signals evaluated continuously, not just at initial auth.

Policy: ordered rule engine with first-match semantics. Rules combine identity claims (email, groups), device signals (posture checks), request context (IP, method, path), and destination. Default-deny means missing rules block access.

Transport: WARP client routes traffic via Cloudflare edge. Private apps connect via cloudflared tunnels (outbound-only connections using HTTP/2 or QUIC). DNS resolution controlled by Gateway. No direct client-to-origin connectivity for private resources.
