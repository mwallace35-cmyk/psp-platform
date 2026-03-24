'use client';
import { useState } from 'react';

const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';

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
    <div style={{ maxWidth:560, margin:'6rem auto', padding:'0 1rem', textAlign:'center' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
      <h2 className="psp-h1" style={{ color:navy }}>Claim Submitted!</h2>
      <p style={{ color:muted, lineHeight:1.6 }}>We&apos;ll verify your info and get back to you within 48 hours. Once approved you&apos;ll be able to manage your players&apos; profiles.</p>
      <a href="/" style={{ display:'inline-block', marginTop:'1.5rem', background:gold, color:'#fff', padding:'0.6rem 1.5rem', borderRadius:8, fontWeight:700, textDecoration:'none' }}>Back to Home</a>
    </div>
  );

  const inputStyle: React.CSSProperties = { width:'100%', padding:'0.6rem 0.8rem', borderRadius:7, border:'1px solid var(--psp-gray-300, #d1d5db)', fontSize:'0.92rem', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };
  const labelStyle: React.CSSProperties = { display:'block', fontWeight:700, fontSize:'0.8rem', color:navy, marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div style={{ maxWidth:620, margin:'3rem auto', padding:'0 1rem 4rem' }}>
      <div style={{ marginBottom:'2rem' }}>
        <a href="/" style={{ color:gold, fontWeight:600, fontSize:'0.82rem', textDecoration:'none' }}>{String.fromCharCode(8592)} Home</a>
        <h1 className="psp-h1" style={{ color:navy, margin:'0.5rem 0 0.25rem' }}>Coach Claim Portal</h1>
        <p style={{ color:muted, fontSize:'0.9rem', lineHeight:1.5 }}>Are you a coach of a Philly-area high school team? Claim your players to manage their profiles, add stats, and get notified of updates.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background:'var(--psp-card-bg, #fff)', border:'1px solid var(--psp-gray-200, #e5e7eb)', borderRadius:12, padding:'2rem', display:'flex', flexDirection:'column', gap:'1.2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input required style={inputStyle} value={form.coachName} onChange={e => set('coachName', e.target.value)} placeholder="Coach Mike Wallace" />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input required type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="coach@school.edu" />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(215) 555-1234" />
          </div>
          <div>
            <label style={labelStyle}>School *</label>
            <input required style={inputStyle} value={form.school} onChange={e => set('school', e.target.value)} placeholder="Lincoln High School" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Sport *</label>
          <select required style={{...inputStyle, background:'#fff'}} value={form.sport} onChange={e => set('sport', e.target.value)}>
            <option value="">Select sport...</option>
            <option>Football</option>
            <option>Boys Basketball</option>
            <option>Girls Basketball</option>
            <option>Baseball</option>
            <option>Softball</option>
            <option>Soccer</option>
            <option>Track & Field</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Player Profile URLs / Names</label>
          <textarea style={{...inputStyle, height:90, resize:'vertical' as const}} value={form.playerSlugs} onChange={e => set('playerSlugs', e.target.value)} placeholder="List players you coach, e.g. John Smith (Class of 2025), Jane Doe..." />
          <span style={{ fontSize:'0.75rem', color:muted }}>List the players you coach so we can link your claim to their profiles.</span>
        </div>

        <div>
          <label style={labelStyle}>Anything else?</label>
          <textarea style={{...inputStyle, height:70, resize:'vertical' as const}} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Optional additional information..." />
        </div>

        {status === 'error' && <p style={{ color:'#ef4444', fontSize:'0.85rem', margin:0 }}>Something went wrong. Please try again.</p>}

        <button type="submit" disabled={status === 'submitting'}
          className="psp-h4"
          style={{ background: status === 'submitting' ? 'var(--psp-gray-light, #9ca3af)' : navy, color:'#fff', border:'none', borderRadius:8, padding:'0.75rem', cursor: status === 'submitting' ? 'not-allowed' : 'pointer' }}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Claim Request'}
        </button>
      </form>
    </div>
  );
}
