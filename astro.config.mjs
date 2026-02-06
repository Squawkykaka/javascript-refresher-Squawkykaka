// @ts-check
import { defineConfig, fontProviders } from "astro/config";

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

  experimental: {
    fonts: [
      {
        provider: fontProviders.local(),
        name: "Cute",
        cssVariable: "--font-cute",
        options: {
          variants: [
            {
              src: ["./src/assets/TsunagiGothic-subset.woff2"],
            },
          ],
        },
      },
    ],
  },
});
