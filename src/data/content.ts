// Single source of truth for site content. The data lives in content/portfolio.json,
// which is what TinaCMS edits through the /admin GUI. Astro reads it here at build time.
import portfolio from '../../content/portfolio.json';

export type Work = {
  image: string;
  type?: string;
  collection?: string;
  model?: string;
  concept?: string;
  year?: string;
};
// Blocks are optional rich content edited via Tina block templates; their shape
// is discriminated at render time by `_template`, so we keep the type loose here.
export type Block = { _template?: string; [key: string]: any };
export type Section = {
  id: string;
  title: string;
  description?: string;
  works: Work[];
  blocks?: Block[];
};

export const site = portfolio.site;
export const sections = portfolio.sections as Section[];
