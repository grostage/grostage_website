# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** business owners and decision makers in India (many in Kerala) judging whether Grostage can build their website, app, business system or growth programme. They read the work to decide whether to get in touch.
- **Secondary (confirmed):** designers and developers evaluating the studio's craft, as possible hires or collaborators.

## Product Purpose

Grostage is a studio that brings strategy, design, technology and growth together to move a business to its "next stage". The public site exists to show that capability through real work and turn a visitor into a conversation (`/contact`). Success is a qualified enquiry.

## Positioning

One partner across four disciplines: Digital Products, Business Technology (ERP/CRM, operations, automation), AI & Data, and Digital Growth. Work starts from the business problem and continues after launch. Built from the ground up rather than on templates (e.g. Chanakya ERP, bilingual English/Malayalam AI assistant).

## Operating Context

- Next.js 15 (App Router), React 19, GSAP + ScrollTrigger + Lenis smooth scroll, framer-motion available. Postgres-backed content with a static fallback in `backend/lib/content.js`.
- Case studies ("works") are edited in `/admin`: title, slug, category, excerpt, Markdown-ish content (`## ` headings make chapters), cover image, image alt, gallery, comma-separated tags, `representative` flag, published.
- Deployed on Hostinger.

## Capabilities and Constraints

- No schema migrations without need; optional new case-study data should ride in existing fields (content, gallery) and hide cleanly when empty.
- Some projects (Samsung Exclusive Store, Soorya Solar) have no campaign imagery; their image is representative company artwork and must be labelled as such.

## Brand Commitments

- Name: Grostage. Tagline: "Built for your next stage."
- Voice: plain, confident, business-first; no hype, no invented claims.

## Evidence on Hand

- 8 case studies in `backend/lib/content.js` (FruitUp, Chanakya Properties, Custom ERP, Warehouse App, Samsung Exclusive Store, Soorya Solar, Circuit India, Chanakya ERP), images in `public/projects/`.
- Testimonials on the site are samples pending client approval.
- **No outcome metrics or extra per-project screenshots exist yet.** The owner will add them later via admin; designs must provide slots that disappear when empty. Never fabricate numbers.

## Product Principles

1. Show the work doing its job; let real projects carry the argument.
2. Business problem first, technology second.
3. Honesty over polish: label representative imagery, invent nothing.
4. Every page should end with a clear path to start a project.
