import type { Config } from "tailwindcss";
import flyonui from "flyonui";
import flyonuiPlugin from "flyonui/plugin";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flyonui/dist/js/*.js",
    "../node_modules/fullcalendar/**/*.js",
    "../node_modules/flatpickr/**/*.js",
  ],

  theme: {
    extend: {},
  },

  plugins: [flyonui, flyonuiPlugin],

  flyonui: {
    themes: ["luxury", "light"],
    vendors: true, // Enable vendor-specific CSS generation
  },
} satisfies Config;
