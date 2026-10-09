import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const cdnTemplatePath = fileURLToPath(new URL('./templates/cdns.html', import.meta.url));

const injectCdnTemplate = {
  name: 'inject-cdn-template',
  transformIndexHtml(html) {
    const cdnTags = readFileSync(cdnTemplatePath, 'utf8');
    return html.replace('<!-- external-cdns -->', cdnTags);
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), injectCdnTemplate],
});
