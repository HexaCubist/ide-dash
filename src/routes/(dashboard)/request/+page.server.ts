import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  getScreen,
  getScreens,
  createScreen,
  uploadMedia,
} from "$lib/directus.server.svelte";
import sharp from "sharp";
import type { ScreenData } from "$lib/screens.svelte";
import type { Image } from "$lib/screens.svelte";
import acceptModule from "attr-accept";
import { goto } from "$app/navigation";
const accept = acceptModule.default;

export const actions = {
  async update({ request, params }) {
    const data = await request.formData();
    const fileData = data.get("file") as File;
    const screenDataJSON = data.get("screenData");
    if (!screenDataJSON) return error(400, "No screen data provided");
    let screenData = JSON.parse(screenDataJSON.toString()) as ScreenData;
    // If nothing to upload, easy
    if (!fileData) {
      const url = data.get("url");
      const res = await createScreen({
        Name: screenData.Name,
        content_type: screenData.content_type,
        status: "draft",
        foreground: screenData.foreground,
        Iframe_URL: url?.toString() || undefined,
      });
      redirect(303, `/admin/screen/${res.id}`);
      return {};
    }
    // If it's an image, we need to resize it and convert it to a webp blob
    if (accept({ name: fileData.name, type: fileData.type }, "image/*")) {
      if (!fileData) return error(400, "No image provided");
      const buffer = await (fileData as File).arrayBuffer();
      const resized = await sharp(buffer)
        .resize(1920, 1080, {
          fit: "cover",
          position: "center",
        })
        .webp()
        .toBuffer();
      const resizedBlob = new Blob([resized], { type: "image/webp" });
      // Upload the image
      const file = (await uploadMedia(
        resizedBlob,
        "image/webp",
        "image"
      )) as Image;
      console.log(file);
      const res = await createScreen({
        Name: screenData.Name,
        content_type: screenData.content_type,
        status: "draft",
        foreground: screenData.foreground,
        // @ts-ignore
        Image: file.id,
      });
      redirect(303, `/admin/screen/${res.id}`);
      return {};
    }
    // If it's a video, we need to upload it
    if (accept({ name: fileData.name, type: fileData.type }, "video/*")) {
      if (!fileData) return error(400, "No video provided");
      const file = (await uploadMedia(
        fileData,
        fileData.type,
        "video"
      )) as Image;
      const res = await createScreen({
        Name: screenData.Name,
        content_type: screenData.content_type,
        status: "draft",
        foreground: screenData.foreground,
        Video: {
          service: "directus",
          id: file.id,
        },
      });
      redirect(303, `/admin/screen/${res.id}`);
      return {};
    }
  },
} satisfies Actions;
