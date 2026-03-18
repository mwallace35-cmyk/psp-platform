'use client';

import { useState, useEffect } from 'react';

type Permission = 'default' | 'granted' | 'denied';

interface Props { topics?: string[]; onDismiss?: () => void; }

export default function PushNotificationBanner({ topics = ['game_results', 'recruiting_news', 'player_updates'], onDismiss }: Props) {
  const [permission, setPermission] = useState<Permission>('default');
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (localStorage.getItem('psp_notif_dismissed')) return;
    const cur = Notification.permission as Permission;
    setPermission(cur);
    if (cur === 'default') {
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
    if (cur === 'granted') setEnabled(true);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('psp_notif_dismissed', '1');
    onDismiss?.();
  };

  const handleEnable = async () => {
    setSaving(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result as Permission);
      if (result === 'granted') {
        setEnabled(true);
        await fetch('/api/notifications/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topics, enabled: true }),
          credentials: 'include',
        }).catch(() => {});
        new Notification('Philly Sports Pack', {
          body: 'You will get notified about game results, recruiting news, and player updates.',
          icon: '/favicon.ico',
        });
        setTimeout(handleDismiss, 2000);
      } else {
        handleDismiss();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!visible || permission === 'denied') return null;

  return (
    <div
      role='dialog'
      aria-label='Enable notifications'
      style={{
        position: 'fixed', bottom: '1.5rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 9999,
        background: 'var(--psp-navy, #1a2744)', color: '#fff',
        borderRadius: 12, padding: '1rem 1.25rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        maxWidth: 480, width: 'calc(100vw - 2rem)',
        border: '1px solid rgba(200,168,75,0.3)',
        animation: 'pspSlideUp 0.3s ease-out',
      }}
    >
      <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(200,168,75,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid rgba(200,168,75,0.3)' }}>
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#c8a84b' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/>
          <path d='M13.73 21a2 2 0 0 1-3.46 0'/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        {enabled ? (
          <><div style={{ fontWeight:700, fontSize:'0.9rem', color:'#22c55e' }}>Notifications on!</div>
          <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.6)' }}>You will hear about scores and recruiting news.</div></>
        ) : (
          <><div style={{ fontWeight:700, fontSize:'0.9rem' }}>Stay in the loop</div>
          <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.6)' }}>Game results, recruiting news and player updates.</div></>
        )}
      </div>
      {!enabled && (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flexShrink:0 }}>
          <button onClick={handleEnable} disabled={saving} style={{ background:'#c8a84b', color:'#1a2744', border:'none', borderRadius:6, padding:'0.4rem 0.85rem', fontSize:'0.8rem', fontWeight:700, cursor:saving?'not-allowed':'pointer' }}>
            {saving ? 'Enabling...' : 'Enable'}
          </button>
          <button onClick={handleDismiss} style={{ background:'transparent', color:'rgba(255,255,255,0.45)', border:'none', padding:'0.2rem', fontSize:'0.75rem', cursor:'pointer' }}>Not now</button>
        </div>
      )}
      <button onClick={handleDismiss} aria-label='Dismiss' style={{ position:'absolute', top:'0.5rem', right:'0.5rem', background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:'0.25rem', lineHeight:1 }}>
        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>
      </button>
      <style>{`@keyframes pspSlideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </div>
  );
}