'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

interface School {
  id: number;
  slug: string;
  name: string;
  league_id: number;
  city: string;
  state: string;
  league?: { name: string };
  championships_count?: number;
}

const LEAGUES = [
  { id: 1, name: 'Catholic League' },
  { id: 2, name: 'Public League' },
  { id: 3, name: 'Inter-Ac' },
  { id: 4, name: 'Central League' },
  { id: 5, name: 'Delaware Valley' },
  { id: 6, name: 'Suburban One' },
  { id: 7, name: 'Independent' },
];

const SPORTS = ['Football', 'Basketball', 'Baseball', 'Track & Field', 'Lacrosse', 'Wrestling', 'Soccer'];

const LEAGUE_COLORS: Record<string, string> = {
  'Catholic League': '#f0a500',
  'Public League': '#0a1628',
  'Inter-Ac': '#16a34a',
  'Central League': '#ea580c',
  'Delaware Valley': '#0891b2',
  'Suburban One': '#7c3aed',
  'Independent': '#999',
};

// Placeholder school data - in production, this would come from Supabase
const PLACEHOLDER_SCHOOLS: School[] = [
  { id: 1, slug: 'saint-josephs-prep', name: 'St. Joseph\'s Prep', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 23 },
  { id: 2, slug: 'imhotep-charter', name: 'Imhotep Charter', league_id: 2, city: 'Philadelphia', state: 'PA', league: { name: 'Public League' }, championships_count: 16 },
  { id: 3, slug: 'neumann-goretti', name: 'Neumann-Goretti', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 13 },
  { id: 4, slug: 'roman-catholic', name: 'Roman Catholic', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 12 },
  { id: 5, slug: 'la-salle-college-hs', name: 'La Salle College High School', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 8 },
  { id: 6, slug: 'archbishop-wood', name: 'Archbishop Wood', league_id: 1, city: 'Warminster', state: 'PA', league: { name: 'Catholic League' }, championships_count: 7 },
  { id: 7, slug: 'malvern-prep', name: 'Malvern Prep', league_id: 3, city: 'Malvern', state: 'PA', league: { name: 'Inter-Ac' }, championships_count: 6 },
  { id: 8, slug: 'haverford-school', name: 'Haverford School', league_id: 3, city: 'Haverford', state: 'PA', league: { name: 'Inter-Ac' }, championships_count: 9 },
  { id: 9, slug: 'episcopal-academy', name: 'Episcopal Academy', league_id: 3, city: 'Newtown', state: 'PA', league: { name: 'Inter-Ac' }, championships_count: 4 },
  { id: 10, slug: 'conestoga', name: 'Conestoga High School', league_id: 6, city: 'Berwyn', state: 'PA', league: { name: 'Suburban One' }, championships_count: 4 },
  { id: 11, slug: 'father-judge', name: 'Father Judge High School', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 3 },
  { id: 12, slug: 'bonner-prendie', name: 'Bonner-Prendie', league_id: 1, city: 'Philadelphia', state: 'PA', league: { name: 'Catholic League' }, championships_count: 2 },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>(PLACEHOLDER_SCHOOLS);
  const [filteredSchools, setFilteredSchools] = useState<School[]>(PLACEHOLDER_SCHOOLS);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Leaflet
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded) return;

    const L = (window as any).L;
    if (!L) return;

    const mapElement = document.getElementById('schools-map');
    if (!mapElement) return;

    if ((mapElement as any)._map) return; // Map already initialized

    const map = L.map('schools-map').setView([39.95, -75.2], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for schools with approximate Philadelphia-area coordinates
    const schoolCoords: Record<string, [number, number]> = {
      'saint-josephs-prep': [39.98, -75.19],
      'imhotep-charter': [39.96, -75.2],
      'neumann-goretti': [39.95, -75.18],
      'roman-catholic': [39.97, -75.21],
      'la-salle-college-hs': [39.99, -75.18],
      'archbishop-wood': [40.15, -75.1],
      'malvern-prep': [40.03, -75.49],
      'haverford-school': [40.01, -75.31],
      'episcopal-academy': [40.24, -75.23],
      'conestoga': [40.06, -75.49],
      'father-judge': [39.98, -75.15],
      'bonner-prendie': [39.94, -75.2],
    };

    schools.forEach((school) => {
      const coords = schoolCoords[school.slug];
      if (coords) {
        const color = LEAGUE_COLORS[school.league?.name || ''] || '#0a1628';
        const marker = L.circleMarker(coords, {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindPopup(`<strong>${school.name}</strong><br/>${school.league?.name}`);
      }
    });
  }, [mapLoaded, schools]);

  // Filter schools
  useEffect(() => {
    let filtered = schools;

    if (selectedLeague) {
      filtered = filtered.filter((s) => s.league?.name === selectedLeague);
    }

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  }, [selectedLeague, searchTerm, schools]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div className="espn-container" style={{ flex: 1 }}>
        <main>
          {/* Hero Card */}
          <div className="hero-card">
            <div className="hero-tag">Directory</div>
            <div
              className="hero-img"
              style={{
                background: 'linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)',
              }}
            >
              <div>
                <h2>Philadelphia-Area High Schools</h2>
                <div className="hero-sub">
                  Explore {schools.length} schools across Catholic League, Public League, Inter-Ac, and more
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="sec-head">
            <h2>School Locations</h2>
          </div>
          <div
            id="schools-map"
            style={{
              width: '100%',
              height: 400,
              marginBottom: 16,
              borderRadius: 4,
              border: '1px solid var(--g100)',
            }}
          />

          {/* Filters */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search schools or cities..."
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <select
              className="filter-select"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <option value="">All Leagues</option>
              {LEAGUES.map((league) => (
                <option key={league.id} value={league.name}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Header */}
          <div className="sec-head">
            <h2>School Directory</h2>
            <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
              {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'}
            </span>
          </div>

          {/* School Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {filteredSchools.map((school) => (
              <Link
                key={school.id}
                href={`/football/schools/${school.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid var(--g100)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: '.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Header with league color */}
                  <div
                    style={{
                      background: LEAGUE_COLORS[school.league?.name || ''] || '#0a1628',
                      padding: '12px',
                      color: '#fff',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif" }}>
                      {school.name}
                    </h3>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
                      {school.league?.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>
                      {school.city}, {school.state}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--g100)' }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase' }}>Championships</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--psp-gold)' }}>
                          {school.championships_count || 0}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase' }}>Sports</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--psp-navy)' }}>
                          7
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--g400)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p>No schools match your search. Try adjusting your filters.</p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Legend */}
          <div className="widget">
            <div className="w-head">League Colors</div>
            <div className="w-body">
              {LEAGUES.map((league) => (
                <div key={league.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid #f0f0f0' }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: LEAGUE_COLORS[league.name] || '#999',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
                    {league.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/football" className="w-link">
                &#8594; Football Schools
              </Link>
              <Link href="/basketball" className="w-link">
                &#8594; Basketball Schools
              </Link>
              <Link href="/search" className="w-link">
                &#8594; Player Search
              </Link>
              <Link href="/compare" className="w-link">
                &#8594; Compare Players
              </Link>
            </div>
          </div>

          {/* Ad Space */}
          <AdPlaceholder size="sidebar-rect" id="psp-schools-rail" />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
