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

const statuses = ["Not Started", "In Progress"] as const;
export type statusType = (typeof statuses)[number];

export type taskShape = {
  id: string;
  name: string;
  status: statusType;
  parentName?: string;
};

export type projectShape = {
  name: string;
  tasks: taskShape[];
};

export const GET: RequestHandler = async ({ url, params }) => {
  if (
    !env.NOTION_TOKEN ||
    !env.NOTION_TASK_DATASOURCE_ID ||
    !env.NOTION_PROJECT_DATASOURCE_ID
  ) {
    return json({ projects: [] });
  }
  // Get Projects
  let projectMap: Record<string, projectShape> = {};
  try {
    const projects = iteratePaginatedAPI(notion.dataSources.query, {
      data_source_id: env.NOTION_PROJECT_DATASOURCE_ID,
      filter_properties: ["Project name"],
    });
    for await (const projectRes of projects) {
      if (!isFullPageOrDataSource(projectRes)) {
        continue;
      }
      projectMap[projectRes.id] = {
        name:
          projectRes.properties["Project name"].title[0]?.plain_text ||
          "Unnamed Project",
        tasks: [],
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
  let parentTasks: taskShape[] = [];
  try {
    const tasks = iteratePaginatedAPI(notion.dataSources.query, {
      data_source_id: env.NOTION_TASK_DATASOURCE_ID,
      filter: {
        or: [
          ...statuses.map((status) => ({
            property: "Status",
            status: { equals: status as string },
          })),
          {
            property: "Sub-tasks",
            relation: { is_not_empty: true },
          },
        ],
      },
      sorts: [
        {
          property: "Status",
          direction: "descending",
        },
        {
          property: "Sorting Name",
          direction: "ascending",
        },
        // Sort by status
        // Sort to show parent tasks first
        {
          property: "Sub-tasks",
          direction: "ascending",
        },
      ],
      filter_properties: [
        "Project",
        "Task name",
        "Status",
        "Sub-tasks",
        "Parent-task",
      ],
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
        const taskShaped: taskShape = {
          id: taskRes.id,
          name:
            taskRes.properties["Task name"].title[0]?.plain_text ||
            "Unnamed Task",
          status: taskRes.properties["Status"].status.name,
          parentName: taskRes.properties["Parent-task"].relation.length
            ? parentTasks.find(
                (pt) =>
                  pt.id === taskRes.properties["Parent-task"].relation[0].id
              )?.name
            : undefined,
        };
        if (taskRes.properties["Sub-tasks"].relation.length > 0) {
          // This is a parent task, skip adding to list but add to parentTasks
          parentTasks.push(taskShaped);
        } else {
          projects[projectId].tasks!.push(taskShaped);
        }
      }
    }
    return json({ projects });
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      console.error("Notion API error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return json({ projects: [] });
  }
};
