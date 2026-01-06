import { env } from "$env/dynamic/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
  const projects = await fetch("/api/notion").then((res) => res.json());
  return {
    projects,
  };
};
