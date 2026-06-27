import { defineHandler } from "nitro";
import {
  getTournamentConstants,
  type TournamentConstants,
} from "../../../tournaments.ts";
import client from "../../../client.ts";
import {
  GroupStruct,
  type Group,
  type Team,
} from "../../../../structs/standings.ts";
import type { SchemaMatchInfo } from "../../../../types/fifa";

function localizedName(value: { Description?: string }[] | null | undefined) {
  return value?.find((item) => item.Description)?.Description ?? "";
}

function groupLetter(groupName: string) {
  return (
    groupName.match(/Group\s+([A-Z0-9]+)$/i)?.[1] ??
    groupName.match(/^([A-Z0-9]+)$/i)?.[1] ??
    groupName.split(/\s+/).at(-1) ??
    ""
  ).toLowerCase();
}

function ensureTeam(
  teams: Map<string, Team>,
  country: string,
  name: string,
  letter: string,
) {
  if (!teams.has(country)) {
    teams.set(country, {
      country,
      name,
      group_letter: letter,
      group_points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      games_played: 0,
      goals_for: 0,
      goals_against: 0,
      goal_differential: 0,
    });
  }

  return teams.get(country)!;
}

function recordResult(team: Team, goalsFor: number, goalsAgainst: number) {
  team.games_played = (team.games_played ?? 0) + 1;
  team.goals_for = (team.goals_for ?? 0) + goalsFor;
  team.goals_against = (team.goals_against ?? 0) + goalsAgainst;
  team.goal_differential = (team.goals_for ?? 0) - (team.goals_against ?? 0);

  if (goalsFor > goalsAgainst) {
    team.wins = (team.wins ?? 0) + 1;
    team.group_points = (team.group_points ?? 0) + 3;
  } else if (goalsFor === goalsAgainst) {
    team.draws = (team.draws ?? 0) + 1;
    team.group_points = (team.group_points ?? 0) + 1;
  } else {
    team.losses = (team.losses ?? 0) + 1;
  }
}

async function fetchCalendarMatches(constants: TournamentConstants) {
  const response = await client.fetchJson<{ Results: SchemaMatchInfo[] }>(
    `${constants.baseURI}/calendar/matches?idCompetition=${constants.competitionID}&idSeason=${constants.seasonID}&count=500`,
  );

  return response?.Results ?? [];
}

function groupsFromMatches(
  matches: SchemaMatchInfo[],
  constants: TournamentConstants,
): Group[] {
  const groups = new Map<string, Map<string, Team>>();

  for (const match of matches) {
    if (String(match.IdStage) !== String(constants.groupStage)) {
      continue;
    }

    const letter = groupLetter(localizedName(match.GroupName));
    if (!letter) {
      continue;
    }

    const teams = groups.get(letter) ?? new Map<string, Team>();
    groups.set(letter, teams);

    const homeCountry = match.Home?.IdCountry;
    const awayCountry = match.Away?.IdCountry;

    if (!homeCountry || !awayCountry) {
      continue;
    }

    const home = ensureTeam(
      teams,
      homeCountry,
      localizedName(match.Home?.TeamName) || homeCountry,
      letter,
    );
    const away = ensureTeam(
      teams,
      awayCountry,
      localizedName(match.Away?.TeamName) || awayCountry,
      letter,
    );

    if (
      typeof match.HomeTeamScore === "number" &&
      typeof match.AwayTeamScore === "number"
    ) {
      recordResult(home, match.HomeTeamScore, match.AwayTeamScore);
      recordResult(away, match.AwayTeamScore, match.HomeTeamScore);
    }
  }

  return [...groups.entries()]
    .map(([letter, teams]) => ({
      letter,
      teams: [...teams.values()].sort(
        (a, b) =>
          (b.group_points ?? 0) - (a.group_points ?? 0) ||
          (b.goal_differential ?? 0) - (a.goal_differential ?? 0) ||
          (b.goals_for ?? 0) - (a.goals_for ?? 0) ||
          (a.name ?? "").localeCompare(b.name ?? ""),
      ),
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}

export default defineHandler(async function (event): Promise<Response> {
  const constants = getTournamentConstants(event.context.params?.year || "");

  if (!constants) {
    return new Response("Not Found", { status: 404 });
  }

  const standings = await client.fetchStandings(constants);
  const groups = (
    standings.length > 0
      ? Object.entries(
          Object.groupBy(standings, (standing) => {
            return standing.Group?.[0].Description ?? "";
          }),
        ).map(([groupName, standings]) =>
          GroupStruct.fromFifa(groupName, standings || []),
        )
      : groupsFromMatches(await fetchCalendarMatches(constants), constants)
  ).sort((a, b) => (a.letter < b.letter ? -1 : a.letter > b.letter ? 1 : 0));

  return new Response(JSON.stringify({ groups }), {
    headers: { "Content-Type": "application/json" },
  });
});
