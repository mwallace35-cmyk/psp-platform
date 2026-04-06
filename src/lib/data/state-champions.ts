// State championship data — combined from sport-specific files

export interface StateChampionship {
  slug: string;
  school: string;
  schoolSlug: string;
  sport: "football" | "basketball" | "baseball";
  year: number;
  classification: string;
  opponent: string;
  score: string;
  coach: string;
  coachLegendSlug?: string;
  venue: string;
  narrative: string;
  highlights: string[];
  seasonRecord?: string;
  gameByGame?: { opponent: string; result: "W" | "L"; score: string }[];
  sourceFile: string;
}

// Import from sport-specific files
import { FOOTBALL_CHAMPIONSHIPS } from "./state-champions-football";
import {
  BASKETBALL_CHAMPIONSHIPS,
  BASEBALL_CHAMPIONSHIPS,
} from "./state-champions-basketball";

export {
  FOOTBALL_CHAMPIONSHIPS,
  BASKETBALL_CHAMPIONSHIPS,
  BASEBALL_CHAMPIONSHIPS,
};

export const ALL_STATE_CHAMPIONSHIPS: StateChampionship[] = [
  ...FOOTBALL_CHAMPIONSHIPS,
  ...BASKETBALL_CHAMPIONSHIPS,
  ...BASEBALL_CHAMPIONSHIPS,
];
