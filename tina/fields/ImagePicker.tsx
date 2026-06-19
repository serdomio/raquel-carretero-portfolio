// Custom TinaCMS field: a visual thumbnail-grid picker for gallery images.
// Renders the images from /gallery-thumbs/manifest.json (built by scripts/sync-thumbs.mjs)
// and stores the chosen file's FILENAME — so the site's build-time astro:assets pipeline
// (which matches by filename in src/assets/images) is completely unaffected.
import React from 'react';
import { wrapFieldsWithMeta } from 'tinacms';

type Thumb = { file: string; thumb: string };

export const ImagePicker = wrapFieldsWithMeta(({ input }: any) => {
  const [images, setImages] = React.useState<Thumb[]>([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch('/gallery-thumbs/manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setImages)
      .catch(() => setError(true));
  }, []);

  const selected = input.value;

  if (error) {
    return (
      <input
        type="text"
        value={input.value || ''}
        onChange={(e) => input.onChange(e.target.value)}
        placeholder="image filename (thumbnails unavailable — run npm run thumbs)"
        style={{ width: '100%', padding: '8px', border: '1px solid #e1e1e1', borderRadius: 6 }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
        gap: 8,
        maxHeight: 340,
        overflowY: 'auto',
        padding: 4,
      }}
    >
      {images.map((im) => {
        const isSel = im.file === selected;
        return (
          <button
            key={im.file}
            type="button"
            title={im.file}
            onClick={() => input.onChange(im.file)}
            style={{
              padding: 0,
              cursor: 'pointer',
              borderRadius: 6,
              overflow: 'hidden',
              border: isSel ? '2px solid #2296fe' : '2px solid transparent',
              outline: isSel ? 'none' : '1px solid #e1e1e1',
              boxShadow: isSel ? '0 0 0 3px rgba(34,150,254,0.25)' : 'none',
              background: '#fff',
            }}
          >
            <img
              src={im.thumb}
              alt={im.file}
              loading="lazy"
              style={{ display: 'block', width: '100%', aspectRatio: '1', objectFit: 'cover' }}
            />
          </button>
        );
      })}
    </div>
  );
});
