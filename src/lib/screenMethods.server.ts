import {
  createScreen,
  deleteMedia,
  deleteScreenPermanent,
  getScreen,
  updateScreen,
  uploadMedia,
} from "$lib/directus.server.svelte";
import { type Image, Status, type ScreenData } from "$lib/screens.svelte";
import { redirect, error } from "@sveltejs/kit";
import sharp from "sharp";

export const processImage = async (fileData: File) => {
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
  const file = (await uploadMedia(resizedBlob, "image/webp", "image")) as Image;
  return file;
};

export const createOrUpdateScreen = async (
  screenData: Partial<ScreenData>,
  fileData?: File
) => {
  let updateData: Partial<ScreenData> = {
    id: screenData.id,
    Name: screenData.Name,
    content_type: screenData.content_type,
    status: screenData.status,
    foreground: screenData.foreground,
  };
  if (screenData.content_type === "image" && fileData?.type.includes("image")) {
    // If it's an image, we need to resize it and convert it to a webp blob
    const file = await processImage(fileData);
    // @ts-ignore
    updateData.Image = file.id;
  } else if (
    screenData.content_type === "video" &&
    fileData?.type.includes("video")
  ) {
    // If it's a video, we need to upload it
    if (!fileData) return error(400, "No video provided");
    const file = (await uploadMedia(fileData, fileData.type, "video")) as Image;
    console.log("Uploaded video:", file);
    screenData.Video = {
      service: "directus",
      id: file.id,
    };
  }
  // Update or create the screen
  if (updateData.id)
    return await updateScreen(
      updateData as Partial<ScreenData> & { id: string }
    );
  else
    return await createScreen({
      ...updateData,
      sort: 99999,
    });
  // if (screenData.status !== Status.Published) throw redirect(303, "/admin");
};

export const deleteScreen = async (id: string) => {
  // First get item
  const screen = await getScreen(id, false);
  if (screen.status === Status.Published) {
    await updateScreen({
      id,
      status: Status.Archived,
    });
    return;
  } else {
    // The item is already a draft or archived, we can safely delete it and the associated file(s)
    console.log("Permanently deleting screen", id);
    if (screen.Image) {
      console.log("Deleting image", screen.Image.id);
      await deleteMedia(screen.Image.id);
    }
    if (screen.Video && screen.Video.service === "directus") {
      console.log("Deleting video", screen.Video.id);
      await deleteMedia(screen.Video.id);
    }
    await deleteScreenPermanent(id);
    return;
  }
};

export const publishScreen = async (id: string) => {
  await updateScreen({
    id,
    status: Status.Published,
  });
  return;
};
