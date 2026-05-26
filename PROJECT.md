# PROJECT.md

## Identity
- Project name: Harper's Website Redesign
- Client / for whom: Harper's Restaurant & Brewpub, East Lansing, MI
- What it is: Full redesign of Harper's public-facing homepage — static HTML/CSS/JS
- Problem it solves: Old site was a 2012-era template — wrong colors, clip-art graphics, no brand energy
- Status: Active
- Phase: Deployed — live at https://harpers-website.vercel.app
- Started: 2026-05-12

## People
- Client contact: TBD (working through Adam)
- My role: Builder / project lead
- Rate: $150/hour
- Events contact: Shelly Toth (Financial Manager) — 517-333-4040, M–F 9am–5pm
- Brewmaster: Kirk Kowalski
- Owner/Operator: Harper O'Brien Riley (Tom's grandson)

## Business Info
- Address: 131 Albert Ave., East Lansing, MI 48823
- Phone: 517-333-4040
- Email: Harpersbrewpub@aol.com
- Hours: Open Every Day · 12:00pm – 2:00am
- Instagram: @harpers_social
- Food Menu: https://www.harpersbrewpub.com/menu
- Beer Menu: https://www.harpersbrewpub.com/beer
- Events Page: https://www.harpersbrewpub.com/events
- Apply Now: https://www.harpersbrewpub.com/apply-now
- Merch (Shopify): https://harpers-east-lansing.myshopify.com/
- Lower level nightclub: Club Rush
- Award: "Best East Lansing Restaurant — 3 Years Running · State News Best Of Awards"
- Founded: September 6, 1997 · Named after Thomas Harper O'Brien (MSU alum)
- Gives Back: $450,000+ donated to community causes

## Tech Stack
- Framework: Astro 5 (static output) + @astrojs/react (required by visual-editing, no React components rendered)
- CMS: Sanity v3 — project ID `h0rc5ul6`, dataset `production`
- CMS client: @sanity/client@7 with stega encoding (src/lib/sanity.js imports from @sanity/client/stega)
- Visual editing: @sanity/visual-editing@2.15.4 — enableVisualEditing() in BaseLayout.astro
- Sanity Studio: https://harpers-brewpub.sanity.studio (redeployed 2026-05-21)
- GitHub: https://github.com/adamsambaer/harpers-website
- Hosting: Vercel — https://harpers-website.vercel.app
- Deploy: Vercel auto-builds on every push to master AND on Sanity publish (webhook live)
- Env vars (Vercel): SANITY_PROJECT_ID=h0rc5ul6

## Key Files
- `src/pages/index.astro` — full page, fetches Sanity at build time
- `src/layouts/BaseLayout.astro` — all head/SEO/meta
- `src/lib/sanity.js` — Sanity client and fetch functions
- `studio/schemaTypes/weeklyEvent.js` — editable event card schema
- `studio/schemaTypes/siteSettings.js` — phone, email, hours schema
- `scripts/seed-events.js` — seeds all 6 event days into Sanity
- `public/` — all static assets (Photos, Videos, Font, css, js)
- `.env` — SANITY_PROJECT_ID + SANITY_TOKEN (not committed to git)
- `HANDOFF.md` — full client handoff instructions

## Deployment Workflow
```
# After any code change:
git add .
git commit -m "describe the change"
git push
# Vercel auto-deploys in ~60 seconds

# After updating content in Sanity Studio:
# Option A (manual): Go to Vercel dashboard → Deployments → Redeploy
# Option B (auto): Set up Sanity webhook → Vercel deploy hook (not yet configured)
```

## What Sanity Controls
- Weekly Event cards (6 documents): day, event name, deals, badge text, sort order
- Site Settings (1 document): phone, email, hours, Shelly's contact info

## Account Ownership (transfer at handoff)
- GitHub repo → transfer to Harper's GitHub account
- Vercel project → Harper's creates account, redeploy from their GitHub
- Sanity project → add Harper's email as Admin, remove Adam's account
- All three transfers take under 1 hour total

## Design System

### Colors (all from the sun logo)
- `--yellow:    #F5C518`  — sun body
- `--red:       #E03020`  — Harper's wordmark
- `--teal:      #00B5BF`  — "Restaurant & Brewpub" text, wave curls
- `--navy:      #1B1454`  — badge outline/stroke, section backgrounds
- `--navy-dark: #120E38`  — deepest backgrounds, card bases, overlays
- `--dark:      #09081C`  — body background, nightlife section
- `--cream:     #FFFBF4`  — badge fill, light sections
- `--charcoal:  #1E1A3A`  — body text

### Typography
- Display: **Bungee** — Google Fonts, single weight, all-caps, venue/marquee character
  - CSS var: `--font-display: 'Bungee', sans-serif`
  - NOTE: loads via Google Fonts link — requires internet. Download locally before final handoff.
- Body: **DM Sans** — locally hosted variable font (Font/DM_Sans/), weight 100–900
  - CSS var: `--font-body: 'DM Sans', sans-serif`
- Rejected fonts: Extenda (too wide), Big Shoulders Display (too thin), Passion One (illegible small)

### Key CSS Variables
- `--section-pad: clamp(80px, 10vw, 140px)`
- `--container: 1200px`
- `--radius: 12px`
- `--gap: 6px`

### Section Order
1. Hero (video background — BANNER.mp4)
2. What's On — event cards grid
3. About ("Built for Every Kind of Night") — cream bg
4. Ticker — scrolling marquee strip
5. Patio — teal bg
6. Food & Drinks — cream bg
7. Game Day — dark bg
8. Nightlife / Club Rush — dark bg, crossfade slideshow
9. Events / Private Bookings — cream bg
10. Brewery — navy-dark bg
11. Videos — 4 portrait promo clips
12. Merch — cream bg, 3-column grid
13. Gives Back — teal bg
14. Find Us — cream bg with Google Maps embed
15. Footer — navy bg

### Visual Features
- 8 SVG wave dividers between section color transitions
- Dot texture on all cream sections (radial-gradient, 5.5% opacity)
- Pill buttons with shimmer sweep on hover
- Scroll reveal animations on all major elements (IntersectionObserver)
- Mouse-following yellow spotlight on nightlife section
- Counter animation on Gives Back section
- Word-by-word reveal on Game Day heading
- Logo dribble animation on page load

### Event Cards ("What's On")
- 6 cards: Mon–Sat, each with its own color identity from matching promo flyer
- Layout: 3×2 CSS grid, `aspect-ratio: 9/16`, `max-width: 81%` of container
- Hover: overlay + text fade to opacity 0, background photo scales to 1.07
- Photos: KARAOKE MONDAY #1.png, Honky Tonk.jpg, Half off Wednesday.jpg, Patio-07.jpg, Friday Night #1.jpg, Patio-77.jpg

### Cup Pop-Out Animations
- **Left blue cup** — `Photos/Adobe Express - file (1).png` (cutout, white bg)
  - CSS: `position: absolute`, `left: -60px`, `bottom: -110px`, `width: 666px`
  - Blend: `mix-blend-mode: multiply`
- **Right red cup** — `Photos/JIT.png`
  - CSS: `position: absolute`, `right: 0`, `bottom: -80px`, `width: 491px`
- Both hidden on ≤ 900px screens
- Scroll trigger: ramps in at progress 0.55–0.68, latches at 0.68, retracts below 0.50
- Easing: smoothstep `t²(3−2t)` — quick and smooth
- Driven by scroll progress through `.thisweek` section via RAF-throttled handler

## Performance State (as of 2026-05-19)
- Photos compressed: ~280MB → ~32MB ✓ (sharp, mozjpeg quality 72–80)
- Videos compressed: ~183MB → ~36MB ✓ (ffmpeg H.264 CRF 28, faststart)
- BANNER.mov converted to BANNER.mp4 ✓
- Hero video: preload="auto", #t=0.001 fragment on sources ✓
- Hero poster img element removed — video plays directly, CSS background is fallback ✓
- All below-fold images: loading="lazy" + decoding="async" ✓
- Scroll handlers: consolidated into single RAF-throttled function ✓
- Image pre-loader observer: 600px lookahead, upgrades lazy → eager before animate ✓
- Section videos: play/pause based on viewport visibility ✓
- Parallax targets: will-change: transform on gameday-img, brewery-img, patio imgs ✓
- Reveal animation: 0.75s → 0.6s, translateY 40px → 28px ✓
- vercel.json: 1-year cache on Photos/Videos/Font, no-cache on CSS/JS ✓
- color-scheme: light only meta tag added ✓
- hero-bg: transform translateZ(0) for GPU layer isolation ✓

## Image Assets (Photos/)
- Merch: Harper's Merch-parents-1.jpg, -6.jpg, -28.jpg
- Food: Harps_Feb11-12.jpg, -13.jpg, -16.jpg, -17.jpg, -25.jpg, -28.jpg, -60.jpg
- Patio/Venue: Patio-07.jpg, -52.jpg, -72.jpg, -74.jpg, -77.jpg, -87.jpg
- Nightlife: DOD_ClubRush-03.jpg, Deerock @ Harper's.jpg
- Brewery: BREW TANKS.jpg
- Logo: harpers-logo.png
- Hero poster: Harps_Feb11-28_no-logo_16x9.png
- Cup animation: Adobe Express - file (1).png

## Video Assets (Videos/)
- Hero: BANNER.mp4 (was .mov — converted + compressed)
- Promo: Copy of Beer Tower Promo.mp4, Copy of Game Day.mp4, Copy of Shot Ski Promo.mp4, Copy of Aspen Promo.mp4
- Unused (available): harpers-hero-pour-16x9.mp4

## Open Items
- [ ] Verify Presentation tool live preview fully works in Studio (open Live Preview tab, confirm overlays activate inside Studio only)
- [ ] Add image field to weeklyEvent schema — drag-and-drop photo uploads per event card
- [ ] Connect Formspree (real form ID — see HANDOFF.md)
- [ ] Connect custom domain (harpersbrewpub.com) in Vercel
- [ ] Download Bungee locally (currently loads from Google Fonts — needs internet)
- [ ] Client review and sign-off on live site
- [ ] Transfer all accounts to Harper's at handoff (GitHub, Vercel, Sanity)
- [ ] Confirm whether existing harpersbrewpub.com inner pages stay or get rebuilt
- [ ] Gallery / Instagram embed page decision

## Completed
- [x] Seeded all 6 weekly event cards with real content
- [x] Sanity webhook → Vercel deploy hook (auto-rebuild on Sanity publish)
- [x] Studio deployed with Presentation tool (Live Preview tab)
- [x] React added to Astro, @sanity/visual-editing@2.15.4 wired up
- [x] Stega encoding on Sanity client (field metadata in fetched strings)
- [x] Fixed comlink mismatch — both sides use presentation-comlink@1.0.33
- [x] Fixed studio import (sanity/presentation, not deprecated @sanity/presentation)
- [x] Removed CSP frame-ancestors (was blocking Studio iframe)
- [x] Fixed stega chars corrupting card CSS class names (stegaClean on event.day)
- [x] Fixed visual editing overlays showing on public site (iframe guard)
