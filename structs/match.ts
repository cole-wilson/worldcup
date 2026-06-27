import Struct from "zod-struct";
import { z } from "zod";
import type {
  SchemaLiveMatch,
  SchemaLiveMatchStat,
  SchemaLiveMatchTeamStatistics,
  SchemaLiveMatchTimeline,
  SchemaMatchInfo,
} from "../types/fifa";

export enum MatchStatus {
  completed = 0,
  future_scheduled = 1,
  future_postponed = 7,
  future_delayed = 10,
  future_rescheduled = 13,
  in_progress = 3,
  abandoned = 4,
  cancelled = 8,
  forfeited = 9,
  interrupted = 11,
  line_ups = 12,
  suspended = 99,
}

export function getMatchStatus(status: MatchStatus): keyof typeof MatchStatus {
  return MatchStatus[status] as keyof typeof MatchStatus;
}

export enum MatchEventType {
  goal = 0,
  assist = 1,
  yellow_card = 2,
  red_card = 3,
  red_2_yellow = 4,
  substitution = 5,
  penalty = 6,
  start_time = 7,
  end_time = 8,
  pause_time = 9,
  resume_time = 10,
  suspension = 11,
  shot = 12,
  big_chance = 13,
  free_kick = 14,
  offside = 15,
  corner = 16,
  save = 17,
  foul = 18,
  toss_coin = 19,
  dribbling = 20,
  skill = 21,
  tackle = 22,
  dropped_ball = 23,
  throw_in = 24,
  clearance = 25,
  end_match = 26,
  aerial_duel = 27,
  ball_out = 28,
  punch = 29,
  claim = 30,
  time_out = 31,
  hit_bar = 32,
  hit_post = 33,
  own_goal = 34,
  penalty_shoot_out = 35,
  second_penalty = 36,
  hand_ball = 37,
  simulation = 38,
  goal_from_free_kick = 39,
  goal_from_indirect_kick = 40,
  goal_from_penalty = 41,
  goal_from_second_penalty = 42,
  goal_overhead = 43,
  hit_bar_from_free_kick = 44,
  hit_bar_from_indirect_kick = 45,
  hit_bar_from_penalty = 46,
  hit_bar_from_second_penalty = 47,
  hit_bar_overhead = 48,
  hit_post_from_free_kick = 49,
  hit_post_from_indirect_kick = 50,
  hit_post_from_penalty = 51,
  hit_post_from_second_penalty = 52,
  hit_post_overhead = 53,
  shot_from_indirect_kick = 54,
  shot_from_penalty = 55,
  shot_overhead = 56,
  save_by_goal_keeper = 57,
  save_from_free_kick = 58,
  save_from_indirect_kick = 59,
  save_from_penalty = 60,
  save_from_second_penalty = 61,
  save_overhead = 62,
  ball_out_from_free_kick = 63,
  ball_out_from_indirect_kick = 64,
  ball_out_from_penalty = 65,
  ball_out_from_second_penalty = 66,
  ball_out_overhead = 67,
  end_time_with_extra = 68,
  end_time_with_p_s_o = 69,
  start_match = 70,
  var_notification = 71,
  foul_causing_penalty = 72,
  referee_substitution = 75,
  video_support = 76,
  delay = 77,
  resume = 78,
  toss_coin_ball = 79,
  toss_coin_side = 80,
  toss_coin_first = 81,
  toss_coin_second = 82,
  delay_by_cooling = 83,
  delay_by_fuelling = 84,
  delay_by_weather = 85,
  delay_by_medical = 86,
  delay_by_support = 87,
  card = 1073,
  player_on = 1074,
  player_off = 1075,
  miss = 1076,
  attempt_saved = 1077,
  player_changed_jersey_number = 1078,
  temp_goal = 1079,
  temp_attempt = 1080,
  postponed = 1081,
  rescinded_card = 1082,
  temp_save = 1083,
  resumed_after_abandon = 1084,
  injury_time_announcement = 1085,
  delayed_start = 1086,
  early_end = 1087,
  deleted_after_review = 1088,
  coach_setup = 1089,
  unknown = 9999,
}

export function getMatchEventType(
  type: MatchEventType,
): keyof typeof MatchEventType {
  return MatchEventType[type] as keyof typeof MatchEventType;
}

export enum MatchPlayerPosition {
  GK = 0,
  D = 1,
  M = 2,
  F = 3,
  Unknown = 4,
  W = 5,
  P = 6,
  VAR = 7,
  Substitute = 8,
}

export function getMatchPlayerPosition(
  position: MatchPlayerPosition,
): keyof typeof MatchPlayerPosition {
  return MatchPlayerPosition[position] as keyof typeof MatchPlayerPosition;
}

export enum MatchOfficialRole {
  unknown = 0,
  main = 1,
  lineman1 = 2,
  lineman2 = 3,
  fourth_official = 4,
  video_assistant_referee = 5,
  reserve_referee = 6,
  offside_video_assistant_referee = 7,
  assistant_video_assistant_referee = 8,
  support_video_assistant_referee = 9,
  reserve_assistant_referee = 10,
  second_referee = 11,
  third_referee = 12,
  timekeeper = 13,
}

export function getMatchOfficialRole(
  role: MatchOfficialRole,
): keyof typeof MatchOfficialRole {
  return MatchOfficialRole[role] as keyof typeof MatchOfficialRole;
}

const optionalString = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);
const optionalNumber = z
  .number()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

export const MatchTeamSchema = z.object({
  country: optionalString,
  name: optionalString,
  goals: optionalNumber,
  penalties: optionalNumber,
});

export const MatchEventSchema = z.object({
  id: z.string(),
  type_of_event: z.string(),
  player: z.string(),
  time: z.string(),
  extra_info: z.object({}).passthrough().optional(),
});

export const MatchPlayerSchema = z.object({
  name: z.string(),
  shirt_number: optionalNumber,
  position: z.string(),
});

export const MatchLineupSchema = z.object({
  country: z.string(),
  tactics: z.string(),
  starting_eleven: z.array(MatchPlayerSchema),
  substitutes: z.array(MatchPlayerSchema),
});

export const MatchOfficialSchema = z.object({
  name: z.string(),
  role: z.string(),
  country: z.string(),
});

export const MatchTeamStatsSchema = z.object({
  country: z.string(),
  attempts_on_goal: z.number(),
  attempts_on_goal_against: z.number(),
  on_target: z.number(),
  off_target: z.number(),
  blocked: z.number(),
  corners: z.number(),
  offsides: z.number(),
  num_passes: z.number(),
  passes_completed: z.number(),
  tackles: z.number(),
  free_kicks: z.number(),
  goal_kicks: z.number(),
  penalties: z.number(),
  penalties_scored: z.number(),
  throw_ins: z.number(),
  yellow_cards: z.number(),
  red_cards: z.number(),
  fouls_committed: z.number(),
});

export const MatchDetailedTimeSchema = z.object({
  current_time: z.string(),
  first_half_time: z.string().nullable(),
  first_half_extra_time: z.string().nullable(),
  second_half_time: z.string().nullable(),
  second_half_extra_time: z.string().nullable(),
});

export const MatchWeatherSchema = z.object({
  humidity: z.number(),
  temp_celsius: z.number(),
  temp_farenheit: z.number(),
  wind_speed: z.number(),
  description: z.string(),
});

export const MatchSchema = z.object({
  id: optionalNumber,
  venue: optionalString,
  location: optionalString,
  status: optionalString,
  time: optionalString,
  attendance: optionalNumber,
  stage_name: optionalString,
  home_team_country: optionalString,
  away_team_country: optionalString,
  datetime: optionalString,
  winner: optionalString,
  winner_code: optionalString,
  home_team: MatchTeamSchema.optional(),
  away_team: MatchTeamSchema.optional(),
  last_checked_at: optionalString,
  last_changed_at: optionalString,
  weather: MatchWeatherSchema.optional(),
  detailed_time: MatchDetailedTimeSchema.optional(),
  officials: z.array(MatchOfficialSchema).optional(),
  home_team_events: z.array(MatchEventSchema).optional(),
  away_team_events: z.array(MatchEventSchema).optional(),
  home_team_lineup: MatchLineupSchema.optional(),
  away_team_lineup: MatchLineupSchema.optional(),
  home_team_statistics: MatchTeamStatsSchema.optional(),
  away_team_statistics: MatchTeamStatsSchema.optional(),
});

export type MatchTeam = z.infer<typeof MatchTeamSchema>;
export type MatchEvent = z.infer<typeof MatchEventSchema>;
export type MatchPlayer = z.infer<typeof MatchPlayerSchema>;
export type MatchLineup = z.infer<typeof MatchLineupSchema>;
export type MatchOfficial = z.infer<typeof MatchOfficialSchema>;
export type MatchTeamStats = z.infer<typeof MatchTeamStatsSchema>;
export type MatchDetailedTime = z.infer<typeof MatchDetailedTimeSchema>;
export type MatchWeather = z.infer<typeof MatchWeatherSchema>;
export type Match = z.infer<typeof MatchSchema>;

type LiveMatchPlayer = NonNullable<
  NonNullable<SchemaLiveMatch["HomeTeam"]>["Players"]
>[number];

type FifaWeather = {
  Humidity?: string | number | null;
  Temperature?: string | number | null;
  WindSpeed?: string | number | null;
  TypeLocalized?: { Description?: string }[];
};

type FifaOfficial = NonNullable<SchemaLiveMatch["Officials"]>[number];

type EnrichedCalendarMatch = SchemaMatchInfo & {
  Attendance?: string | number | null;
  Weather?: FifaWeather | null;
  Officials?: FifaOfficial[];
};

export interface MatchDetails {
  timeline?: SchemaLiveMatchTimeline;
  homeStats?: SchemaLiveMatchTeamStatistics | null;
  awayStats?: SchemaLiveMatchTeamStatistics | null;
}

export type LiveMatchDetails = MatchDetails;

function localizedName(value?: { Description?: string }[]) {
  return value?.[0]?.Description;
}

function statValue(
  stats: SchemaLiveMatchTeamStatistics | undefined | null,
  type: SchemaLiveMatchStat["Type"],
) {
  return stats?.Stats?.find((stat) => stat.Type === type)?.Value ?? 0;
}

function numberValue(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

// Period: 0=Unknown 1=Scheduled 2=PreMatch 3=First_Half 4=Half_Time
// 5=Second_Half 6=Extra_Time 7=Extra_First_Half 8=Extra_Half_Time
// 9=Extra_Second_Half 10=Full_Time 11=Penalty_Shootout 12=PostMatch
// 13=Abandoned 14=Third_Half 15=Break_Second_Half 16=Pre_Penalty_Shootout
// 17=Pre_Extra_Time
function matchTimeLabel(
  status: keyof typeof MatchStatus,
  matchTime: string | null | undefined,
  period?: number,
): string | undefined {
  if (status === "completed") return "full-time";

  switch (period) {
    case 4:
    case 8:
    case 15:
      return "half-time";
    case 10:
    case 12:
      return "full-time";
    case 13:
      return "abandoned";
    default:
      return matchTime || undefined;
  }
}

function weatherFromFifa(
  weather: FifaWeather | null | undefined,
): MatchWeather | undefined {
  const tempCelsius = numberValue(weather?.Temperature);
  const humidity = numberValue(weather?.Humidity);
  const windSpeed = numberValue(weather?.WindSpeed);
  const description = localizedName(weather?.TypeLocalized);

  if (
    tempCelsius == null &&
    humidity == null &&
    windSpeed == null &&
    !description
  ) {
    return undefined;
  }

  return {
    humidity: humidity ?? 0,
    temp_celsius: tempCelsius ?? 0,
    temp_farenheit:
      tempCelsius == null ? 0 : Math.round(tempCelsius * 1.8 + 32),
    wind_speed: windSpeed ?? 0,
    description: description || "Unknown",
  };
}

function structData<T>(struct: unknown): T {
  return (struct as { _data: T })._data;
}

export class MatchTeamStruct extends Struct(MatchTeamSchema) {
  static fromFifa(
    team: SchemaMatchInfo["Home"] | SchemaLiveMatch["HomeTeam"],
    placeholder: string | undefined,
    score: number | undefined,
    penalties: number | undefined,
  ): MatchTeam {
    return structData<MatchTeam>(
      new MatchTeamStruct({
        name:
          localizedName(team?.TeamName) || placeholder || "To Be Determined",
        country: team?.IdCountry || "TBD",
        goals: score,
        penalties,
      }),
    );
  }
}

export class MatchPlayerStruct extends Struct(MatchPlayerSchema) {
  static fromFifa(player: LiveMatchPlayer): MatchPlayer {
    return structData<MatchPlayer>(
      new MatchPlayerStruct({
        name: localizedName(player.PlayerName) || "",
        shirt_number: player.ShirtNumber,
        position: getMatchPlayerPosition(player.Position || 4),
      }),
    );
  }
}

export class MatchLineupStruct extends Struct(MatchLineupSchema) {
  static fromFifa(
    team: SchemaLiveMatch["HomeTeam"] | SchemaLiveMatch["AwayTeam"],
  ): MatchLineup {
    const players = team?.Players || [];

    return structData<MatchLineup>(
      new MatchLineupStruct({
        country: team?.IdCountry || "UNK",
        tactics: team?.Tactics || "",
        starting_eleven: players
          .filter((player) => player.Status === 1)
          .map(MatchPlayerStruct.fromFifa),
        substitutes: players
          .filter((player) => player.Status === 2)
          .map(MatchPlayerStruct.fromFifa),
      }),
    );
  }
}

export class MatchOfficialStruct extends Struct(MatchOfficialSchema) {
  static fromFifa(
    official: NonNullable<SchemaLiveMatch["Officials"]>[number],
  ): MatchOfficial {
    return structData<MatchOfficial>(
      new MatchOfficialStruct({
        name: localizedName(official.Name) || "Unknown",
        role: getMatchOfficialRole(official.OfficialType || 0),
        country: official.IdCountry || "UNK",
      }),
    );
  }
}

export class MatchEventStruct extends Struct(MatchEventSchema) {
  static fromFifa(
    event: NonNullable<SchemaLiveMatchTimeline["Event"]>[number],
  ): MatchEvent {
    return structData<MatchEvent>(
      new MatchEventStruct({
        id: event.EventId || "",
        type_of_event:
          localizedName(event.TypeLocalized) ||
          getMatchEventType(event.Type || 0),
        player:
          localizedName(event.EventDescription) || event.IdPlayer || "Unknown",
        time: event.MatchMinute || event.DateTimeUTC || "",
      }),
    );
  }
}

export class MatchTeamStatsStruct extends Struct(MatchTeamStatsSchema) {
  static fromFifa(
    country: string,
    stats: SchemaLiveMatchTeamStatistics | undefined | null,
    opponentStats: SchemaLiveMatchTeamStatistics | undefined | null,
  ): MatchTeamStats {
    return structData<MatchTeamStats>(
      new MatchTeamStatsStruct({
        country,
        attempts_on_goal: statValue(stats, 3),
        attempts_on_goal_against: statValue(opponentStats, 3),
        on_target: statValue(stats, 4),
        off_target: statValue(stats, 5),
        blocked: statValue(stats, 52),
        corners: statValue(stats, 12),
        offsides: statValue(stats, 13),
        num_passes: statValue(stats, 86),
        passes_completed: statValue(stats, 23),
        tackles: statValue(stats, 126),
        free_kicks: statValue(stats, 696),
        goal_kicks: statValue(stats, 158),
        penalties: statValue(stats, 44),
        penalties_scored: statValue(stats, 44),
        throw_ins: statValue(stats, 141),
        yellow_cards: statValue(stats, 21),
        red_cards: statValue(stats, 22),
        fouls_committed: statValue(stats, 20),
      }),
    );
  }
}

export class MatchStruct extends Struct(MatchSchema) {
  toJSON() {
    return (this as unknown as { _data: z.output<typeof MatchSchema> })._data;
  }

  static fromCalendar(
    match: SchemaMatchInfo,
    details: MatchDetails = {},
  ): Match {
    const calendarMatch = match as EnrichedCalendarMatch;
    const homeTeamId = match.Home?.IdTeam;
    const awayTeamId = match.Away?.IdTeam;
    const status = getMatchStatus(match.MatchStatus as MatchStatus);

    return structData<Match>(
      new MatchStruct({
        id: match.MatchNumber,
        venue: localizedName(match.Stadium?.Name),
        location: localizedName(match.Stadium?.CityName),
        status,
        time: matchTimeLabel(status, match.MatchTime),
        attendance:
          numberValue(calendarMatch.Attendance) ?? match.Stadium?.Capacity,
        stage_name: localizedName(match.StageName),
        home_team: MatchTeamStruct.fromFifa(
          match.Home,
          match.PlaceHolderA,
          match.HomeTeamScore,
          match.HomeTeamPenaltyScore,
        ),
        home_team_country: match.Home?.IdCountry,
        away_team: MatchTeamStruct.fromFifa(
          match.Away,
          match.PlaceHolderB,
          match.AwayTeamScore,
          match.AwayTeamPenaltyScore,
        ),
        away_team_country: match.Away?.IdCountry,
        datetime: match.Date,
        winner: match.Winner,
        winner_code: match.Winner,
        last_checked_at: new Date().toISOString(),
        last_changed_at: match.LastPeriodUpdate,
        weather: weatherFromFifa(calendarMatch.Weather),
        detailed_time: {
          current_time: String(match.MatchTime ?? ""),
          first_half_time:
            match.FirstHalfTime == null ? null : String(match.FirstHalfTime),
          first_half_extra_time:
            match.FirstHalfExtraTime == null
              ? null
              : String(match.FirstHalfExtraTime),
          second_half_time:
            match.SecondHalfTime == null ? null : String(match.SecondHalfTime),
          second_half_extra_time:
            match.SecondHalfExtraTime == null
              ? null
              : String(match.SecondHalfExtraTime),
        },
        officials: (calendarMatch.Officials || []).map(
          MatchOfficialStruct.fromFifa,
        ),
        home_team_events: (details.timeline?.Event || [])
          .filter((event) => event.IdTeam === homeTeamId)
          .map(MatchEventStruct.fromFifa),
        away_team_events: (details.timeline?.Event || [])
          .filter((event) => event.IdTeam === awayTeamId)
          .map(MatchEventStruct.fromFifa),
        ...(details.homeStats || details.awayStats
          ? {
              home_team_statistics: MatchTeamStatsStruct.fromFifa(
                match.Home?.IdCountry || "UNK",
                details.homeStats,
                details.awayStats,
              ),
              away_team_statistics: MatchTeamStatsStruct.fromFifa(
                match.Away?.IdCountry || "UNK",
                details.awayStats,
                details.homeStats,
              ),
            }
          : {}),
      }),
    );
  }

  static fromLive(
    match: SchemaLiveMatch,
    details: LiveMatchDetails = {},
  ): Match {
    const status = getMatchStatus(match.MatchStatus as MatchStatus);

    return structData<Match>(
      new MatchStruct({
        id: match.MatchNumber,
        venue: localizedName(match.Stadium?.Name),
        location: localizedName(match.Stadium?.CityName),
        status,
        time: matchTimeLabel(status, match.MatchTime, match.Period),
        attendance: numberValue(match.Attendance) ?? match.Stadium?.Capacity,
        stage_name: localizedName(match.StageName),
        home_team: MatchTeamStruct.fromFifa(
          match.HomeTeam,
          undefined,
          match.HomeTeam?.Goals?.length,
          match.HomeTeamPenaltyScore,
        ),
        home_team_country: match.HomeTeam?.IdCountry,
        away_team: MatchTeamStruct.fromFifa(
          match.AwayTeam,
          undefined,
          match.AwayTeam?.Goals?.length,
          match.AwayTeamPenaltyScore,
        ),
        away_team_country: match.AwayTeam?.IdCountry,
        datetime: match.Date,
        winner: match.Winner,
        winner_code: match.Winner,
        last_checked_at: new Date().toISOString(),
        last_changed_at: undefined,
        weather: weatherFromFifa(match.Weather),
        detailed_time: {
          current_time: String(match.MatchTime ?? ""),
          first_half_time:
            match.FirstHalfTime == null ? null : String(match.FirstHalfTime),
          first_half_extra_time:
            match.FirstHalfExtraTime == null
              ? null
              : String(match.FirstHalfExtraTime),
          second_half_time:
            match.SecondHalfTime == null ? null : String(match.SecondHalfTime),
          second_half_extra_time:
            match.SecondHalfExtraTime == null
              ? null
              : String(match.SecondHalfExtraTime),
        },
        officials: (match.Officials || []).map(MatchOfficialStruct.fromFifa),
        home_team_events: (details.timeline?.Event || [])
          .filter((event) => event.IdTeam === match.HomeTeam?.IdTeam)
          .map(MatchEventStruct.fromFifa),
        away_team_events: (details.timeline?.Event || [])
          .filter((event) => event.IdTeam === match.AwayTeam?.IdTeam)
          .map(MatchEventStruct.fromFifa),
        home_team_lineup: MatchLineupStruct.fromFifa(match.HomeTeam),
        away_team_lineup: MatchLineupStruct.fromFifa(match.AwayTeam),
        ...(details.homeStats || details.awayStats
          ? {
              home_team_statistics: MatchTeamStatsStruct.fromFifa(
                match.HomeTeam?.IdCountry || "UNK",
                details.homeStats,
                details.awayStats,
              ),
              away_team_statistics: MatchTeamStatsStruct.fromFifa(
                match.AwayTeam?.IdCountry || "UNK",
                details.awayStats,
                details.homeStats,
              ),
            }
          : {}),
      }),
    );
  }
}
