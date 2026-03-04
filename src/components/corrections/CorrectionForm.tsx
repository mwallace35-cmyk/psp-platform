'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CorrectionFormProps {
  entityType: 'player' | 'school' | 'team_season' | 'championship';
  entityId: number;
  entityName: string;
}

export default function CorrectionForm({ entityType, entityId, entityName }: CorrectionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [reason, setReason] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fieldName.trim() || !proposedValue.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('corrections').insert({
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        field_name: fieldName,
        current_value: currentValue || null,
        proposed_value: proposedValue,
        reason: reason || null,
        source_url: sourceUrl || null,
        submitter_email: submitterEmail || null,
        submitter_name: submitterName || null,
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFieldName('');
        setCurrentValue('');
        setProposedValue('');
        setReason('');
        setSourceUrl('');
      }, 2000);
    } catch (err) {
      console.error('Error submitting correction:', err);
      alert('Could not submit correction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
        Report an issue
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
        Thanks for submitting a correction! Our team will review it shortly.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">Report an Issue — {entityName}</h4>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">What needs fixing? *</label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g., School name, Stats, Position"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Current value</label>
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="What it currently says"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Correct value *</label>
          <input
            type="text"
            value={proposedValue}
            onChange={(e) => setProposedValue(e.target.value)}
            placeholder="What it should say"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Why? (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="How do you know this is incorrect?"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Source link (optional)</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Your name (optional)</label>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Your email (optional)</label>
            <input
              type="email"
              value={submitterEmail}
              onChange={(e) => setSubmitterEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-gold text-navy rounded-md hover:bg-gold/90 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Correction'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
