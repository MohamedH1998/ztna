---
product: zero-trust
section:
  id: the-mechanism
  badgeTitle: The Mechanism
  title: So, what is Zero Trust (at Cloudflare)?
  description: Per-request decisions + app-scoped access (not network membership).
  order: 2
  alignment: horizontal
depth: beginner
---

Instead of connecting to a network, you request access to specific applications. Each request is evaluated independently. When you access an app, Cloudflare validates your identity (who you are), checks your device posture (is it compliant), and evaluates policy rules (are you allowed). Only if all checks pass do you get access to that specific resource. The next request goes through the same process. The key difference: you never get blanket network access. Every request earns authorization individually.
