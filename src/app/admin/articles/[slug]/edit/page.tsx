'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/sports';
import EntityLinker from '@/components/articles/EntityLinker';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();

  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sportId, setSportId] = useState<SportId>('football');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch article data
  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          alert('Article not found');
          router.push('/admin/articles');
          return;
        }

        setArticleId(data.id);
        setTitle(data.title || '');
        setContent(data.content || '');
        setSportId((data.sport_id || 'football') as SportId);
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setFeaturedImage(data.featured_image_url || '');
        setStatus(data.status || 'draft');
        setAuthor(data.author || '');
        setExcerpt(data.excerpt || '');
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug, supabase, router]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!articleId || loading) return;

    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        const draft = { title, content, sportId, tags, featuredImage, status, author, excerpt };
        localStorage.setItem(`article-${slug}-autosave`, JSON.stringify(draft));
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [articleId, loading, hasUnsavedChanges, title, content, sportId, tags, featuredImage, status, author, excerpt, slug]);

  // Check for auto-saved draft on load
  useEffect(() => {
    if (loading || !articleId) return;
    const saved = localStorage.getItem(`article-${slug}-autosave`);
    if (saved) {
      const draft = JSON.parse(saved);
      const restore = window.confirm('An auto-saved draft was found. Restore it?');
      if (restore) {
        setTitle(draft.title || title);
        setContent(draft.content || content);
        setSportId(draft.sportId || sportId);
        setTags(draft.tags || tags);
        setFeaturedImage(draft.featuredImage || featuredImage);
        setStatus(draft.status || status);
        setAuthor(draft.author || author);
        setExcerpt(draft.excerpt || excerpt);
      }
      localStorage.removeItem(`article-${slug}-autosave`);
    }
  }, [loading, articleId]);

  // Track changes
  const handleChange = useCallback((setter: (val: any) => void, val: any) => {
    setter(val);
    setHasUnsavedChanges(true);
  }, []);

  async function handleSave(publishNow: boolean) {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!articleId) return;

    setSaving(true);
    try {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { error } = await supabase
        .from('articles')
        .update({
          title,
          slug: newSlug,
          content,
          excerpt: excerpt || null,
          sport_id: sportId,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          featured_image_url: featuredImage || null,
          author,
          status: publishNow ? 'published' : 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId);

      if (error) throw error;

      localStorage.removeItem(`article-${slug}-autosave`);
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());

      // If slug changed, redirect to new URL
      if (newSlug !== slug) {
        router.push(`/admin/articles/${newSlug}/edit`);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-gray-500">
        Loading article...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy font-bebas mb-2">Edit Article</h1>
          <p className="text-gray-600">
            Editing: <span className="font-medium">{slug}</span>
            {lastSaved && (
              <span className="ml-3 text-sm text-green-600">Last saved: {lastSaved}</span>
            )}
            {hasUnsavedChanges && (
              <span className="ml-3 text-sm text-amber-600">Unsaved changes</span>
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/admin/articles')}>
          Back to Articles
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange(setTitle, e.target.value)}
              placeholder="Article headline"
              className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-md font-bebas focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <button
                type="button"
                onClick={async () => {
                  if (!content.trim()) { alert('Write article content first'); return; }
                  setGeneratingAI(true);
                  try {
                    const res = await fetch('/api/ai/summary', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, body: content }),
                    });
                    const data = await res.json();
                    if (data.error) throw new Error(data.error);
                    handleChange(setExcerpt, data.summary);
                  } catch (err: any) {
                    alert(err.message || 'Could not generate summary');
                  } finally {
                    setGeneratingAI(false);
                  }
                }}
                disabled={generatingAI}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
              >
                {generatingAI ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => handleChange(setExcerpt, e.target.value)}
              placeholder="Short summary for article cards and social sharing..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-gold hover:text-gold/80"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {!showPreview ? (
              <textarea
                value={content}
                onChange={(e) => handleChange(setContent, e.target.value)}
                placeholder="Write your article in markdown..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-gold"
              />
            ) : (
              <div className="border border-gray-300 rounded-md p-6 bg-white min-h-96 prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^/gm, '<p>')
                      .replace(/$/gm, '</p>'),
                  }}
                />
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => handleChange(setFeaturedImage, e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {featuredImage && (
              <div className="mt-3 rounded-md overflow-hidden border border-gray-300">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => handleChange(setTags, e.target.value)}
              placeholder="Comma-separated tags (e.g., recruiting, playoffs, top-10)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Entity Linking */}
          {articleId && <EntityLinker articleId={parseInt(articleId)} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sport */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Sport</h3>
            <select
              value={sportId}
              onChange={(e) => handleChange(setSportId, e.target.value as SportId)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {VALID_SPORTS.map((sport) => (
                <option key={sport} value={sport}>
                  {SPORT_META[sport].emoji} {SPORT_META[sport].name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Author</h3>
            <input
              type="text"
              value={author}
              onChange={(e) => handleChange(setAuthor, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-sm"
            />
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => handleChange(setStatus, e.target.value as 'draft')}
                  className="w-4 h-4 text-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => handleChange(setStatus, e.target.value as 'published')}
                  className="w-4 h-4 text-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>

          {/* View Public */}
          {status === 'published' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <a
                href={`/articles/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View published article &rarr;
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="primary"
              onClick={() => handleSave(status === 'published')}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : status === 'published' ? 'Update & Publish' : 'Save Draft'}
            </Button>
            {status === 'draft' && (
              <Button
                variant="secondary"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full"
              >
                Publish Now
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/articles')}
              disabled={saving}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
