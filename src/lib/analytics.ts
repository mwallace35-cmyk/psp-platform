export type PageType =
  | 'homepage'
  | 'sport-hub'
  | 'school-profile'
  | 'player-career'
  | 'leaderboard'
  | 'championships'
  | 'records'
  | 'coach'
  | 'articles'
  | 'article-detail'
  | 'potw'
  | 'events'
  | 'search'
  | 'compare';

/**
 * Track search events
 * Fired when a user performs a search
 */
export function trackSearch(query: string, resultCount: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      value: resultCount,
      event_category: 'engagement',
    });
  }
}

/**
 * Track page views with context
 * Fired when a page loads with sport/type information
 */
export function trackPageView(pageType: PageType, sport?: string, slug?: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageType,
      page_path: window.location.pathname,
      ...(sport && { sport }),
      ...(slug && { entity_slug: slug }),
      event_category: 'page_view',
    });
  }
}

/**
 * Track POTW votes
 * Fired when a user votes for a player
 */
export function trackVote(playerId: string, playerName: string, sport: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'potw_vote', {
      player_id: playerId,
      player_name: playerName,
      sport,
      event_category: 'engagement',
    });
  }
}

/**
 * Track player comparison tool usage
 * Fired when a user compares players
 */
export function trackCompare(playerSlugs: string[], sport: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'player_compare', {
      player_count: playerSlugs.length,
      sport,
      event_category: 'engagement',
    });
  }
}

/**
 * Track article views
 * Fired when an article is opened
 */
export function trackArticleView(slug: string, title: string, author: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_view', {
      article_slug: slug,
      article_title: title,
      author,
      event_category: 'content',
    });
  }
}

/**
 * Track external link clicks
 * Fired when a user clicks outbound links
 */
export function trackOutboundLink(url: string, label: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: label,
      value: url,
    });
  }
}

/**
 * Track event registration
 * Fired when a user clicks register for an event
 */
export function trackEventRegistration(eventId: string, eventTitle: string, sport: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'event_registration', {
      event_id: eventId,
      event_title: eventTitle,
      sport,
      event_category: 'engagement',
    });
  }
}

// Declare gtag on window object for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
