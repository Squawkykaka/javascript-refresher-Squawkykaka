// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://squawkykaka.github.io',
    base: '/javascript-refresher-Squawkykaka',
    vite: {
        esbuild: {
            legalComments: "external",
        },
    }
});
