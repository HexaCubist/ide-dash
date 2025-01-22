import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const ical_urls = env.ical_urls.split(",");
const ical_data = ical_urls.map((url) => {
  return fetch(url).then((res) => res.text());
});

export const GET: RequestHandler = async ({ url, params }) => {
  const index = parseInt(params.index);
  if (index < 0 || index >= ical_urls.length) {
    error(404, "Index out of range");
  }
  return new Response(await ical_data[index], {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
};
