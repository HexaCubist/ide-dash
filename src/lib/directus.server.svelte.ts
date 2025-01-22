import {
  createDirectus,
  authentication,
  rest,
  readItems,
  readSingleton,
  updateItems,
  updateItem,
  createItem,
  readItem,
  uploadFiles,
} from "@directus/sdk";
import { env } from "$env/dynamic/private";
import { env as pubEnv } from "$env/dynamic/public";
import { browser } from "$app/environment";
import { ScreenData } from "./screens.svelte";

const client = createDirectus(env.directus_url)
  .with(authentication())
  .with(rest());
client.setToken(env.directus_token);

export const getScreens = async (published = true) => {
  const res = (await client.request(
    readItems("IDE", {
      fields: [
        "id",
        "status",
        "sort",
        "Name",
        "foreground",
        "content_type",
        "Iframe_URL",
        "Image.*",
        "Video.*",
        "schedule_start",
        "schedule_end",
      ],
      sort: "sort",
      ...(published
        ? {
            filter: {
              status: {
                _eq: "published",
              },
            },
          }
        : {}),
    })
  )) as ScreenData[];

  return res;
};

export const getScreen = async (id: string, published = true) => {
  const res = (await client.request(
    readItem("IDE", id, {
      ...(published ? { filter: { status: { _eq: "published" } } } : {}),
      fields: [
        "id",
        "status",
        "sort",
        "Name",
        "foreground",
        "content_type",
        "Iframe_URL",
        "Image.*",
        "Video.*",
        "schedule_start",
        "schedule_end",
      ],
    })
  )) as ScreenData;

  return res;
};

export const updateScreen = async (
  screen: Partial<ScreenData> & { id: string }
) => {
  const res = await client.request(
    updateItem("IDE", screen.id, {
      status: screen.status,
      sort: screen.sort,
      Name: screen.Name,
      foreground: screen.foreground,
      content_type: screen.content_type,
      Iframe_URL: screen.Iframe_URL,
      Image: screen.Image,
      Video: screen.Video,
      schedule_start: screen.schedule_start,
      schedule_end: screen.schedule_end,
    })
  );

  return res;
};

export const createScreen = async (screen: Partial<ScreenData>) => {
  const res = await client.request(
    createItem("IDE", {
      status: screen.status,
      sort: screen.sort,
      Name: screen.Name,
      foreground: screen.foreground,
      content_type: screen.content_type,
      Iframe_URL: screen.Iframe_URL,
      Image: screen.Image,
      Video: screen.Video,
      schedule_start: screen.schedule_start,
      schedule_end: screen.schedule_end,
    })
  );

  return res;
};

export const uploadMedia = async (
  file: Blob,
  mime: string,
  mediaType: "image" | "video"
) => {
  const formData = new FormData();
  formData.append("type", mime);
  formData.append("folder", env.directus_media_folder);
  formData.append("file", file);
  return await client.request(uploadFiles(formData));
};
