import { defineConfig }    from 'sanity';
import { structureTool }   from 'sanity/structure';
import { visionTool }      from '@sanity/vision';
import { presentationTool } from '@sanity/presentation';
import { schemaTypes }     from './schemaTypes/index.js';

export default defineConfig({
  name:    'harpers-brewpub',
  title:   "Harper's Restaurant & Brewpub",

  projectId: process.env.SANITY_PROJECT_ID || 'h0rc5ul6',
  dataset:   process.env.SANITY_DATASET    || 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      name:  'preview',
      title: 'Live Preview',
      previewUrl: 'https://harpers-website.vercel.app',
    }),
  ],

  schema: { types: schemaTypes },
});
