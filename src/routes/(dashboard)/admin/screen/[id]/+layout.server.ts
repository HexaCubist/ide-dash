import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getScreen } from "$lib/directus.server.svelte";

export const load: LayoutServerLoad = async ({ params }) => {
  const currentScreen = await getScreen(params.id, false);
  if (!currentScreen) error(404);

  return { currentScreen };
};
