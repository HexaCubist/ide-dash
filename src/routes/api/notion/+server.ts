import { env } from "$env/dynamic/private";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  Client,
  isFullPageOrDataSource,
  isNotionClientError,
  iteratePaginatedAPI,
} from "@notionhq/client";
// Initializing a client

const notion = new Client({
  auth: env.NOTION_TOKEN,
});

export const GET: RequestHandler = async ({ url, params }) => {
  if (
    !env.NOTION_TOKEN ||
    !env.NOTION_TASK_DATASOURCE_ID ||
    !env.NOTION_PROJECT_DATASOURCE_ID
  ) {
    return json({ projects: [] });
  }
  // Get Projects
  try {
    const projects = iteratePaginatedAPI(notion.dataSources.query, {
      data_source_id: env.NOTION_PROJECT_DATASOURCE_ID,
      filter_properties: ["title"],
    });
    let projectMap: Record<string, { name: string }> = {};
    for await (const projectRes of projects) {
      if (!isFullPageOrDataSource(projectRes)) {
        continue;
      }
      projectMap[projectRes.id] = {
        name:
          projectRes.properties["Name"].title[0]?.plain_text ||
          "Unnamed Project",
      };
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      console.error("Notion API error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return json({ projects: [] });
  }

  // Get Tasks
  try {
    const tasks = iteratePaginatedAPI(notion.dataSources.query, {
      data_source_id: env.NOTION_TASK_DATASOURCE_ID,
      filter: {
        property: "Status",
        select: {
          equals: "To Do",
        },
      },
      filter_properties: ["Project", "Name"],
    });
    let projects: Record<
      string,
      { name: string; tasks: { id: string; name: string }[] }
    > = {};
    for await (const taskRes of tasks) {
      if (!isFullPageOrDataSource(taskRes)) {
        continue;
      }
      const projectRel = taskRes.properties["Project"];
      if (projectRel.type === "relation" && projectRel.relation.length > 0) {
        const projectId = projectRel.relation[0].id;
        if (!projects[projectId]) {
          projects[projectId] = {
            name: projectMap[projectId]?.name || "",
            tasks: [],
          };
        }
        if (!projects[projectId].tasks) {
          projects[projectId].tasks = [];
        }
        projects[projectId].tasks!.push({
          id: taskRes.id,
          name:
            taskRes.properties["Name"].title[0]?.plain_text || "Unnamed Task",
        });
      }
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      console.error("Notion API error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return json({ tasks: [] });
  }
};
