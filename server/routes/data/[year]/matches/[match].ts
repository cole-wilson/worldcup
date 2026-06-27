import { defineHandler } from "nitro";
import { getTournamentConstants } from "../../../../tournaments.ts";
import client from "../../../../client.ts";

export default defineHandler(async function (event): Promise<Response> {
  const constants = getTournamentConstants(event.context.params?.year || "");
  const matchNumber = Number(event.context.params?.match);

  if (!constants || !Number.isFinite(matchNumber)) {
    return new Response("Not Found", { status: 404 });
  }

  const liveMatch = await client.getLiveMatchByMatchNumber(
    constants,
    matchNumber,
  );

  if (liveMatch) {
    return new Response(JSON.stringify(liveMatch));
  }

  const calendarMatch = await client.getCalendarMatchByMatchNumber(
    constants,
    matchNumber,
  );

  if (!calendarMatch) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(calendarMatch));
});
