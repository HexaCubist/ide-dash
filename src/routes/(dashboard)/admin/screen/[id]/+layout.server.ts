import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getScreen } from "$lib/directus.server.svelte";

export const load: PageServerLoad = async ({ params }) => {
  const currentScreen = await getScreen(params.id);
  if (!currentScreen) error(404);

  return { currentScreen };
};
