'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ToastContainer } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

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
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fieldName.trim()) {
      newErrors.fieldName = 'Please specify what needs fixing';
    }
    if (!proposedValue.trim()) {
      newErrors.proposedValue = 'Please provide the correct value';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      // Focus first error field
      const firstErrorId = Object.keys(newErrors)[0];
      const firstErrorElement = document.getElementById(`${firstErrorId}-input`);
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
      return;
    }

    setFieldErrors({});

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
      toastSuccess('Correction submitted! Thank you for helping improve our data.');
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
      toastError('Could not submit correction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <>
        <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
          Report an issue
        </button>
      </>
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
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close correction form">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>
      {error && (
        <div id="correction-error" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-3" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="field-name-input" className="block text-xs font-medium text-gray-700 mb-1">What needs fixing? <span aria-label="required">*</span></label>
            <input
              id="field-name-input"
              type="text"
              value={fieldName}
              onChange={(e) => {
                setFieldName(e.target.value);
                if (fieldErrors.fieldName) {
                  setFieldErrors({ ...fieldErrors, fieldName: '' });
                }
              }}
              placeholder="e.g., School name, Stats, Position"
              required
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.fieldName)}
              aria-describedby={fieldErrors.fieldName ? 'fieldName-error' : undefined}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] ${
                fieldErrors.fieldName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {fieldErrors.fieldName && (
              <div id="fieldName-error" className="text-red-700 text-xs mt-1" role="alert">
                {fieldErrors.fieldName}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="current-value" className="block text-xs font-medium text-gray-700 mb-1">Current value</label>
            <input
              id="current-value"
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="What it currently says"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="proposed-value-input" className="block text-xs font-medium text-gray-700 mb-1">Correct value <span aria-label="required">*</span></label>
          <input
            id="proposed-value-input"
            type="text"
            value={proposedValue}
            onChange={(e) => {
              setProposedValue(e.target.value);
              if (fieldErrors.proposedValue) {
                setFieldErrors({ ...fieldErrors, proposedValue: '' });
              }
            }}
            placeholder="What it should say"
            required
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.proposedValue)}
            aria-describedby={fieldErrors.proposedValue ? 'proposedValue-error' : undefined}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] ${
              fieldErrors.proposedValue ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {fieldErrors.proposedValue && (
            <div id="proposedValue-error" className="text-red-700 text-xs mt-1" role="alert">
              {fieldErrors.proposedValue}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="reason" className="block text-xs font-medium text-gray-700 mb-1">Why? (optional)</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="How do you know this is incorrect?"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="source-url" className="block text-xs font-medium text-gray-700 mb-1">Source link (optional)</label>
            <input
              id="source-url"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="submitter-name" className="block text-xs font-medium text-gray-700 mb-1">Your name (optional)</label>
            <input
              id="submitter-name"
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="submitter-email" className="block text-xs font-medium text-gray-700 mb-1">Your email (optional)</label>
            <input
              id="submitter-email"
              type="email"
              value={submitterEmail}
              onChange={(e) => setSubmitterEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-gold text-navy rounded-md hover:bg-gold/90 transition disabled:opacity-50 min-h-[44px] flex items-center justify-center"
          >
            {submitting ? 'Submitting...' : 'Submit Correction'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition min-h-[44px] flex items-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
