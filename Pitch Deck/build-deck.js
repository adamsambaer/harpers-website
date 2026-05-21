const PptxGenJS = require('pptxgenjs');

const C = {
  dark:    '09081C',
  navy:    '1B1454',
  navyMid: '0F0D2E',
  teal:    '00B5BF',
  red:     'E03020',
  yellow:  'F5C518',
  cream:   'FFFBF4',
  muted:   '9B9488',
};

const F = { display: 'Bungee', body: 'DM Sans' };

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5"

// ─── Helpers ────────────────────────────────────────────────────────────────

function bar(s, color = C.teal, y = 7.08, h = 0.08) {
  s.addShape('rect', { x: 0, y, w: 13.33, h, fill: { color }, line: { type: 'none' } });
}

function outlineBox(s, x, y, w, h, color = C.teal, lineW = 1.5) {
  s.addShape('rect', { x, y, w, h, fill: { type: 'none' }, line: { color, width: lineW } });
}

function filledBox(s, x, y, w, h, color) {
  s.addShape('rect', { x, y, w, h, fill: { color }, line: { type: 'none' } });
}

function label(s, text, color = C.teal, x = 0.8, y = 0.7) {
  s.addText(text, {
    x, y, w: 11, h: 0.3,
    fontFace: F.body, fontSize: 9, color, bold: true, charSpacing: 3,
  });
}

function headline(s, text, size = 42, color = C.cream, x = 0.8, y = 1.05, w = 11.5) {
  s.addText(text, {
    x, y, w, h: 2.5,
    fontFace: F.display, fontSize: size, color, wrap: true,
  });
}

function body(s, text, x, y, w, h = 0.5, color = C.cream, size = 15) {
  s.addText(text, {
    x, y, w, h, fontFace: F.body, fontSize: size, color, wrap: true,
  });
}

// ─── Slide 1 — Cover ────────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  bar(s, C.teal, 0, 0.07);

  s.addText("HARPER'S RESTAURANT & BREWPUB", {
    x: 0, y: 1.3, w: 13.33, h: 0.5,
    fontFace: F.display, fontSize: 22, color: C.cream, align: 'center', charSpacing: 2,
  });

  s.addText('Your New Website\nIs Ready.', {
    x: 0, y: 2.1, w: 13.33, h: 2.4,
    fontFace: F.display, fontSize: 62, color: C.teal, align: 'center',
  });

  s.addText('Presented by Get Up Creative  ·  getup.studio', {
    x: 0, y: 5.1, w: 13.33, h: 0.4,
    fontFace: F.body, fontSize: 13, color: C.muted, align: 'center',
  });

  bar(s, C.teal, 5.9, 0.05);

  s.addText('#1 Bar  ·  State News Best Of  ·  Est. 1997  ·  500+ Capacity', {
    x: 0, y: 6.1, w: 13.33, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.yellow, align: 'center', bold: true, charSpacing: 1,
  });
}

// ─── Slide 2 — The Problem ───────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'THE SITUATION');
  headline(s, "Your Website Is\nMissing Opportunities.", 40, C.cream, 0.8, 1.0, 8);

  const bullets = [
    'No way to book private events online — just a phone number',
    'No events calendar — people don\'t know what\'s happening',
    'Doesn\'t capture Harper\'s nightlife and energy',
    'Harder to find when people search on Google',
  ];

  bullets.forEach((text, i) => {
    s.addText([
      { text: '→  ', options: { color: C.teal, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 0.8, y: 2.55 + i * 0.66, w: 7.6, h: 0.55,
      fontFace: F.body, fontSize: 15,
    });
  });

  // Stat box
  filledBox(s, 8.7, 2.5, 4.2, 2.0, C.red);
  s.addText('Over 60% of people\nsearch for restaurants\non their phone.', {
    x: 8.9, y: 2.65, w: 3.8, h: 1.7,
    fontFace: F.body, fontSize: 15, color: C.cream, align: 'center', bold: true, wrap: true,
  });

  bar(s);
}

// ─── Slide 3 — Comparison ───────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'THEN VS. NOW');
  headline(s, 'See The Difference.', 40, C.cream, 0.5, 1.0, 12);

  // Left — current site (red outline)
  outlineBox(s, 0.4, 2.1, 5.9, 4.3, C.red);

  s.addText('CURRENT SITE', {
    x: 0.65, y: 2.25, w: 5.4, h: 0.3,
    fontFace: F.body, fontSize: 9, color: C.red, bold: true, charSpacing: 2,
  });
  s.addText('harpersbrewpub.com', {
    x: 0.65, y: 2.6, w: 5.4, h: 0.35,
    fontFace: F.body, fontSize: 12, color: C.muted,
  });

  const leftBullets = [
    'No events calendar',
    'Booking by phone only',
    'No nightlife or Club Rush section',
    'Not optimized for phones',
  ];
  leftBullets.forEach((text, i) => {
    s.addText([
      { text: '✗  ', options: { color: C.red, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 0.65, y: 3.1 + i * 0.62, w: 5.4, h: 0.52,
      fontFace: F.body, fontSize: 14,
    });
  });

  // Right — new site (teal outline)
  outlineBox(s, 7.04, 2.1, 5.9, 4.3, C.teal);

  s.addText('NEW SITE', {
    x: 7.3, y: 2.25, w: 5.4, h: 0.3,
    fontFace: F.body, fontSize: 9, color: C.teal, bold: true, charSpacing: 2,
  });
  s.addText('harpers-website.vercel.app', {
    x: 7.3, y: 2.6, w: 5.4, h: 0.35,
    fontFace: F.body, fontSize: 12, color: C.teal,
  });

  const rightBullets = [
    'Events section, always updated',
    'Book online, 24/7',
    'Club Rush, video, personality',
    'Built phone-first',
  ];
  rightBullets.forEach((text, i) => {
    s.addText([
      { text: '✓  ', options: { color: C.teal, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 7.3, y: 3.1 + i * 0.62, w: 5.4, h: 0.52,
      fontFace: F.body, fontSize: 14,
    });
  });

  s.addText('Fieldhouse (fieldhousemsu.com), one of your closest competitors, already has all of this.', {
    x: 0, y: 6.75, w: 13.33, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.muted, align: 'center', italic: true,
  });
}

// ─── Slide 4 — Mobile ────────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };

  label(s, 'WHY THIS MATTERS', C.yellow);
  headline(s, 'Most People Will See Your Site\nOn Their Phone.', 38, C.cream, 0.8, 1.0, 11.5);

  // Big stat bar
  filledBox(s, 1.0, 3.35, 11.33, 1.2, C.teal);
  s.addText('6 in 10 restaurant searches happen on a phone.', {
    x: 1.2, y: 3.42, w: 10.93, h: 1.05,
    fontFace: F.display, fontSize: 26, color: C.dark, align: 'center',
  });

  body(s,
    'If your site doesn\'t look right on a phone, people leave before they even see your menu.',
    0.8, 4.8, 11.5, 0.55, C.cream, 15);
  body(s,
    'The new Harper\'s site was built phone-first — every section, every button, every photo.',
    0.8, 5.5, 11.5, 0.55, C.cream, 15);

  bar(s, C.yellow);
}

// ─── Slide 5 — What We Built ─────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'THE NEW SITE');
  headline(s, "Here's What\nWe Built.", 44, C.cream, 0.8, 0.9, 6);

  s.addText('harpers-website.vercel.app', {
    x: 0.8, y: 2.1, w: 6, h: 0.38,
    fontFace: F.body, fontSize: 14, color: C.teal, bold: true,
    hyperlink: { url: 'https://harpers-website.vercel.app' },
  });

  const features = [
    'A video playing when you land — just like Harper\'s energy',
    'Events section, always up to date',
    'Online form to book private events — no more phone tag',
    'Food photos that make people hungry before they arrive',
    'Google Maps built right in',
    'Works perfectly on every phone, tablet, and computer',
  ];

  features.forEach((text, i) => {
    s.addText([
      { text: '→  ', options: { color: C.teal, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 0.8, y: 2.65 + i * 0.62, w: 11.5, h: 0.52,
      fontFace: F.body, fontSize: 14,
    });
  });

  bar(s);
}

// ─── Slide 6 — Revenue ───────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'HOW IT PAYS OFF', C.yellow);
  headline(s, 'Four Ways This Site\nMakes You Money.', 40, C.cream, 0.5, 0.9, 12.3);

  const cards = [
    { title: 'Private Events', body: 'Book directly online.\nNo missed calls.' },
    { title: 'Club Rush',      body: 'Sell tickets through the site,\nautomatically.' },
    { title: 'Food Photos',    body: 'Real photos drive real traffic\n— and real hunger.' },
    { title: 'Merch',          body: 'An online shop, anytime,\non any phone.' },
  ];

  const pos = [
    { x: 0.4,  y: 2.85 },
    { x: 7.04, y: 2.85 },
    { x: 0.4,  y: 4.85 },
    { x: 7.04, y: 4.85 },
  ];

  cards.forEach((card, i) => {
    const { x, y } = pos[i];
    outlineBox(s, x, y, 5.9, 1.75, C.teal);
    s.addText(card.title.toUpperCase(), {
      x: x + 0.22, y: y + 0.15, w: 5.46, h: 0.4,
      fontFace: F.display, fontSize: 16, color: C.teal,
    });
    s.addText(card.body, {
      x: x + 0.22, y: y + 0.6, w: 5.46, h: 1.0,
      fontFace: F.body, fontSize: 13, color: C.cream, wrap: true,
    });
  });

  bar(s, C.yellow);
}

// ─── Slide 7 — Why Get Up Creative ──────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'WHY US');
  headline(s, "We're Not\nA Remote Agency.", 44, C.cream, 0.8, 0.9, 7.5);

  const bullets = [
    "We're in the building. We know Harper's.",
    "We manage Harper's Instagram — we know the voice.",
    "We already have the photos, the video, and the energy.",
    "This site was built for Harper's — not a template.",
  ];

  bullets.forEach((text, i) => {
    s.addText([
      { text: '→  ', options: { color: C.teal, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 0.8, y: 2.7 + i * 0.66, w: 7.5, h: 0.55,
      fontFace: F.body, fontSize: 15,
    });
  });

  // Get Up Creative callout card
  filledBox(s, 8.55, 1.2, 4.45, 5.6, C.teal);

  s.addText('GET UP\nCREATIVE', {
    x: 8.75, y: 1.35, w: 4.05, h: 1.5,
    fontFace: F.display, fontSize: 30, color: C.dark, align: 'center',
  });

  filledBox(s, 9.1, 2.95, 3.35, 0.04, C.dark);

  s.addText('Lansing, MI  ·  Est. 2021', {
    x: 8.75, y: 3.05, w: 4.05, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.dark, align: 'center',
  });
  s.addText('"Every frame has a purpose."', {
    x: 8.75, y: 3.5, w: 4.05, h: 0.45,
    fontFace: F.body, fontSize: 13, color: C.dark, align: 'center', italic: true,
  });

  filledBox(s, 9.1, 4.1, 3.35, 0.04, C.dark);

  s.addText('hello@getupcreative.com', {
    x: 8.75, y: 4.2, w: 4.05, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.dark, align: 'center',
  });
  s.addText('getup.studio', {
    x: 8.75, y: 4.65, w: 4.05, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.dark, align: 'center',
    hyperlink: { url: 'https://getup.studio' },
  });

  bar(s);
}

// ─── Slide 8 — Investment ────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  label(s, 'WHAT IT COSTS');
  headline(s, 'Simple, Transparent Pricing.', 40, C.cream, 0.5, 0.9, 12.3);

  // Left — Launch (teal outline)
  outlineBox(s, 0.4, 2.2, 5.9, 4.8, C.teal);

  s.addText('$7,500', {
    x: 0.6, y: 2.35, w: 5.5, h: 0.95,
    fontFace: F.display, fontSize: 54, color: C.teal,
  });
  s.addText('One-time launch package', {
    x: 0.6, y: 3.2, w: 5.5, h: 0.32,
    fontFace: F.body, fontSize: 12, color: C.muted,
  });

  const launchItems = [
    'Full website — yours to keep, forever',
    'Works on every phone, tablet, computer',
    'Online booking for private events',
    'Events, food photos, Google Maps, Club Rush',
    'No monthly fees',
  ];
  launchItems.forEach((text, i) => {
    s.addText([
      { text: '✓  ', options: { color: C.teal, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 0.6, y: 3.65 + i * 0.55, w: 5.5, h: 0.48,
      fontFace: F.body, fontSize: 13,
    });
  });

  // Right — Ongoing (navy fill, subtle)
  filledBox(s, 7.04, 2.2, 5.9, 4.8, C.navyMid);
  outlineBox(s, 7.04, 2.2, 5.9, 4.8, C.navy, 1.5);

  s.addText('$80/hr', {
    x: 7.24, y: 2.35, w: 5.5, h: 0.95,
    fontFace: F.display, fontSize: 54, color: C.cream,
  });
  s.addText('Ongoing support, as needed', {
    x: 7.24, y: 3.2, w: 5.5, h: 0.32,
    fontFace: F.body, fontSize: 12, color: C.muted,
  });

  const ongoingItems = [
    'Updates, changes, new pages',
    'Only when you need it',
    'No retainer required',
  ];
  ongoingItems.forEach((text, i) => {
    s.addText([
      { text: '→  ', options: { color: C.cream, bold: true } },
      { text, options: { color: C.cream } },
    ], {
      x: 7.24, y: 3.65 + i * 0.55, w: 5.5, h: 0.48,
      fontFace: F.body, fontSize: 13,
    });
  });

  s.addText('Optional: LineLeap ticket integration · Online menu ordering', {
    x: 7.24, y: 6.15, w: 5.5, h: 0.38,
    fontFace: F.body, fontSize: 11, color: C.muted, italic: true,
  });

  bar(s);
}

// ─── Slide 9 — CTA ───────────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  s.addText('The Site Exists.', {
    x: 0, y: 0.85, w: 13.33, h: 1.8,
    fontFace: F.display, fontSize: 76, color: C.teal, align: 'center',
  });

  s.addText('The only thing missing is the green light.', {
    x: 0, y: 2.8, w: 13.33, h: 0.75,
    fontFace: F.display, fontSize: 28, color: C.cream, align: 'center',
  });

  // Divider
  filledBox(s, 2.5, 3.85, 8.33, 0.05, C.teal);

  // 3 steps
  const steps = ['1.  Review the live site', '2.  Confirm the package', '3.  Go live in 2 weeks'];
  steps.forEach((text, i) => {
    s.addText(text, {
      x: 0.8 + i * 3.9, y: 4.1, w: 3.6, h: 0.45,
      fontFace: F.body, fontSize: 14, color: C.cream, align: 'center',
    });
  });

  s.addText('harpers-website.vercel.app', {
    x: 0, y: 4.75, w: 13.33, h: 0.4,
    fontFace: F.body, fontSize: 14, color: C.teal, align: 'center', bold: true,
    hyperlink: { url: 'https://harpers-website.vercel.app' },
  });

  bar(s, C.teal, 6.5, 0.05);

  s.addText('Get Up Creative  ·  hello@getupcreative.com  ·  getup.studio', {
    x: 0, y: 6.7, w: 13.33, h: 0.35,
    fontFace: F.body, fontSize: 11, color: C.muted, align: 'center',
  });
}

// ─── Save ────────────────────────────────────────────────────────────────────
const out = './harpers-pitch-redesigned.pptx';
pptx.writeFile({ fileName: out })
  .then(() => console.log('✓ Saved: ' + out))
  .catch(err => { console.error(err); process.exit(1); });
