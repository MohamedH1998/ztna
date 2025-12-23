---
product: zero-trust
section:
  id: day-one
  badgeTitle: Day 1
  title: How to start (without breaking everything)
  description: Connect one app. Then one team. No big bang migration.
  order: 8
depth: deep
---

Side-by-side deployment: Route specific DNS domains to Cloudflare Tunnel (CNAME to UUID.cfargotunnel.com). Keep existing VPN for legacy routes. Over time, migrate more internal DNS records to Cloudflare.

Users install WARP client. It co-exists with most VPN clients (split tunnel configuration). Eventually, when all apps are migrated, decommission the VPN concentrator. Zero downtime migration path.
