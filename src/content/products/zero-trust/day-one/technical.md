---
product: zero-trust
section:
  id: day-one
  badgeTitle: Day 1
  title: How to start (without breaking everything)
  description: Connect one app. Then one team. No big bang migration.
  order: 8
depth: technical
---

Parallel adoption strategy: Keep your VPN running. Pick one non-critical internal app. Configure cloudflared tunnel to point to localhost:8080 (or your internal IP). Set policy to 'Email ends with @company.com'. Test. No firewall changes needed initially.

Route by route migration: Use Split Tunnels to exclude ZT protected IPs from VPN, or just allow them to route through ZTNA. You control the pace.
