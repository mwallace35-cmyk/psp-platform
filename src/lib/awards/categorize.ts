/**
 * Categorize football and basketball awards into Pro Bowl-style tiers
 *
 * TIER 1: League Awards (All-Public, All-Catholic, All-Inter-Ac)
 * TIER 2: City Awards (All-City — combines all 3 leagues)
 * TIER 3: State & National (All-State, All-American)
 */

interface RawAward {
  award_name: string | null;
  player_name: string | null;
  player_slug?: string | null;
  school_name?: string | null;
  school_slug?: string | null;
  position?: string | null;
  year?: number | null;
}

interface CategorizedAward {
  tier: 'league' | 'city' | 'state' | 'other';
  selector: string; // "Daily News", "Coaches", "Bulletin", etc.
  level: string; // "All-Public", "All-Catholic", "All-City", etc.
  team: string | null; // "First Team", "Second Team", etc.
  player_name: string;
  player_slug?: string;
  school_name?: string;
  school_slug?: string;
  position?: string;
  year?: number;
}

export function categorizeFootballAward(award: RawAward): CategorizedAward | null {
  const name = award.award_name;
  if (!name) return null;

  const result: CategorizedAward = {
    tier: 'other',
    selector: '',
    level: '',
    team: null,
    player_name: award.player_name || 'Unknown',
    player_slug: award.player_slug || undefined,
    school_name: award.school_name || undefined,
    school_slug: award.school_slug || undefined,
    position: award.position || undefined,
    year: award.year || undefined,
  };

  // Extract team designation
  if (name.includes('First Team')) result.team = 'First Team';
  else if (name.includes('Second Team')) result.team = 'Second Team';
  else if (name.includes('Third Team')) result.team = 'Third Team';

  // TIER 1: League Awards
  if (name.includes('All-Catholic') || name.includes('Catholic League')) {
    result.tier = 'league';
    result.level = 'All-Catholic';
    result.selector = name.includes('Coaches') ? 'Coaches' : name.includes('Daily News') ? 'Daily News' : 'Coaches';
  } else if (name.includes('All-Public') || name.includes('Public League')) {
    result.tier = 'league';
    result.level = 'All-Public';
    result.selector = name.includes('Coaches') ? 'Coaches' : name.includes('Daily News') ? 'Daily News' : 'Coaches';
  } else if (name.includes('All-Inter-Ac') || name.includes('Inter-Ac')) {
    result.tier = 'league';
    result.level = 'All-Inter-Ac';
    result.selector = name.includes('Coaches') ? 'Coaches' : 'All-Inter-Ac';
  }
  // Daily News All-League variants are LEAGUE level (historical — before Coaches took over)
  else if (name.includes('All-League') && name.includes('Public')) {
    result.tier = 'league';
    result.level = 'All-Public';
    result.selector = 'Daily News';
  } else if (name.includes('All-League') && name.includes('Catholic')) {
    result.tier = 'league';
    result.level = 'All-Catholic';
    result.selector = 'Daily News';
  }
  // TIER 2: City Awards
  else if (name.includes('All-City')) {
    result.tier = 'city';
    result.level = 'All-City';
    result.selector = name.includes('Daily News') ? 'Daily News' : name.includes('Bulletin') ? 'Bulletin' : '';
  } else if (name.includes('All-Scholastic')) {
    result.tier = 'city';
    result.level = 'All-Scholastic';
    result.selector = name.includes('Bulletin') ? 'Philadelphia Bulletin' : '';
  } else if (name.includes('All-League')) {
    result.tier = 'city';
    result.level = 'All-League';
    result.selector = name.includes('Daily News') ? 'Daily News' : '';
  }
  // TIER 3: State & National
  else if (name.includes('All-State')) {
    result.tier = 'state';
    result.level = 'All-State';
    result.selector = '';
  } else if (name.includes('All-American')) {
    result.tier = 'state';
    result.level = 'All-American';
    result.selector = '';
  }
  // MVPs / Player of the Year
  else if (name.includes('Player of the Year') || name.includes('MVP') || name.includes('Best Prospect')) {
    result.tier = 'mvp';
    result.level = name;
    result.selector = name.includes('Daily News') ? 'Daily News' : name.includes('Coaches') ? 'Coaches' : '';
  }
  // Coach of the Year
  else if (name.includes('Coach of the Year')) {
    result.tier = 'coty';
    result.level = name;
    result.selector = name.includes('Coaches') ? 'Coaches' : '';
  }
  // Other (stat leaders, decade teams, etc.)
  else {
    result.tier = 'other';
    result.level = name;
    result.selector = '';
  }

  return result;
}

export function categorizeBasketballAward(award: RawAward): CategorizedAward | null {
  const name = award.award_name;
  if (!name) return null;

  const result: CategorizedAward = {
    tier: 'other',
    selector: '',
    level: '',
    team: null,
    player_name: award.player_name || 'Unknown',
    player_slug: award.player_slug || undefined,
    school_name: award.school_name || undefined,
    school_slug: award.school_slug || undefined,
    position: award.position || undefined,
    year: award.year || undefined,
  };

  // Extract team designation
  if (name.includes('First Team')) result.team = 'First Team';
  else if (name.includes('Second Team')) result.team = 'Second Team';
  else if (name.includes('Third Team')) result.team = 'Third Team';

  // TIER 1: League Awards (Markward variations)
  if (name.includes('All-Public') || (name.includes('Markward') && name.includes('Public'))) {
    result.tier = 'league';
    result.level = 'All-Public';
    result.selector = 'Coaches'; // Markward defaults to Coaches
  } else if (name.includes('All-Catholic') || (name.includes('Markward') && name.includes('Catholic'))) {
    result.tier = 'league';
    result.level = 'All-Catholic';
    result.selector = 'Coaches';
  } else if (name.includes('All-Inter-Ac') || (name.includes('Markward') && (name.includes('Interac') || name.includes('Inter-Ac')))) {
    result.tier = 'league';
    result.level = 'All-Inter-Ac';
    result.selector = 'Coaches';
  }
  // TIER 2: City Awards (Daily News All-City Basketball)
  else if (name.includes('All-City Basketball')) {
    result.tier = 'city';
    result.level = 'All-City';
    result.selector = 'Daily News';
  }
  // TIER 3: Professional/Next Level
  else if (name.includes('NBA/ABA')) {
    result.tier = 'state';
    result.level = name;
    result.selector = '';
  }
  // Other awards
  else {
    result.tier = 'other';
    result.level = name;
    result.selector = '';
  }

  return result;
}

export function buildAwardTiers(awards: RawAward[], sport?: string) {
  // Choose categorization function based on sport
  const categoryFunction = sport === 'basketball' ? categorizeBasketballAward : categorizeFootballAward;
  const categorized = awards.map(categoryFunction).filter(Boolean) as CategorizedAward[];

  // Group by tier > selector+level+team
  const tierMap = new Map<string, Map<string, CategorizedAward[]>>();

  for (const award of categorized) {
    const tierKey = award.tier;
    const groupKey = `${award.selector}|${award.level}|${award.team || ''}`;

    if (!tierMap.has(tierKey)) tierMap.set(tierKey, new Map());
    const groups = tierMap.get(tierKey)!;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(award);
  }

  // Build tier array in order
  const tierOrder = [
    { key: 'league', name: 'League Awards', desc: 'All-Public, All-Catholic, All-Inter-Ac — individual league honors' },
    { key: 'city', name: 'City Awards', desc: 'All-City — combining all Philadelphia-area leagues' },
    { key: 'state', name: 'State & National', desc: 'All-State and All-American selections' },
    { key: 'mvp', name: 'MVPs & Player Awards', desc: 'Player of the Year, MVP, Best Prospect — individual honors' },
    { key: 'coty', name: 'Coach of the Year', desc: 'Head coaching excellence recognized by league and media' },
    { key: 'other', name: 'Special Awards', desc: 'Stat leaders, decade teams, and other honors' },
  ];

  return tierOrder
    .filter(t => tierMap.has(t.key))
    .map(t => ({
      tierName: t.name,
      tierDescription: t.desc,
      teams: Array.from(tierMap.get(t.key)!.entries()).map(([groupKey, players]) => {
        const [selector, level, team] = groupKey.split('|');
        return {
          selector,
          level,
          team: team || null,
          players: players.map(p => ({
            player_name: p.player_name,
            player_slug: p.player_slug,
            school_name: p.school_name,
            school_slug: p.school_slug,
            position: p.position,
            year: p.year,
          })),
        };
      }),
    }));
}
