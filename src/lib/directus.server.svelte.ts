import {
  createDirectus,
  authentication,
  rest,
  readItems,
  readSingleton,
} from "@directus/sdk";
import { env } from "$env/dynamic/private";
import { env as pubEnv } from "$env/dynamic/public";
import { browser } from "$app/environment";
import { ScreenData } from "./screens.svelte";

const client = createDirectus(env.directus_url)
  .with(authentication())
  .with(rest());
client.setToken(env.directus_token);

export const getScreens = async () => {
  const res = (await client.request(
    readItems("IDE", {
      fields: [
        "id",
        "status",
        "sort",
        "Name",
        "Iframe_URL",
        "Image",
        "Video",
        "schedule_start",
        "schedule_end",
      ],
      sort: "sort",
      filter: {
        status: {
          _eq: "published",
        },
      },
    })
  )) as ScreenData[];

  return res;
};
