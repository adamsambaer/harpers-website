import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset   = import.meta.env.SANITY_DATASET || 'production';

export const client = projectId
  ? createClient({ projectId, dataset, useCdn: true, apiVersion: '2024-01-01' })
  : null;

export async function fetchWeeklyEvents() {
  if (!client) return null;
  try {
    return await client.fetch(`*[_type == "weeklyEvent"] | order(order asc)`);
  } catch {
    return null;
  }
}

export async function fetchSiteSettings() {
  if (!client) return null;
  try {
    return await client.fetch(`*[_type == "siteSettings"][0]`);
  } catch {
    return null;
  }
}
