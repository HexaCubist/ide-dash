import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Status, type ScreenData } from "$lib/screens.svelte";
import { getScreens, updateScreen } from "$lib/directus.server.svelte";
import { deleteScreen, publishScreen } from "$lib/screenMethods.server";

export const actions = {
  async save({ request }) {
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
  async delete({ request }) {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) return error(400, "No id provided");
    await deleteScreen(id);
    return {
      screens: await getScreens(),
    };
  },
  async publish({ request }) {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) return error(400, "No id provided");
    await publishScreen(id);
    return {
      screens: await getScreens(),
    };
  },
} satisfies Actions;
