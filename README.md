# Mattress By Appointment Sumter — Master Project File

> **Owner:** Tre Thompson | **Site:** https://mbasumter.com | **GitHub:** github.com/mbasumter803/mbasumter-website
> Last Updated: May 2, 2026

---

## Business Info

| Field | Value |
|-------|-------|
| Business Name | Mattress By Appointment Sumter |
| Owner | Tre Thompson |
| Phone | 803-795-1194 (tel:8037951194) |
| Address | 1809 Hwy 15 South, Sumter, SC 29150 |
| Hours | Open 7 Days · 10:00 AM – 7:00 PM |
| Email | mbasumter803@gmail.com / tredamit@gmail.com |
| Owner Cell | +18039685749 |
| Founded | 2021 (always say "Since 2021" — NEVER "4 years") |

---

## Tech Stack & Credentials

### Site & Hosting
| Service | Value |
|---------|-------|
| Live Site | https://mbasumter.com |
| Vercel Project | mbasumter-website under mbasumter803s-projects |
| GitHub Repo | github.com/mbasumter803/mbasumter-website |
| Vercel Deploy Hook | https://api.vercel.com/v1/integrations/deploy/prj_rOP55eMdpYiDOFdLogLgHTRyeUsN/z6QljOrFNW |

### Tracking
| Service | ID |
|---------|----|
| Google Analytics 4 | G-4F1DQ20DT9 |
| Google Tag Manager | GTM-K73GVRS2 |
| Microsoft Clarity | wkwiibdev0 |
| Facebook Pixel | 2264892437128858 |

### Automation & SMS
| Service | Value |
|---------|-------|
| Twilio FROM number | +18037213588 / (803) 721-3588 |
| Twilio SMS | OUTBOUND ONLY — DO NOT touch inbound webhook (owned by GoHighLevel / Sell More Mattresses) |
| CRON_SECRET | mba-remind-2024 |
| GAS Script ID | 158Fn_P07NxkBrln1er03o-gKMg04AtAsrsc3TZzDdfXKnaZF-8gbCQf2 |
| GAS Web App URL | https://script.google.com/macros/s/AKfycbwsahBiNd0yEygJlYXuj_08LO0UuimVlypiJibRhbT13P6ZBabMDMeimNXRsxBdlso1/exec |
| Google Sheet | "MBA Customers" tab |
| Google Calendar | primary |

### Vercel Environment Variables
| Variable | Value |
|----------|-------|
| GAS_WEBHOOK_URL | (GAS Web App URL above) |
| CRON_SECRET | mba-remind-2024 |
| TWILIO_ACCOUNT_SID | (set in Vercel dashboard) |
| TWILIO_AUTH_TOKEN | (set in Vercel dashboard) |
| TWILIO_FROM | +18037213588 |
| TWILIO_TO | +18039685749 |

### Google Business Profile
| Field | Value |
|-------|-------|
| GBP Business ID | 5454551619852600338 |
| Access | Google Search authuser=1 (tredamit@gmail.com) |
| Primary Category | Mattress store |
| Additional Categories | Furniture store, Bedroom furniture store |

---

## Design System

| Element | Value |
|---------|-------|
| Primary Color | Navy #0a0e27 |
| Accent Color | Gold #d4a017 |
| Background | White |
| Font Strategy | Mobile-first, clean, premium feel |
| CTA Style | Gold buttons, high contrast |
| Phone Link | Always `tel:8037951194` — always clickable |

---

## Critical Rules (Never Break These)

1. **NEVER** touch GoHighLevel webhook on (803) 721-3588 — it belongs to Sell More Mattresses CRM
2. **NEVER** use "4 years" — always say "Since 2021" or "Proudly Serving Sumter Since 2021"
3. **ALWAYS** add financing disclaimer on ALL financing mentions (Snap Finance)
4. **NEVER** use fake timers, false scarcity claims, or popups blocking booking
5. **ALWAYS** keep phone as clickable tel: link
6. **ALWAYS** mobile-first — most customers find on phone
7. Every change must drive **appointments or calls**
8. Twilio is **outbound SMS only** — no inbound webhook changes ever

---

## What's Live & Working

### API Endpoints (Vercel)
- `/api/remind` — Hourly Twilio reminder system (checks Google Sheet for upcoming appointments, fires 24hr and 1hr SMS reminders)
- `/api/confirm` — One-tap confirmation link (https://mbasumter.com/api/confirm?id=XXX) — shows branded confirmation page

### Cron Jobs (vercel.json)
- Hourly cron: `0 * * * *` → fires `/api/remind`

### Google Apps Script (GAS)
- Version 2 deployed as Web App
- Reads/writes "MBA Customers" Google Sheet
- Handles appointment booking submissions from the site form
- Adds events to Google Calendar (primary)
- Sends confirmation SMS via Twilio FROM number

### GTM (Version 2 — Live)
- `book_appointment` — fires on form submit
- `call_tap` — fires on tel: link click
- `text_tap` — fires on text link click

### Site Features (index.html)
- Sticky mobile CTA bar (navy/gold, bottom of screen, mobile only)
- Schema.org LocalBusiness + MattressStore JSON-LD structured data
- Hero with 3 CTAs (Book, Call, Text)
- Real pricing section (Twin $130, Full $140, Queen $150 BEST VALUE, King $275)
- Comparison table (Big Box vs MBA)
- Customer photo marquee
- 3 verified Google reviews
- 7-question FAQ
- Booking form with SMS confirmation
- "Open Now" / "Opens at 10am" live status indicator

### SEO Files
- `/robots.txt` — allows all agents, specifies sitemap
- `/sitemap.xml` — submitted to Google Search Console

### GBP Status
- Hours: 10am–7pm 7 days ✅
- Categories: Mattress store + 2 additional ✅
- Description: strong, written ✅
- Posts: active ✅
- Wheelchair accessible: yes ✅

---

## Deployment Process

**Auto-deploy is broken** (Vercel GitHub webhook not firing).

**Manual deploy trigger:**
```
POST https://api.vercel.com/v1/integrations/deploy/prj_rOP55eMdpYiDOFdLogLgHTRyeUsN/z6QljOrFNW
```
Call this URL with a POST request to trigger fresh production deploy from latest main branch.

Or from Vercel Git settings → Deploy Hooks → "main-deploy" hook.

---

## Conversion Improvement Roadmap

### Done ✅
- Automation pipeline (GAS + Twilio + Vercel cron)
- GTM tracking (appointments, calls, texts)
- Structured data (LocalBusiness schema)
- Sticky mobile CTA bar
- robots.txt + sitemap.xml
- Real pricing with size-specific CTAs
- Social proof section (reviews + photos)
- FAQ covering all objections
- GBP audit and optimization
- Microsoft Clarity + Meta Pixel + GA4 all firing

### In Progress / Remaining ⏳
- README master file (this file) ✅ now done
- Verify all latest commits are deployed to production
- Add "Financing available" to GBP Amenities tab
- Conversion copy review — tighten urgency in hero
- Add trust badges / BBB / Google rating badge near booking form
- Review form confirmation UX flow
- Add exit-intent or scroll-triggered reminder (not a popup)
- Speed audit (Vercel Speed Insights — currently 2/5 on Production Checklist)
- Add more GBP posts (weekly cadence)
- Schema: add Review schema for the 3 Google reviews shown on site
- Test full appointment → GAS → SMS flow end-to-end

---

## File Structure

```
mbasumter-website/
├── api/
│   ├── confirm.js      # One-tap confirmation endpoint
│   └── remind.js       # Hourly SMS reminder system
├── images/             # Tre photos + customer photos
├── index.html          # Main site (full single-page)
├── styles.css          # All styles (navy/gold/white system)
├── app.js              # Booking form logic + deal card click handlers
├── robots.txt          # SEO — allows all, specifies sitemap
├── sitemap.xml         # SEO sitemap
├── vercel.json         # Cron jobs + API config
└── README.md           # This file — master project reference
```

---

## Contact & Access

- **Live site:** https://mbasumter.com
- **Admin email:** mbasumter803@gmail.com
- **Backup email:** tredamit@gmail.com
- **Vercel:** https://vercel.com/mbasumter803s-projects/mbasumter-website
- **GitHub:** https://github.com/mbasumter803/mbasumter-website
- **GBP:** Search "Mattress by Appointment Sumter" on Google (signed into tredamit@gmail.com)
- **Google Sheet (appointments):** Accessible via tredamit@gmail.com → Sheets → "MBA Customers"
- **GAS Editor:** https://script.google.com/home → Script ID: 158Fn_P07NxkBrln1er03o-gKMg04AtAsrsc3TZzDdfXKnaZF-8gbCQf2
