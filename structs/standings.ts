import Struct from "zod-struct";
import { z } from "zod";
import type { SchemaStanding } from "../types/fifa";

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

export const TeamSchema = z.object({
  country: optionalString,
  name: optionalString,
  group_letter: optionalString,
  group_points: optionalNumber,
  wins: optionalNumber,
  draws: optionalNumber,
  losses: optionalNumber,
  games_played: optionalNumber,
  goals_for: optionalNumber,
  goals_against: optionalNumber,
  goal_differential: optionalNumber,
});

export const GroupSchema = z.object({
  letter: z.string(),
  teams: z.array(TeamSchema),
});

export type Team = z.infer<typeof TeamSchema>;
export type Group = z.infer<typeof GroupSchema>;

function structData<T>(struct: unknown): T {
  return (struct as { _data: T })._data;
}

export class TeamStruct extends Struct(TeamSchema) {
  static fromFifa(standing: SchemaStanding, groupLetter: string): Team {
    return structData<Team>(
      new TeamStruct({
        country: standing.Team?.IdCountry,
        name: standing.Team?.Name[0].Description,
        group_letter: groupLetter,
        group_points: standing.Points,
        wins: standing.Won,
        draws: standing.Drawn,
        losses: standing.Lost,
        games_played: standing.Played,
        goal_differential: standing.GoalsDiference,
        goals_against: standing.Against,
        goals_for: standing.For,
      }),
    );
  }
}

function groupLetter(groupName: string): string {
  return (
    groupName.match(/Group\s+([A-Z0-9]+)$/i)?.[1] ??
    groupName.match(/^([A-Z0-9]+)$/i)?.[1] ??
    groupName.split(/\s+/).at(-1) ??
    ""
  ).toLowerCase();
}

export class GroupStruct extends Struct(GroupSchema) {
  static fromFifa(groupName: string, standings: SchemaStanding[]): Group {
    const letter = groupLetter(groupName);

    return structData<Group>(
      new GroupStruct({
        letter,
        teams: standings.map((standing) =>
          TeamStruct.fromFifa(standing, letter),
        ),
      }),
    );
  }
}
