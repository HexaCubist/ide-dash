import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { ScreenData } from "$lib/screens.svelte";
import { getScreens, updateScreen } from "$lib/directus.server.svelte";

export const actions = {
  async default({ request }) {
    const data = await request.formData();
    const screenListString = data.get("screenList");
    if (!screenListString) return error(400, "Data note saved incorrectly");
    try {
      const screenList = JSON.parse(
        screenListString.toString()
      ) as ScreenData[];
      Promise.all(
        screenList.map(async ({ id, sort }) => {
          return updateScreen({
            id,
            sort,
          });
        })
      );
    } catch (e) {
      return error(500, "Error saving data");
    }
    return {
      screens: await getScreens(),
    };
  },
} satisfies Actions;
