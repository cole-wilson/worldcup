export interface TournamentConstants {
  baseURI: string;
  seasonID: number;
  competitionID: number;
  groupStage: number;
}

export const tournaments = {
  2026: {
    baseURI: "https://api.fifa.com/api/v3",
    seasonID: 285023,
    competitionID: 17,
    groupStage: 289273,
  },
} as const satisfies Record<number, TournamentConstants>;

export type TournamentYear = keyof typeof tournaments;

export function getTournamentConstants(year: string | number) {
  return tournaments[Number(year) as TournamentYear];
}
