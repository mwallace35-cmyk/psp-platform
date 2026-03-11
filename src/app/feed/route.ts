import { createStaticClient } from '@/lib/supabase/static';

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  sport_id: string | null;
  published_at: string;
  created_at: string;
  featured_image_url: string | null;
  author: string | null;
  author_name: string | null;
}

/**
 * RFC 2822 date formatter for RSS feeds
 */
function toRFC2822(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Strip HTML tags and decode entities for plain text description
 */
function stripHtmlAndTruncate(html: string | null | undefined, maxLength = 200): string {
  if (!html) return '';
  let text = html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }
  return text;
}

export async function GET() {
  try {
    const supabase = createStaticClient();

    // Fetch 50 most recent published articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error);
      return new Response('Error fetching articles', { status: 500 });
    }

    const now = new Date().toUTCString();
    const baseUrl = 'https://phillysportspack.com';

    // Build RSS XML
    let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PhillySportsPack - Philadelphia High School Sports</title>
    <link>${baseUrl}</link>
    <description>Coverage of Philadelphia area high school football, basketball, baseball, and more</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml" />
`;

    // Add articles as items
    if (articles && articles.length > 0) {
      for (const article of articles) {
        const pubDate = article.published_at
          ? toRFC2822(article.published_at)
          : toRFC2822(article.created_at);
        const articleUrl = `${baseUrl}/articles/${article.slug}`;
        const description = escapeXml(
          article.excerpt ||
            stripHtmlAndTruncate(article.content) ||
            'Click to read article...'
        );
        const title = escapeXml(article.title);
        const author = escapeXml(article.author_name || article.author || 'PhillySportsPack');
        const sportCategory = article.sport_id ? escapeXml(article.sport_id) : 'sports';
        const guid = `${baseUrl}/articles/${article.id}-${article.slug}`;

        rssXml += `    <item>
      <title>${title}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      <category>${sportCategory}</category>
      <description>${description}</description>
`;

        // Add content:encoded for full article content
        if (article.content) {
          const content = escapeXml(article.content);
          rssXml += `      <content:encoded><![CDATA[${article.content}]]></content:encoded>\n`;
        }

        // Add featured image if available
        if (article.featured_image_url) {
          rssXml += `      <enclosure url="${escapeXml(article.featured_image_url)}" type="image/jpeg" />\n`;
        }

        rssXml += `    </item>\n`;
      }
    }

    rssXml += `  </channel>
</rss>`;

    return new Response(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
