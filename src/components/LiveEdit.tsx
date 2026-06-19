// Contextual ("click-on-page") editing island — a TIME-BOXED experiment.
//
// Astro pages are static HTML, which is why this is the one place Tina's marquee
// live-edit needs a hydrated React island. `useTina` subscribes to the Tina admin
// over postMessage when this page is viewed inside /admin, so edits stream in live.
// `tinaField(obj, 'name')` stamps a `data-tina-field` attribute → clicking that
// element in the admin focuses the matching form field.
//
// Outside the admin (plain visit, or offline build via the static fallback), the
// hooks are inert: it just renders the data it was given. Nothing else on the site
// is React — this island exists only to demonstrate the capability.
import * as React from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

// TinaCMS's precompiled dist (e.g. tinacms/dist/rich-text) calls bare
// `React.createElement` and expects React on the global scope rather than
// importing it. Expose it so the island hydrates instead of throwing
// "React is not defined".
if (typeof globalThis !== 'undefined') (globalThis as any).React = React;

type Props = { query: string; variables: object; data: any };

export default function LiveEdit(props: Props) {
  const { data } = useTina(props);
  const site = data?.portfolio?.site;
  const sections: any[] = data?.portfolio?.sections ?? [];
  if (!site) return null;

  return (
    <div className="live-edit">
      <h1 className="le-name" data-tina-field={tinaField(site, 'name')}>
        {site.name}
      </h1>

      <div className="le-about" data-tina-field={tinaField(site, 'about')}>
        {typeof site.about === 'string' ? (
          // Static fallback path: about arrives as a markdown string.
          <p>{site.about}</p>
        ) : (
          // Live client path: about arrives as a Tina rich-text AST.
          <TinaMarkdown content={site.about} />
        )}
      </div>

      <ol className="le-sections">
        {sections.map((s, i) => (
          <li key={s?.id ?? i} className="le-section">
            <span className="le-title" data-tina-field={tinaField(s, 'title')}>
              {s?.title}
            </span>
            {s?.description && (
              <span className="le-desc" data-tina-field={tinaField(s, 'description')}>
                {s.description}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
