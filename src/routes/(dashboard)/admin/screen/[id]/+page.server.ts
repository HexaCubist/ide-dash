import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  getScreen,
  getScreens,
  updateScreen,
  uploadMedia,
} from "$lib/directus.server.svelte";
import sharp from "sharp";
import { Status, type ScreenData } from "$lib/screens.svelte";
import type { Image } from "$lib/screens.svelte";
import { createOrUpdateScreen, deleteScreen } from "$lib/screenMethods.server";

export const actions = {
  async update({ request, params }) {
    const data = await request.formData();
    const fileData = data.get("file") as File;
    const screenDataJSON = data.get("screenData");
    if (!screenDataJSON) return error(400, "No screen data provided");
    let screenData = JSON.parse(screenDataJSON.toString()) as ScreenData;
    await createOrUpdateScreen({ ...screenData }, fileData);
  },
  async delete({ params }) {
    await deleteScreen(params.id);
    redirect(303, "/admin");
    return {};
  },
} satisfies Actions;
