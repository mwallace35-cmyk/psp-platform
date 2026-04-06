/**
 * State Championship Data — Basketball & Baseball
 * Extracted from Ted Silary archive HTML files (tedsilary.com)
 *
 * Each entry represents a PIAA state championship won by a Philadelphia-area school.
 * Box scores, narratives, and season results are sourced directly from the archive pages.
 */

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

// ─────────────────────────────────────────────────────────────────────────────
// BASKETBALL CHAMPIONSHIPS
// ─────────────────────────────────────────────────────────────────────────────

export const BASKETBALL_CHAMPIONSHIPS: StateChampionship[] = [
  // ── Neumann-Goretti 2012 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2012",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2012,
    classification: "Class AAA",
    opponent: "Montour",
    score: "48-45",
    coach: "Carl Arrigale",
    venue: "Bryce Jordan Center, Penn State",
    narrative: `On March 23, at Penn State's Bryce Jordan Center, Neumann-Goretti beat Montour, 48-45, to capture its third consecutive Class AAA state title. The Saints thus became the first Pennsylvania team to win three straight titles since Kennedy Christian swept four in Class A from 1998-2001. Ja'Quan Newton scored seven of his 17 points in the fourth quarter, Derrick Stewart totaled 11 points and five blocks and La'Quan Coaxum leaped to tip a last-second trey that could have forced OT.

**Title-Game Box Score: Neumann-Goretti 48, Montour 45**

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| John Davis | 3-6 | 5-7 | 8 | 0 | 2 | 11 | 0-0 | 1 | 1 |
| Derrick Stewart | 1-8 | 0-3 | 11 | 0 | 3 | 2 | 0-3 | 5 | 1 |
| Billy Shank | 3-7 | 2-2 | 0 | 0 | 0 | 10 | 2-5 | 0 | 1 |
| Hanif Sutton | 2-3 | 2-4 | 2 | 1 | 1 | 6 | 0-0 | 0 | 1 |
| Ja'Quan Newton | 6-11 | 5-12 | 2 | 2 | 3 | 17 | 0-0 | 1 | 0 |
| La'Quan Coaxum | 1-3 | 0-2 | 3 | 1 | 3 | 2 | 0-1 | 1 | 1 |
| **Totals** | **16-38** | **14-30** | **26** | **4** | **12** | **48** | **2-9** | **8** | **5** |

| MONTOUR | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Ryan Lewis | 2-7 | 2-4 | 8 | 0 | 5 | 6 | 0-0 | 1 | 0 |
| Devin Wilson | 4-8 | 3-4 | 9 | 7 | 2 | 7 | 0-0 | 0 | 2 |
| Kevin Scuilli | 4-7 | 0-0 | 0 | 0 | 2 | 12 | 4-7 | 0 | 0 |
| Dillon Buechel | 7-12 | 4-6 | 5 | 1 | 3 | 19 | 1-3 | 0 | 0 |
| Aaron Reed | 0-0 | 0-0 | 1 | 0 | 5 | 0 | 0-0 | 0 | 0 |
| Justin Hill | 0-0 | 0-0 | 0 | 0 | 0 | 0 | 0-0 | 0 | 0 |
| Tyler Haas | 0-4 | 1-2 | 2 | 0 | 1 | 1 | 0-2 | 0 | 0 |
| Robert Julian | 0-0 | 0-0 | 0 | 0 | 0 | 0 | 0-0 | 0 | 0 |
| **Totals** | **15-38** | **10-16** | **25** | **8** | **21** | **45** | **5-12** | **1** | **2** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Neumann-Goretti | 7 | 14 | 12 | 15 | 48 |
| Montour | 15 | 4 | 12 | 14 | 45 |

Officials: Pat Gebhart, Fred Artman, Mike Bergeron.`,
    highlights: [
      "Third consecutive Class AAA state title",
      "First PA team to win three straight since Kennedy Christian (1998-2001)",
      "Ja'Quan Newton: 17 points (7 in the 4th quarter)",
      "Derrick Stewart: 11 rebounds, 5 blocks",
      "La'Quan Coaxum tipped a last-second trey to preserve the win",
    ],
    seasonRecord: "28-3",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2012-state-playoffs.html",
  },

  // ── Neumann-Goretti 2014 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2014",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2014,
    classification: "Class AAA",
    opponent: "Susquehanna Township",
    score: "64-57 (OT)",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 21, at Hershey's Giant Center, Neumann-Goretti beat Susquehanna Township, 64-57, in OT, to capture its fourth Class AAA state title in five seasons (also 2010-12). One day after the passing of his mother, Lisa Brown, Ja'Quan Newton scored a career-high 33 points and claimed a team-high eight rebounds. His final career total (1,972) is the best in CL history. Troy Harper (12) and Lamarr "Fresh" Kimble (10) also scored in double figures for coach Carl Arrigale.

**Title-Game Box Score: Neumann-Goretti 64, Susquehanna Twp. 57 (OT)**

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Ja'Quan Newton | 11-19 | 6-8 | 8 | 0 | 1 | 33 | 5-9 | 1 | 2 |
| Lamarr Kimble | 3-9 | 4-7 | 5 | 2 | 3 | 10 | 0-2 | 0 | 1 |
| Troy Harper | 2-10 | 7-9 | 6 | 1 | 4 | 12 | 1-6 | 0 | 2 |
| Jamal Custis | 2-6 | 0-0 | 4 | 0 | 2 | 4 | 0-0 | 1 | 1 |
| Tony Toplyn | 2-3 | 1-2 | 6 | 0 | 4 | 5 | 0-0 | 2 | 0 |
| Vaughn Covington | 0-1 | 0-0 | 0 | 1 | 2 | 0 | 0-0 | 0 | 1 |
| Quade Green | 0-1 | 0-0 | 1 | 0 | 0 | 0 | 0-1 | 0 | 0 |
| **Totals** | **20-49** | **18-26** | **30** | **4** | **16** | **64** | **6-18** | **4** | **7** |

| SUSQUEHANNA TWP. | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Nehemiah Mack | 6-14 | 3-4 | 2 | 2 | 2 | 16 | 1-3 | 0 | 2 |
| Gabriel Mack | 4-13 | 2-4 | 7 | 2 | 3 | 11 | 1-4 | 0 | 0 |
| Joseph Marshall | 1-5 | 3-8 | 11 | 1 | 3 | 5 | 0-0 | 0 | 0 |
| Quintin Ward | 8-9 | 2-3 | 7 | 0 | 4 | 18 | 0-0 | 2 | 1 |
| Roman Letterlough | 0-2 | 0-0 | 6 | 0 | 3 | 0 | 0-0 | 0 | 0 |
| Takhi Turner | 2-6 | 0-0 | 3 | 0 | 4 | 5 | 1-3 | 0 | 0 |
| **Totals** | **21-49** | **12-21** | **35** | **5** | **22** | **57** | **3-10** | **2** | **3** |

| Team | 1 | 2 | 3 | 4 | OT | F |
|---|---|---|---|---|---|---|
| Neumann-Goretti | 12 | 14 | 21 | 6 | 11 | 64 |
| Susquehanna Twp. | 15 | 4 | 12 | 14 | 4 | 57 |

Officials: John Barley, Thomas Drennan, Justin Crum.`,
    highlights: [
      "Fourth Class AAA state title in five seasons",
      "Ja'Quan Newton: career-high 33 points, 8 rebounds -- one day after his mother's passing",
      "Newton's final career total (1,972 pts) is the best in Catholic League history",
      "Troy Harper: 12 points; Lamarr 'Fresh' Kimble: 10 points",
      "Overtime victory after trailing by 8 entering the 4th quarter comeback",
    ],
    seasonRecord: "27-4",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2014-state-playoffs.html",
  },

  // ── Neumann-Goretti 2015 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2015",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2015,
    classification: "Class AAA",
    opponent: "Archbishop Carroll",
    score: "69-67",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 20, at Hershey's Giant Center, Neumann-Goretti beat Archbishop Carroll, 69-67, to capture its fifth Class AAA state title in six seasons (except for '13). Zane Martin (26), Vaughn Covington (17), Quade Green (14) and Lamarr "Fresh" Kimble (10) all scored in double figures for coach Carl Arrigale.

**Title-Game Box Score: Neumann-Goretti 69, Carroll 67**

| ARCHBISHOP CARROLL | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Derrick Jones | 13-22 | 4-15 | 18 | 1 | 2 | 30 | 0-1 | 6 | 0 |
| Josh Sharkey | 6-18 | 0-1 | 10 | 5 | 4 | 13 | 1-2 | 1 | 2 |
| Ryan Daly | 2-11 | 5-7 | 13 | 0 | 3 | 9 | 0-4 | 0 | 0 |
| Dave Beatty | 4-13 | 1-2 | 3 | 1 | 4 | 11 | 2-4 | 1 | 0 |
| Samir Taylor | 2-4 | 0-0 | 4 | 1 | 5 | 4 | 0-1 | 1 | 1 |
| **Totals** | **27-68** | **10-25** | **48** | **9** | **23** | **67** | **3-12** | **9** | **3** |

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Dhamir Cosby-Roundtree | 1-1 | 0-0 | 7 | 1 | 5 | 2 | 0-0 | 1 | 1 |
| Vaughn Covington | 5-9 | 4-6 | 7 | 5 | 3 | 17 | 3-5 | 0 | 1 |
| Quade Green | 4-9 | 6-6 | 3 | 1 | 1 | 14 | 0-3 | 0 | 2 |
| Zane Martin | 8-18 | 8-9 | 6 | 0 | 2 | 26 | 2-5 | 0 | 0 |
| Lamarr Kimble | 3-15 | 3-8 | 3 | 3 | 2 | 10 | 1-7 | 1 | 1 |
| Rasheed Browne | 0-1 | 0-0 | 1 | 0 | 0 | 0 | 0-1 | 0 | 1 |
| Emil Moody | 0-0 | 0-0 | 3 | 0 | 5 | 0 | 0-0 | 0 | 0 |
| **Totals** | **21-53** | **21-29** | **30** | **10** | **18** | **69** | **6-21** | **2** | **6** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Archbishop Carroll | 14 | 13 | 9 | 31 | 67 |
| Neumann-Goretti | 9 | 15 | 19 | 26 | 69 |

Officials: Thomas Pauley, Brian Smith, Michael Bacon.`,
    highlights: [
      "Fifth Class AAA state title in six seasons",
      "Zane Martin led all scorers with 26 points",
      "Vaughn Covington: 17 points, 7 rebounds, 5 assists",
      "Quade Green: 14 points, 6-for-6 from the free throw line",
      "Rallied from 36-28 halftime deficit with a dominant second half",
    ],
    seasonRecord: "29-2",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2015-state-playoffs.html",
  },

  // ── Neumann-Goretti 2016 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2016",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2016,
    classification: "Class AAA",
    opponent: "Mars",
    score: "99-66",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 18, at Hershey's Giant Center, Neumann-Goretti beat Mars, 99-66, to capture its sixth Class AAA state title in seven seasons (except for '13). The 99 points broke the record for most points in a state final (94 by Elk Lake in 1977) and N-G became the first school in state history to twice win three consecutive crowns. Zane Martin (33), Quade Green (25), Rasheed Browne (18) and Vaughn Covington (11) all scored in double figures. Dhamir "DaDa" Cosby-Roundtree (nine) just missed.

**Title-Game Box Score: Neumann-Goretti 99, Mars 66**

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Quade Green | 8-14 | 5-5 | 9 | 8 | 3 | 25 | 4-7 | 0 | 2 |
| Zane Martin | 14-22 | 3-5 | 5 | 2 | 0 | 33 | 2-8 | 0 | 2 |
| Dhamir Cosby-Roundtree | 4-4 | 1-2 | 8 | 2 | 4 | 9 | 0-0 | 3 | 0 |
| Rasheed Browne | 8-14 | 0-1 | 7 | 7 | 4 | 18 | 2-5 | 1 | 1 |
| Vaughn Covington | 3-6 | 3-4 | 0 | 1 | 3 | 11 | 2-3 | 0 | 1 |
| Emil Moody | 0-0 | 0-0 | 2 | 1 | 2 | 0 | 0-0 | 1 | 1 |
| Noah Warren | 1-1 | 0-0 | 0 | 0 | 0 | 3 | 1-1 | 0 | 0 |
| **Totals** | **38-63** | **12-17** | **33** | **22** | **18** | **99** | **11-24** | **5** | **8** |

| MARS | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Aaron Gruber | 2-5 | 0-0 | 7 | 2 | 2 | 6 | 2-4 | 0 | 0 |
| John Castello | 10-20 | 0-1 | 7 | 0 | 1 | 21 | 1-2 | 1 | 0 |
| Steve Castello | 3-6 | 0-0 | 0 | 0 | 3 | 7 | 1-4 | 1 | 1 |
| Christian Schmitt | 0-6 | 2-3 | 6 | 6 | 4 | 2 | 0-4 | 0 | 0 |
| Robby Carmody | 7-15 | 5-7 | 6 | 2 | 4 | 20 | 1-3 | 0 | 0 |
| Alex Gruber | 4-7 | 1-2 | 2 | 0 | 2 | 10 | 1-1 | 0 | 0 |
| **Totals** | **26-65** | **8-14** | **31** | **13** | **18** | **66** | **6-21** | **2** | **3** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Neumann-Goretti | 29 | 24 | 17 | 29 | 99 |
| Mars | 23 | 10 | 17 | 16 | 66 |`,
    highlights: [
      "Sixth Class AAA state title in seven seasons",
      "99 points broke the all-time record for most in a state final (prev: 94, Elk Lake 1977)",
      "First school in state history to twice win three consecutive crowns",
      "Zane Martin: 33 points (14-22 FG); Quade Green: 25 pts, 9 reb, 8 ast",
      "Rasheed Browne: 18 points, 7 rebounds, 7 assists",
    ],
    seasonRecord: "27-4",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2016-state-playoffs.html",
  },

  // ── Neumann-Goretti 2017 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2017",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2017,
    classification: "Class AAA",
    opponent: "Lincoln Park",
    score: "89-58",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 23, at Hershey's Giant Center, Neumann-Goretti beat Lincoln Park, 89-58, to capture its seventh Class AAA state title in eight seasons and fourth in a row, thus tying the mark of Carlisle (1985-1988) and Kennedy Christian (1998-2001). Coach Carl Arrigale became just the second basketball coach in state history to win a seventh crown, joining Farrell's Ed McCluskey (seven at AAA, then the highest level, from 1952-72). Also, the championship was Carl's 25th in 37 chances over 19 seasons (Catholic/City/State). Quade Green (22), Dhamir "DaDa" Cosby-Roundtree (15), sub Christian Ings (13) and Mike Millsip (11) reached double figures in points and starter Noah Warren (nine) just missed.

**Title-Game Box Score: Neumann-Goretti 89, Lincoln Park 58**

| LINCOLN PARK | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Renell Cummings | 12-27 | 6-6 | 3 | 3 | 4 | 37 | 7-14 | 0 | 3 |
| Keeno Holmes | 1-11 | 2-2 | 8 | 2 | 2 | 4 | 0-3 | 0 | 3 |
| Evan Brown | 6-16 | 0-0 | 2 | 1 | 1 | 13 | 1-8 | 0 | 1 |
| **Totals** | **21-64** | **8-8** | **23** | **6** | **20** | **58** | **8-27** | **0** | **8** |

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Quade Green | 6-7 | 7-9 | 3 | 8 | 3 | 22 | 3-4 | 0 | 2 |
| Dhamir Cosby-Roundtree | 6-9 | 3-4 | 13 | 0 | 1 | 15 | 0-0 | 4 | 0 |
| Mike Millsip | 4-9 | 2-4 | 5 | 1 | 2 | 11 | 1-3 | 0 | 3 |
| Marcus Littles | 2-4 | 1-2 | 2 | 0 | 1 | 5 | 0-0 | 0 | 0 |
| Noah Warren | 3-5 | 0-0 | 1 | 3 | 1 | 9 | 3-4 | 0 | 1 |
| Christian Ings | 3-5 | 6-7 | 3 | 3 | 1 | 13 | 1-1 | 0 | 1 |
| Dymir Montague | 1-5 | 0-0 | 5 | 2 | 1 | 3 | 1-2 | 1 | 1 |
| Emil Moody | 2-2 | 3-5 | 5 | 0 | 1 | 7 | 0-0 | 0 | 0 |
| **Totals** | **28-55** | **24-36** | **45** | **17** | **12** | **89** | **9-16** | **5** | **8** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Lincoln Park | 9 | 10 | 16 | 23 | 58 |
| Neumann-Goretti | 17 | 25 | 25 | 22 | 89 |

Officials: Tim Lavan, Pat Cook, James Come.`,
    highlights: [
      "Seventh Class AAA state title in eight seasons; fourth consecutive",
      "Tied Carlisle (1985-88) and Kennedy Christian (1998-2001) with four straight crowns",
      "Carl Arrigale: second coach in state history with seven titles (joined Ed McCluskey)",
      "Quade Green: 22 pts, 8 ast (6-7 FG); Cosby-Roundtree: 15 pts, 13 reb, 4 blk",
      "25th championship for Arrigale in 37 chances over 19 seasons (CL/City/State)",
    ],
    seasonRecord: "24-7",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2017-state-playoffs.html",
  },

  // ── Neumann-Goretti 2018 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2018",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2018,
    classification: "Class 3A",
    opponent: "Richland",
    score: "57-42",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 28, at Hershey's Giant Center, Neumann-Goretti beat Richland, 57-42, to capture its eighth Class 3A state title in nine seasons and fifth in a row. Coach Carl Arrigale became the first basketball coach in state history to win five consecutive crowns. Also, the championship was Carl's 27th in 40 chances over 20 seasons (Catholic/City/State). Dymir Montague tied his career high with 23 points and shot 4-for-8 from beyond the arc. He also recorded five steals and four blocks and was the only Saint to score in double figures. Chris Ings (seven assists) and sub TaQuan Woodley (seven rebounds) were next with eight points apiece. Marcus Littles added four blocks.

**Title-Game Box Score: Neumann-Goretti 57, Richland 42**

| NEUMANN-GORETTI | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Christian Ings | 3-11 | 2-5 | 6 | 7 | 1 | 8 | 0-3 | 0 | 1 |
| Dymir Montague | 7-15 | 5-6 | 6 | 1 | 2 | 23 | 4-8 | 4 | 5 |
| Noah Warren | 2-7 | 0-0 | 2 | 3 | 0 | 5 | 1-5 | 1 | 1 |
| Ja'cor Smith | 1-5 | 0-0 | 4 | 2 | 1 | 2 | 0-2 | 0 | 1 |
| Marcus Littles | 3-3 | 0-0 | 6 | 0 | 0 | 6 | 0-0 | 4 | 1 |
| TaQuan Woodley | 3-4 | 2-4 | 7 | 0 | 3 | 8 | 0-0 | 2 | 1 |
| Hakim Byrd | 2-5 | 0-0 | 1 | 2 | 0 | 5 | 1-3 | 0 | 0 |
| **Totals** | **21-50** | **9-15** | **34** | **15** | **7** | **57** | **6-21** | **11** | **10** |

| RICHLAND | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Tyler Zimmerman | 7-16 | 0-2 | 3 | 1 | 4 | 16 | 2-5 | 3 | 3 |
| Caleb Burke | 1-8 | 3-4 | 3 | 3 | 4 | 5 | 0-2 | 0 | 0 |
| Tyler Paul | 0-4 | 0-0 | 3 | 1 | 1 | 0 | 0-4 | 0 | 0 |
| Trevy Hardison | 3-9 | 0-0 | 10 | 5 | 3 | 9 | 3-7 | 1 | 0 |
| Collin Instone | 5-9 | 2-5 | 7 | 0 | 0 | 12 | 0-0 | 0 | 0 |
| **Totals** | **16-49** | **5-11** | **34** | **11** | **14** | **42** | **5-20** | **4** | **4** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Neumann-Goretti | 18 | 13 | 14 | 12 | 57 |
| Richland | 13 | 8 | 8 | 13 | 42 |

Officials: Mark Weir, Larry Frisina, Tyler Nolan.`,
    highlights: [
      "Eighth state title in nine seasons; fifth consecutive -- a state record",
      "Carl Arrigale: first coach in state history to win five straight crowns",
      "Dymir Montague: 23 points (career high), 4-8 from three, 5 steals, 4 blocks",
      "Marcus Littles: 4 blocks; TaQuan Woodley: 7 rebounds off the bench",
      "27th championship for Arrigale in 40 chances over 20 seasons",
    ],
    seasonRecord: "23-6",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2018-state-playoffs.html",
  },

  // ── Neumann-Goretti 2022 ──────────────────────────────────────────────────
  {
    slug: "neumann-goretti-basketball-2022",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "basketball",
    year: 2022,
    classification: "Class 4A",
    opponent: "Quaker Valley",
    score: "93-68",
    coach: "Carl Arrigale",
    venue: "Giant Center, Hershey",
    narrative: `On March 24, at Hershey's Giant Center, Neumann-Goretti beat 27-0 Quaker Valley, 93-68, to capture its ninth state championship (the others were in Class 3A) and remain perfect in state finals. Coach Carl Arrigale, in his 24th season, raised his record in championship games to 33-6, counting the Catholic League (12-5), City Titles (12-1) and States (9-0). The CL became a PIAA member in the 2008-09 season. Aamir Hurst (four treys) scored 20 points, matching his combined total in the other four state playoff games, while classmate Masud Stewart added 10. They were just two of six double-digit scorers. The others: Robert Wright (16), Bruce Smith (14), Khaafiq Myers (12) and Sultan Adewale (10). Adewale added seven rebounds and five blocks while Wright distributed seven assists.

**Title-Game Box Score: Neumann-Goretti 93, Quaker Valley 68**
(compiled by Ed "Huck" Palmer)

| NEUM.-GOR. | # | MIN | FG-FGA | 3P-3PA | FT-FTA | OR | DR | TR | AS | ST | BK | TO | PF | PTS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Wright | 2 | 27 | 8-13 | 0-3 | 0-1 | 0 | 5 | 5 | 7 | 0 | 0 | 1 | 1 | 16 |
| Stewart | 4 | 29 | 4-7 | 2-4 | 0-0 | 2 | 2 | 4 | 3 | 0 | 1 | 2 | 4 | 10 |
| Adewale | 11 | 21 | 4-9 | 0-0 | 2-2 | 2 | 5 | 7 | 1 | 0 | 5 | 1 | 3 | 10 |
| Myers | 0 | 27 | 4-7 | 1-2 | 3-4 | 2 | 4 | 6 | 3 | 3 | 0 | 3 | 1 | 12 |
| Hurst | 3 | 24 | 7-9 | 4-6 | 2-3 | 1 | 2 | 3 | 2 | 2 | 1 | 1 | 4 | 20 |
| Williams | 12 | 7 | 2-3 | 1-2 | 0-0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 2 | 5 |
| Smith | 22 | 14 | 5-7 | 0-1 | 4-4 | 1 | 2 | 3 | 1 | 3 | 0 | 0 | 1 | 14 |
| Battle | 5 | 7 | 0-0 | 0-0 | 0-0 | 0 | 0 | 0 | 2 | 2 | 0 | 1 | 2 | 0 |
| **TOTALS** | | **160** | **37-59** | **8-18** | **11-14** | **8** | **21** | **29** | **21** | **13** | **7** | **9** | **18** | **93** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Neumann-Goretti | 27 | 14 | 28 | 24 | 93 |
| Quaker Valley | 23 | 4 | 17 | 24 | 68 |

Officials: Christopher Asdourian, Stephen Ockenhouse, Terrence Cobb.`,
    highlights: [
      "Ninth state championship overall; perfect 9-0 in state finals",
      "Six players scored in double figures: Hurst (20), Wright (16), Smith (14), Myers (12), Stewart (10), Adewale (10)",
      "Sultan Adewale: 7 rebounds, 5 blocks",
      "Robert Wright: 7 assists; team totaled 21 assists and 13 steals",
      "Arrigale's championship-game record rose to 33-6 (CL/City/State combined)",
    ],
    seasonRecord: "23-4",
    sourceFile: "basketball/schools/Neumann-Goretti/Neumann-Goretti-2022-state-playoffs.html",
  },

  // ── Roman Catholic 2015 ───────────────────────────────────────────────────
  {
    slug: "roman-catholic-basketball-2015",
    school: "Roman Catholic",
    schoolSlug: "roman-catholic",
    sport: "basketball",
    year: 2015,
    classification: "Class AAAA",
    opponent: "Martin Luther King",
    score: "62-45",
    coach: "Chris McNesby",
    venue: "Giant Center, Hershey",
    narrative: `On March 21, at Hershey's Giant Center, Roman beat King, 62-45, to capture District 12's first Class AAAA state title and conclude a 4-0 sweep. Gemil Holbrook drained three treys en route to 20 points, Tony Carr mixed six assists and three steals with 14 points and D'Andre Vilmar scored 10 points. Coach Chris McNesby's team forced King to miss 27 of its first 29 shots in the second half.

**Title-Game Box Score: Roman 62, King 45**

| ROMAN CATHOLIC | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Tony Carr | 4-5 | 4-4 | 5 | 6 | 1 | 14 | 2-3 | 0 | 3 |
| Nazeer Bostick | 1-1 | 5-12 | 6 | 3 | 3 | 7 | 0-0 | 1 | 0 |
| Gemil Holbrook | 6-12 | 5-8 | 2 | 1 | 1 | 20 | 3-6 | 0 | 0 |
| D'Andre Vilmar | 2-3 | 6-8 | 4 | 0 | 2 | 10 | 0-0 | 0 | 2 |
| Paul Newman | 0-0 | 1-2 | 4 | 1 | 3 | 1 | 0-0 | 1 | 1 |
| Manny Taylor | 3-4 | 2-6 | 6 | 1 | 4 | 8 | 0-0 | 0 | 0 |
| Dakquan Davis | 1-2 | 0-1 | 0 | 0 | 0 | 2 | 0-1 | 0 | 0 |
| **Totals** | **17-28** | **23-41** | **27** | **12** | **14** | **62** | **5-10** | **2** | **6** |

| MARTIN LUTHER KING | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Ladji Fofana | 3-9 | 0-0 | 5 | 0 | 5 | 6 | 0-2 | 0 | 0 |
| Sammy Foreman | 7-19 | 5-6 | 7 | 2 | 4 | 20 | 1-4 | 0 | 2 |
| Tyere Marshall | 0-4 | 2-2 | 4 | 0 | 4 | 2 | 0-0 | 0 | 0 |
| Tyheem Harmon | 3-8 | 1-2 | 1 | 2 | 0 | 10 | 3-7 | 0 | 0 |
| Jabri McCall | 0-9 | 2-2 | 3 | 2 | 2 | 2 | 0-3 | 0 | 2 |
| Nasir Bell | 1-5 | 0-0 | 3 | 1 | 3 | 3 | 1-2 | 0 | 0 |
| Rasool Samir | 1-1 | 0-0 | 3 | 0 | 5 | 2 | 0-0 | 0 | 0 |
| **Totals** | **15-55** | **10-12** | **26** | **7** | **25** | **45** | **5-18** | **0** | **4** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Roman Catholic | 14 | 16 | 14 | 18 | 62 |
| M.L. King | 11 | 18 | 4 | 12 | 45 |

Officials: Randy Pritzker, Kevin Clay, Barry Vaughn.`,
    highlights: [
      "District 12's first Class AAAA state title",
      "Gemil Holbrook: 20 points with 3 treys",
      "Tony Carr: 14 points, 6 assists, 3 steals",
      "Held King to 2-of-29 shooting to start the second half",
      "Completed a 4-0 state playoff sweep",
    ],
    seasonRecord: "29-2",
    sourceFile: "basketball/schools/Roman-Catholic/Roman-Catholic-2015-state-playoffs.html",
  },

  // ── Roman Catholic 2016 ───────────────────────────────────────────────────
  {
    slug: "roman-catholic-basketball-2016",
    school: "Roman Catholic",
    schoolSlug: "roman-catholic",
    sport: "basketball",
    year: 2016,
    classification: "Class AAAA",
    opponent: "Taylor Allderdice",
    score: "73-62",
    coach: "Chris McNesby",
    venue: "Giant Center, Hershey",
    narrative: `On March 19, at Hershey's Giant Center, Roman beat Allderdice, 73-62, to capture its second consecutive Class AAAA state title. Lamar Stevens wolfed down four of the Cahillites' seven dunks and shot 11-for-12 at the line en route to 27 points. Tony Carr mixed eight rebounds and five assists with 13 points while Nazeer Bostick had 15 points. All three had made commitments to Penn State. Coach Chris McNesby's team battled back from a shaky start (10-0 deficit, five turnovers) to claim a 33-30 lead by halftime. Roman's crowns have been the only two for District 12 in AAAA.

**Title-Game Box Score: Roman 73, Allderdice 62**

| TAYLOR ALLDERDICE | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Jordan Rawls | 2-3 | 0-0 | 3 | 1 | 5 | 5 | 1-1 | 0 | 1 |
| Tim Pugh | 0-1 | 0-0 | 2 | 0 | 3 | 0 | 0-0 | 1 | 1 |
| Ramon Creighton | 7-16 | 4-8 | 2 | 2 | 4 | 19 | 1-4 | 0 | 1 |
| Timothy Jackson | 4-12 | 0-0 | 4 | 2 | 1 | 9 | 1-5 | 0 | 1 |
| James Jackson | 9-17 | 0-0 | 6 | 4 | 3 | 21 | 3-7 | 1 | 3 |
| Jahi Ogbonna | 2-5 | 0-0 | 1 | 0 | 0 | 4 | 0-1 | 0 | 1 |
| Dajuan Dugger | 1-1 | 0-0 | 4 | 0 | 5 | 2 | 0-0 | 1 | 0 |
| Tyler Williams | 1-1 | 0-0 | 0 | 0 | 1 | 2 | 0-0 | 0 | 0 |
| **Totals** | **26-56** | **4-8** | **22** | **9** | **22** | **62** | **6-18** | **3** | **9** |

| ROMAN CATHOLIC | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Tony Carr | 3-10 | 6-8 | 8 | 5 | 4 | 13 | 1-5 | 0 | 2 |
| Nazeer Bostick | 5-11 | 5-7 | 5 | 3 | 2 | 15 | 0-1 | 2 | 1 |
| Lamar Stevens | 8-15 | 11-12 | 7 | 1 | 2 | 27 | 0-0 | 1 | 0 |
| D'Andre Vilmar | 1-3 | 2-5 | 4 | 5 | 1 | 4 | 0-0 | 0 | 0 |
| Paul Newman | 2-3 | 0-0 | 5 | 1 | 1 | 4 | 0-0 | 0 | 1 |
| Dakquan Davis | 3-5 | 0-0 | 1 | 0 | 1 | 8 | 2-3 | 0 | 0 |
| Mikeal Jones | 1-1 | 0-0 | 2 | 2 | 2 | 2 | 0-0 | 1 | 1 |
| **Totals** | **23-50** | **24-32** | **32** | **17** | **13** | **73** | **3-11** | **4** | **5** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Taylor Allderdice | 17 | 14 | 13 | 18 | 62 |
| Roman Catholic | 10 | 23 | 22 | 18 | 73 |`,
    highlights: [
      "Second consecutive Class AAAA state title",
      "Lamar Stevens: 27 points (11-12 FT), 4 dunks, 7 rebounds",
      "Tony Carr: 13 points, 8 rebounds, 5 assists",
      "Nazeer Bostick: 15 points -- all three committed to Penn State",
      "Battled back from a 10-0 deficit to lead 33-30 at halftime",
    ],
    seasonRecord: "27-4",
    sourceFile: "basketball/schools/Roman-Catholic/Roman-Catholic-2016-state-playoffs.html",
  },

  // ── Roman Catholic 2018 ───────────────────────────────────────────────────
  {
    slug: "roman-catholic-basketball-2018",
    school: "Roman Catholic",
    schoolSlug: "roman-catholic",
    sport: "basketball",
    year: 2018,
    classification: "Class 6A",
    opponent: "Abraham Lincoln",
    score: "92-80",
    coach: "Chris McNesby",
    venue: "Giant Center, Hershey",
    narrative: `On March 28, at Hershey's Giant Center, Roman beat Lincoln, 92-80, to capture its third state championship in four years. The Cahillites thus avenged a loss to Lincoln in the City Title. Seth Lundy (28), Hakim Hart (26) and Lynn Greer (20) all scored in the 20s. Lundy added nine rebounds and five assists. Hart shot 12-for-17 from the floor and his three-point play started Roman on a closing 10-0 run after the score stood at 82-80. Roman's crowns have been the only three for District 12 in the highest enrollment classification (previous two at 4A).

**Title-Game Box Score: Roman 92, Lincoln 80**

| ROMAN CATHOLIC | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Allen Betrand | 6-7 | 2-4 | 5 | 5 | 3 | 14 | 0-0 | 0 | 0 |
| Lynn Greer | 5-7 | 9-11 | 5 | 3 | 1 | 20 | 1-2 | 1 | 0 |
| Hakim Hart | 12-17 | 1-1 | 3 | 2 | 2 | 26 | 1-3 | 0 | 3 |
| Seth Lundy | 8-16 | 8-10 | 9 | 5 | 3 | 28 | 4-9 | 2 | 2 |
| John Kelly | 1-2 | 0-0 | 2 | 0 | 3 | 2 | 0-0 | 1 | 0 |
| Louie Wild | 1-4 | 0-0 | 4 | 1 | 1 | 2 | 0-2 | 0 | 2 |
| **Totals** | **33-53** | **20-26** | **28** | **16** | **13** | **92** | **6-16** | **4** | **7** |

| ABRAHAM LINCOLN | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Khalif Meares | 12-20 | 2-2 | 3 | 4 | 4 | 28 | 2-5 | 0 | 4 |
| Shakeir Morrison | 5-10 | 4-5 | 4 | 2 | 4 | 14 | 0-2 | 0 | 1 |
| Sanhei Day | 3-11 | 0-0 | 2 | 8 | 1 | 8 | 2-3 | 0 | 2 |
| Tyree Corbett | 2-6 | 2-2 | 7 | 0 | 3 | 6 | 0-0 | 0 | 1 |
| Jahi Randall | 2-6 | 0-0 | 2 | 0 | 4 | 4 | 0-1 | 1 | 1 |
| Emeul Charleston | 5-9 | 0-1 | 2 | 1 | 1 | 14 | 4-7 | 0 | 2 |
| Paul Lewis | 1-1 | 2-2 | 0 | 0 | 2 | 4 | 0-0 | 0 | 0 |
| Aseem Luckey | 1-3 | 0-0 | 4 | 0 | 2 | 2 | 0-0 | 1 | 0 |
| **Totals** | **31-67** | **10-12** | **26** | **15** | **21** | **80** | **8-18** | **2** | **11** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Roman Catholic | 18 | 18 | 23 | 33 | 92 |
| Abraham Lincoln | 18 | 18 | 22 | 22 | 80 |

Officials: John Loughran, Mark Horn, Paul McShane.`,
    highlights: [
      "Third state championship in four years",
      "Three players scored 20+: Lundy (28), Hart (26), Greer (20)",
      "Seth Lundy: 28 pts, 9 reb, 5 ast; Hakim Hart: 12-17 FG",
      "Hart's three-point play sparked a closing 10-0 run after 82-80 tie",
      "Avenged City Title loss to Lincoln; only District 12 team to win at highest classification",
    ],
    seasonRecord: "24-6",
    sourceFile: "basketball/schools/Roman-Catholic/Roman-Catholic-2018-state-playoffs.html",
  },

  // ── Roman Catholic 2022 ───────────────────────────────────────────────────
  {
    slug: "roman-catholic-basketball-2022",
    school: "Roman Catholic",
    schoolSlug: "roman-catholic",
    sport: "basketball",
    year: 2022,
    classification: "Class 6A",
    opponent: "Archbishop Wood",
    score: "77-65",
    coach: "Chris McNesby",
    venue: "Giant Center, Hershey",
    narrative: `On March 26, at Hershey's Giant Center, in a battle of Catholic League powers, Roman beat Archbishop Wood, 77-65, to win the Class 6A title and give the CL its third crown of the weekend (also Neumann-Goretti in 4A and Devon Prep in 3A). Coach Chris McNesby, back in charge after a five-year break, earned his third state championship (also 2015 and '16) and lifted his overall record to 192-60 over nine seasons. Daniel Skillings, at times powerful and at other times slinky, contributed 31 points, 12 rebounds, four assists and three blocks. He also nailed his last nine shots from the floor and his point total was two short of the CL record for state championship games. Xzayvier Brown added 16 points (8-for-8 at line) and 10 rebounds while sixth-man frosh Shareef Jackson (his dad, Marc, is a '93 Roman grad and former NBA player), mixed 11 points with 10 boards and five assists. For Wood, Justin Moore was terrific with 21 points and 10 assists.

**Title-Game Box Score: Roman 77, Archbishop Wood 65**
(compiled by Ed "Huck" Palmer)

| ROMAN | # | MIN | FG-FGA | 3P-3PA | FT-FTA | OR | DR | TR | AS | ST | BK | TO | PF | PTS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Skillings | 0 | 31 | 14-26 | 2-5 | 1-3 | 7 | 5 | 12 | 4 | 1 | 3 | 3 | 2 | 31 |
| Farmer | 3 | 27 | 5-9 | 2-4 | 0-0 | 3 | 2 | 5 | 7 | 3 | 1 | 0 | 2 | 12 |
| Brown, X. | 1 | 31 | 4-8 | 0-0 | 8-8 | 2 | 8 | 10 | 3 | 1 | 0 | 1 | 3 | 16 |
| Ojukwu | 11 | 30 | 2-6 | 1-3 | 2-7 | 0 | 1 | 1 | 2 | 1 | 0 | 0 | 4 | 7 |
| Brown, Q. | 4 | 11 | 0-4 | 0-1 | 0-0 | 0 | 0 | 0 | 2 | 0 | 0 | 1 | 1 | 0 |
| Jackson | 44 | 27 | 3-7 | 0-0 | 5-8 | 2 | 8 | 10 | 5 | 0 | 2 | 1 | 3 | 11 |
| **TOTALS** | | **160** | **28-60** | **5-13** | **16-26** | **14** | **24** | **38** | **23** | **6** | **6** | **6** | **15** | **77** |

| ARCH. WOOD | # | MIN | FG-FGA | 3P-3PA | FT-FTA | OR | DR | TR | AS | ST | BK | TO | PF | PTS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Moore | 1 | 30 | 6-11 | 3-8 | 6-7 | 0 | 2 | 2 | 10 | 2 | 0 | 2 | 4 | 21 |
| Laster | 4 | 28 | 1-5 | 0-2 | 4-5 | 0 | 3 | 3 | 2 | 0 | 1 | 1 | 0 | 6 |
| Howard | 20 | 17 | 1-4 | 0-0 | 0-0 | 1 | 1 | 2 | 0 | 0 | 4 | 0 | 2 | 2 |
| Allen | 5 | 24 | 5-14 | 0-1 | 0-1 | 3 | 4 | 7 | 0 | 0 | 0 | 0 | 5 | 10 |
| Knouse | 14 | 21 | 3-8 | 2-5 | 0-0 | 1 | 2 | 3 | 0 | 1 | 1 | 2 | 5 | 8 |
| Bethea | 10 | 22 | 6-10 | 2-3 | 1-1 | 0 | 6 | 6 | 3 | 1 | 2 | 2 | 3 | 15 |
| Reed | 2 | 11 | 1-2 | 0-0 | 1-2 | 1 | 2 | 3 | 1 | 2 | 0 | 1 | 2 | 3 |
| **TOTALS** | | **160** | **23-56** | **7-20** | **12-16** | **6** | **20** | **26** | **16** | **6** | **8** | **8** | **21** | **65** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Roman Catholic | 16 | 17 | 21 | 23 | 77 |
| Archbishop Wood | 19 | 11 | 12 | 23 | 65 |

Officials: Justin Stegall, James T. Carlin, James R. Smith.`,
    highlights: [
      "Catholic League swept three state titles that weekend (NG in 4A, Devon Prep in 3A, Roman in 6A)",
      "Daniel Skillings: 31 points (14-26 FG, nailed last 9 shots), 12 rebounds, 4 assists, 3 blocks",
      "Xzayvier Brown: 16 points (8-8 FT), 10 rebounds -- double-double",
      "Shareef Jackson (frosh, son of NBA's Marc Jackson): 11 pts, 10 reb, 5 ast off the bench",
      "McNesby's third state title; 192-60 overall record across nine seasons",
    ],
    seasonRecord: "24-4",
    sourceFile: "basketball/schools/Roman-Catholic/Roman-Catholic-2022-state-playoffs.html",
  },

  // ── Imhotep Charter 2012 ──────────────────────────────────────────────────
  {
    slug: "imhotep-charter-basketball-2012",
    school: "Imhotep Charter",
    schoolSlug: "imhotep-charter",
    sport: "basketball",
    year: 2012,
    classification: "Class AA",
    opponent: "Beaver Falls",
    score: "56-54 (OT)",
    coach: "Andre Noble",
    coachLegendSlug: "andre-noble",
    venue: "Bryce Jordan Center, Penn State",
    narrative: `On March 24, at Penn State's Bryce Jordan Center, Imhotep Charter beat Beaver Falls, 56-54, in overtime, to capture its third Class AA state title in four years (missed in 2010). Brandon Austin totaled 13 points, the same number of rebounds, four assists and three steals/blocks while Khyree Wooten scored 13 of his 15 points beyond halftime. Shakur NeSmith's steal and layup forced OT.

**Title-Game Box Score: Imhotep 56, Beaver Falls 54 (OT)**

| IMHOTEP CHARTER | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Brandon Austin | 6-11 | 0-2 | 13 | 4 | 4 | 13 | 1-2 | 3 | 3 |
| Khyree Wooten | 6-16 | 3-9 | 7 | 1 | 1 | 15 | 0-0 | 0 | 2 |
| Kamani Jordan | 2-9 | 2-4 | 4 | 1 | 1 | 7 | 1-2 | 0 | 0 |
| Shakur NeSmith | 3-5 | 2-4 | 5 | 2 | 3 | 8 | 0-0 | 0 | 1 |
| Nigel Grant | 4-4 | 1-2 | 7 | 1 | 2 | 9 | 0-0 | 0 | 1 |
| Devin Liggeons | 1-2 | 2-2 | 1 | 0 | 2 | 4 | 0-0 | 2 | 0 |
| **Totals** | **22-47** | **10-23** | **37** | **9** | **16** | **56** | **2-4** | **5** | **7** |

| BEAVER FALLS | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Royce Watson | 0-2 | 1-2 | 6 | 0 | 4 | 1 | 0-0 | 0 | 0 |
| Sheldon Jeter | 10-32 | 2-3 | 11 | 3 | 4 | 22 | 0-10 | 2 | 3 |
| Elijah Cottrill | 4-9 | 2-5 | 2 | 2 | 2 | 11 | 1-4 | 1 | 1 |
| Drew Cook | 5-14 | 1-1 | 3 | 1 | 2 | 11 | 0-2 | 0 | 1 |
| Kevin Cancel | 2-5 | 1-2 | 3 | 1 | 2 | 6 | 1-4 | 0 | 1 |
| Joe Wynn | 0-5 | 0-0 | 2 | 0 | 1 | 0 | 0-1 | 0 | 0 |
| Deyne Richardson | 1-2 | 1-5 | 7 | 1 | 4 | 3 | 0-0 | 0 | 3 |
| **Totals** | **22-69** | **8-18** | **34** | **8** | **21** | **54** | **2-21** | **3** | **9** |

| Team | 1 | 2 | 3 | 4 | OT | F |
|---|---|---|---|---|---|---|
| Imhotep Charter | 16 | 5 | 16 | 11 | 8 | 56 |
| Beaver Falls | 8 | 15 | 5 | 20 | 6 | 54 |

Officials: Matt Shaffer, Jim Elliott, Jeff Laboranti.`,
    highlights: [
      "Third Class AA state title in four years",
      "Brandon Austin: 13 points, 13 rebounds, 4 assists, 3 steals, 3 blocks",
      "Khyree Wooten: 15 points (13 in the second half)",
      "Shakur NeSmith's steal and layup forced overtime",
      "Overtime victory over Sheldon Jeter-led Beaver Falls (Jeter: 22 pts, 11 reb on 10-32 FG)",
    ],
    seasonRecord: "22-8",
    sourceFile: "basketball/schools/Imhotep-Charter/Imhotep-Charter-2012-state-playoffs.html",
  },

  // ── Imhotep Charter 2013 ──────────────────────────────────────────────────
  {
    slug: "imhotep-charter-basketball-2013",
    school: "Imhotep Charter",
    schoolSlug: "imhotep-charter",
    sport: "basketball",
    year: 2013,
    classification: "Class AAA",
    opponent: "Archbishop Carroll",
    score: "54-45",
    coach: "Andre Noble",
    coachLegendSlug: "andre-noble",
    venue: "Giant Center, Hershey",
    narrative: `On March 22, at Hershey's Giant Center, Imhotep Charter beat Archbishop Carroll, 54-45, to capture its first Class AAA state title and fourth total in five years (others in AA; missed in 2010). Brandon Austin totaled 25 points, eight rebounds and three assists and evenly combined with sub Jakwan Jones to go 8-for-8 at the line in the final 59 seconds.

**Title-Game Box Score: Imhotep 54, Carroll 45**

| ARCHBISHOP CARROLL | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Yosef Yacob | 5-14 | 0-1 | 2 | 4 | 3 | 10 | 0-4 | 0 | 0 |
| Derrick Jones | 4-11 | 4-5 | 11 | 0 | 4 | 13 | 1-2 | 3 | 0 |
| Nick Jones | 1-8 | 2-2 | 4 | 3 | 2 | 4 | 0-5 | 0 | 1 |
| Ernest Aflakpui | 5-10 | 3-6 | 12 | 0 | 3 | 13 | 0-0 | 1 | 0 |
| Joe Mostardi | 1-11 | 0-0 | 5 | 0 | 3 | 2 | 0-7 | 0 | 0 |
| Armand Sorrentino | 1-2 | 0-0 | 0 | 0 | 0 | 3 | 1-1 | 0 | 1 |
| **Totals** | **17-56** | **9-14** | **34** | **7** | **15** | **45** | **2-19** | **4** | **2** |

| IMHOTEP CHARTER | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Brandon Austin | 9-15 | 6-6 | 8 | 3 | 1 | 25 | 1-3 | 2 | 1 |
| Abraham Massaley | 3-15 | 3-4 | 5 | 0 | 2 | 9 | 0-3 | 0 | 1 |
| Dymir Logan | 2-2 | 0-2 | 6 | 0 | 2 | 4 | 0-0 | 2 | 1 |
| Deryl Bagwell | 1-5 | 0-0 | 2 | 0 | 1 | 2 | 0-1 | 0 | 0 |
| Basil Thompson | 1-10 | 0-1 | 6 | 2 | 1 | 2 | 0-0 | 0 | 1 |
| Jalil Myers | 1-3 | 0-0 | 1 | 0 | 2 | 2 | 0-0 | 0 | 0 |
| Nigel Grant | 2-4 | 0-0 | 5 | 0 | 1 | 4 | 0-0 | 0 | 0 |
| Deion Evans | 1-1 | 0-0 | 2 | 0 | 2 | 2 | 0-0 | 0 | 0 |
| Jakwan Jones | 0-2 | 4-4 | 1 | 0 | 1 | 4 | 0-1 | 0 | 0 |
| **Totals** | **20-57** | **13-17** | **36** | **5** | **14** | **54** | **1-8** | **4** | **4** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Archbishop Carroll | 13 | 13 | 9 | 10 | 45 |
| Imhotep Charter | 8 | 18 | 14 | 14 | 54 |

Officials: Joe Anhalt, Ben Moore, Lee Page.`,
    highlights: [
      "First Class AAA state title; fourth overall in five years",
      "Brandon Austin: 25 points (9-15 FG), 8 rebounds, 3 assists",
      "Austin and Jakwan Jones combined to go 8-for-8 at the line in the final 59 seconds",
      "Held Carroll to 17-56 FG (30.4%) and 2-19 from three",
      "Only 2 turnovers for Imhotep in the entire game",
    ],
    seasonRecord: "28-5",
    sourceFile: "basketball/schools/Imhotep-Charter/Imhotep-Charter-2013-state-playoffs.html",
  },

  // ── Devon Prep 2022 ───────────────────────────────────────────────────────
  {
    slug: "devon-prep-basketball-2022",
    school: "Devon Prep",
    schoolSlug: "devon-prep",
    sport: "basketball",
    year: 2022,
    classification: "Class 3A",
    opponent: "Aliquippa",
    score: "76-58",
    coach: "Jason Fisher",
    venue: "Giant Center, Hershey",
    narrative: `On March 26, at Hershey's Giant Center, Devon Prep, a Catholic League member for just the fourth school year, swept past Aliquippa, 76-58, to capture the Class 3A state championship. All starters scored in double figures for coach Jason Fisher's squad. Lucas Orchard was tops with 17, followed by Jacen Holloway (16), Argel "IV" Pettit (15), Allen Cieslak and Ty Mishock (13 apiece). Holloway claimed 10 rebounds for the Tide, which shot 26-for-50 from the floor. A 25-0 run left a 34-34 tie waaaaay behind.

**Title-Game Box Score: Devon Prep 76, Aliquippa 58**
(compiled by Ed "Huck" Palmer)

| DEVON PREP | # | MIN | FG-FGA | 3P-3PA | FT-FTA | OR | DR | TR | AS | ST | BK | TO | PF | PTS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pettit | 2 | 31 | 4-12 | 4-9 | 3-4 | 2 | 5 | 7 | 1 | 1 | 0 | 3 | 2 | 15 |
| Orchard | 4 | 31 | 6-9 | 3-4 | 2-2 | 0 | 4 | 4 | 5 | 0 | 1 | 2 | 2 | 17 |
| Holloway | 10 | 31 | 7-11 | 1-3 | 1-2 | 2 | 10 | 12 | 2 | 1 | 2 | 4 | 2 | 16 |
| Cieslak | 3 | 29 | 3-10 | 2-5 | 5-6 | 0 | 1 | 1 | 4 | 2 | 0 | 0 | 1 | 13 |
| Mishock | 22 | 28 | 5-7 | 0-1 | 3-5 | 1 | 1 | 2 | 6 | 3 | 0 | 2 | 3 | 13 |
| Kenney | 5 | 4 | 1-1 | 0-0 | 0-0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |
| **TOTALS** | | **160** | **26-50** | **10-22** | **14-21** | **5** | **24** | **29** | **18** | **7** | **3** | **12** | **11** | **76** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Devon Prep | 24 | 19 | 21 | 12 | 76 |
| Aliquippa | 19 | 15 | 13 | 11 | 58 |

Officials: Roddy E. Hartle, James Grumley, Kevin M. Doverspike.`,
    highlights: [
      "State championship in only Devon Prep's fourth year as a Catholic League member",
      "All five starters in double figures: Orchard (17), Holloway (16), Pettit (15), Cieslak (13), Mishock (13)",
      "Jacen Holloway: 16 points and 10 rebounds -- double-double",
      "Team shot 26-for-50 (52.0%) from the floor",
      "A 25-0 run blew open a 34-34 tie",
    ],
    seasonRecord: "19-8",
    sourceFile: "basketball/schools/Devon-Prep/Devon-Prep-2022-state-playoffs.html",
  },

  // ── Conwell-Egan 2015 ─────────────────────────────────────────────────────
  {
    slug: "conwell-egan-basketball-2015",
    school: "Conwell-Egan Catholic",
    schoolSlug: "conwell-egan-catholic",
    sport: "basketball",
    year: 2015,
    classification: "Class AA",
    opponent: "Aliquippa",
    score: "62-51",
    coach: "Frank Sciolla",
    venue: "Giant Center, Hershey",
    narrative: `On March 21, at Hershey's Giant Center, Conwell-Egan beat 29-0 Aliquippa, 62-51, to capture the Class AA state title. Prior to this campaign, C-E (nee Egan) owned just one postseason win -- a Catholic League semifinal in its first season of membership in 1963-64. LaPri McCray-Pace had 22 points, eight rebounds and four assists for second-year coach Frank Sciolla. Stevie Jordan added 21 points and Chase Kumor (14) hit three treys.

**Title-Game Box Score: Conwell-Egan 62, Aliquippa 51**

| ALIQUIPPA | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Charles Humphries | 3-12 | 0-0 | 11 | 0 | 4 | 6 | 0-0 | 1 | 0 |
| Kaezon Pugh | 1-6 | 3-4 | 8 | 0 | 3 | 5 | 0-0 | 0 | 3 |
| Darrien Fields | 2-4 | 0-0 | 6 | 3 | 2 | 5 | 1-1 | 0 | 1 |
| Jassir Jordan | 4-13 | 2-4 | 0 | 0 | 5 | 13 | 3-8 | 0 | 0 |
| Stephon McGinnis | 7-22 | 0-0 | 7 | 3 | 3 | 17 | 3-13 | 0 | 3 |
| Sheldon Jeter | 2-6 | 0-0 | 2 | 1 | 4 | 5 | 1-4 | 0 | 1 |
| **Totals** | **19-63** | **5-8** | **35** | **9** | **24** | **51** | **8-26** | **1** | **8** |

| CONWELL-EGAN | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Chase Kumor | 4-9 | 3-3 | 5 | 1 | 1 | 14 | 3-5 | 0 | 0 |
| Sean Kelly | 0-6 | 1-2 | 8 | 0 | 2 | 1 | 0-5 | 2 | 1 |
| Vinny Dalessandro | 1-4 | 0-0 | 5 | 0 | 4 | 2 | 0-0 | 2 | 0 |
| LaPri McCray-Pace | 4-10 | 14-18 | 8 | 4 | 0 | 22 | 0-1 | 0 | 1 |
| Stevie Jordan | 5-8 | 10-12 | 4 | 2 | 2 | 21 | 1-4 | 0 | 1 |
| Jordan Burney | 1-2 | 0-0 | 2 | 0 | 1 | 2 | 0-0 | 1 | 1 |
| **Totals** | **15-39** | **28-35** | **33** | **7** | **11** | **62** | **4-15** | **5** | **5** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Aliquippa | 8 | 7 | 20 | 16 | 51 |
| Conwell-Egan | 12 | 19 | 8 | 23 | 62 |

Officials: James Gross, Gerard Byron, Joe DiMaggio.`,
    highlights: [
      "First state title in school history -- prior to this season, C-E had just one postseason win ever",
      "Knocked off previously undefeated (29-0) Aliquippa",
      "LaPri McCray-Pace: 22 points (14-18 FT), 8 rebounds, 4 assists",
      "Stevie Jordan: 21 points (10-12 FT); Chase Kumor: 14 points with 3 treys",
      "Won at the free throw line: 28-for-35 (80%) vs. Aliquippa's 5-for-8",
    ],
    seasonRecord: "21-8",
    sourceFile: "basketball/schools/Conwell-Egan/Conwell-Egan-2015-state-playoffs.html",
  },

  // ── Archbishop Wood 2017 ──────────────────────────────────────────────────
  {
    slug: "archbishop-wood-basketball-2017",
    school: "Archbishop Wood",
    schoolSlug: "archbishop-wood",
    sport: "basketball",
    year: 2017,
    classification: "Class 5A",
    opponent: "Meadville",
    score: "73-40",
    coach: "John Mosco",
    venue: "Giant Center, Hershey",
    narrative: `On March 24, at Hershey's Giant Center, Wood beat Meadville, 73-40, to capture the Class 5A state title and complete a Catholic/City/State sweep. The championships were its first in 51 seasons of CL competition. Also, the Vikings enabled their school to pull off the very rare feat of winning football/basketball state titles in the same academic year. Collin Gillespie came close to a triple double with 15 points, 10 rebounds and eight assists. Thanks to five treys, Tyree Pickron totaled 18 points. Seth Pinkney (11) and sub Andrew Funk (10) also reached double digits for coach John Mosco and Pinkney added 11 rebounds, four blocks.

**Title-Game Box Score: Archbishop Wood 73, Meadville 40**

| ARCHBISHOP WOOD | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Collin Gillespie | 6-17 | 0-0 | 10 | 8 | 2 | 15 | 3-8 | 0 | 2 |
| Tyree Pickron | 6-13 | 1-2 | 5 | 1 | 1 | 18 | 5-9 | 0 | 1 |
| Matt Cerruti | 3-7 | 0-0 | 0 | 3 | 3 | 7 | 1-2 | 0 | 1 |
| Seth Pinkney | 5-8 | 1-2 | 11 | 0 | 2 | 11 | 0-0 | 4 | 2 |
| Keith Otto | 0-4 | 2-2 | 4 | 3 | 1 | 2 | 0-1 | 0 | 1 |
| Andrew Funk | 4-7 | 0-0 | 4 | 1 | 1 | 10 | 2-4 | 0 | 0 |
| Karrington Wallace | 2-2 | 0-0 | 3 | 0 | 0 | 4 | 0-0 | 3 | 0 |
| Julius Phillips | 3-4 | 0-0 | 7 | 0 | 1 | 6 | 0-0 | 0 | 0 |
| **Totals** | **29-71** | **4-6** | **46** | **16** | **13** | **73** | **11-26** | **7** | **7** |

| MEADVILLE | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Lason Lindsey | 4-7 | 1-2 | 6 | 0 | 1 | 9 | 0-1 | 0 | 0 |
| Armoni Foster | 6-26 | 2-3 | 9 | 2 | 2 | 17 | 3-9 | 3 | 3 |
| Journey Brown | 0-2 | 0-0 | 5 | 1 | 2 | 0 | 0-0 | 0 | 1 |
| Simeal Wofford | 3-12 | 6-8 | 6 | 2 | 1 | 14 | 2-7 | 0 | 1 |
| **Totals** | **13-59** | **9-13** | **35** | **5** | **7** | **40** | **5-23** | **3** | **5** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Archbishop Wood | 17 | 23 | 18 | 15 | 73 |
| Meadville | 5 | 16 | 8 | 11 | 40 |

Officials: John Eyster, Phil Miller, Drew Proctor.`,
    highlights: [
      "First basketball championship in 51 seasons of Catholic League competition",
      "Completed Catholic/City/State triple crown sweep",
      "School won both football and basketball state titles in the same academic year",
      "Collin Gillespie: near triple-double with 15 pts, 10 reb, 8 ast (Catholic MVP)",
      "Tyree Pickron: 18 points (5 treys); Seth Pinkney: 11 pts, 11 reb, 4 blk",
    ],
    seasonRecord: "28-3",
    sourceFile: "basketball/schools/Archbishop-Wood/Archbishop-Wood-2017-state-playoffs.html",
  },

  // ── Roberts Vaux 2013 ─────────────────────────────────────────────────────
  {
    slug: "vaux-basketball-2013",
    school: "Roberts Vaux",
    schoolSlug: "vaux-big-picture",
    sport: "basketball",
    year: 2013,
    classification: "Class A",
    opponent: "Johnsonburg",
    score: "83-63",
    coach: "Jamie Ross",
    venue: "Giant Center, Hershey",
    narrative: `On March 22, at Hershey's Giant Center, Roberts Vaux beat Johnsonburg, 83-63, to capture the Class A state title in its seventh and final season. Rysheed Jordan (32, 14-for-20 floor) and Sammy Foreman (22) led the scoring parade and Trayvond Massenburg mixed eight rebounds with four blocks.

**Title-Game Box Score: Vaux 83, Johnsonburg 63**

| ROBERTS VAUX | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Rysheed Jordan | 14-20 | 4-6 | 6 | 4 | 1 | 32 | 0-4 | 1 | 5 |
| Sammy Foreman | 7-12 | 6-9 | 2 | 6 | 3 | 22 | 2-4 | 0 | 5 |
| Amir Butler | 3-6 | 3-4 | 6 | 0 | 3 | 9 | 0-1 | 4 | 2 |
| Trayvond Massenburg | 3-5 | 0-0 | 8 | 0 | 2 | 6 | 0-0 | 0 | 1 |
| Daron Johnson | 1-3 | 2-2 | 2 | 0 | 1 | 5 | 1-3 | 0 | 0 |
| Lestor Mattox | 0-5 | 0-0 | 2 | 0 | 4 | 0 | 0-2 | 0 | 2 |
| Karon Snead | 1-2 | 0-0 | 2 | 2 | 3 | 2 | 0-0 | 0 | 1 |
| Khalief Tinley | 2-4 | 0-0 | 3 | 1 | 4 | 5 | 1-1 | 0 | 2 |
| Gregory Edwards | 0-0 | 2-2 | 0 | 0 | 0 | 2 | 0-0 | 0 | 0 |
| **Totals** | **31-57** | **17-23** | **31** | **13** | **21** | **83** | **4-15** | **5** | **18** |

| JOHNSONBURG | FG | FT | R | A | P | Pts | 3's | B | S |
|---|---|---|---|---|---|---|---|---|---|
| Cameron Grumley | 6-16 | 2-2 | 5 | 4 | 4 | 17 | 3-11 | 1 | 2 |
| Quinn Luhr | 3-5 | 1-2 | 5 | 4 | 1 | 8 | 1-3 | 0 | 2 |
| Cole Peterson | 3-7 | 4-5 | 3 | 3 | 5 | 11 | 1-3 | 0 | 1 |
| Mitch Holmberg | 1-5 | 6-7 | 2 | 1 | 1 | 8 | 0-3 | 1 | 4 |
| Frank Kocjancic | 5-8 | 1-1 | 5 | 0 | 3 | 11 | 0-0 | 0 | 0 |
| Kyle Sheldon | 2-5 | 3-4 | 0 | 0 | 1 | 8 | 1-2 | 0 | 0 |
| **Totals** | **20-46** | **17-21** | **20** | **12** | **15** | **63** | **6-22** | **2** | **9** |

| Team | 1 | 2 | 3 | 4 | F |
|---|---|---|---|---|---|
| Roberts Vaux | 23 | 13 | 25 | 22 | 83 |
| Johnsonburg | 14 | 23 | 13 | 13 | 63 |

Officials: Bradley Yiengst, Bob Porambo, Brent Lawson.`,
    highlights: [
      "Class A state title in Vaux's seventh and final season as a school",
      "Rysheed Jordan: 32 points on 14-for-20 shooting, 6 rebounds, 4 assists, 5 steals",
      "Sammy Foreman: 22 points, 6 assists, 5 steals",
      "Team recorded 18 steals and forced 18 Johnsonburg turnovers",
      "Trayvond Massenburg: 8 rebounds, 4 blocks off just 5 field goal attempts",
    ],
    seasonRecord: "24-8",
    sourceFile: "basketball/schools/Vaux-HS/Vaux-HS-2013-state-playoffs.html",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BASEBALL CHAMPIONSHIPS
// ─────────────────────────────────────────────────────────────────────────────

export const BASEBALL_CHAMPIONSHIPS: StateChampionship[] = [
  // ── Neumann-Goretti Baseball 2016 ─────────────────────────────────────────
  {
    slug: "neumann-goretti-baseball-2016",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "baseball",
    year: 2016,
    classification: "Class AA",
    opponent: "Bishop McCort",
    score: "3-0",
    coach: "Kevin Schneider",
    venue: "Medlar Field at Lubrano Park, Penn State",
    narrative: `On June 16, at Penn State's Medlar Field at Lubrano Park, Neumann-Goretti beat Bishop McCort, of Johnstown, 3-0, to claim its first state baseball title. Ethan "E" Pritchett pitched a three-hitter with eight strikeouts and Brian Verratti, after scoring a run in the first inning (walk, sac, SB/E-2 combo), smacked a two-run triple to right-center in the fifth.

**Title-Game Box Score: Neumann-Goretti 3, Bishop McCort 0**

| NEUM.-GOR. | AB | R | H | BI |
|---|---|---|---|---|
| Brian Verratti cf | 1 | 1 | 1 | 2 |
| Colin Eiser rf | 3 | 0 | 1 | 0 |
| Nicky D'Amore 3b | 4 | 0 | 0 | 0 |
| Jared Healey ss | 3 | 0 | 0 | 0 |
| Aidan Baur 2b | 1 | 0 | 0 | 0 |
| Lou Testa 1b | 3 | 0 | 0 | 0 |
| Joe LaFiora dh | 3 | 0 | 1 | 0 |
| Steve Pizza pr | 0 | 1 | 0 | 0 |
| RJ McGettigan lf | 3 | 0 | 2 | 0 |
| Anth. Pierandozzi pr | 0 | 1 | 0 | 0 |
| Ethan Pritchett p | 2 | 0 | 0 | 0 |
| **Totals** | **23** | **3** | **5** | **2** |

| BISHOP McCORT | AB | R | H | BI |
|---|---|---|---|---|
| Boston Bradley 1b | 3 | 0 | 1 | 0 |
| Logan Wade c | 4 | 0 | 0 | 0 |
| Blake Wade ss | 2 | 0 | 0 | 0 |
| Bryce Kramer dh | 2 | 0 | 0 | 0 |
| Ian Fleck 2b | 3 | 0 | 2 | 0 |
| Zef Leech rf | 1 | 0 | 0 | 0 |
| Chris Miller lf | 2 | 0 | 0 | 0 |
| Brenden Lavely 3b | 2 | 0 | 0 | 0 |
| Logan Kasper cf | 3 | 0 | 0 | 0 |
| **Totals** | **21** | **0** | **3** | **0** |

| Team | 1 | 2 | 3 | 4 | 5 | 6 | 7 | F |
|---|---|---|---|---|---|---|---|---|
| Neumann-Goretti | 1 | 0 | 0 | 0 | 2 | 0 | 0 | 3 |
| Bishop McCort | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

| PITCHING | IP | H | R | ER | BB | SO |
|---|---|---|---|---|---|---|
| Ethan Pritchett (W) | 7 | 3 | 0 | 0 | 5 | 8 |
| Billy Wilson (L) | 4.1 | 4 | 3 | 2 | 3 | 1 |
| Nick Beblar | 2.3 | 1 | 0 | 0 | 0 | 1 |

E: L. Wade. DP: McCort. 3B: Verratti. SB: Verratti 3, Bradley. T: 2:14 (rain delay of 1:48 before home 4th).`,
    highlights: [
      "First state baseball title in school history",
      "Ethan Pritchett: complete-game 3-hitter, 8 strikeouts, 0 runs",
      "Brian Verratti: 2-run triple in the 5th, 3 stolen bases, scored a run",
      "Game delayed 1:48 by rain before the bottom of the 4th",
      "Postseason pitching staff ERA: 0.63 across 56 innings (8 games)",
    ],
    seasonRecord: "20-6",
    sourceFile: "baseball/schools/Neumann-Goretti/Neumann-Goretti-2016-state-playoffs_archive.html",
  },

  // ── Neumann-Goretti Baseball 2017 ─────────────────────────────────────────
  {
    slug: "neumann-goretti-baseball-2017",
    school: "Neumann-Goretti",
    schoolSlug: "neumann-goretti",
    sport: "baseball",
    year: 2017,
    classification: "Class AA",
    opponent: "Bishop McCort",
    score: "7-4",
    coach: "Kevin Schneider",
    venue: "Medlar Field at Lubrano Park, Penn State",
    narrative: `On June 16, at Penn State's Medlar Field at Lubrano Park, Neumann-Goretti beat Bishop McCort, of Johnstown, 7-4, to claim its second consecutive state baseball title (over the same opponent). Phil Sanborn (4.1 innings) and Joe Messina divided the pitching while Brian Reynolds (walk), Eric Nardini and Sanborn (singles) had RBI in a five-run first. With the bases loaded in the seventh, Messina notched a three-pitch strikeout to end it.

**Title-Game Box Score: Neumann-Goretti 7, Bishop McCort 4**

| BISHOP McCORT | AB | R | H | BI |
|---|---|---|---|---|
| Boston Bradley c-p | 3 | 1 | 1 | 1 |
| Cameron Bunn 2b | 4 | 0 | 1 | 2 |
| Ian Fleck ss | 4 | 0 | 2 | 0 |
| Bryce Kramer 1b | 4 | 0 | 1 | 1 |
| Chris Miller lf | 1 | 1 | 1 | 0 |
| Logan Kasper cf | 2 | 0 | 0 | 0 |
| Carmine Cannizzaro dh | 4 | 1 | 1 | 0 |
| Anthony Cacciotti rf | 3 | 1 | 1 | 0 |
| Zach Romach 3b | 3 | 0 | 0 | 0 |
| **Totals** | **28** | **4** | **8** | **4** |

| NEUMANN-GOR. | AB | R | H | BI |
|---|---|---|---|---|
| Colin Eiser cf | 3 | 0 | 0 | 0 |
| Aidan Baur 3b | 2 | 1 | 1 | 0 |
| Jared Healey ss | 3 | 0 | 2 | 0 |
| RJ McGettigan 1b | 3 | 1 | 0 | 0 |
| Steve Pizza 2b | 2 | 1 | 0 | 0 |
| Brian Reynolds rf | 2 | 2 | 1 | 1 |
| Eric Nardini c | 3 | 1 | 1 | 1 |
| Phil Sanborn p | 2 | 0 | 2 | 1 |
| Joe Messina p | 2 | 0 | 0 | 0 |
| George Mascuilli lf | 2 | 1 | 0 | 0 |
| **Totals** | **24** | **7** | **7** | **3** |

| Team | 1 | 2 | 3 | 4 | 5 | 6 | 7 | F |
|---|---|---|---|---|---|---|---|---|
| Bishop McCort | 0 | 0 | 1 | 2 | 0 | 0 | 1 | 4 |
| Neumann-Goretti | 5 | 0 | 0 | 0 | 2 | 0 | x | 7 |

| PITCHING | IP | H | R | ER | BB | SO |
|---|---|---|---|---|---|---|
| Brenden Lavely (L) | 3.1 | 6 | 5 | 3 | 4 | 1 |
| Brett Seitz | 2 | 1 | 2 | 1 | 3 | 2 |
| Boston Bradley | 0.2 | 0 | 0 | 0 | 0 | 1 |
| Phil Sanborn (W) | 4.1 | 8 | 3 | 3 | 3 | 7 |
| Joe Messina (S) | 2.2 | 0 | 1 | 1 | 3 | 3 |

E: Bradley 2, Seitz, Baur. DP: N-G.`,
    highlights: [
      "Second consecutive state title over the same opponent (Bishop McCort)",
      "Five-run first inning set the tone -- RBI from Reynolds, Nardini, and Sanborn",
      "Joe Messina: bases-loaded, 3-pitch strikeout to end the game in the 7th",
      "Phil Sanborn: 4.1 IP, 7 K; Messina: 2.2 IP, 3 K (save)",
      "Jared Healey batted .550 across the 8-game postseason run",
    ],
    seasonRecord: "23-4",
    sourceFile: "baseball/schools/Neumann-Goretti/Neumann-Goretti-2017-state-playoffs_archive.html",
  },

  // ── La Salle College Baseball 2012 ────────────────────────────────────────
  {
    slug: "la-salle-baseball-2012",
    school: "La Salle College High School",
    schoolSlug: "la-salle-college",
    sport: "baseball",
    year: 2012,
    classification: "Class AAAA",
    opponent: "Council Rock South",
    score: "3-1",
    coach: "Joe Parisi",
    venue: "Medlar Field at Lubrano Park, Penn State",
    narrative: `On June 15, at Penn State's Medlar Field at Lubrano Park, La Salle beat Council Rock South, 3-1, to capture District 12's first state title in baseball. Kevin Long pitched a three-hitter with eight strikeouts with one walk while the RBI went to Colin Pyne, Mike Piscopo and Dom Cuoci on singles.

**Title-Game Box Score: La Salle 3, Council Rock South 1**

| LA SALLE | AB | R | H | BI |
|---|---|---|---|---|
| Ryan Otis cf | 4 | 0 | 0 | 0 |
| P.J. Acierno lf | 3 | 0 | 0 | 0 |
| Chris Melillo 1b | 3 | 0 | 0 | 0 |
| Corey Baiada c | 3 | 1 | 1 | 0 |
| Tyler Kozeniewski rf | 2 | 2 | 0 | 0 |
| Mike Piscopo 3b | 2 | 0 | 2 | 1 |
| Colin Pyne 2b | 3 | 0 | 2 | 1 |
| Dom Cuoci ss | 3 | 0 | 1 | 1 |
| Kevin Long p | 3 | 0 | 0 | 0 |
| **Totals** | **26** | **3** | **6** | **3** |

| CR SOUTH | AB | R | H | BI |
|---|---|---|---|---|
| Zach Fitzgerald 2b | 3 | 0 | 0 | 0 |
| Brian Donnelly cf | 2 | 0 | 1 | 0 |
| Bret DeStefano p | 3 | 0 | 1 | 0 |
| Jeff Miller rf | 3 | 0 | 0 | 0 |
| Dan Callahan c | 3 | 0 | 0 | 0 |
| Zak Gross 1b | 3 | 1 | 0 | 0 |
| Kane Price lf | 2 | 0 | 0 | 1 |
| Michael Chaykin 3b | 3 | 0 | 1 | 0 |
| Steve Wright ss | 2 | 0 | 0 | 0 |
| **Totals** | **24** | **1** | **3** | **1** |

| Team | 1 | 2 | 3 | 4 | 5 | 6 | 7 | F |
|---|---|---|---|---|---|---|---|---|
| La Salle | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 3 |
| Council Rock South | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |

| PITCHING | IP | H | R | ER | BB | SO |
|---|---|---|---|---|---|---|
| Kevin Long (W) | 7 | 3 | 1 | 0 | 1 | 8 |
| Bret DeStefano (L) | 5.1 | 6 | 3 | 3 | 4 | 6 |
| Brian Donnelly | 1.2 | 0 | 0 | 0 | 0 | 2 |

E: Otis, Pyne. DP: CR South. 2B: Baiada, Chaykin. SB: Cuoci. T: 1:45.`,
    highlights: [
      "District 12's first state title in baseball",
      "Kevin Long: complete-game 3-hitter, 8 strikeouts, 1 walk, 0 earned runs",
      "RBI singles from Pyne, Piscopo, and Cuoci",
      "Postseason team batting average: .347 across 8 games",
      "Pitching staff ERA: 2.14 in 52.1 postseason innings",
    ],
    seasonRecord: "24-3",
    sourceFile: "baseball/schools/LaSalle-College/LaSalle-College-2012-tribute_archive.html",
  },

  // ── La Salle College Baseball 2014 ────────────────────────────────────────
  {
    slug: "la-salle-baseball-2014",
    school: "La Salle College High School",
    schoolSlug: "la-salle-college",
    sport: "baseball",
    year: 2014,
    classification: "Class AAAA",
    opponent: "Conestoga",
    score: "4-2 (8 inn.)",
    coach: "Joe Parisi",
    venue: "Medlar Field at Lubrano Park, Penn State",
    narrative: `On June 13, at Penn State's Medlar Field at Lubrano Park, La Salle beat Conestoga, 4-2, in eight innings, to claim its second state title in three years. In the visiting eighth, Brian Buckley broke a 2-2 tie with a two-run single, enabling Dominic Cuoci to earn the win. John Scheffey's 1-2-3 bottom half saved it. Cuoci (single) and Jimmy Herron posted the Explorers' earlier RBI. Coach Joe Parisi announced his retirement five days later.

**Title-Game Box Score: La Salle 4, Conestoga 2 (8 inn.)**

| LA SALLE | AB | R | H | BI |
|---|---|---|---|---|
| AJ Grezeszak ss | 3 | 1 | 0 | 0 |
| Brad Schneider 2b | 2 | 0 | 0 | 0 |
| Jimmy Herron cf | 3 | 2 | 1 | 1 |
| Dominic Cuoci p | 4 | 1 | 2 | 1 |
| Nick Dermo c | 3 | 0 | 0 | 0 |
| Brian Buckley 1b | 3 | 0 | 2 | 2 |
| Eric Burgmann 1b | 3 | 0 | 1 | 0 |
| Ryan Coonahan rf | 3 | 0 | 1 | 0 |
| Ian McIntosh lf | 4 | 0 | 1 | 0 |
| Adam Arcadia 3b | 3 | 0 | 0 | 0 |
| **Totals** | **28** | **4** | **7** | **4** |

| CONESTOGA | AB | R | H | BI |
|---|---|---|---|---|
| Austin Shirley cf | 3 | 1 | 1 | 0 |
| Ryne Ogren 2b | 2 | 0 | 0 | 0 |
| Tommy Richter ss | 4 | 0 | 2 | 1 |
| Andrew Born rf | 4 | 0 | 1 | 0 |
| Stephen Born dh | 3 | 1 | 1 | 0 |
| Andrew Turner c | 4 | 0 | 0 | 0 |
| Max Dolente 1b | 4 | 0 | 2 | 0 |
| Brandon Ruffenach 3b | 4 | 0 | 1 | 1 |
| Alec Gagne lf | 4 | 0 | 0 | 0 |
| **Totals** | **32** | **2** | **8** | **2** |

| Team | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | F |
|---|---|---|---|---|---|---|---|---|---|
| La Salle | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 2 | 4 |
| Conestoga | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 2 |

| PITCHING | IP | H | R | ER | BB | SO |
|---|---|---|---|---|---|---|
| Dominic Cuoci (W) | 7 | 8 | 2 | 2 | 2 | 2 |
| John Scheffey (S) | 1 | 0 | 0 | 0 | 0 | 1 |
| Brendon Little (L) | 7 | 4 | 3 | 2 | 4 | 4 |
| Jake Bufo | 1 | 3 | 1 | 1 | 0 | 0 |

E: Grezeszak 2, Ruffenach, Turner. Balk: Cuoci. T: not listed.`,
    highlights: [
      "Second state title in three years",
      "Brian Buckley: go-ahead 2-run single in the 8th inning",
      "Dominic Cuoci: 7 IP for the win; John Scheffey: 1-2-3 8th inning for the save",
      "Coach Joe Parisi announced his retirement five days after the title",
      "Postseason pitching staff ERA: 1.61 across 61 innings (9 games)",
    ],
    seasonRecord: "21-6",
    sourceFile: "baseball/schools/LaSalle-College/LaSalle-College-2014-tribute_archive.html",
  },
];
