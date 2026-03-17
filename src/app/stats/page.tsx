import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Statistics & Records | Philadelphia High School Sports',
};
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
      title: 'Stats | Philadelphia High School Sports',
      description: 'Statistics hub for Philadelphia high school sports.',
};

const SECTIONS = [
    { href: '/leaderboards', label: 'Leaderboards', icon: '🏆', desc: 'Top performers across all sports' },
    { href: '/leaderboards/trending', label: 'Trending Players', icon: '📈', desc: 'Players gaining the most attention' },
    { href: '/standings', label: 'Standings', icon: '📊', desc: 'Current season W-L records' },
    { href: '/football/efficiency', label: 'Football Efficiency', icon: '🏈', desc: 'YPC, completion %, TD:INT ratio' },
    { href: '/history', label: 'PSP History', icon: '📅', desc: 'This week in Philadelphia sports history' },
    { href: '/schools', label: 'Schools', icon: '🏫', desc: 'Browse all 400+ Philadelphia schools' },
    ];

const SPORTS = [
    { href: '/football/leaderboards', label: 'Football', emoji: '🏈' },
    { href: '/basketball/leaderboards', label: 'Basketball', emoji: '🏀' },
    { href: '/baseball/leaderboards', label: 'Baseball', emoji: '⚾' },
    { href: '/soccer/leaderboards', label: 'Soccer', emoji: '⚽' },
    { href: '/lacrosse/leaderboards', label: 'Lacrosse', emoji: '🥍' },
    { href: '/track/leaderboards', label: 'Track & Field', emoji: '🏃' },
    { href: '/wrestling/leaderboards', label: 'Wrestling', emoji: '🤼' },
    ];

export default function StatsPage() {
      return (
              <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
                        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>
                                    Stats Hub
                        </h1>h1>
                        <p style={{ color: 'var(--psp-muted)', marginBottom: '2rem' }}>
                                    Explore statistics, standings, and records across Philadelphia high school sports.
                        </p>p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                            {SECTIONS.map((s) => (
                            <Link key={s.href} href={s.href} style={{ display: 'block', background: 'var(--psp-card-bg)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>div>
                                            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.25rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>{s.label}</div>div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{s.desc}</div>div>
                            </Link>Link>
                                    ))}
                        </div>div>
                        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--psp-navy)'i,m pmoarrtg itnyBpoet t{o mM:e t'a1draetma'  }} }f>r
                  o m   ' n e x t 'B;y
                   iSmppoorrtt
                    L i n k   f<r/ohm2 >'
                  n e x t / l i<ndki'v; 
                                   s
                                   teyxlpeo=r{t{  cdoinssptl amye:t a'dfalteax:' ,M eftlaedxaWtraa p=:  {'
                                   w r atpi't,l eg:a p':S t'a0t.s7 5|r ePmh'i l}a}d>e
                  l p h i a   H i g{hS PSOcRhToSo.lm aSpp(o(rst)s '=,>
                    ( 
                  d e s c r i p t i o n<:L i'nSkt akteiys=t{isc.sh rheufb}  fhorre fP=h{isl.ahdreelfp}h isat yhlieg=h{ {s cdhiosopll asyp:o r'tisn.l'i,n
                      e}-;f
                      l
                      ecxo'n,s ta lSiEgCnTIItOeNmSs :=  '[c
                      e n t{e rh'r,e fg:a p':/ l'e0a.d4errebmo'a,r dbsa'c,k glraobuenld::  ''Lveaard(e-r-bposapr-dnsa'v,y )i'c,o nc:o l'o🏆r':,  'd#efsfcf:' ,' Tpoapd dpienrgf:o r'm0e.r5sr eamc r1orsesm 'a,l lb osrpdoerrtRsa'd i}u,s
                      :   '{2 0hprxe'f,:  t'e/xlteDaedceorrbaotairodns:/ t'rneonndei'n,g 'f,o nltaSbiezle::  ''T0r.e9nrdeimn'g  }P}l>a
                      y e r s ' ,   i c o n :  <'s📈'p,a nd>e{ssc.:e m'oPjlia}y<e/rssp agna>i
                          n i n g   t h e   m o s t< saptatne>n{tsi.olna'b e}l,}
                          < / s{p ahnr>e
                          f :   ' / s t a n d i<n/gLsi'n,k >l
                          a b e l :   ' S t)a)n}d
                          i n g s ' ,  <i/cdoinv:> 
                          ' 📊 ' ,  <d/emsaci:n >'
                          C u r)r;e
                          n}t season W-L records' },
                              { href: '/football/efficiency', label: 'Football Efficiency', icon: '🏈', desc: 'YPC, completion %, TD:INT ratio' },
                              { href: '/history', label: 'PSP History', icon: '📅', desc: 'This week in Philadelphia sports history' },
                              { href: '/schools', label: 'Schools', icon: '🏫', desc: 'Browse all 400+ Philadelphia schools' },
                          ];
                          
                          const SPORTS = [
                              { href: '/football/leaderboards', label: 'Football', emoji: '🏈' },
                              { href: '/basketball/leaderboards', label: 'Basketball', emoji: '🏀' },
                              { href: '/baseball/leaderboards', label: 'Baseball', emoji: '⚾' },
                              { href: '/soccer/leaderboards', label: 'Soccer', emoji: '⚽' },
                              { href: '/lacrosse/leaderboards', label: 'Lacrosse', emoji: '🥍' },
                              { href: '/track/leaderboards', label: 'Track & Field', emoji: '🏃' },
                              { href: '/wrestling/leaderboards', label: 'Wrestling', emoji: '🤼' },
                          ];
                          
                          export default function StatsPage() {
                                return (
                              <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
                                    <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>
                                            Stats Hub
                                    </h1>h1>
                                    <p style={{ color: 'var(--psp-muted)', marginBottom: '2rem' }}>
                                            Explore statistics, standings, and records across Philadelphia high school sports.
                                    </p>p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                                        {SECTIONS.map((s) => (
                            <Link key={s.href} href={s.href} style={{ display: 'block', background: 'var(--psp-card-bg)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>div>
                                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.25rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>{s.label}</div>div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{s.desc}</div>div>
                            </Link>Link>
                          ))}
                                    </div>div>
                                    <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--psp-navy)', marginBottom: '1rem' }}>
                                            By Sport
                                    </h2>h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {SPORTS.map((s) => (
                            <Link key={s.href} href={s.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--psp-navy)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        <span>{s.emoji}</span>span>
                                        <span>{s.label}</span>span>
                            </Link>Link>
                          ))}
                                    </div>div>
                              </main>main>
                            );
                              }</saptatne>
export default function StatsPage() {
    return (
          <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '24px' }}>Statistics & Records</h1>h1>

                            <div style={{ marginBottom: '32px' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Featured</h2>h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                                      <Link href="/leaderboards" style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                      <div style={{ fontSize: '2rem' }}>📊</div>div>
                                                                      <h3 style={{ fontWeight: '600', marginTop: '8px' }}>Leaderboards</h3>h3>
                                                      </Link>Link>
                                                      <Link href="/standings" style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                      <div style={{ fontSize: '2rem' }}>📈</div>div>
                                                                      <h3 style={{ fontWeight: '600', marginTop: '8px' }}>Standings</h3>h3>
                                                      </Link>Link>
                                        </div>div>
                            </div>div>

                            <div>
                                      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>By Sport</h2>h2>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                                        {['Football', 'Basketball', 'iBmapsoerbta ltly'p,e  '{S oMcecteard'a,t a' L}a cfrroosms e''n,e x'tT'r;a
                                      cikm p&o rFti eLlidn'k,  f'rWorme s'tnleixntg/'l]i.nmka'p;(
                                      (
                                      sepxoprotr)t  =c>o n(s
                                      t   m e t a d a t a :   M e t<aLdiantka  k=e y{=
            { s ptoirttl}e :h r'eSft=a{t`i/slteiacdse r&b oRaercdosr?dssp o|r tP=h$i{lsapdoerltp.htioaL oHwiegrhC aSsceh(o)o}l` }S psotrytlse'=,{
              {} ;b
                                      a
                                      cekxgproorutn ddCeoflaourl:t  'f#u2n5c6t3ieobn' ,S tcaotlsoPra:g e'(#)f f{f
                                        ' ,  rpeatdudrinn g(:
                                        ' 1 2 p<xd'i,v  bsotrydleer=R{a{d imuisn:H e'i4gphxt':,  't1e0x0tvDhe'c,o rbaatcikognr:o u'nndoCnoel'o,r :t e'x#tfA9lfiagfnb:'  '}c}e>n
                                      t e r ' ,   f<odnitvW esitgyhlte:= {'{5 0m0a'x W}i}d>t
                                      h :   ' 1 2 0 0 p x ' ,   m a r g{isnp:o r't0} 
                                      a u t o ' ,   p a d d i n g :< /'L1i6npkx>'
                                        } } > 
                                                      )<)h}1
                                                        s t y l e = { {   f<o/ndtiSvi>z
            e :   ' 2 r e m '<,/ dfiovn>t
            W e i g h t :< /'d7i0v0>'
            ,   m a r<g/idniBvo>t
            t o m):; 
            '}24px' }}>Statistics & Records</>h1>
                                                              
                                                              <div style={{ marginBottom: '32px' }}>
                                                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Featured</h2>h2>
                                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                                                                    <Link href="/leaderboards" style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                                                  <div style={{ fontSize: '2rem' }}>📊</div>div>
                                                                                                  <h3 style={{ fontWeight: '600', marginTop: '8px' }}>Leaderboards</h3>h3>
                                                                                    </Link>Link>
                                                                                    <Link href="/standings" style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                                                  <div style={{ fontSize: '2rem' }}>📈</div>div>
                                                                                                  <h3 style={{ fontWeight: '600', marginTop: '8px' }}>Standings</h3>h3>
                                                                                    </Link>Link>
                                                                        </div>div>
                                                              </div>div>
                                                      
                                                              <div>
                                                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>By Sport</h2>h2>
                                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                                                                          {['Football', 'Basketball', 'Baseball', 'Soccer', 'Lacrosse', 'Track & Field', 'Wrestling'].map((sport) => (
                          <Link key={sport} href={`/leaderboards?sport=${sport.toLowerCase()}`} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px', borderRadius: '4px', textDecoration: 'none', textAlign: 'center', fontWeight: '500' }}>
                            {sport}
                          </Link>Link>
                        ))}
                                                                        </div>div>
                                                              </div>div>
                                                      </>div>
                                      </>div>
                                        );
                                        }</div>
