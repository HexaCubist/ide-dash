import * as api from "$lib/directus.server.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allScreens = await api.getScreens(false);
  if (!allScreens) {
    throw new Error("Failed to fetch site tags");
  }
  return {
    allScreens,
  };
};
