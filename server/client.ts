import { defineCachedFunction } from "nitro/cache";
import { MatchStruct, type Match } from "../structs/match.ts";
import {
  SchemaLiveMatch,
  SchemaLiveMatchTeamStatistics,
  SchemaLiveMatchTimeline,
  SchemaMatchInfo,
  SchemaStanding,
} from "../types/fifa";
import { TournamentConstants } from "./tournaments.ts";
const FIFA_API = "https://api.fifa.com/api/v3";

// All FIFA API calls funnel through here, so caching this one function
// limits load on FIFA across every endpoint (timelines, team stats, live
// matches, the calendar, standings) and dedupes concurrent requests for
// the same URL instead of each one hitting FIFA independently.
const cachedFetchJson = defineCachedFunction(
  async (url: string): Promise<unknown> => {
    const response = await fetch(url);

    if (!response.ok) {
      return undefined;
    }

    const body = await response.json();
    return body == null ? undefined : body;
  },
  {
    name: "fifa-fetch",
    getKey: (url: string) => url,
    maxAge: 15,
    staleMaxAge: 120,
  },
);

export default {
  fetchJson: async function <T>(url: string): Promise<T | undefined> {
    return (await cachedFetchJson(url)) as T | undefined;
  },
  fetchTimeline: async function (idMatch: string) {
    return await this.fetchJson<SchemaLiveMatchTimeline>(
      `${FIFA_API}/timelines/${idMatch}`,
    );
  },
  fetchTeamStats: async function (idMatch: string, idTeam: string | undefined) {
    if (!idTeam) {
      return undefined;
    }

    return await this.fetchJson<SchemaLiveMatchTeamStatistics>(
      `${FIFA_API}/teamstatistics/match/${idMatch}/team/${idTeam}`,
    );
  },
  fetchCalendarMatches: async function (constants: TournamentConstants) {
    const response = await this.fetchJson<{ Results: SchemaMatchInfo[] }>(
      `${constants.baseURI}/calendar/matches?idCompetition=${constants.competitionID}&idSeason=${constants.seasonID}&count=500`,
    );

    return (response?.Results || [])
      .map((match) => MatchStruct.fromCalendar(match))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  },
  fetchStandings: async function (constants: TournamentConstants) {
    const response = await this.fetchJson<{ Results: SchemaStanding[] }>(
      `${constants.baseURI}/calendar/${constants.competitionID}/${constants.seasonID}/${constants.groupStage}/Standing`,
    );

    return response?.Results || [];
  },
  fetchLiveMatch: async function (idMatch: string | undefined) {
    if (!idMatch) {
      return undefined;
    }

    return await this.fetchJson<SchemaLiveMatch>(
      `${FIFA_API}/live/football/${idMatch}`,
    );
  },
  fetchCurrentLiveMatches: async function (constants: TournamentConstants) {
    const response = await this.fetchJson<{ Results: SchemaLiveMatch[] }>(
      `${constants.baseURI}/live/football/now`,
    );

    const matches = (response?.Results || []).filter(
      (match) =>
        match.IdCompetition === String(constants.competitionID) &&
        match.IdSeason === String(constants.seasonID),
    );

    const mapped = await Promise.all(
      matches.map((match) => this.mapLiveMatch(match)),
    );

    // FIFA's "now" endpoint doesn't guarantee a stable order between polls.
    // The client keeps a persistent index into this list (the "showing
    // match x/y" selector), so an unstable order would silently swap which
    // match that index points to every ~57s.
    return mapped.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  },
  fetchMatchDetails: async function (
    idMatch: string,
    homeTeamId: string | undefined,
    awayTeamId: string | undefined,
  ) {
    const [timeline, homeStats, awayStats] = await Promise.all([
      this.fetchTimeline(idMatch),
      this.fetchTeamStats(idMatch, homeTeamId),
      this.fetchTeamStats(idMatch, awayTeamId),
    ]);

    return { timeline, homeStats, awayStats };
  },
  mapLiveMatch: async function (match: SchemaLiveMatch): Promise<Match> {
    return MatchStruct.fromLive(
      match,
      await this.fetchMatchDetails(
        match.IdMatch,
        match.HomeTeam?.IdTeam,
        match.AwayTeam?.IdTeam,
      ),
    );
  },
  mapCalendarMatch: async function (
    match: SchemaMatchInfo,
    enrich = false,
  ): Promise<Match> {
    if (!enrich || !match.IdMatch) {
      return MatchStruct.fromCalendar(match);
    }

    return MatchStruct.fromCalendar(
      match,
      await this.fetchMatchDetails(
        match.IdMatch,
        match.Home?.IdTeam,
        match.Away?.IdTeam,
      ),
    );
  },
  getCalendarMatchByMatchNumber: async function (
    constants: TournamentConstants,
    matchNumber: number,
  ) {
    const response = await this.fetchJson<{ Results: SchemaMatchInfo[] }>(
      `${constants.baseURI}/calendar/matches?idCompetition=${constants.competitionID}&idSeason=${constants.seasonID}&count=500`,
    );
    const match = (response?.Results || []).find(
      (match) => match.MatchNumber === matchNumber,
    );

    if (!match) {
      return undefined;
    }

    const liveMatch = await this.fetchLiveMatch(match.IdMatch);
    if (liveMatch) {
      return await this.mapLiveMatch(liveMatch);
    }

    return await this.mapCalendarMatch(match, true);
  },
  getLiveMatchByMatchNumber: async function (
    constants: TournamentConstants,
    matchNumber: number,
  ) {
    const matches = await this.fetchCurrentLiveMatches(constants);
    return matches.find((match) => match.id === matchNumber);
  },
};
