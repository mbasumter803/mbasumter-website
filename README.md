# Mattress By Appointment Sumter — Master Project File

> **Owner:** Tre Thompson | **Site:** https://mbasumter.com | **GitHub:** github.com/mbasumter803/mbasumter-website
> Last Updated: May 3, 2026

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
| Financing | Snap Finance — no credit check, $5 down (always include disclaimer) |

---

## Tech Stack & Credentials

### Site & Hosting
| Service | Value |
|---------|-------|
| Live Site | https://mbasumter.com |
| Vercel Project | mbasumter-website under mbasumter803s-projects |
| GitHub Repo | github.com/mbasumter803/mbasumter-website |
| Vercel Deploy Hook | https://api.vercel.com/v1/integrations/deploy/prj_rOP55eMdpYiDOFdLogLgHTRyeUsN/z6QljOrFNW |
| Latest Commit | 6a528f9 — Fix: hide duplicate #mobile-sticky bar |

### Tracking
| Service | ID |
|---------|----|
| Google Analytics 4 | G-4F1DQ20DT9 |
| Google Tag Manager | GTM-K73GVRS2 (Container ID: 251212983, Account: 6353095003) |
| Microsoft Clarity | wkwiibdev0 |
| Facebook Pixel | 2264892437128858 |

> **Note:** GA4 property G-4F1DQ20DT9 is under a different Google account (not tredamit or mbasumter803). Need access to mark booking_complete as conversion in GA4 Admin.

### Automation & SMS
| Service | Value |
|---------|-------|
| Twilio FROM number | +18037213588 / (803) 721-3588 |
| Twilio Usage | OUTBOUND ONLY — DO NOT touch inbound webhook (owned by GoHighLevel / Sell More Mattresses) |
| CRON_SECRET | mba-remind-2024 |
| GAS Script ID | 158Fn_P07NxkBrln1er03o-gKMg04AtAsrsc3TZzDdfXKnaZF-8gbCQf2 |
| GAS Web App URL | https://script.google.com/macros/s/AKfycbwsahBiNd0yEygJlYXuj_08LO0UuimVlypiJibRhbT13P6ZBabMDMeimNXRsxBdlso1/exec |
| Google Sheet | "MBA Customers" — ID: 1968ejlMdzw_KGFexkl5pILA3pVFurJtCn8SHs_v7xtk |
| Google Calendar | primary (tredamit@gmail.com) |

### Vercel Environment Variables
| Variable | Value |
|----------|-------|
| GAS_WEBHOOK_URL | (GAS Web App URL above) |
| CRON_SECRET | mba-remind-2024 |
| TWILIO_ACCOUNT_SID | (set in Vercel dashboard) |
| TWILIO_AUTH_TOKEN | (set in Vercel dashboard) |
| TWILIO_FROM | +18037213588 |
| TWILIO_TO | +18039685749 |

---

## Google Business Profile

| Field | Value |
|-------|-------|
| GBP Location ID | 11489820970553963377 |
| GBP Business ID | 5454551619852600338 |
| Access | NEITHER tredamit nor mbasumter803 owns GBP |
| Current Owner | Third account — Sell More Mattresses / GoHighLevel |
| Status | SMM must invite mbasumter803@gmail.com as owner/manager |
| Action Required | Contact SMM Monday to request owner access |
| Posts | Active — SMM posts regularly, DO NOT disrupt |

### GBP What's Live
- Hours: 10am–7pm 7 days ✅
- Categories: Mattress store + Furniture store + Bedroom furniture store ✅
- Description: strong, written ✅
- Posts: active (managed by SMM) ✅
- Wheelchair accessible: yes ✅
- Financing available: NOT YET added (needs GBP access first)

---

## GTM Setup — Version 3 (Live as of May 3, 2026)

### Tags (6 total)
| Tag Name | Type | Trigger |
|----------|------|---------|
| GA4 Configuration - mbasumter.com | Google Tag | Initialization - All Pages |
| GA4 - Book Appointment | GA4 Event: book_appointment | Click - Book Appointment |
| GA4 - Booking Submit | GA4 Event: booking_submit | DataLayer - booking_submit |
| GA4 - Booking Complete (Conversion) | GA4 Event: booking_complete | DataLayer - booking_complete |
| GA4 - Call Tap | GA4 Event: call_tap | Click - Call Tap |
| GA4 - Text Tap | GA4 Event: text_tap | Click - Text Tap |

### Triggers (5 total)
| Trigger Name | Type | Filter |
|-------------|------|--------|
| Click - Book Appointment | Just Links | Click URL contains #book |
| Click - Call Tap | Just Links | Click URL contains tel: |
| Click - Text Tap | Just Links | Click URL contains sms: |
| DataLayer - booking_submit | Custom Event | Event name: booking_submit |
| DataLayer - booking_complete | Custom Event | Event name: booking_complete |

### DataLayer Events (wired in app.js)
| Event | Fires When |
|-------|-----------|
| booking_submit | User clicks submit on booking form (#qbConfirm) |
| booking_complete | #qbDoneStep becomes visible (booking confirmed) |
| cta_click | Any CTA button clicked (sticky bar, hero, deal cards) |
| phone_tap | Any tel:8037951194 link clicked |

> **Action Required:** Mark booking_complete as a Conversion in GA4 Admin (needs account access to G-4F1DQ20DT9)

---

## GAS (Google Apps Script) — MBA Booking Handler

**Script:** https://script.google.com/home/projects/158Fn_P07NxkBrln1er03o-gKMg04AtAsrsc3TZzDdfXKnaZF-8gbCQf2/edit
**Account:** tredamit@gmail.com

### Functions
| Function | Purpose |
|----------|---------|
| doPost(e) | Receives booking form submissions, writes to sheet, sends SMS, creates calendar event |
| sendSms_(to, body) | Outbound Twilio SMS helper |
| sendWeeklyReport() | Reads MBA Customers sheet, calculates week/all-time stats, texts 803-795-1194 |
| setupWeeklyReportTrigger() | Registers Monday 8am ET time-based trigger for weekly report |

### Weekly SMS Report
- **Format:** 📊 MBA Weekly Report / Week: X bookings / All-time: X total / Sizes: QUEEN:X KING:X TWIN:X / Sources: website:X
- **Schedule:** Every Monday 8am ET → texts 803-795-1194
- **Status:** Functions saved to Drive ✅ | Trigger activation requires Tre to run setupWeeklyReportTrigger() once manually in GAS editor and approve Google permissions

### Sheet Columns (MBA Customers → Bookings tab)
Booked At | Name | Phone | Requested Time | Scheduled For | Size | Pain | Source | Calendar Event ID

---

## API Endpoints (Vercel)

| Endpoint | Purpose |
|----------|---------|
| /api/remind | Daily cron — checks sheet for upcoming appointments, fires 24hr and 1hr SMS reminders via Twilio |
| /api/confirm | One-tap confirmation: https://mbasumter.com/api/confirm?id=XXX — shows branded confirmation page |

### Cron Jobs (vercel.json)
- Schedule: once per day minimum (Vercel Hobby plan — hourly NOT supported)
- Pattern: `0 X * * *` format only

---

## Design System

| Element | Value |
|---------|-------|
| Primary Color | Navy #0a0e27 |
| Accent Color | Gold #d4a017 |
| Background | White |
| Font Strategy | Mobile-first, clean, premium feel |
| CTA Style | Gold buttons, high contrast |
| Phone Link | Always tel:8037951194 — always clickable |

---

## Critical Rules (Never Break These)

1. **NEVER** touch GoHighLevel webhook on (803) 721-3588 — it belongs to Sell More Mattresses CRM
2. **NEVER** use "4 years" — always say "Since 2021" or "Proudly Serving Sumter Since 2021"
3. **ALWAYS** add Snap Finance disclaimer on ALL financing mentions
4. **NEVER** use fake timers, false scarcity claims, or popups blocking booking
5. **ALWAYS** keep phone as clickable tel: link
6. **ALWAYS** mobile-first — most customers find on phone
7. **NEVER** say walk-ins welcome — business is BY APPOINTMENT ONLY
8. **NEVER** use Vercel image optimization API (/_vercel/image)
9. **NEVER** defer GTM script — breaks conversion tracking
10. Every change must drive appointments or calls
11. Twilio is outbound SMS only — no inbound webhook changes ever
12. DO NOT touch Sell More Mattresses / GoHighLevel setup at all

---

## What's Live & Confirmed Working (as of May 3, 2026)

### Tracking — All 4 Confirmed Active
- ✅ GTM-K73GVRS2 firing on all pages
- ✅ GA4 G-4F1DQ20DT9 active
- ✅ Facebook Pixel 2264892437128858 active
- ✅ Microsoft Clarity wkwiibdev0 active
- ✅ DataLayer custom events: booking_submit, booking_complete, cta_click, phone_tap

### GTM Version History
- v1: Empty Container
- v2: GA4 Conversion Tracking — Book, Call, Text (click-based)
- v3 (LIVE): GA4 Config base tag + DataLayer booking_submit + booking_complete conversion events

### Site Features (index.html)
- ✅ Sticky mobile CTA bar (navy/gold, bottom of screen, mobile only) — #sticky-cta-bar
- ✅ Schema.org MattressStore + FAQPage JSON-LD structured data
- ✅ Hero with 3 CTAs (Book, Call, Text)
- ✅ Real pricing (Twin $130, Full $140, Queen $150 BEST VALUE, King $275)
- ✅ Comparison table (Big Box vs MBA)
- ✅ Customer photo marquee
- ✅ 3 verified Google reviews (Dean B., Sam M., Beth E.)
- ✅ 7-question FAQ
- ✅ Booking form with SMS confirmation
- ✅ "Open Now" / "Opens at 10am" live status indicator
- ✅ Exit popup — "Still looking? Same-day availability" (triggered by scroll, not exit intent)
- ✅ robots.txt (allows all, specifies sitemap)
- ✅ sitemap.xml (submitted to Google Search Console)
- ✅ Duplicate #mobile-sticky bar fixed (commit 6a528f9) — display:none!important

### Schema.org (Current)
- ✅ MattressStore with phone, address, geo, openingHours, aggregateRating (4.9, 29 reviews), image, sameAs, priceRange, url
- ✅ FAQPage (6 questions)
- ✅ Individual Review objects (Dean B., Sam M., Beth E.)
- ✅ GeoCoordinates present
- ⚠️ Missing: founder, foundingDate, areaServed, makesOffer, paymentAccepted (future improvement)

### SEO
- ✅ Title: "Mattress By Appointment Sumter SC | Save 50-80% Off Retail"
- ✅ Meta description present and strong
- ✅ Canonical: https://mbasumter.com/
- ✅ OG tags: title, description, image, url, type (business.business)
- ✅ Twitter card: summary_large_image
- ✅ robots.txt: allows all, Sitemap line present
- ✅ sitemap.xml: one URL, changefreq weekly, priority 1.0
- ⚠️ Missing: og:site_name, og:locale, twitter:title, meta robots tag (minor)

### Social Accounts (in sameAs schema)
- https://www.facebook.com/mbasumter803
- https://x.com/mbasumter803

---

## Deployment Process

Auto-deploy is broken (Vercel GitHub webhook not firing consistently).

**Manual deploy trigger:**
POST https://api.vercel.com/v1/integrations/deploy/prj_rOP55eMdpYiDOFdLogLgHTRyeUsN/z6QljOrFNW

Or: Vercel dashboard → Git settings → Deploy Hooks → "main-deploy"

---

## Pending / Action Required (Tre)

| Item | Priority | Notes |
|------|----------|-------|
| Run setupWeeklyReportTrigger() in GAS | HIGH | Open GAS editor → select function → Run → approve Google permissions. Needed to activate Monday 8am SMS reports |
| Get GBP access from SMM | HIGH | Call SMM Monday — ask them to add mbasumter803@gmail.com as GBP owner |
| Mark booking_complete as Conversion in GA4 | HIGH | Whoever owns G-4F1DQ20DT9 must go to GA4 Admin → Events → toggle booking_complete as Conversion |
| Add "Financing available" to GBP Amenities | LOW | After GBP access obtained |

---

## Remaining Build Improvements (Future — When Ready)

| Improvement | Impact | Effort |
|-------------|--------|--------|
| UTM/source capture in booking form + sheet | HIGH — needed before any ad spend | Medium |
| Exit intent trigger (popup already built, needs auto-trigger) | HIGH | Low |
| Email capture at done-step (optional field) | MEDIUM | Low |
| og:site_name, og:locale, twitter:title meta fixes | LOW | Low |
| Schema: add founder, foundingDate, areaServed, makesOffer | MEDIUM | Low |
| Review schema for individual reviews | MEDIUM | Low |
| GBP weekly posts (after access) | HIGH | Ongoing |
| AppointmentService / ReserveAction schema | MEDIUM | Medium |

---

## File Structure

```
mbasumter-website/
├── api/
│   ├── confirm.js        # One-tap confirmation endpoint
│   └── remind.js         # Daily SMS reminder system
├── images/               # Tre photos + customer photos
├── index.html            # Main site (full single-page) — 152+ commits
├── styles.css            # All styles (navy/gold/white system)
├── app.js                # Booking form logic + dataLayer events + deal card handlers
├── robots.txt            # SEO — allows all, specifies sitemap
├── sitemap.xml           # SEO sitemap
├── vercel.json           # Cron jobs + API config
└── README.md             # This file — master project reference
```

---

## Contact & Access

| Resource | URL / Info |
|----------|-----------|
| Live site | https://mbasumter.com |
| Admin email | mbasumter803@gmail.com |
| Backup email | tredamit@gmail.com |
| Vercel | https://vercel.com/mbasumter803s-projects/mbasumter-website |
| GitHub | https://github.com/mbasumter803/mbasumter-website |
| GAS Editor | https://script.google.com/home → Script ID: 158Fn_P07NxkBrln1er03o-gKMg04AtAsrsc3TZzDdfXKnaZF-8gbCQf2 |
| Google Sheet | https://docs.google.com/spreadsheets/d/1968ejlMdzw_KGFexkl5pILA3pVFurJtCn8SHs_v7xtk |
| GTM | https://tagmanager.google.com/#/container/accounts/6353095003/containers/251212983 |
| GBP | Search "Mattress by Appointment Sumter" on Google (signed into tredamit@gmail.com) |

---

*This file is the single source of truth for the MBA Sumter build. Update after every session.*
