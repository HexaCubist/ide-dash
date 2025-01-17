import * as api from "$lib/directus.server.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const screenList = await api.getScreens();
  if (!screenList) {
    throw new Error("Failed to fetch site tags");
  }
  const currentScreen = screenList[0];
  return {
    screenList,
    currentScreen,
  };
};
