import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The whole stylesheet is ~9 KB gzipped, so inline it into index.html at build time: one less
// render-blocking request before first paint. Font files stay external (they're loaded on demand).
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html'];
      if (!html) return;
      for (const [name, file] of Object.entries(bundle)) {
        if (file.type !== 'asset' || !name.endsWith('.css')) continue;
        const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${name.replace('.', '\\.')}"[^>]*>`);
        if (!link.test(html.source)) continue;
        html.source = html.source.replace(link, () => `<style>${file.source}</style>`);
        delete bundle[name];
      }
    },
  };
}

export default defineConfig({ plugins: [react(), inlineCss()] });
