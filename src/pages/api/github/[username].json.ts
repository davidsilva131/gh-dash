import type { APIRoute } from "astro";
import { fetchGitHubUser, GitHubApiError } from "../../../lib/github";

const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ params }) => {
  const token = import.meta.env.GITHUB_TOKEN as string | undefined;
  if (!token) {
    return json(
      { error: { type: "network", message: "Server is missing GITHUB_TOKEN configuration" } },
      500,
    );
  }

  const username = params.username;
  if (!username || !USERNAME_REGEX.test(username)) {
    return json({ error: { type: "not_found", message: "Invalid username" } }, 404);
  }

  try {
    const data = await fetchGitHubUser(username, token);
    return json(data, 200);
  } catch (err) {
    if (err instanceof GitHubApiError) {
      const status =
        err.type === "not_found" ? 404 : err.type === "rate_limited" ? 429 : 502;
      const errorBody: Record<string, unknown> = {
        type: err.type,
        message: err.message,
      };
      if (err.retryAfter) {
        errorBody.retryAfter = err.retryAfter;
      }
      return json({ error: errorBody }, status);
    }
    return json(
      { error: { type: "network", message: "Unexpected server error" } },
      502,
    );
  }
};
