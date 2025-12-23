---
product: zero-trust
section:
  id: the-mechanism
  badgeTitle: The Mechanism
  title: So, what is Zero Trust (at Cloudflare)?
  description: Per-request decisions + app-scoped access (not network membership).
  order: 2
  alignment: horizontal
depth: deep
---

Cloudflare ZT is an authorization and connectivity fabric: evaluate requests with identity + device context, then proxy authorized traffic to specific resources without granting network membership. Core invariants: explicit policy evaluation per request, default-deny posture, app-scoped authorization (not subnet-scoped reachability).

Request flow: client initiates connection → identity assertion validated (JWT, session cookie) → device posture evaluated (WARP client signals, certificate auth) → policy rules matched → authorized requests routed through Cloudflare edge → backend receives proxied connection. For private apps: origins connect outbound via cloudflared tunnels, eliminating inbound firewall rules and public IP exposure. For SaaS/web: inline proxy with same identity + policy enforcement.
