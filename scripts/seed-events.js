import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// Load .env manually
const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
env.split(/\r?\n/).forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const client = createClient({
  projectId: 'h0rc5ul6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const events = [
  {
    _id: 'weekly-event-monday',
    _type: 'weeklyEvent',
    day: 'Monday',
    eventName: 'Karaoke Night',
    deals: [
      '$8 Bottles of Wine',
      '$4 Spartan Light Pitchers',
      "$4 Cat's PJs · Green Tea Shots",
      'Half-Off Apps',
    ],
    stampLines: ['Grab', 'The', 'Mic'],
    order: 1,
  },
  {
    _id: 'weekly-event-tuesday',
    _type: 'weeklyEvent',
    day: 'Tuesday',
    eventName: 'Honky Tonk',
    deals: [
      '$4 Spartan Light Pitchers',
      '$4 Apple Pie Seltzers',
      '$4 Jack Daniels',
      '$8 Personal Pizza',
    ],
    stampLines: ['Country', 'All', 'Night'],
    order: 2,
  },
  {
    _id: 'weekly-event-wednesday',
    _type: 'weeklyEvent',
    day: 'Wednesday',
    eventName: 'Half Off Night',
    deals: [
      "$2.75 Harper's Vodka",
      '$3 Wings',
      '$5 Chicken Dillas · Burgers',
      '$8 Large Pizza',
    ],
    stampLines: ['Best', 'Deal of', 'the Week'],
    order: 3,
  },
  {
    _id: 'weekly-event-thursday',
    _type: 'weeklyEvent',
    day: 'Thursday',
    eventName: 'Patio DJ Night',
    deals: [
      'Open-Air Sets',
      'String Lights & Fire Pits',
      'Heaters Cranked',
      'Dinner Crowd Welcome',
    ],
    stampLines: ['On the', 'Patio'],
    order: 4,
  },
  {
    _id: 'weekly-event-friday',
    _type: 'weeklyEvent',
    day: 'Friday',
    eventName: 'Friday Night',
    deals: [
      '$4 Long Islands',
      '$4 Spartan Light Pitchers',
      '$6 Wings',
    ],
    stampLines: ['Weekend', 'Mode'],
    order: 5,
  },
  {
    _id: 'weekly-event-saturday',
    _type: 'weeklyEvent',
    day: 'Saturday',
    eventName: 'Game Day → After Dark',
    deals: [
      'Every Screen On at Noon',
      'Club Rush Opens at Nine',
      'One Building, All Day',
    ],
    stampLines: ['Game', 'Day HQ'],
    order: 6,
  },
];

async function seed() {
  if (!process.env.SANITY_TOKEN) {
    console.error('Missing SANITY_TOKEN in .env — add it and try again.');
    process.exit(1);
  }

  console.log('Seeding weekly events into Sanity...\n');

  for (const event of events) {
    await client.createOrReplace(event);
    console.log(`✓ ${event.day}: ${event.eventName}`);
  }

  console.log('\nAll 6 events seeded. Publish them in Sanity Studio to make them live.');
}

seed().catch(err => {
  console.error(err.message);
  process.exit(1);
});
