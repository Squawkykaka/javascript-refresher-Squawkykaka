// @ts-check
import { defineConfig } from "astro/config";

import sharp from "sharp";

// https://astro.build/config
export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  site: "https://squawkykaka.github.io",
  base: "/javascript-refresher-Squawkykaka",
  vite: {
    esbuild: {
      legalComments: "external",
    },
  },
});
