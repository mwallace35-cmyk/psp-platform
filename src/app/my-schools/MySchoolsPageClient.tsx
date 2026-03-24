'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMySchools, removeMySchool, addMySchool } from '@/lib/my-schools';
import styles from '@/app/homepage.module.css';

interface SchoolData {
  slug: string;
  name: string;
}

const POPULAR_SCHOOLS: SchoolData[] = [
  { slug: 'st-josephs-prep', name: 'St. Joseph\'s Prep' },
  { slug: 'neumann-goretti', name: 'Neumann-Goretti' },
  { slug: 'roman-catholic', name: 'Roman Catholic' },
  { slug: 'la-salle-college-hs', name: 'La Salle College HS' },
  { slug: 'archbishop-wood', name: 'Archbishop Wood' },
  { slug: 'imhotep-charter', name: 'Imhotep Charter' },
  { slug: 'father-judge', name: 'Father Judge' },
  { slug: 'penn-charter', name: 'Penn Charter' },
  { slug: 'germantown-academy', name: 'Germantown Academy' },
  { slug: 'episcopal-academy', name: 'Episcopal Academy' },
  { slug: 'haverford-school', name: 'Haverford School' },
  { slug: 'malvern-prep', name: 'Malvern Prep' },
];

export default function MySchoolsPageClient() {
  const [mySchools, setMySchools] = useState<SchoolData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const bookmarks = getMySchools();
    const schoolData = bookmarks.map((slug) => ({
      slug,
      name: formatSchoolName(slug),
    }));
    setMySchools(schoolData);
    setIsMounted(true);
  }, []);

  const formatSchoolName = (slug: string): string => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRemove = (slug: string) => {
    removeMySchool(slug);
    setMySchools(mySchools.filter((school) => school.slug !== slug));
  };

  const handleAddFromSearch = (slug: string, name: string) => {
    if (!mySchools.find((s) => s.slug === slug)) {
      addMySchool(slug);
      setMySchools([...mySchools, { slug, name }]);
      setSearchQuery('');
    }
  };

  const filteredPopularSchools = POPULAR_SCHOOLS.filter(
    (school) => !mySchools.find((m) => m.slug === school.slug) &&
      school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', minHeight: '60vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', minHeight: '60vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="psp-h1" style={{
          marginBottom: '0.5rem',
          color: 'var(--psp-navy)',
        }}>
          MY SCHOOLS
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--psp-gray-600)',
          marginBottom: '1.5rem',
        }}>
          Manage your bookmarked schools to personalize your PhillySportsPack experience
        </p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search schools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '2px solid var(--psp-gray-300)',
            borderRadius: '0.5rem',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* My Bookmarked Schools */}
        <div>
          <h2 className="psp-h2" style={{
            marginBottom: '1rem',
            color: 'var(--psp-navy)',
          }}>
            BOOKMARKED SCHOOLS
          </h2>

          {mySchools.length === 0 ? (
            <div style={{
              padding: '2rem',
              backgroundColor: 'var(--psp-gray-50)',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: 'var(--psp-gray-600)',
            }}>
              No schools bookmarked yet. Search to add your first school!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {mySchools.map((school) => (
                <div
                  key={school.slug}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'var(--psp-gray-50)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--psp-gray-200)',
                  }}
                >
                  <Link
                    href={`/football/schools/${school.slug}`}
                    style={{
                      flex: 1,
                      fontWeight: '500',
                      color: 'var(--psp-blue)',
                      textDecoration: 'none',
                    }}
                  >
                    {school.name}
                  </Link>
                  <button
                    onClick={() => handleRemove(school.slug)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      marginLeft: '1rem',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Schools to Add */}
        <div>
          <h2 className="psp-h2" style={{
            marginBottom: '1rem',
            color: 'var(--psp-navy)',
          }}>
            POPULAR SCHOOLS
          </h2>

          {filteredPopularSchools.length === 0 && mySchools.length === 0 ? (
            <div style={{
              padding: '2rem',
              backgroundColor: 'var(--psp-gray-50)',
              borderRadius: '0.5rem',
              textAlign: 'center',
              color: 'var(--psp-gray-600)',
            }}>
              All popular schools are bookmarked!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {(filteredPopularSchools.length > 0 ? filteredPopularSchools : POPULAR_SCHOOLS.filter((s) => !mySchools.find((m) => m.slug === s.slug))).map((school) => (
                <div
                  key={school.slug}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'var(--psp-gray-50)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--psp-gray-200)',
                  }}
                >
                  <span style={{ fontWeight: '500', color: 'var(--psp-navy)' }}>
                    {school.name}
                  </span>
                  <button
                    onClick={() => handleAddFromSearch(school.slug, school.name)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      marginLeft: '1rem',
                      backgroundColor: 'var(--psp-gold)',
                      color: 'var(--psp-navy)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back Link */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--psp-gray-200)' }}>
        <Link
          href="/"
          style={{
            color: 'var(--psp-blue)',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
