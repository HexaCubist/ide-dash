import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],

  build: {
    rollupOptions: { external: ["sharp"] },
    target: ["chrome87"],
    cssTarget: ["chrome87"],
    minify: "esbuild",
    cssMinify: "lightningcss"
  },

  css: { lightningcss: { targets: { chrome: 87 } } },
  resolve: { dedupe: ["@fullcalendar/common"] },

  optimizeDeps: {
    include: ["@fullcalendar/common", "@fullcalendar/icalendar", "ical.js"]
  }
});
