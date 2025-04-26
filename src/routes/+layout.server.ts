import { env } from "$env/dynamic/private";
import * as api from "$lib/directus.server.svelte";
import { getCurrentHolidays } from "$lib/holidays";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const screenList = await api.getScreens();
  const num_icals = env.ical_urls?.split(",").length || 0;
  const holidays = await getCurrentHolidays();
  if (!screenList) {
    throw new Error("Failed to fetch site tags");
  }
  return {
    screenList,
    num_icals,
    holidays,
  };
};
