import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool }    from '@sanity/vision';
import { schemaTypes }   from './schemaTypes/index.js';

export default defineConfig({
  name:    'harpers-brewpub',
  title:   "Harper's Restaurant & Brewpub",

  // Fill these in after running: npx sanity@latest init
  projectId: process.env.SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset:   process.env.SANITY_DATASET    || 'production',

  plugins: [structureTool(), visionTool()],

  schema: { types: schemaTypes },
});
