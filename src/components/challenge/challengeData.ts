export interface ChallengeQuestion {
  id: number;
  player1: {
    name: string;
    school: string;
    year: string;
    slug: string;
    sport: string;
  };
  player2: {
    name: string;
    school: string;
    year: string;
    slug: string;
    sport: string;
  };
  stat: string;
  statLabel: string;
  answer: 1 | 2;
  player1Value: number;
  player2Value: number;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number;
}

export const CHALLENGE_BANK: ChallengeQuestion[] = [
  {
    id: 1,
    player1: { name: 'Marvin Harrison', school: 'Roman Catholic', year: '1999', slug: 'marvin-harrison', sport: 'football' },
    player2: { name: 'Mike Mamula', school: 'Boston College', year: '1996', slug: 'mike-mamula', sport: 'football' },
    stat: 'receiving_yards',
    statLabel: 'Receiving Yards (Single Season)',
    answer: 1,
    player1Value: 1454,
    player2Value: 1200,
    difficulty: 'hard',
    successRate: 42,
  },
  {
    id: 2,
    player1: { name: 'Kobe Bryant', school: 'Lower Merion', year: '1996', slug: 'kobe-bryant', sport: 'basketball' },
    player2: { name: 'Kyle Lowry', school: 'Cardinal O\'Hara', year: '2003', slug: 'kyle-lowry', sport: 'basketball' },
    stat: 'points_per_game',
    statLabel: 'Points Per Game (Career)',
    answer: 1,
    player1Value: 31.1,
    player2Value: 19.2,
    difficulty: 'medium',
    successRate: 58,
  },
  {
    id: 3,
    player1: { name: 'Jalen Duren', school: 'Imhotep Charter', year: '2022', slug: 'jalen-duren', sport: 'basketball' },
    player2: { name: 'Marvin Harrison Jr.', school: 'St. Joseph\'s Prep', year: '2022', slug: 'marvin-harrison-jr', sport: 'football' },
    stat: 'all_star_selections',
    statLabel: 'All-Star/All-City Selections',
    answer: 2,
    player1Value: 2,
    player2Value: 3,
    difficulty: 'hard',
    successRate: 35,
  },
  {
    id: 4,
    player1: { name: 'D\'Andre Swift', school: 'St. Joseph\'s Prep', year: '2016', slug: 'dandre-swift', sport: 'football' },
    player2: { name: 'Kyle McCord', school: 'St. Joseph\'s Prep', year: '2018', slug: 'kyle-mccord', sport: 'football' },
    stat: 'passing_yards',
    statLabel: 'Single Season Passing Yards',
    answer: 2,
    player1Value: 0,
    player2Value: 3847,
    difficulty: 'hard',
    successRate: 28,
  },
  {
    id: 5,
    player1: { name: 'Wilt Chamberlain', school: 'Overbrook', year: '1955', slug: 'wilt-chamberlain', sport: 'basketball' },
    player2: { name: 'Tom Gola', school: 'La Salle HS', year: '1951', slug: 'tom-gola', sport: 'basketball' },
    stat: 'nba_championships',
    statLabel: 'NBA Championships',
    answer: 1,
    player1Value: 2,
    player2Value: 1,
    difficulty: 'medium',
    successRate: 65,
  },
  {
    id: 6,
    player1: { name: 'Eddie Griffin', school: 'Roman Catholic', year: '1997', slug: 'eddie-griffin', sport: 'basketball' },
    player2: { name: 'Jalen Duren', school: 'Imhotep Charter', year: '2022', slug: 'jalen-duren', sport: 'basketball' },
    stat: 'nba_draft_position',
    statLabel: 'NBA Draft Position (Lower is Better)',
    answer: 2,
    player1Value: 18,
    player2Value: 5,
    difficulty: 'medium',
    successRate: 52,
  },
  {
    id: 7,
    player1: { name: 'Roman Catholic', school: 'Roman Catholic', year: '2021', slug: 'roman-catholic-bb', sport: 'basketball' },
    player2: { name: 'Neumann-Goretti', school: 'Neumann-Goretti', year: '2024', slug: 'neumann-goretti-bb', sport: 'basketball' },
    stat: 'state_championships',
    statLabel: 'All-Time State Championships',
    answer: 2,
    player1Value: 4,
    player2Value: 10,
    difficulty: 'easy',
    successRate: 72,
  },
  {
    id: 8,
    player1: { name: 'St. Joseph\'s Prep', school: 'St. Joseph\'s Prep', year: '2023', slug: 'sjp-fb', sport: 'football' },
    player2: { name: 'Imhotep Charter', school: 'Imhotep Charter', year: '2024', slug: 'imhotep-fb', sport: 'football' },
    stat: 'playoff_appearances',
    statLabel: 'Consecutive Playoff Appearances',
    answer: 1,
    player1Value: 23,
    player2Value: 12,
    difficulty: 'hard',
    successRate: 31,
  },
  {
    id: 9,
    player1: { name: 'Rasual Butler', school: 'Roman Catholic', year: '1998', slug: 'rasual-butler', sport: 'basketball' },
    player2: { name: 'Earl Monroe', school: 'Bartram', year: '1963', slug: 'earl-monroe', sport: 'basketball' },
    stat: 'hof_inducted',
    statLabel: 'Hall of Fame Inducted',
    answer: 2,
    player1Value: 0,
    player2Value: 1,
    difficulty: 'hard',
    successRate: 24,
  },
  {
    id: 10,
    player1: { name: 'La Salle College HS', school: 'La Salle College HS', year: '2021', slug: 'lasalle-baseball', sport: 'baseball' },
    player2: { name: 'Father Judge HS', school: 'Father Judge HS', year: '2023', slug: 'judge-baseball', sport: 'baseball' },
    stat: 'state_titles',
    statLabel: 'State Baseball Championships',
    answer: 1,
    player1Value: 3,
    player2Value: 1,
    difficulty: 'medium',
    successRate: 48,
  },
];
