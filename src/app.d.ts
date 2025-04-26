// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ScreenData } from "$lib/screens.svelte";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      holidays: holidayData[];
    }
    interface PageState {
      success?: number;
    }
    // interface Platform {}
  }
}

export {};
