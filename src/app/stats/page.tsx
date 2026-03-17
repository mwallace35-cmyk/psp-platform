import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Statistics & Records | Philadelphia High School Sports',
};

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
