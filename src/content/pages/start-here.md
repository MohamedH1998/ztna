---
title: "Design Considerations"
description: "Building an accessible Zero Trust guide for diverse enterprise stakeholders"
kicker: "Case Study"
---

The hardest part about building this wasn't the design or the actual building, it was navigating around the function that this guide should serve. As an enterprise solution, I'd be potentially writing for security engineers, heads of finance, directors, executives, etc etc, all of whom might land on the same space for wildly different reasons and levels of expertise. The challenge that presented itself then was; how on earth do you create a single guide that serves them all?

I thought it might be useful to share my thinking.

## Challenge 1: The Technical Depth Spectrum

Enterprise software has multiple stakeholders, you don't want to bore heads of finance with technical jargon that means nothing to them when they're looking to understand the business value and justify spend. You also don't want to patronise a head of security who might want to dive deep into auth flows and policy enforcement mechanisms - both are equally important, but they need different things from the same guide.

I considered following typical guide conventions where the deeper you give, the more technical you get, a self-selection of sorts, but if felt a bit lazy as the cognitive load of navigating for useful/meaningful information rests on the reader. Instead, I designed a depth slider that lets readers adjust the technical complexity on the fly, defaulting to moderate.

The goal was to make this adjustment as non-invasive as possible. No separate pages, no menu diving. Just a subtle control that curates a personalized experience based on who you are. It's also not just the same content at different levels of abstraction, but content serves a completely different function i.e., beginner-friendly might convey concepts at a higher level of abstraction but would also touch on cost benefits and wider impact of these concepts.

I wonder if the depth slider could surface more than just technical complexity. Maybe it could also adjust for business vs. technical focus, or high-level strategy vs. tactical implementation. But there's almost an infinite number of variables in which we could tailor the experience for a reader to, it's a delicate balancing act of curating a personalised experience but also keeping it as simple as possible.

## Challenge 2: Cloudflare Ecosystem Familiarity

The other variable I had to account for was familiarity with Cloudflare's products. Some folks might be well versed in the Cloudflare ecosystem, while others might be coming from a competitor or evaluating Cloudflare for the first time.

I made a conscious decision to be selective about the Cloudflare-specific language I used. Instead, I anchored explanations to existing concepts that most enterprise IT teams already know i.e., VPNs, perimeter security, network access control. The idea was to meet people where they are, then gradually introduce Cloudflare-specific terms in context.

## Challenge 3: User Journey Stages

The third consideration was where readers were in their journey. I've categorised it into four stages:

- Discovery: wth is this?
- Understanding: how does this actually work?
- Decision-making: should we adopt this?
- Execution: how do we adopt this?

But how do you serve all four without losing anyone?

This guide prioritises the first two categories - the last thing they need is deep technical insights & implementation details when they're just trying to find their bearings. The later two stages; decision-making and execution, are subtly supported through comparisons with existing products and strategic insights.

Why? Because those initial two stages are where you lose people. If they make it past "wth is this?" and "how does it work?", they're sticky enough that you can afford to optimize the experience for early-stage readers without worrying the later-stage ones will drop off. It might have been worth including more explicit CTAs such as "Try it out" button or a direct line to sales for readers in the later stages.