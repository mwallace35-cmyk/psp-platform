'use client';
import { useState } from 'react';

const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';

const SPORTS = ['Football', 'Boys Basketball', 'Girls Basketball', 'Baseball', 'Softball', 'Soccer', 'Track & Field', 'Wrestling', 'Lacrosse', 'Cross Country'];
const YEARS = ['2025', '2026', '2027', '2028', '2029'];
const LEVELS = ['D1', 'D2', 'D3', 'JUCO', 'Any / Open'];

export default function RecruitPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', gradYear: '', sport: '', positions: '', gpa: '', height: '', weight: '', targetLevel: '', highlights: '', message: '' });
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/recruit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  if (status === 'success') return (
    <div style={{ maxWidth: 560, margin: '6rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.4rem', color: navy }}>You&apos;re on the radar!</h2>
      <p style={{ color: muted, lineHeight: 1.6, fontSize: '0.95rem' }}>Your recruiting profile has been submitted. College coaches browsing PhillySportsPack will be able to see your interest. We&apos;ll reach out if there&apos;s a match.</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <a href="/" style={{ background: navy, color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>Home</a>
        <a href="/leaderboards/trending" style={{ background: gold, color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>Browse Players</a>
      </div>
    </div>
  );

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.8rem', borderRadius: 7, border: '1px solid #d1d5db', fontSize: '0.92rem', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '0.78rem', color: navy, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const sectionHead = (label: string) => (
    <div style={{ borderBottom: `2px solid ${gold}`, paddingBottom: '0.4rem', marginBottom: '0.1rem' }}>
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: navy, letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: '3rem auto', padding: '0 1rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/" style={{ color: gold, fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>{String.fromCharCode(8592)} Home</a>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: navy, margin: '0.5rem 0 0.25rem', letterSpacing: '0.03em' }}>Recruiting Interest</h1>
        <p style={{ color: muted, fontSize: '0.9rem', lineHeight: 1.5, maxWidth: 500 }}>
          Are you a Philly-area student-athlete looking for college opportunities? Register your interest and get discovered by coaches browsing the platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        {sectionHead('Personal Info')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={labelStyle}>First Name *</label><input required style={inputStyle} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" /></div>
          <div><label style={labelStyle}>Last Name *</label><input required style={inputStyle} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={labelStyle}>Email *</label><input required type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@school.edu" /></div>
          <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(215) 555-1234" /></div>
        </div>

        {sectionHead('Athletic Profile')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Graduation Year *</label>
            <select required style={{ ...inputStyle, background: '#fff' }} value={form.gradYear} onChange={e => set('gradYear', e.target.value)}>
              <option value="">Select year...</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sport *</label>
            <select required style={{ ...inputStyle, background: '#fff' }} value={form.sport} onChange={e => set('sport', e.target.value)}>
              <option value="">Select sport...</option>
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Position(s)</label>
          <input style={inputStyle} value={form.positions} onChange={e => set('positions', e.target.value)} placeholder="QB, WR / PG, SG" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div><label style={labelStyle}>GPA</label><input style={inputStyle} value={form.gpa} onChange={e => set('gpa', e.target.value)} placeholder="3.8" /></div>
          <div><label style={labelStyle}>Height</label><input style={inputStyle} value={form.height} onChange={e => set('height', e.target.value)} placeholder="6'2&quot;" /></div>
          <div><label style={labelStyle}>Weight</label><input style={inputStyle} value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="185 lbs" /></div>
        </div>
        <div>
          <label style={labelStyle}>Target Level</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
            {LEVELS.map(l => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.85rem', padding: '0.3rem 0.7rem', borderRadius: 20, border: `1px solid ${form.targetLevel === l ? navy : '#d1d5db'}`, background: form.targetLevel === l ? navy : '#fff', color: form.targetLevel === l ? '#fff' : '#374151', fontWeight: form.targetLevel === l ? 700 : 400 }}>
                <input type="radio" name="targetLevel" value={l} checked={form.targetLevel === l} onChange={() => set('targetLevel', l)} style={{ display: 'none' }} />
                {l}
              </label>
            ))}
          </div>
        </div>

        {sectionHead('Highlight Links')}
        <div>
          <label style={labelStyle}>Hudl / YouTube Highlights</label>
          <input style={inputStyle} value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder="https://www.hudl.com/video/..." />
        </div>
        <div>
          <label style={labelStyle}>Additional Notes</label>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Anything else coaches should know..." />
        </div>

        {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>Something went wrong. Please try again.</p>}

        <button type="submit" disabled={status === 'submitting'}
          style={{ background: status === 'submitting' ? '#9ca3af' : gold, color: '#fff', border: 'none', borderRadius: 8, padding: '0.8rem', fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', letterSpacing: '0.06em', cursor: status === 'submitting' ? 'not-allowed' : 'pointer' }}>
          {status === 'submitting' ? 'Submitting…' : '🏆 Submit Recruiting Profile'}
        </button>
      </form>
    </div>
  );
}
