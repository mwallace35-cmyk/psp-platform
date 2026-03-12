'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMySchools, removeMySchool } from '@/lib/my-schools';
import styles from '@/app/homepage.module.css';

interface MySchoolsWidgetProps {
  topSchools?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

const DEFAULT_TOP_SCHOOLS = [
  { id: 1005, name: 'St. Joseph\'s Prep', slug: 'st-josephs-prep' },
  { id: 2690, name: 'Neumann-Goretti', slug: 'neumann-goretti' },
  { id: 127, name: 'Roman Catholic', slug: 'roman-catholic' },
  { id: 171, name: 'La Salle College HS', slug: 'la-salle-college-hs' },
  { id: 144, name: 'Archbishop Wood', slug: 'archbishop-wood' },
  { id: 209, name: 'Imhotep Charter', slug: 'imhotep-charter' },
];

export default function MySchoolsWidget({ topSchools = DEFAULT_TOP_SCHOOLS }: MySchoolsWidgetProps) {
  const [mySchools, setMySchools] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [hasBookmarks, setHasBookmarks] = useState(false);

  useEffect(() => {
    const bookmarks = getMySchools();
    setMySchools(bookmarks);
    setHasBookmarks(bookmarks.length > 0);
    setIsMounted(true);
  }, []);

  const handleRemove = (slug: string) => {
    removeMySchool(slug);
    setMySchools(getMySchools());
  };

  if (!isMounted) return null;

  if (!hasBookmarks) {
    // Empty state: show "Get Started" prompt with popular schools
    return (
      <section className={styles.mySchoolsSection} style={{ marginTop: '2rem' }}>
        <div className={styles.mySchoolsContainer}>
          <div className={styles.mySchoolsHeader}>
            <h2 className={styles.mySchoolsTitle}>MY SCHOOLS</h2>
            <p className={styles.mySchoolsSubtitle}>
              Personalize your experience by bookmarking your favorite schools
            </p>
          </div>

          {/* Suggested Schools Grid */}
          <div className={styles.suggestedSchoolsGrid}>
            {topSchools.map((school) => (
              <Link key={school.id} href={`/football/schools/${school.slug}`}>
                <div className={styles.suggestedSchoolCard}>
                  <h3 className={styles.suggestedSchoolName}>{school.name}</h3>
                  <span className={styles.suggestedSchoolCTA}>View Profile →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Search CTA */}
          <div className={styles.mySchoolsCTA}>
            <Link href="/search" className={styles.mySchoolsSearchLink}>
              🔍 Find Your School
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Personalized view: show bookmarked schools
  return (
    <section className={styles.mySchoolsSection} style={{ marginTop: '2rem' }}>
      <div className={styles.mySchoolsContainer}>
        <div className={styles.mySchoolsHeader}>
          <h2 className={styles.mySchoolsTitle}>MY SCHOOLS</h2>
          <Link href="/my-schools" className={styles.mySchoolsManage}>
            Manage All →
          </Link>
        </div>

        {/* Bookmarked Schools Grid */}
        <div className={styles.mySchoolsGrid}>
          {mySchools.slice(0, 6).map((slug) => {
            const schoolName = slug
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <Link key={slug} href={`/football/schools/${slug}`}>
                <div className={styles.mySchoolCard}>
                  <div className={styles.mySchoolCardHeader}>
                    <h3 className={styles.mySchoolCardName}>{schoolName}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(slug);
                      }}
                      className={styles.mySchoolCardRemove}
                      title="Remove from My Schools"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.mySchoolCardFooter}>
                    View Profile →
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Add More CTA */}
          <Link href="/search">
            <div className={styles.mySchoolAddCard}>
              <div className={styles.mySchoolAddIcon}>+</div>
              <div className={styles.mySchoolAddLabel}>Add More Schools</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
