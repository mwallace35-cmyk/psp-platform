import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
      title: 'Standings | Philadelphia High School Sports',
      description: 'Current season standings for Philadelphia high school sports.',
};

export const revalidate = 3600;

const SPORT_NAMES: Record<number, string> = {
      1: 'Football',
      2: 'Basketball',
      3: 'Baseball',
      4: 'Soccer',
      5: 'Lacrosse',
      6: 'Track & Field',
      7: 'Wrestling',
};

async function getStandings() {
      const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
      const { data: latestSeason } = await supabase
              .from('seasons')
              .select('id, year')
              .order('year', { ascending: false })
              .limit(1)
              .single();
      if (!latestSeason) return null;
      const { data: records } = await supabase
              .from('team_seasons')
              .select('school_id, sport_id, wins, losses, ties, win_pct, league_wins, league_losses, schools(name, slug)')
              .eq('season_id', latestSeason.id)
              .order('win_pct', { ascending: false });
      return { season: latestSeason, records: records ?? [] };
}

export default async function StandingsPage() {
      const data = await getStandings();
      if (!data || data.records.length === 0) {
              return (
                        <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                                    <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--psp-navy)' }}>
                                                  Standings
                                    </h1>h1>
                                    <p style={{ color: 'var(--psp-muted)' }}>Standings will be available once the season begins.</p>p>
                        </main>main>
                      );
      }
      const bySport: Record<number, typeof data.records> = {};
      for (const r of data.records) {
              if (!bySport[r.sport_id]) bySport[r.sport_id] = [];
              bySport[r.sport_id].push(r);
      }
      return (
              <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>
                                    Standings
                        </h1>h1>
                        <p style={{ color: 'var(--psp-muted)', marginBottom: '2rem' }}>{data.season.year} Season</p>p>
                  {Object.entries(bySport).map(([sportIdStr, teams]) => {
                          const sportId = Number(sportIdStr);
                          return (
                                        <section key={sportId} style={{ marginBottom: '2.5rem' }}>
                                                        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.i5mrpeomr't,  tcyopleo r{:  M'evtaard(a-t-ap s}p -fnraovmy )''n,e xbto'r;d
                                            eirmBpootrtto mL:i n'k2 pfxr osmo l'inde xvta/rl(i-n-kp's;p
                                            -igmoplodr)t' ,{  pcardedaitnegCBloitetnotm :}  'f0r.o5mr e'm@'s,u pmaabragsien/Bsoutptaobma:s e'-1jrse'm;'
                                             
                                            }e}x>p
                                            o r t   c o n s t   m e t a d{aStPaO:R TM_eNtAaMdEaSt[as p=o r{t
                                                I d ]t i?t?l e`:S p'oSrtta n$d{isnpgosr t|I dP}h`i}l
                                            a d e l p h i a   H i g h< /Shc2h>o
                                                o l   S p o r t s ' , 
                                                  < tdaebslcer ispttyiloen=:{ {' Cwuirdrtehn:t  's1e0a0s%o'n,  sbtoarnddeirnCgosl lfaoprs eP:h i'lcaodlellapphsiea' ,h ifgohn tsScihzoeo:l  's0p.o9rrtesm.'' ,}
                                                }}>;
                                                
                                                 
                                                 e x p o r t   c o n s t  <rtehveaaldi>d
                                                 a t e   =   3 6 0 0 ; 
                                                  
                                                  c o n s<tt rS PsOtRyTl_eN=A{M{E Sb:a cRkegcroorudn<dn:u m'bvearr,( -s-tprsipn-gn>a v=y ){'
                                                      ,   c1o:l o'rF:o o't#bfaflfl'' ,}
                                                     } > 
                                                 2 :   ' B a s k e t b a l l ' , 
                                                     <3t:h  'sBtaysleeb=a{l{l 't,e
                                                     x t A4l:i g'nS:o c'cleerf't,'
                                                     ,   p5a:d d'iLnagc:r o's0s.e5'r,e
                                                     m   06.:7 5'rTerma'c k} }&> SFciheolodl'<,/
                                                     t h >7
                                                     :   ' W r e s t l i n g ' , 
                                                         } ; 
                                                      
                                                     <atshy nsct yfluen=c{t{i opna dgdeitnSgt:a n'd0i.n5grse(m)  0{.
                                                         7 5 rceomn's t} }s>uWp<a/btahs>e
                                                       =   c r e a t e C l i e n t ( 
                                                         < t hp rsotcyelses=.{e{n vp.aNdEdXiTn_gP:U B'L0I.C5_rSeUmP A0B.A7S5Er_eUmR'L !},}
                                                     > L < / tphr>o
                                                     c e s s . e n v . N E X T _ P U B L I<Ct_hS UsPtAyBlAeS=E{_{A NpOaNd_dKiEnYg!:
                                                       ' 0).;5
                                                     r e mc o0n.s7t5 r{e md'a t}a}:> Wliant%e<s/ttShe>a
                                                     s o n   }   =   a w a i t   s u p a b<atshe 
                                                                                              s t y l e.=f{r{o mp(a'dsdeiansgo:n s''0).
                                                     5 r e m  .0s.e7l5ercetm('' i}d},> Lyeeaagru'e) 
                                                     W < / t h.>o
                                                     r d e r ( ' y e a r ' ,   {   a s c e<ntdhi nsgt:y lfea=l{s{e  p}a)d
                                                     d i n g :. l'i0m.i5tr(e1m) 
                                                     0 . 7 5 r.esmi'n g}l}e>(L)e;a
                                                     g u ei fL <(/!tlha>t
                                                     e s t S e a s o n )   r e t u r n< /nturl>l
                                                     ; 
                                                          c o n s t   {   d a t<a/:t hreeacdo>r
                                                     d s   }   =   a w a i t   s u<ptabboadsye>
                                                     
                                                             . f r o m ( ' t e a m _ s{etaesaomnss.'m)a
                                                     p ( ( t e.asme,l eic)t (='>s c{h
                                                         o o l _ i d ,   s p o r t _ i d ,   wcionnss,t  lsocshsoeosl,  =t iteesa,m .wsicnh_opoclts,  alse a{g unea_mwei:n ss,t rlienagg;u es_lluogs:s esst,r isncgh o}o l|s (nnualmle;,
                                                       s l u g ) ' ) 
                                                              . e q ( ' sreeatsuornn_ i(d
                                                     ' ,   l a t e s t S e a s o n . i d ) 
                                                       < t r  .koeryd=e{rt(e'awmi.ns_cphcoto'l,_ i{d }a sscteynldei=n{g{:  bfaaclksger o}u)n;d
                                                     :   ir e%t u2r n= ={=  s0e a?s o'n#:f flfa't e:s t'Sveaars(o-n-,p srpe-ccoarrdds-:b gr)e'c o}r}d>s
                                                       ? ?   [ ]   } ; 
                                                         } 
                                                      
                                                      e x p o r t   d e f<atudl ts tayslyen=c{ {f upnacdtdiionng :S t'a0n.d5irnegms P0a.g7e5(r)e m{'
                                                      } }c>o
                                                     n s t   d a t a   =   a w a i t   g e t S t a n d{isncghso(o)l; 
                                                     ?   (i
                                                     f   ( ! d a t a   | |   d a t a . r e c o r d s . l e<nLgitnhk  =h=r=e f0=){ `{/
                                                     s c h o orlest/u$r{ns c(h
                                                     o o l . s l u<gm}a`i}n  ssttyyllee=={{{{  cpoaldodri:n g':v a'r2(r-e-mp's,p -mnaaxvWyi)d't,h :f o'n9t0W0epixg'h,t :m a6r0g0i n}:} >'
                                                     0   a u t o '   } } > 
                                                                      < h 1   s t y l e{=s{c{h ofooln.tnFaammei}l
                                                     y :   ' v a r ( - - f o n t - b e b a s ) ' ,   f o n<t/SLiiznek:> 
                                                     ' 2 . 5 r e m ' ,   c o l o r :   ' v a r ( - - p)s p:- n(a
                                                     v y ) '   } } > 
                                                                          S t a n d i n g<ss
                                                                                             p a n > U n k n o<w/nh<1/>s
                                                                                             p a n > 
                                                                                                     < p   s t y l e = { {   c o l o r :   ' v)a}r
                                                                                                         ( - - p s p - m u t e d ) '   } } > S t a n d<i/ntgds> 
                                                                                             w i l l   b e   a v a i l a b l e   o n c e  <tthde  ssteyalseo=n{ {b etgeixntsA.l<i/gpn>:
                                                                                                   ' c e n t e<r/'m,a ipna>d
                                                                                             d i n g :) ;'
                                                                                             0 . 5}r
                                                                                             e m  c0o.n7s5tr ebmy'S p}o}r>t{:t eRaemc.owridn<sn u?m?b e0r},< /ttydp>e
                                                                                             o f   d a t a . r e c o r d s >   =   { } ; 
                                                                                             < t df osrt y(lceo=n{s{t  tre xotfA ldiagtna:. r'ecceonrtdesr)' ,{ 
                                                                                                 p a d d iinfg :( !'b0y.S5proermt [0r..7s5proermt'_ i}d}]>){ tbeyaSmp.olrots[sre.ss p?o?r t0_}i<d/]t d=> 
                                                                                             [ ] ; 
                                                                                                      b y S p o r t [ r . s p o r t<_tidd ]s.tpyulseh=({r{) ;t
                                                                                             e x t}A
                                                                                             l i grne:t u'rcne n(t
                                                                                             e r ' ,  <pmaadidni nsgt:y l'e0=.{5{r epma d0d.i7n5gr:e m''2 r}e}m>'
                                                                                             ,   m a x W i d t h :   ' 9 0 0 p x ' ,   m a r g{itne:a m'.0w ianu_tpoc't  }!}=> 
                                                                                             n u l l   ?  <`h$1{ (stteyalme.=w{i{n _fpocntt F*a m1i0l0y):. t'ovFairx(e-d-(f0o)n}t%-`b e:b a's-)-'',} 
                                                                                             f o n t S i z e :   ' 2 . 5 r e m ' ,   c o l<o/rt:d >'
                                                                                             v a r ( - - p s p - n a v y ) ' ,   m a r g i<ntBdo tsttoyml:e ='{0{. 2t5erxetmA'l i}g}n>:
                                                                                               ' c e n t e r 'S,t apnaddidnignsg
                                                                                             :   ' 0 . 5 r<e/mh 10>.
                                                                                             7 5 r e m '  <}p} >s{ttyelaem=.{l{e acgouleo_rw:i n'sv a?r?( -0-}p<s/pt-dm>u
                                                                                             t e d ) ' ,   m a r g i n B o t t o m :   ' 2<rtedm 's t}y}l>e{=d{a{t at.esxetaAsloing.ny:e a'rc}e nSteears'o,n <p/apd>d
                                                                                             i n g :   ' 0{.O5brjeemc t0..e7n5trreime's (}b}y>S{ptoeratm)..lmeaapg(u(e[_slpoosrsteIsd S?t?r ,0 }t<e/atmds>]
                                                                                             )   = >   { 
                                                                                                                  c o n s t  <s/ptorr>t
                                                                                             I d   =   N u m b e r ( s p o r t I d)S;t
                                                                                             r ) ; 
                                                                                                              r e t u r}n) }(
                                                                                             
                                                                                                                  < s e c<t/itobno dkye>y
                                                                                             = { s p o r t I d }   s t<y/ltea=b{l{e >m
                                                                                                 a r g i n B o t t o m<:/ s'e2c.t5iroenm>'
                                                                                                     } } > 
                                                                                                         ) ; 
                                                                                                             <}h)2} 
                                                                                                             s t y l e<=/{m{a ifno>n
                                                                                                             t F a)m;i
                                                                                                             l}y: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--psp-navy)', borderBottom: '2px solid var(--psp-gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                                                                                                 {SPORT_NAMES[sportId] ?? `Sport ${sportId}`}
                                                                                                                 </>h2>
                                                                                                                         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                                                                                                                       <thead>
                                                                                                                                                       <tr style={{ background: 'var(--psp-navy)', color: '#fff' }}>
                                                                                                                                                                         <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>School</th>th>
                                                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>W</th>th>
                                                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>L</th>th>
                                                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>Win%</th>th>
                                                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>League W</th>th>
                                                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>League L</th>th>
                                                                                                                                                           </tr>tr>
                                                                                                                                           </thead>thead>
                                                                                                                                       <tbody>
                                                                                                                                           {teams.map((team, i) => {
                                                                                                                   const school = team.schools as { name: string; slug: string } | null;
                                                                                                                   return (
                                                                                                                                           <tr key={team.school_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--psp-card-bg)' }}>
                                                                                                                                                                 <td style={{ padding: '0.5rem 0.75rem' }}>
                                                                                                                                                                     {school ? (
                                                                                                                                                                         <Link href={`/schools/${</rtehveaaldi>const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

type SportKey = 'football' | 'basketball' | 'baseball' | 'soccer' | 'lacrosse' | 'track-field' | 'wrestling';

const SPORT_META: Record<SportKey, { emoji: string; name: string }> = {
    football: { emoji: '🏈', name: 'Football' },
    basketball: { emoji: '🏀', name: 'Basketball' },
    baseball: { emoji: '⚾', name: 'Baseball' },
    soccer: { emoji: '⚽', name: 'Soccer' },
    lacrosse: { emoji: '🥍', name: 'Lacrosse' },
    'track-field': { emoji: '🏃', name: 'Track & Field' },
    wrestling: { emoji: '🤼', name: 'Wrestling' },
};

export const metadata: Metadata = {
    title: 'Standings | Philadelphia High School Sports',
    description: 'Current season league standings for Philadelphia high school football, basketball, baseball, soccer, lacrosse, track & field, and wrestling.',
    openGraph: {
          title: 'Standings | Philadelphia High School Sports',
          description: 'Current season league standings for Philadelphia high school football, basketball, baseball, soccer, lacrosse, track & field, and wrestling.',
          images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
};

async function getStandingsData() {
    try {
          const currentSeason = new Date().getFullYear();

      const { data: standingsData } = await supabase
            .from('team_season_records')
            .select('*')
            .eq('season', currentSeason)
            .order('sport', { ascending: true })
            .order('wins', { ascending: false });

      return standingsData || [];
    } catch (error) {
          console.error('Error fetching standings:', error);
          return [];
    }
}

interface StandingsRecord {
    school_iimdp:o rstt rtiynpge; 
{   Msecthaodoalt_an a}m ef:r osmt r'innegx;t
  ' ; 
sipmoprotr:t  sLtirnikn gf;r
o m  w'innesx:t /nluimnbke'r;;

i m ploorsts e{s :c rneuamtbeeCrl;i
               e n tt i}e sf:r onmu m'b@esru;p
  a b alseea/gsuuep_awbiansse?-:j sn'u;m
  b
eerx;p
o r tl ecaognuset_ lroesvsaelsi?d:a tneu m=b e3r6;0
0};



ecxopnosrtt  sduepfaabualste  a=s ycnrce aftuenCcltiieonnt (S
                                                            t a npdrioncgessPsa.geen(v). N{E
X T _cPoUnBsLtI Cs_tSaUnPdAiBnAgSsED_aUtRaL !=, 
  a w apirto cgeestsS.teannvd.iNnEgXsTD_aPtUaB(L)I;C
                                                                                           _
                                                                                           S U PcAoBnAsStE _gArNoOuNp_eKdEBYy!S
                                                                                           c)h;o
                                                                                           o
                                                                                           lt y=p es tSapnodritnKgesyD a=t a'.froeodtubcael(l('a c|c :' bRaesckoertdb<asltlr'i n|g ,' bSatsaenbdailnlg's R|e c'osrodc[c]e>r,'  r|e c'olradc:r oasnsye)'  =|>  '{t
                                                                                             r a c k -cfoinesltd 's c|h o'owlr e=s trleicnogr'd;.
                                                                                             s
                                                                                           cchoonoslt_ nSaPmOeR T|_|M E'TUAn:k nRoewcno'r;d
                                                                                           < S p o ritfK e(y!,a c{c [esmcohjoio:l ]s)t raicncg[;s cnhaomoel:]  s=t r[i]n;g
                                                                                                                  } >   =a c{c
                                                                                                                             [ s cfhooootlb]a.lplu:s h{( reemcoojrid:) ;'
                                                                                             🏈' ,   n armeet:u r'nF oaoctcb;a
                                                                                                                                                       l l '} ,} ,{
                                                                                                                                                       } ) ;b
                                                                                                                             a
                                                                                                                             s k ectobnasltl :s p{o retmKoejyis:  =' 🏀O'b,j encatm.ek:e y'sB(aSsPkOeRtTb_aMlElT'A )} ,a
                                                                                                                             s   SbpaosretbKaelyl[:] ;{
                                                                                                                                
                                                                                                                             e m orjeit:u r'n⚾' ,( 
                                                                                                                               n a m e :< d'iBva ssetbyallel='{ {} ,m
                                                                                                                             i n Hseoicgchetr::  '{1 0e0mvohj'i,:  b'a⚽c'k,g rnoaumned:C o'lSoorc:c e'r#'f 9}f,a
                                                                                                                               f b 'l,a cpraodsdsien:g B{o tetmoomj:i :' 6'0🥍'p,x 'n a}m}e>:
                                                                                                                                 ' L a c r o<sdsiev'  s}t,y
                                                                                           l e ='{t{r amcakx-Wfiidetlhd:' :' 1{2 0e0mpoxj'i,:  m'a🏃r'g,i nn:a m'e0:  a'uTtroa'c,k  p&a dFdiienlgd:'  '}1,6
                                                                                             p x 'w r}e}s>t
                                                                                             l i n g :   {   e<mho1j is:t y'l🤼'e,= {n{a mfeo:n t'SWirzees:t l'i2nrge'm '},, 
                                                                                             f}o;n
                                                                                           t
                                                                                           Weexipgohrtt:  c'o7n0s0t' ,m emtaardgaitnaB:o tMteotma:d a't8ap x='  {}
                                                                                          } > Lteiatgluee:  S'tSatnadnidnignsg<s/ h|1 >P
  h i l a d e l p h<ipa  sHtiyglhe =S{c{h ocooll oSrp:o r't#s6'6,6
                                        ' ,  dmeasrcgriinpBtoitotno:m :' C'u3r2rpexn't  }s}e>aCsuornr elneta gsueea ssotna nwdiinn-glso sfso rr ePchoirldasd<e/lpp>h
i
a   h i g h   s c{hsopoolr tfKoeoytsb.amlalp,( (bsapsokrettKbeayl)l ,= >b a{s
                                                                            e b a l l ,   s o c cceorn,s tl ascproorstsMee,t at r=a cSkP O&R Tf_iMeElTdA,[ sapnodr twKreeys]t;l
                                                                            i n g . ' , 
                                                                                   o pceonnGsrta pshp:o r{t
                                                                                                          s R e c otridtsl e=:  s'tSatnadnidnignsgDsa t|a .Pfhiilltaedre(l(prh:i aa nHyi)g h= >S crh.osoplo rStp o=r=t=s 's,p
                                                                                                          o r t K edye.srcerpilpatcieo(n':- '',C u'r r'e)n)t; 
                                                                                                            s
                                                                                                          e a s o n   l e a g uree tsutrann d(i
                                                                                                                                              n g s   f o r   P h i l a<ddeilvp hkieay =h{isgpho rstcKheoyo}l  sftoyolteb=a{l{l ,m abragsikneBtobtatlolm,:  b'a4s8epbxa'l l},} >s
                                                                                                          o c c e r ,   l a c r o s s e<,d itvr asctky l&e =f{i{e lddi,s palnady :w r'efsltelxi'n,g .a'l,i
                                                                                                            g n I t eimmsa:g e'sc:e n[t{e ru'r,l :g a'p/:o p'e8npgxr'a,p hm-airmgaigneB'o,t twoimd:t h':1 61p2x0'0 ,} }h>e
                                                                                                          i g h t :   6 3 0   } ] , 
                                                                              }<,s
                                                                                p}a;n

                                                                                satsyylnec= {f{u nfcotnitoSni zgee:t S't1a.n5drienmg's D}a}t>a{(s)p o{r
                                                                                  t M ettray. e{m
                                                                                    o j i } <c/osnpsatn >c
                                                                                u r r e n t S e a s o n   =   n e<wh 2D asttey(l)e.=g{e{t FfuolnltYSeiazre(:) ;'
                                                                                1
                                                                                . 5 r e mc'o,n sfto n{t Wdeaitgah:t :s t'a6n0d0i'n g}s}D>a{tsap o}r t=M eatwaa.inta mseu}p<a/bha2s>e

                                                                                             . f r o m ( ' t<e/admi_vs>e
                                                                                a
                                                                                s o n _ r e c o r d s ' ) 
                                                                                { s p o r t.ssReelceocrtd(s'.*l'e)n
                                                                                g t h   = = =. e0q (?' s(e
                                                                                a s o n ' ,   c u r r e n t S e a<sdoinv) 
                                                                                s t y l e = {.{o rbdaecrk(g'rsopuonrdtC'o,l o{r :a s'c#efnfdfi'n,g :b otrrdueer R}a)d
                                                                                i u s :   ' 8.poxr'd,e rp(a'dwdiinnsg':,  '{2 4apsxc'e,n dbionrgd:e rf:a l's1ep x} )s;o
                                                                                l
                                                                                i d   # er5eet7uerbn'  s}t}a>n
                                                                                d i n g s D a t a   | |   [ ] ; 
                                                                                    <}p  csat
