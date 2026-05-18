# PROJECT.md

## Identity
- Project name: Harper's Website Redesign
- Client / for whom: Harper's Restaurant & Brewpub, East Lansing, MI
- What it is: Full redesign of Harper's public-facing homepage as a local static HTML/CSS/JS file
- Problem it solves: Existing site looks like a 2012 template — wrong colors, clip-art graphics, no brand energy
- Status: Active
- Phase: Building → Ready for client review / pre-deploy
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
- Stack: Static HTML/CSS/JS — no framework, no build tools
- Files: index.html + css/styles.css + js/main.js — open directly in browser
- Hosting: TBD — Netlify recommended (free tier, drag-and-drop)
- Status: Local only — not deployed

## Current Design System (as of 2026-05-18)

### Colors (all from the sun logo)
- `--yellow:    #F5C518`  — sun body
- `--red:       #E03020`  — Harper's wordmark (warm orange-red)
- `--teal:      #00B5BF`  — "Restaurant & Brewpub" text, wave curls
- `--navy:      #1B1454`  — badge outline/stroke, section backgrounds
- `--navy-dark: #120E38`  — deepest backgrounds, card bases, overlays
- `--dark:      #09081C`  — body background, nightlife section (deep navy-tinted)
- `--cream:     #FFFBF4`  — badge fill, light sections
- `--charcoal:  #1E1A3A`  — body text (navy-tinted dark)

### Typography (as of 2026-05-18)
- Display: **Bungee** — Google Fonts, single weight, inherently all-caps, venue/marquee signage character
  - Loaded via `<link>` in index.html (needs internet — download locally before deploy)
  - CSS var: `--font-display: 'Bungee', sans-serif`
- Body: **DM Sans** — locally hosted variable font (Font/DM_Sans/), weight range 100–900
  - CSS var: `--font-body: 'DM Sans', sans-serif`
- Adam's font preference: chunky/bold over tall/thin. Rejected: Extenda (too wide), Big Shoulders Display (too thin), Passion One alone (illegible at small sizes).

### Section Order
1. Hero (video background — harpers-hero-pour-16x9.mp4)
2. About ("The Place to Be")
3. Patio ("East Lansing's Favorite Outdoor Space") — teal bg
4. Food & Drinks ("Made From Scratch. Poured Fresh.") — cream bg
5. Game Day — navy-dark bg
6. Nightlife / Club Rush — dark bg with crossfade slideshow
7. Events / Private Bookings — cream bg
8. Brewery ("Hand-Crafted. Tank-to-Table.") — navy-dark bg
9. Videos ("See The Vibe") — 4 portrait promo clips — navy bg
10. Merch ("Show Your Harper's Love") — cream bg, 3-column grid
11. Gives Back — teal bg
12. Find Us — cream bg with Google Maps embed
13. Footer — navy bg

### Key CSS Variables
- `--radius: 12px` (cards, UI elements)
- Buttons: `border-radius: 100px` (pill shape)
- `--section-pad: clamp(80px, 10vw, 140px)`
- `--container: 1200px`
- `--gap: 6px` (photo grid gutters)

### Visual Features
- 8 SVG wave dividers between every section color transition
- Dot texture on all cream sections (radial-gradient, 5.5% opacity)
- Pill buttons with shimmer sweep on hover
- Card hover lift on merch items (translateY + box-shadow)
- Mouse-following yellow spotlight glow on nightlife section
- Counter animation on Gives Back section
- Word-by-word reveal on Game Day heading
- Logo dribble animation on page load

### Event Cards ("What's On" section) — as of 2026-05-18
- 6 cards: Mon–Sat, each with its own color identity from matching promo flyer
- Layout: 3×2 CSS grid, `aspect-ratio: 9/16`, max-width 1200px container
- Hover effect: overlay + text fade to opacity 0 (0.5s), background photo reveals + scales to 1.07
- Photos used: KARAOKE MONDAY #1.png, Honky Tonk.jpg, Half off Wednesday.jpg, Patio-07.jpg, Friday Night #1.jpg, Patio-77.jpg

## Image Assets (in project root)
- Merch: Harper's Merch-parents-1.jpg, -6.jpg, -28.jpg
- Food: Harps_Feb11-12.jpg, -13.jpg, -16.jpg, -16(1).jpg, -17.jpg, -25.jpg, -28.jpg, -60.jpg
- Patio / Venue: Patio-52.jpg, -72.jpg, -74.jpg, -77.jpg, -87.jpg
- Brewery: BREW TANKS.jpg
- Logo: harpers-logo.png
- Hero poster: Harps_Feb11-28_no-logo_16x9.png

## Video Assets (in project root)
- Hero: harpers-hero-pour-16x9.mp4 (preload="metadata", poster set)
- Promo (4): Copy of Beer Tower Promo.mp4, Copy of Game Day.mp4, Copy of Shot Ski Promo.mp4, Copy of Aspen Promo.mp4

## Performance State (as of 2026-05-15)
- Hero: preload="metadata" ✓
- All 14 below-fold images: loading="lazy" ✓
- All 5 videos: poster frames set ✓
- Image files: NOT compressed yet (do externally with Squoosh/TinyPNG)
- Video files: NOT compressed yet (do with HandBrake before deploy)

## Open Items
- [ ] Full page review with new Bungee + DM Sans — check every section for sizing/spacing issues
- [ ] Download Bungee locally (currently loads via Google Fonts — needs internet)
- [ ] Continue design polish — hero, nav, section-by-section
- [ ] Compress image files (Squoosh or TinyPNG)
- [ ] Compress video files (HandBrake or FFmpeg)
- [ ] Choose and set up hosting (Netlify recommended)
- [ ] Client review and sign-off before deploy
- [ ] Confirm whether existing harpersbrewpub.com inner pages stay or get rebuilt
- [ ] Gallery / Instagram embed page decision
- [ ] Get client's confirmation on all copy and contact details
