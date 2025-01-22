import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  getScreen,
  getScreens,
  createScreen,
  uploadMedia,
} from "$lib/directus.server.svelte";
import sharp from "sharp";
import { Status, type ScreenData } from "$lib/screens.svelte";
import type { Image } from "$lib/screens.svelte";

import { goto } from "$app/navigation";
import { createOrUpdateScreen } from "$lib/screenMethods.server";
import { sendNotification } from "$lib/notify";

export const actions = {
  async update({ request, params }) {
    const data = await request.formData();
    const fileData = data.get("file") as File;
    const screenDataJSON = data.get("screenData");
    if (!screenDataJSON) return error(400, "No screen data provided");
    let screenData = JSON.parse(screenDataJSON.toString()) as ScreenData;
    if (!screenData.creator) return error(400, "No creator provided");
    const res = await createOrUpdateScreen(
      { ...screenData, id: undefined, status: Status.Draft },
      fileData
    );
    console.log("Screen created");
    // Send notification of new screen to review
    let review_url = new URL(request.url);
    review_url.pathname = `/admin/screen/${res.id}`;
    sendNotification({
      message: `A new ${
        screenData.content_type || "unknown thing"
      } is available to review!`,
      url: review_url.toString(),
    });
    return {};
  },
} satisfies Actions;
