'use client';
import { useState } from 'react';

export default function CoachClaimPage() {
  const [form, setForm] = useState({ coachName: '', email: '', phone: '', school: '', sport: '', playerSlugs: '', message: '' });
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/coaches/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus('success'); } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  if (status === 'success') return (
    <div className="max-w-[560px] mx-auto mt-24 px-4 text-center">
      <div className="text-5xl mb-4">&#x2705;</div>
      <h2 className="psp-h1 text-[var(--psp-navy)]">Claim Submitted!</h2>
      <p className="text-gray-500 leading-relaxed">We&apos;ll verify your info and get back to you within 48 hours. Once approved you&apos;ll be able to manage your players&apos; profiles.</p>
      <a href="/" className="inline-block mt-6 bg-[var(--psp-gold)] text-white px-6 py-2.5 rounded-lg font-bold no-underline hover:bg-[var(--psp-gold-light)] transition-colors">Back to Home</a>
    </div>
  );

  return (
    <div className="max-w-[620px] mx-auto mt-12 px-4 pb-16">
      <div className="mb-8">
        <a href="/" className="text-[var(--psp-gold)] font-semibold text-sm no-underline hover:text-[var(--psp-gold-light)] transition-colors">&larr; Home</a>
        <h1 className="psp-h1 text-[var(--psp-navy)] mt-2 mb-1">Coach Claim Portal</h1>
        <p className="text-gray-500 text-sm leading-relaxed">Are you a coach of a Philly-area high school team? Claim your players to manage their profiles, add stats, and get notified of updates.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Your Name *</label>
            <input required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[var(--psp-gold)] transition-colors" value={form.coachName} onChange={e => set('coachName', e.target.value)} placeholder="Coach John Smith" />
          </div>
          <div>
            <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Email *</label>
            <input required type="email" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[var(--psp-gold)] transition-colors" value={form.email} onChange={e => set('email', e.target.value)} placeholder="coach@school.edu" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Phone</label>
            <input className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[var(--psp-gold)] transition-colors" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(215) 555-1234" />
          </div>
          <div>
            <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">School *</label>
            <input required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[var(--psp-gold)] transition-colors" value={form.school} onChange={e => set('school', e.target.value)} placeholder="Lincoln High School" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Sport *</label>
          <select required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none bg-white focus:border-[var(--psp-gold)] transition-colors" value={form.sport} onChange={e => set('sport', e.target.value)}>
            <option value="">Select sport...</option>
            <option>Football</option>
            <option>Boys Basketball</option>
            <option>Girls Basketball</option>
            <option>Baseball</option>
            <option>Softball</option>
            <option>Soccer</option>
            <option>Track &amp; Field</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Player Profile URLs / Names</label>
          <textarea className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none h-[90px] resize-y focus:border-[var(--psp-gold)] transition-colors" value={form.playerSlugs} onChange={e => set('playerSlugs', e.target.value)} placeholder="List players you coach, e.g. John Smith (Class of 2025), Jane Doe..." />
          <span className="text-xs text-gray-500">List the players you coach so we can link your claim to their profiles.</span>
        </div>

        <div>
          <label className="block font-bold text-xs text-[var(--psp-navy)] mb-1 uppercase tracking-wide">Anything else?</label>
          <textarea className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none h-[70px] resize-y focus:border-[var(--psp-gold)] transition-colors" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Optional additional information..." />
        </div>

        {status === 'error' && <p className="text-red-500 text-sm m-0">Something went wrong. Please try again.</p>}

        <button type="submit" disabled={status === 'submitting'}
          className={`psp-h4 text-white border-none rounded-lg py-3 cursor-pointer transition-colors ${status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--psp-navy)] hover:bg-[var(--psp-navy-mid)]'}`}>
          {status === 'submitting' ? 'Submitting\u2026' : 'Submit Claim Request'}
        </button>
      </form>
    </div>
  );
}
