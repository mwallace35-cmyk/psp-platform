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
 * ISO 8601 date formatter for Atom feeds
 */
function toISO8601(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
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
 * Strip HTML tags for plain text summary
 */
function stripHtml(html: string | null | undefined, maxLength = 200): string {
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

    const now = new Date().toISOString();
    const baseUrl = 'https://phillysportspack.com';

    // Build Atom XML
    let atomXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PhillySportsPack - Philadelphia High School Sports</title>
  <id>tag:phillysportspack.com,2026:feed</id>
  <link href="${baseUrl}/" rel="alternate" type="text/html" />
  <link href="${baseUrl}/rss" rel="self" type="application/atom+xml" />
  <updated>${now}</updated>
  <author>
    <name>PhillySportsPack</name>
    <email>contact@phillysportspack.com</email>
  </author>
  <rights>Copyright ${new Date().getFullYear()} PhillySportsPack.com - All rights reserved.</rights>
  <subtitle>Coverage of Philadelphia area high school football, basketball, baseball, and more</subtitle>
`;

    // Add articles as entries
    if (articles && articles.length > 0) {
      for (const article of articles) {
        const published = article.published_at
          ? toISO8601(article.published_at)
          : toISO8601(article.created_at);
        const articleUrl = `${baseUrl}/articles/${article.slug}`;
        const summary = escapeXml(
          article.excerpt ||
            stripHtml(article.content) ||
            'Click to read article...'
        );
        const title = escapeXml(article.title);
        const author = article.author_name || article.author || 'PhillySportsPack';

        atomXml += `  <entry>
    <title>${title}</title>
    <id>tag:phillysportspack.com,2026:articles/${article.id}</id>
    <link href="${articleUrl}" rel="alternate" type="text/html" />
    <published>${published}</published>
    <updated>${published}</updated>
    <author>
      <name>${escapeXml(author)}</name>
    </author>
`;

        // Add category if sport_id exists
        if (article.sport_id) {
          atomXml += `    <category term="${escapeXml(article.sport_id)}" />\n`;
        }

        // Add summary
        atomXml += `    <summary>${summary}</summary>\n`;

        // Add content
        if (article.content) {
          atomXml += `    <content type="html"><![CDATA[${article.content}]]></content>\n`;
        }

        // Add media content if featured image exists
        if (article.featured_image_url) {
          atomXml += `    <link href="${escapeXml(article.featured_image_url)}" rel="enclosure" type="image/jpeg" />\n`;
        }

        atomXml += `  </entry>\n`;
      }
    }

    atomXml += `</feed>`;

    return new Response(atomXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Atom feed generation error:', error);
    return new Response('Error generating Atom feed', { status: 500 });
  }
}
