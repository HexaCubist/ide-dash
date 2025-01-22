import * as api from "$lib/directus.server.svelte";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
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
