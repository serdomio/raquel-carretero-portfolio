import { defineConfig } from 'tinacms';
import { ImagePicker } from './fields/ImagePicker';

// TinaCMS visual editor. Run `npm run dev` (which wraps astro dev) and open
// http://localhost:4321/admin to edit content. Edits are written to
// content/portfolio.json — the same file Astro reads at build time.
//
// Local mode (clientId/token null) needs no account. For a hosted, shareable admin
// later, create a free Tina Cloud project and set the env vars below.

export default defineConfig({
  branch: process.env.TINA_BRANCH || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'portfolio',
        label: 'Portfolio',
        path: 'content',
        format: 'json',
        match: { include: 'portfolio' },
        // single fixed document — no create/delete in the UI
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'site',
            label: 'Site',
            fields: [
              { type: 'string', name: 'name', label: 'Name' },
              {
                type: 'string',
                name: 'cover',
                label: 'Cover image',
                description: 'Splash photo behind the name — pick from the gallery.',
                ui: { component: ImagePicker },
              },
              { type: 'string', name: 'role', label: 'Role' },
              { type: 'string', name: 'locations', label: 'Locations', list: true },
              { type: 'string', name: 'email', label: 'Email' },
              {
                type: 'object',
                name: 'instagram',
                label: 'Instagram',
                fields: [
                  { type: 'string', name: 'handle', label: 'Handle' },
                  { type: 'string', name: 'url', label: 'URL' },
                ],
              },
              {
                type: 'rich-text',
                name: 'about',
                label: 'About text',
                description: 'Full rich-text editor: headings, bold/italic, links, lists, quotes.',
              },
            ],
          },
          {
            type: 'object',
            name: 'sections',
            label: 'Sections',
            list: true,
            ui: {
              // drag to reorder; list order = display order on the site
              itemProps: (item) => ({ label: item?.title || 'Section' }),
            },
            fields: [
              {
                type: 'string',
                name: 'id',
                label: 'ID (slug)',
                description: 'URL-safe id, e.g. e-commerce',
                required: true,
              },
              { type: 'string', name: 'title', label: 'Title' },
              {
                type: 'string',
                name: 'description',
                label: 'Description',
                description: 'Shown on the Universo map when a project is opened',
                ui: { component: 'textarea' },
              },
              {
                type: 'object',
                name: 'works',
                label: 'Works',
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.collection || item?.image || 'Untitled' }),
                },
                fields: [
                  {
                    type: 'string',
                    name: 'image',
                    label: 'Image',
                    description: 'Pick the photo for this work.',
                    required: true,
                    ui: { component: ImagePicker },
                  },
                  { type: 'string', name: 'type', label: 'Type', description: 'e.g. E-commerce' },
                  { type: 'string', name: 'collection', label: 'Collection' },
                  { type: 'string', name: 'model', label: 'Model' },
                  { type: 'string', name: 'concept', label: 'Concept' },
                  { type: 'string', name: 'year', label: 'Year' },
                ],
              },
              {
                type: 'object',
                name: 'blocks',
                label: 'Content blocks',
                description:
                  'Optional rich content for this section (text, quote, feature image). Add, remove and drag to reorder. Leave empty for an images-only section.',
                list: true,
                templates: [
                  {
                    name: 'prose',
                    label: 'Text',
                    fields: [{ type: 'rich-text', name: 'body', label: 'Body' }],
                  },
                  {
                    name: 'statement',
                    label: 'Statement',
                    fields: [
                      {
                        type: 'string',
                        name: 'text',
                        label: 'Statement',
                        description: 'A short oversized line set in the display serif.',
                        ui: { component: 'textarea' },
                      },
                    ],
                  },
                  {
                    name: 'quote',
                    label: 'Quote',
                    fields: [
                      { type: 'string', name: 'text', label: 'Quote', ui: { component: 'textarea' } },
                      { type: 'string', name: 'cite', label: 'Attribution' },
                    ],
                  },
                  {
                    name: 'fullbleed',
                    label: 'Full-bleed image',
                    fields: [
                      {
                        type: 'string',
                        name: 'image',
                        label: 'Image',
                        description: 'Edge-to-edge photo from the gallery (optimized).',
                        ui: { component: ImagePicker },
                      },
                      { type: 'string', name: 'caption', label: 'Caption' },
                      {
                        type: 'string',
                        name: 'height',
                        label: 'Height',
                        options: [
                          { value: 'tall', label: 'Tall' },
                          { value: 'short', label: 'Short' },
                          { value: 'auto', label: 'Natural' },
                        ],
                        ui: { component: 'radio-group' },
                      },
                    ],
                  },
                  {
                    name: 'split',
                    label: 'Image + Text',
                    fields: [
                      {
                        type: 'string',
                        name: 'image',
                        label: 'Image',
                        description: 'Gallery photo (optimized).',
                        ui: { component: ImagePicker },
                      },
                      { type: 'rich-text', name: 'body', label: 'Text' },
                      {
                        type: 'string',
                        name: 'layout',
                        label: 'Layout',
                        options: [
                          { value: 'image-left', label: 'Image left' },
                          { value: 'image-right', label: 'Image right' },
                        ],
                        ui: { component: 'radio-group' },
                      },
                    ],
                  },
                  {
                    name: 'diptych',
                    label: 'Diptych (two images)',
                    fields: [
                      {
                        type: 'string',
                        name: 'imageA',
                        label: 'Left image',
                        ui: { component: ImagePicker },
                      },
                      {
                        type: 'string',
                        name: 'imageB',
                        label: 'Right image',
                        ui: { component: ImagePicker },
                      },
                      { type: 'string', name: 'caption', label: 'Caption' },
                    ],
                  },
                  {
                    name: 'feature',
                    label: 'Feature image (upload)',
                    fields: [
                      {
                        type: 'image',
                        name: 'image',
                        label: 'Image',
                        description: 'Uploaded via the media manager (public/uploads).',
                      },
                      { type: 'string', name: 'caption', label: 'Caption' },
                    ],
                  },
                ],
                ui: {
                  itemProps: (item) => ({ label: item?._template || 'Block' }),
                },
              },
            ],
          },
        ],
      },
    ],
  },
});
