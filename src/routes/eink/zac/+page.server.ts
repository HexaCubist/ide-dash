import { env } from "$env/dynamic/private";
import type { projectShape } from "../../api/notion/+server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  const projects = (await fetch("/api/notion").then((res) => res.json())) as {
    projects: Record<string, projectShape>;
  };
  return {
    projects,
  };
};
