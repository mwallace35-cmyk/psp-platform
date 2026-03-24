'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Recruit {
  id: string;
  name: string;
  school: string;
  position: string;
  stars: number; // 1-5
  status: 'COMMITTED' | 'UNSIGNED';
}

interface ProAlumni {
  id: string;
  name: string;
  proTeam: string;
  position: string;
}

interface PhillyPipelineProps {
  sport: string;
  sportColor: string;
}

// Sample recruit data for Philadelphia schools
const SAMPLE_RECRUITS: Record<string, Recruit[]> = {
  football: [
    {
      id: '1',
      name: 'Marcus Williams',
      school: 'St. Joseph\'s Prep',
      position: 'QB',
      stars: 5,
      status: 'COMMITTED',
    },
    {
      id: '2',
      name: 'Terrell Grant',
      school: 'Roman Catholic',
      position: 'RB',
      stars: 4,
      status: 'COMMITTED',
    },
    {
      id: '3',
      name: 'DeShawn Martinez',
      school: 'Northeast High',
      position: 'WR',
      stars: 4,
      status: 'UNSIGNED',
    },
    {
      id: '4',
      name: 'Jordan Price',
      school: 'La Salle College High',
      position: 'OL',
      stars: 3,
      status: 'UNSIGNED',
    },
    {
      id: '5',
      name: 'Kenneth Phillips',
      school: 'William Penn High',
      position: 'DE',
      stars: 3,
      status: 'COMMITTED',
    },
  ],
  basketball: [
    {
      id: '1',
      name: 'Jaylen Jackson',
      school: 'Archbishop Wood',
      position: 'SG',
      stars: 5,
      status: 'COMMITTED',
    },
    {
      id: '2',
      name: 'Isaiah Johnson',
      school: 'Neumann Goretti',
      position: 'PF',
      stars: 4,
      status: 'COMMITTED',
    },
    {
      id: '3',
      name: 'Anthony Torres',
      school: 'St. Joseph\'s Prep',
      position: 'C',
      stars: 4,
      status: 'UNSIGNED',
    },
    {
      id: '4',
      name: 'Marcus Davis',
      school: 'Imhotep Charter',
      position: 'PG',
      stars: 3,
      status: 'UNSIGNED',
    },
    {
      id: '5',
      name: 'Devon Brooks',
      school: 'Overbrook High',
      position: 'SF',
      stars: 3,
      status: 'COMMITTED',
    },
  ],
  baseball: [
    {
      id: '1',
      name: 'Christian Rodriguez',
      school: 'La Salle College High',
      position: 'SS',
      stars: 5,
      status: 'COMMITTED',
    },
    {
      id: '2',
      name: 'Brandon Lee',
      school: 'St. Joseph\'s Prep',
      position: 'OF',
      stars: 4,
      status: 'COMMITTED',
    },
    {
      id: '3',
      name: 'Patrick O\'Brien',
      school: 'Lansdale Catholic',
      position: 'C',
      stars: 4,
      status: 'UNSIGNED',
    },
    {
      id: '4',
      name: 'Marcus White',
      school: 'Archbishop Ryan',
      position: '3B',
      stars: 3,
      status: 'UNSIGNED',
    },
    {
      id: '5',
      name: 'Tyler Harris',
      school: 'Northeast High',
      position: 'P',
      stars: 3,
      status: 'COMMITTED',
    },
  ],
};

// Sample pro alumni data
const SAMPLE_PRO_ALUMNI: Record<string, ProAlumni[]> = {
  football: [
    { id: '1', name: 'Carson Wentz', proTeam: 'Tennessee Titans', position: 'QB' },
    { id: '2', name: 'Jalen Hurts', proTeam: 'Philadelphia Eagles', position: 'QB' },
    { id: '3', name: 'Brandon Graham', proTeam: 'Philadelphia Eagles', position: 'DE' },
    { id: '4', name: 'Zach Ertz', proTeam: 'Washington Commanders', position: 'TE' },
    { id: '5', name: 'Miles Sanders', proTeam: 'Carolina Panthers', position: 'RB' },
  ],
  basketball: [
    { id: '1', name: 'Kobe Bryant', proTeam: 'Los Angeles Lakers (Retired)', position: 'SG' },
    { id: '2', name: 'Donovan McNabb', proTeam: 'Philadelphia 76ers (Retired)', position: 'C' },
    { id: '3', name: 'Baron Davis', proTeam: 'Multiple Teams (Retired)', position: 'PG' },
    { id: '4', name: 'Rasheed Wallace', proTeam: 'Multiple Teams (Retired)', position: 'PF' },
    { id: '5', name: 'Thaddeus Young', proTeam: 'Chicago Bulls', position: 'SF' },
  ],
  baseball: [
    { id: '1', name: 'Mike Schmidt', proTeam: 'Philadelphia Phillies (Retired)', position: '3B' },
    { id: '2', name: 'Ryan Howard', proTeam: 'Philadelphia Phillies (Retired)', position: '1B' },
    { id: '3', name: 'Chase Utley', proTeam: 'Philadelphia Phillies (Retired)', position: '2B' },
    { id: '4', name: 'Cole Hamels', proTeam: 'Multiple Teams (Retired)', position: 'P' },
    { id: '5', name: 'Bryce Harper', proTeam: 'Philadelphia Phillies', position: 'OF' },
  ],
};

export default function PhillyPipeline({ sport, sportColor }: PhillyPipelineProps) {
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [proAlumni, setProAlumni] = useState<ProAlumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // TODO: Replace with actual Supabase query to tracked_alumni table
        // For now, using sample data
        // const { data: recruitData } = await supabase
        //   .from('recruiting_tracker')
        //   .select('*')
        //   .eq('sport', sport)
        //   .eq('status', 'unsigned')
        //   .order('stars', { ascending: false })
        //   .limit(5);

        // const { data: alumniData } = await supabase
        //   .from('tracked_alumni')
        //   .select('*')
        //   .eq('sport', sport)
        //   .eq('current_level', 'pro')
        //   .limit(5);

        // Use sample data for now
        const sportKey = (sport.toLowerCase() as keyof typeof SAMPLE_RECRUITS) || 'football';
        setRecruits(SAMPLE_RECRUITS[sportKey] || SAMPLE_RECRUITS.football);
        setProAlumni(SAMPLE_PRO_ALUMNI[sportKey] || SAMPLE_PRO_ALUMNI.football);
      } catch (error) {
        console.error('Error fetching pipeline data:', error);
        // Fallback to sample data on error
        const sportKey = (sport.toLowerCase() as keyof typeof SAMPLE_RECRUITS) || 'football';
        setRecruits(SAMPLE_RECRUITS[sportKey] || SAMPLE_RECRUITS.football);
        setProAlumni(SAMPLE_PRO_ALUMNI[sportKey] || SAMPLE_PRO_ALUMNI.football);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sport]);

  const getProLeagueName = (sport: string): string => {
    const leagueMap: Record<string, string> = {
      football: 'NFL',
      basketball: 'NBA',
      baseball: 'MLB',
    };
    return leagueMap[sport.toLowerCase()] || 'Pro';
  };

  const renderStars = (count: number): string => {
    return '⭐'.repeat(count);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="widget">
      {/* Top Section: Top Recruits */}
      <div className="w-head">🎯 Top {sport.charAt(0).toUpperCase() + sport.slice(1)} Recruits</div>
      <div className="w-body" style={{ paddingBottom: 0 }}>
        {recruits.map((recruit, index) => (
          <div
            key={recruit.id}
            style={{
              paddingBottom: index < recruits.length - 1 ? 10 : 12,
              borderBottom: index < recruits.length - 1 ? '1px solid var(--g200)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--psp-navy)', marginBottom: 2 }}>
                  {recruit.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--g400)' }}>
                  {recruit.school} • {recruit.position}
                </div>
              </div>
              <div
                style={{
                  background: recruit.status === 'COMMITTED' ? '#dcfce7' : '#fef3c7',
                  color: recruit.status === 'COMMITTED' ? '#15803d' : '#b45309',
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '3px 6px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {recruit.status}
              </div>
            </div>
            <div style={{ fontSize: 11, color: sportColor, letterSpacing: 2 }}>
              {renderStars(recruit.stars)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Pro Alumni */}
      <div
        className="w-head"
        style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--g200)' }}
      >
        <span aria-hidden="true">🏆</span> Our Guys — {getProLeagueName(sport)}
      </div>
      <div className="w-body" style={{ paddingTop: 0 }}>
        {proAlumni.map((player, index) => (
          <div
            key={player.id}
            style={{
              paddingBottom: index < proAlumni.length - 1 ? 10 : 12,
              borderBottom: index < proAlumni.length - 1 ? '1px solid var(--g200)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--psp-navy)', marginBottom: 2 }}>
                  {player.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--g400)' }}>
                  {player.proTeam} • {player.position}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div style={{ borderTop: '1px solid var(--g200)', paddingTop: 10, marginTop: 10 }}>
        <Link
          href="/our-guys"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: sportColor,
            textDecoration: 'none',
            padding: '8px 0',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View Full Pipeline →
        </Link>
      </div>
    </div>
  );
}
