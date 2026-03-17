import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Recruiting Hub | Philadelphia High School Sports',
};
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
      title: 'Recruiting | Philadelphia High School Sports',
      description: 'Recruiting hub for Philadelphia high school athletes.',
};

export default function RecruitingPage() {
      return (
              <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
                        <section style={{ background: 'var(--psp-navy)', borderRadius: '12px', padding: '2.5rem', marginBottom: '2.5rem', color: '#fff' }}>
                                    <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.75rem', margin: '0 0 0.5rem' }}>
                                                  Recruiting Hub
                                    </h1>h1>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px', marginBottom: '1.5rem' }}>
                                                  The definitive source for Philadelphia high school recruiting. Discover top prospects, track stats, and connect with athletes.
                                    </p>p>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                  <Link href="/players" style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)', padding: '0.65rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                                                                  Browse Prospects
                                                  </Link>Link>
                                                  <a href="mailto:mwallace35@gmail.com?subject=Coach Inquiry" style={{ background: 'transparent', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, border: '2px solid rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
                                                                  Coach Inquiry
                                                  </a>a>
                                    </div>div>
                        </section>section>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                            {[
                  { href: '/players', label: 'Find Prospects', icon: '🔍', desc: 'Search 10,000+ athletes by sport, school, and year' },
                  { href: '/leaderboards', label: 'Stat Leaders', icon: '📊', desc: 'Top performers across every sport and season' },
                  { href: '/leaderboards/trending', label: 'Trending', icon: '📈', desc: 'Athletes gaining the most attention right now' },
                  { href: '/standings', label: 'Team Records', icon: '🏆', desc: 'School performance and league standings' },
                          ].map((card) => (
                                        <Link key={card.href} href={card.href} style={{ display: 'block', background: 'var(--psp-card-bg)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                                                        <diimvp osrtty ltey=p{e{  {f oMnettSaidzaet:a  '}1 .f7r5orme m''n,e xmta'r;g
                                            iinmBpootrtto mL:i n'k0 .f5rroemm '' n}e}x>t{/clairndk.'i;c
                                                o
                                            ne}x<p/odritv >c
                                            o n s t   m e t a d a t a<:d iMve tsatdyaltea= {={  {f
                                                                                                 o n ttFiatmliel:y :' R'evcarru(i-t-ifnogn t|- bPehbialsa)d'e,l pfhoinat SHiizgeh:  S'c1h.o1o5lr eSmp'o,r tcso'l,o
                                                r :  d'evsacrr(i-p-tpisopn-:n a'vRye)c'r,u imtairnggi nhBuobt tfoomr:  P'h0i.l2a5dreelmp'h i}a} >h{icgahr ds.clhaoboell }a<t/hdlievt>e
                                                s . ' , 
                                                } ; 

                                                 e x p o<rdti vd esftayullet= {f{u nfcotnitoSni zRee:c r'u0i.t8i5nrgePma'g,e (c)o l{o
                                                     r :  r'evtaurr(n- -(p
                                                s p - m u<tmeadi)n'  s}t}y>l{ec=a{r{d .pdaedsdci}n<g/:d i'v2>r
                                                e m ' ,   m a x W i d<t/hL:i n'k9>6
                                                0 p x ' ,   m a r)g)i}n
                                                :   ' 0   a u<t/od'i v}>}
                                                > 
                                                          < s<escetcitoino ns tsytlyel=e{={{ {b abcakcgkrgoruonudn:d :' v'avra(r-(--p-spps-pc-anradv-yb)g'),' ,b obrodredreRraRdaiduisu:s :' 1'21p0xp'x,' ,p apdaddidnign:g :' 2'.15.r5erme'm,' ,m amragrigniBnoBtottotmo:m :' 2'.25rreemm'' ,} }c>o
                                                l o r :   ' # f f<fh'2  }s}t>y
                                                                     l e = { {   f o n<thF1a msitlyyl:e ='{v{a rf(o-n-tfFoanmti-lbye:b a'sv)a'r,( -f-ofnotnSti-zbee:b a's1).'5,r efmo'n,t Sciozleo:r :' 2'.v7a5rr(e-m-'p,s pm-anragviyn):' ,' 0m a0r g0i.n5Broetmt'o m}:} >'
                                                1 r e m '   } } > 
                                                  R e c r u i t i n gP rHou bP
                                                i p e l i n e 
                                                  < / h 1 > 
                                                          < / h 2 > 
                                                                < p   s t y l e<=d{i{v  csotlyolre:= {'{r gdbias(p2l5a5y,:2 5'5f,l2e5x5',,0 .g7a5p):' ,' 2mraexmW'i,d tfhl:e x'W5r6a0pp:x '',w rmaapr'g i}n}B>o
                                                                    t t o m :   ' 1 . 5 r{e[m
                                                                        '   } } > 
                                                                    {   l aTbheel :d e'fNiFnLi tPilvaey esrosu'r,c ec ofuonrt :P h'i2l2a2d+e'l p}h,i
                                                                    a   h i g h   s c h o o l{  rleacbreuli:t i'nNgB.A  DPilsacyoevresr' ,t ocpo upnrto:s p'e8c7t+s',  }t,r
                                                                    a c k   s t a t s ,   a n{d  lcaobnenle:c t' MwLiBt hP laatyhelrest'e,s .c
                                                                    o u n t :   ' 1 1<6/+p'> 
                                                                        } , 
                                                                                    < d i v  ]s.tmyalpe(=({s{t adti)s p=l>a y(:
                                                                          ' f l e x ' ,   g a p :< d'i1vr ekme'y,= {fslteaxtW.rlaapb:e l'}w>r
                                                                        a p '   } } > 
                                                                                      < d i v< Lsitnykl eh=r{e{f =f"o/nptlFaaymeirlsy":  s'tvyalre(=-{-{f obnatc-kbgerboausn)d':,  'fvoanrt(S-i-zpes:p -'g2orledm)'',,  ccoolloorr::  ''vvaarr((----ppsspp--gnoalvdy))'' ,} }p>a{dsdtiantg.:c o'u0n.t6}5<r/edmi v1>.
                                                                        5 r e m ' ,   b o r d e r R a<ddiiuvs :s t'y6lpex='{,{  tfeoxnttDSeiczoer:a t'i0o.n8:5 r'enmo'n,e 'c,o lfoorn:t W'eviagrh(t-:- p7s0p0-,m uftoendt)F'a m}i}l>y{:s t'avta.rl(a-b-eflo}n<t/-dbievb>a
                                                                        s ) ' ,   f o n t S i z e<:/ d'i1v.>1
                                                                            r e m ' ,   l e t t e)r)S}p
                                                                            a c i n g :   ' 0<./0d5ievm>'
                                                                                } } > 
                                                                                    < / s e c t i o n > 
                                                                                        B r o w s e  <Psreocstpieocnt ss
                                                                                                         t y l e = { {   b a c<k/gLrionukn>d
                                                                                        :   ' v a r ( - - p s<pa- nharveyf)='",m abiolrtdoe:rmRwaadliluasc:e 3'51@0gpmxa'i,l .pcaodmd?isnugb:j e'c1t.=5Croeamc'h,  Icnoqluoirr:y "' #sftfyfl'e,= {t{e xbtaAclkiggrno:u n'dc:e n'tterra'n s}p}a>r
                                                                                        e n t ' ,   c o l<ohr2:  s't#yflfef='{,{  pfaodndtiFnagm:i l'y0:. 6'5vraerm( -1-.f5ornetm-'b,e bbaosr)d'e,r RfaodnituSsi:z e':6 p'x1'.,5 rteemx't,D emcaorrgaitni:o n':0  '0n o0n.e5'r,e mf'o n}t}W>e
                                                                                        i g h t :   6 0 0 ,  Cbooarcdheers::  'G2eptx  Esaorlliyd  Arcgcbeas(s2
                                                                                        5 5 , 2 5 5 , 2 5<5/,h02.>4
                                                                                            ) ' ,   f o n t S<ipz es:t y'l0e.=9{5{r ecmo'l o}r}:> 
                                                                                            ' r g b a ( 2 5 5 , 2 5 5C,o2a5c5h, 0I.n7q)u'i,r ym
                                                                                            a r g i n B o t t o m<:/ a'>1
                                                                                                r e m ' ,   f o n<t/Sdiizve>:
                                                                                                  ' 0 . 9 r e<m/'s e}c}t>i
                                                                                                o n > 
                                                                                                             <Addivva nscteydl er=e{c{r udiitsipnlga yt:o o'lgsr,i dc'u,s tgormi dpTreomsppleactte Cloilsutmsn,s :a n'dr evpeeraitf(iaeudt oa-tfhillelt,e  mpirnomfaixl(e2s2 0cpoxm,i n1gf rs)o)o'n,. 
                                                                                                g a p :   ' 1 r e<m/'p,> 
                                                                                                m a r g i n B o t<tao mh:r e'f2=."5mraeiml't o}:}m>w
                                                                                                a l l a c e 3 5 @{g[m
                                                                                                    a i l . c o m ? s u b{j ehcrte=fC:o a'c/hp lEaayrelrys 'A,c cleasbse"l :s t'yFlien=d{ {P rboascpkegcrtosu'n,d :i c'ovna:r ('-🔍-'p,s pd-egsocl:d )''S,e acroclho r1:0 ,'0v0a0r+( -a-tphslpe-tneasv yb)y' ,s ppoardtd,i nsgc:h o'o0l.,6 raenmd  1y.e5arre'm '},, 
                                                                                                b o r d e r R a d i u{s :h r'e6fp:x '',/ lteeaxdteDrebcooarradtsi'o,n :l a'bneoln:e '',S tfaotn tLWeeaidgehrts:' ,7 0i0c,o nf:o n't📊'F,a mdielsyc::  ''vTaorp( -p-efrofnotr-mbeerbsa sa)c'r,o slse tetveerrSyp ascpionrgt:  a'n0d. 0s5eeams'o n}'} >}
                                                                                                , 
                                                                                                                  R e{q uhersetf :A c'c/elsesa
                                                                                                d e r b o a r d s</>/tar>e
                                                                                            n d i n g ' ,< /lsaebcetli:o n'>T
                                                                                                r e n d i<n/gm'a,i ni>c
                                                                                                o n :) ;'
                                                                                                📈}', desc: 'Athletes gaining the most attention right now' },
                                                                                                { href: '/standings', label: 'Team Records', icon: '🏆', desc: 'School performance and league standings' },
                                                                                                        ].map((card) => (
                                                                                                          <Link key={card.href} href={card.href} style={{ display: 'block', background: 'var(--psp-card-bg)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                                                                                                                          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.icon}</div>div>
                                                                                                                          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.15rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>{card.label}</div>div>
                                                                                                                          <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{card.desc}</div>div>
                                                                                                              </Link>Link>
                                                                                                        ))}
                                                                                                </>div>
                                                                                                  <section style={{ background: 'var(--psp-card-bg)', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
                                                                                                              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--psp-navy)', marginBottom: '1rem' }}>
                                                                                                                            Pro Pipeline
                                                                                                                  </h2>h2>
                                                                                                              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                                                                                                  {[
                                            { label: 'NFL Players', count: '222+' },
                                            { label: 'NBA Players', count: '87+' },
                                            { label: 'MLB Players', count: '116+' },
                                                      ].map((stat) => (
                                                                      <div key={stat.label}>
                                                                                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'var(--psp-gold)' }}>{stat.count}</div>div>
                                                                                        <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{stat.label}</div>div>
                                                                      </div>div>
                                                                                                                            ))}
                                                                                                                  </div>div>
                                                                                                      </section>section>
                                                                                                  <section style={{ background: 'var(--psp-navy)', borderRadius: '10px', padding: '1.5rem', color: '#fff', textAlign: 'center' }}>
                                                                                                              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', margin: '0 0 0.5rem' }}>
                                                                                                                            Coaches: Get Early Access
                                                                                                                  </h2>h2>
                                                                                                              <p style={{ color:
export default function RecruitingPage() {
    return (
          <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '60px' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px' }}>Recruiting Hub</h1>h1>
                            <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '40px' }}>Connect with top Philadelphia high school athletes on their path to college and professional sports.</p>p>

                            <div style={{ marginBottom: '48px' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Pro Pipeline</h2>h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                                      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>222+</div>div>
                                                                      <p style={{ color: '#666' }}>NFL Players</p>p>
                                                      </div>div>
                                                      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>87+</div>div>
                                                                      <p style={{ color: '#666' }}>NBA Players</p>p>
                                                      </div>div>
                                                      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>116+</div>div>
                                                                      <p style={{ color: '#666' }}>MLB Players</p>p>
                                                      </div>div>
                                        </div>div>
                            </div>div>

                            <div>
                                      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Resources</h2>h2>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                                  <Link href="/players" style={{ backgroundColor: '#fff', borderRadius
            :
             e'x8ppoxr't,  dpeafdaduilntg :f u'n2c4tpixo'n,  Rbeocrrdueirt:i n'g1Ppaxg es(o)l i{d
                 # er5eet7uerbn' ,( 
                                      t e x t D<edciovr asttiyolne:= {'{n omnien'H,e icgohlto:r :' 1'0i0nvhhe'r,i tb'a c}k}g>r
                                      o u n d C o l o r :   ' # f 9<fha3f bs't,y lpea=d{d{i nfgoBnottWteoimg:h t':6 0'p6x0'0 '},} >m
                                      a r g i n B o<tdtiovm :s t'y8lpex='{ {} }m>a📋x WFiidntdh :P r'o1s2p0e0cptxs'<,/ hm3a>r
                                      g i n :   ' 0   a u t o ' ,  <ppa dsdtiynlge:= {'{1 6cpoxl'o r}:} >'
                                      # 6 6 6 ' ,   f o<nht1S isztey:l e'=0{.{8 7f5ornetmS'i z}e}:> S'e2a.r5crhe ma'n,d  fdoinstcWoeviegrh tt:o p' 7a0t0h'l,e tmeasr.g<i/npB>o
                                      t t o m :   ' 2 4 p x '  <}/}L>iRnekc>r
                                      u i t i n g   H u b < / h<1L>i
                                      n k   h r e f = "</>pl esatdyelreb=o{a{r dfso"n tsStiyzlee:= {'{1 .b1a2c5krgermo'u,n dcCoolloorr::  ''##6f6f6f'',,  mbaorrgdienrBRoatdtioums::  ''480ppxx'',  }p}a>dCdoinnnge:c t' 2w4iptxh' ,t obpo rPdheirl:a d'e1lppxh isao lhiidg h# es5ceh7oeobl' ,a tthelxettDeesc oorna ttihoeni:r  'pnaotnhe 't,o  ccoollolre:g e' iannhde rpirto'f e}s}s>i
                                      o n a l   s p o r t s . < / p<>h
                                      3
                                        s t y l e = { {< dfiovn tsWteyilgeh=t{:{  'm6a0r0g'i,n Bmoatrtgoimn:B o't4t8opmx:'  '}8}p>x
                                      '   } } > 📊  S t a t  <Lhe2a dsetrysl<e/=h{3{> 
                                      f o n t S i z e :   ' 1 . 5 r<epm 's,t yfloen=t{W{e icgohlto:r :' 6'0#06'6,6 'm,a rfgoinntBSoitzteo:m :' 0'.2847p5xr'e m}'} >}P}r>oT oPpi ppeelrifnoer<m/ehr2s>.
                                      < / p > 
                                                  < d i v   s t<y/lLei=n{k{> 
                                      d i s p l a y :   ' g<r/iddi'v,> 
                                      g r i d T e m p l<a/tdeiCvo>l
                                      u m n s :   '<r/edpieva>t
                                      ( 3 ,   1<f/rd)i'v,> 
                                      g a p):; 
                                      '}16px' }}>
                                                  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>222+</div>div>
                                                                <p style={{ color: '#666' }}>NFL Players</p>p>
                                                  </div>div>
                                                  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>87+</div>div>
                                                                <p style={{ color: '#666' }}>NBA Players</p>p>
                                                  </div>div>
                                                  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>116+</div>div>
                                                                <p style={{ color: '#666' }}>MLB Players</p>p>
                                                  </div>div>
                                      </>div>
                                      </>div>
                                      
                                              <div>
                                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Resources</h2>h2>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                                                    <Link href="/players" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                                  <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>📋 Find Prospects</h3>h3>
                                                                                  <p style={{ color: '#666', fontSize: '0.875rem' }}>Search and discover top athletes.</p>p>
                                                                    </Link>Link>
                                                                    <Link href="/leaderboards" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' }}>
                                                                                  <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Stat Leaders</h3>h3>
                                                                                  <p style={{ color: '#666', fontSize: '0.875rem' }}>Top performers.</p>p>
                                                                    </Link>Link>
                                                        </div>div>
                                              </div>div>
                                      </>div>
                                      </>div>
                                        );
                                        }</></div>
