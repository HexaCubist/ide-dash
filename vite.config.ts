import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      external: ["sharp"],
    },
  },
  resolve: {
    dedupe: ["@fullcalendar/common"],
  },
  optimizeDeps: {
    include: ["@fullcalendar/common", "@fullcalendar/icalendar", "ical.js"],
  },
});
