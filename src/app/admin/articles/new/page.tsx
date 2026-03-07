'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button, ToastContainer } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/sports';

export default function NewArticle() {
  const router = useRouter();
  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sportId, setSportId] = useState<SportId>('football');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [author, setAuthor] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setAuthor(user.email);
      }
    }
    getUser();
  }, [supabase.auth]);

  async function handleSave(publishNow: boolean) {
    if (!title.trim()) {
      toastError('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { error } = await supabase.from('articles').insert({
        title,
        slug,
        content,
        sport_id: sportId,
        tags: tags.split(',').map((t) => t.trim()),
        featured_image_url: featuredImage || null,
        author,
        status: publishNow ? 'published' : 'draft',
      });

      if (error) throw error;

      toastSuccess(`Article ${publishNow ? 'published' : 'saved as draft'} successfully!`);
      router.push('/admin/articles');
      router.refresh();
    } catch (error) {
      console.error('Error saving article:', error);
      toastError('Error saving article. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
      <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy font-bebas mb-2">New Article</h1>
          <p className="text-gray-600">Create a new article for Philadelphia high school sports</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article headline"
              className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-md font-bebas focus:outline-none focus:ring-2 focus:ring-gold"
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
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in markdown..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-gold"
              />
            ) : (
              <div className="border border-gray-300 rounded-md p-6 bg-white min-h-96 prose prose-sm max-w-none">
                {/* Basic markdown rendering */}
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
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {featuredImage && (
              <div className="mt-3 rounded-md overflow-hidden border border-gray-300 relative w-full h-48">
                <Image
                  src={featuredImage}
                  alt="Featured"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
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
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags (e.g., recruiting, playoffs, top-10)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sport */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Sport</h3>
            <select
              value={sportId}
              onChange={(e) => setSportId(e.target.value as SportId)}
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
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Current: {userEmail}</p>
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
                  onChange={(e) => setStatus(e.target.value as 'draft')}
                  className="w-4 h-4 text-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.value as 'published')}
                  className="w-4 h-4 text-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="primary"
              onClick={() => handleSave(status === 'published')}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : status === 'published' ? 'Publish' : 'Save Draft'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              disabled={saving}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
