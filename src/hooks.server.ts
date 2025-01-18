import { env } from "$env/dynamic/private";
import { error, type Handle } from "@sveltejs/kit";
import timingSafeCompare from "tsscmp";
const AdminCompare = env.IDE_ADMIN_PASSWORD;
const UserCompare = env.IDE_USER_PASSWORD;

export const handle: Handle = async ({ event, resolve }) => {
  event.route.id?.startsWith("/admin");
  if (event.url.pathname.startsWith("/admin")) {
    // Check admin auth

    const auth = event.request.headers.get("Authorization");
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
      });
    }
    const [scheme, credentials] = auth.split(" ");
    if (scheme.toLowerCase() !== "basic" || !AdminCompare) {
      return error(400, "Bad Request");
    }
    const [username, password] = atob(credentials).split(":");
    if (!timingSafeCompare(password, AdminCompare)) {
      return error(401, "Unauthorized");
    }
  }

  const response = await resolve(event);
  return response;
};
