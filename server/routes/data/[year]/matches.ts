import { defineHandler } from "nitro";
import { getTournamentConstants } from "../../../tournaments.ts";
import client from "../../../client.ts";

export default defineHandler(async function (event): Promise<Response> {
  const constants = getTournamentConstants(event.context.params?.year || "");

  if (!constants) {
    return new Response("Not Found", { status: 404 });
  }

  const matches = await client.fetchCalendarMatches(constants);

  return new Response(JSON.stringify(matches));
});
