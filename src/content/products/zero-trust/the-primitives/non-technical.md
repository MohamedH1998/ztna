---
product: zero-trust
section:
  id: the-primitives
  badgeTitle: The Four Primitives
  title: The building blocks
  description: Identity, Device, Policy, Transport — each with clear scope and failure modes.
  order: 3
depth: non-technical
---

Zero Trust decisions are built from four components: Identity, Device, Policy, and Transport. Identity: who you are (verified through your IdP like Okta or Azure AD). Device: what you're using and its security state. Policy: the rules that determine access. Transport: the secure path to the application.

Each component can independently block access. A valid user on a non-compliant device gets blocked. A compliant device with invalid credentials gets blocked. Understanding these four primitives helps you debug access issues and design policies effectively.
