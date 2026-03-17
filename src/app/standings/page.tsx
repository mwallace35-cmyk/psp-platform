import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
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
          const bySport: Record<number, typeof diamtpao.rrte ctoyrpdes >{  =M e{t}a;d
          a t af o}r  f(rcoomn s'tn erx to'f; 
diamtpao.rrte cLoirndks )f r{o
m   ' n eixft /(l!ibnykS'p;o
ritm[pro.rstp o{r tc_rieda]t)e CblyiSepnotr t}[ rf.rsopmo r't@_siudp]a b=a s[e]/;s
        u p a b absyeS-pjosr't;[
        r
.esxppoorrtt_ icdo]n.sptu smhe(tra)d;a
t a :} 
M e traedtautran  =( 
        { 
                     t<imtalien:  s'tSytlaen=d{i{n gpsa d|d iPnhgi:l a'd2erlepmh'i,a  mHaixgWhi dStchh:o o'l9 0S0ppoxr't,s 'm,a
                             r g idne:s c'r0i patuitoon':  }'}C>u
        r r e n t   s<eha1s osnt ysltea=n{d{i nfgosn tfFoarm iPlhyi:l a'dvealrp(h-i-af ohnitg-hb esbcahso)o'l,  sfpoonrttSsi.z'e,:
                                           }';2
        .
        5erxepmo'r,t  ccoolnosrt:  r'evvaarl(i-d-aptsep -=n a3v6y0)0';,
         
        mcaorngsitn BSoPtOtRoTm_:N A'M0E.S2:5 rReemc'o r}d}<>n
        u m b e r ,   s tSrtianngd>i n=g s{
                
                     1 :   '<F/oho1t>b
        a l l ' , 
          < p2 :s t'yBlaes=k{e{t bcaolllo'r,:
          ' v3a:r ('-B-apssepb-amlult'e,d
        ) ' ,4 :m a'rSgoicncBeort't,o
        m :  5':2 r'eLma'c r}o}s>s{ed'a,t
        a . s6e:a s'oTnr.ayceka r&}  FSieealsdo'n,<
        / p >7
        :   ' W r e s{tOlbijnegc't,.
        e}n;t
        r
        iaessy(nbcy Sfpuonrctt)i.omna pg(e(t[SstpaonrdtiIndgSst(r),  {t
                e a mcso]n)s t= >s u{p
                        a b a s e   =   ccroenastte CslpioernttI(d
          =   N upmrboecre(sssp.oerntvI.dNSEtXrT)_;P
        U B L I C _ S U PrAeBtAuSrEn_ U(R
        L ! , 
                 p r o<cseescst.ieonnv .kNeEyX=T{_sPpUoBrLtIICd_}S UsPtAyBlAeS=E{_{A NmOaNr_gKiEnYB!o
        t t o)m;:
          ' 2c.o5nrsetm '{  }d}a>t
        a :   l a t e s t S e a s<ohn2  }s t=y laew=a{i{t  fsounptaFbaamsiel
        y :   ' v.afrr(o-m-(f'osneta-sboenbsa's))
        ' ,   f o.nsteSliezcet:( ''i1d.,5 ryeema'r,' )c
        o l o r :. o'rvdaerr((-'-ypesapr-'n,a v{y )a's,c ebnodridnegr:B oftatlosme:  }')2
        p x   s o.lliidm ivta(r1()-
        - p s p -.gsoilndg)l'e,( )p;a
        d d iinfg B(o!tltaotme:s t'S0e.a5sroenm)' ,r emtaurrgni nnBuoltlt;o
        m :  c'o1nrsetm '{  }d}a>t
        a :   r e c o r d s   }   =  {aSwPaOiRtT _sNuApMaEbSa[ssep
        o r t I d.]f}r
        o m ( ' t e a m _ s e a s<o/nhs2'>)
        
                 . s e l e c t (<'tsacbhloeo ls_tiydl,e =s{p{o rwti_ditdh,:  w'i1n0s0,% 'l,o sbsoersd,e rtCioelsl,a pwsien:_ p'ccto,l llaepasgeu'e,_ wfionnst,S ilzeea:g u'e0_.l9orsesme's ,} }s>c
        h o o l s ( n a m e ,   s l u<gt)h'e)a
        d > 
            . e q ( ' s e a s o n _ i d '<,t rl astteyslteS=e{a{s obna.cikdg)r
            o u n d :. o'rvdaerr((-'-wpisnp_-pncatv'y,) '{,  acsocleonrd:i n'g#:f fffa'l s}e} >}
            ) ; 
                 r e t u r n   {   s e a s o<nt:h  lsattyelset=S{e{a stoenx,t Arleicgonr:d s':l erfetc'o,r dpsa d?d?i n[g]:  }';0
            .}5
            r
            eemx p0o.r7t5 rdeemf'a u}l}t> Sacshyonocl <f/utnhc>t
            i o n   S t a n d i n g s P a g e ( )< t{h
                                                       s tcyolnes=t{ {d aptaad d=i nagw:a i't0 .g5erteSmt a0n.d7i5nrgesm(') ;}
                    } > Wi<f/ t(h!>d
            a t a   | |   d a t a . r e c o r d s<.tlhe nsgttyhl e==={={  0p)a d{d
                    i n g :  r'e0t.u5rrne m( 
            0 . 7 5 r e m<'m a}i}n> Ls<t/ytlhe>=
                                 { {   p a d d i n g :   ' 2 r e m ' ,< tmha xsWtiydlteh=:{ {' 9p0a0dpdxi'n,g :m a'r0g.i5nr:e m' 00 .a7u5troe'm '} }}>}
            > W i n % < / t h<>h
            1   s t y l e = { {   f o n t F a m i<ltyh:  s'tvyalre(=-{-{f opnatd-dbienbga:s )''0,. 5froenmt S0i.z7e5:r e'm2'. 5}r}e>mL'e,a gcuoel oWr<:/ t'hv>a
            r ( - - p s p - n a v y ) '   } } > 
            < t h   s t y l e = {S{t apnaddidnignsg
                    :   ' 0 . 5 r e m< /0h.17>5
                    r e m '   } } > L<epa gsutey lLe<=/{t{h >c
                            o l o r :   ' v a r ( - - p s p -<m/uttre>d
                    ) '   } } > S t a n d i n g s< /wtihlela db>e
                      a v a i l a b l e   o n c e< ttbhoed ys>e
                      a s o n   b e g i n s . < / p > 
                              { t e a m s .<m/ampa(i(nt>e
                      a m ,   i)); 
                      = >  }{
                              
                                  c o n s t   b y S p o r t :   R eccoonrsdt< nsucmhboeorl,  =t ytpeeaomf. sdcahtoao.lrse caosr d{s >n a=m e{:} ;s
                      t r ifnogr;  (scloungs:t  srt roifn gd a}t a|. rneuclolr;d
                      s )   { 
                                       i f   ( ! b y S p orrett[urr.ns p(o
                      r t _ i d ] )   b y S p o r t [ r . s p o<rttr_ ikde]y =={ t[e]a;m
                      . s c h oboylS_piodr}t [srt.yslpeo=r{t{_ ibda]c.kpgursohu(nrd):; 
                      i   %} 
                      2   =r=e=t u0r n?  ('
                      # f f f '< m:a i'nv asrt(y-l-ep=s{p{- cpaarddd-ibngg):'  '}2}r>e
                      m ' ,   m a x W i d t h :   ' 9 0 0 p x ' ,  <mtadr gsitny:l e'=0{ {a uptaod'd i}n}g>:
                        ' 0 . 5 r e<mh 10 .s7t5yrleem='{ {} }f>o
                      n t F a m i l y :   ' v a r ( - - f o n t - b e b{assc)h'o,o lf o?n t(S
                      i z e :   ' 2 . 5 r e m ' ,   c o l o r :   ' v a r (<-L-ipnskp -hnraevfy=){'',/ smcahrogoilnsB/o't t+o ms:c h'o0o.l2.5srleumg'}  }s}t>y
                      l e = { {   c o lSotra:n d'ivnagrs(
                      - - p s p - n<a/vhy1)>'
                      ,   f o n t W<epi gshtty:l e6=0{0{  }c}o>l
                      o r :   ' v a r ( - - p s p - m u t e d ) ' ,   m a r g i{nsBcohtotoolm.:n a'm2er}e
                      m '   } } > { d a t a . s e a s o n . y e a r }   S e<a/sLoinn<k/>p
                      > 
                              { O b j e c t . e n t r i e s ( b)y S:p o<rstp)a.nm>aUpn(k(n[oswpno<r/tsIpdaSnt>r},
                        t e a m s ] )   = >   { 
                                                 c<o/ntsdt> 
                                s p o r t I d   =   N u m b e r ( s p o r t I<dtSdt rs)t;y
                      l e = { {   t e xrteAtluirgnn :( 
                      ' c e n t e r ' ,   p<asdedcitnigo:n  'k0e.y5=r{esmp o0r.t7I5dr}e ms't y}l}e>={{t{e amma.rwgiinnsB o?t?t o0m}:< /'t2d.>5
                      r e m '   } } > 
                                               < h<2t ds tsytlyel=e{={{ {f otnetxFtaAmliilgyn::  ''vcaern(t-e-rf'o,n tp-abdedbiansg):' ,' 0f.o5nrteSmi z0e.:7 5'r1e.m5'r e}m}'>,{ tceoalmo.rl:o s'sveasr (?-?- p0s}p<-/ntadv>y
                                               ) ' ,   b o r d e r B o t t o m :   ' 2 p x  <stodl isdt yvlaer=({-{- ptsepx-tgAollidg)n':,  'pcaedndtienrg'B,o tptaodmd:i n'g0:. 5'r0e.m5'r,e mm a0r.g7i5nrBeomt't o}m}:> 
                                               ' 1 r e m '   } } > 
                                                       {{tSePaOmR.Tw_iNnA_MpEcSt[ s!p=o rntuIldl] }?
                                                 S t r i n g ( M a t h .<r/ohu2n>d
                                               ( t e a m . w i n _ p c t< t*a b1l0e0 )s)t y+l e'=%{'{  :w i'd-t-h':} 
                                               ' 1 0 0 % ' ,   b o r d e r C o l l a p s e :< /'tcdo>l
                                               l a p s e ' ,   f o n t S i z e :   ' 0 . 9 r<etmd'  s}t}y>l
                                               e = { {   t e x t A l i g n :< t'hceeandt>e
                                               r ' ,   p a d d i n g :   ' 0 . 5<rterm  s0t.y7l5er=e{m{'  b}a}c>k{gtreoaumn.dl:e a'gvuaer_(w-i-npss p?-?n a0v}y<)/'t,d >c
                                               o l o r :   ' # f f f '   } } > 
                                                           < t d   s t y l e = { {  <ttehx tsAtlyilgen=:{ {' cteenxtteArl'i,g np:a d'dlienfgt:' ,' 0p.a5drdeimn g0:. 7'50r.e5mr'e m} }0>.{7t5eraemm.'l e}a}g>uSec_hlooosls<e/st h?>?
                                                 0 } < / t d > 
                                                                     < t h   s t y l e = {<{/ tpra>d
                                                                             d i n g :   ' 0 . 5 r e m   0 . 7 5 r)e;m
                                                                     '   } } > W < / t h > 
                                                                             } ) } 
                                                                                         < t h   s<t/ytlbeo=d{y{> 
                                                                     p a d d i n g :   ' 0 . 5<r/etma b0l.e7>5
                                                                     r e m '   } } > L < /<t/hs>e
                                                                     c t i o n > 
                                                                                      ) ; 
                                                                       < t h   s t}y)l}e
                                                                     = { {   p<a/dmdaiinng>:
                  ' 0).;5
                                                                     r}em 0.75rem' }}>Win%</>th>
                                                                                       <th style={{ padding: '0.5rem 0.75rem' }}>League W</th>th>
                                                                                       <th style={{ padding: '0.5rem 0.75rem' }}>League L</th>th>
                                                                     </>tr>
                                                                     </>thead>
                                                                                   <tbody>
                                                                                           {teams.map((team, i) => {
                                  const school = team.schools as { name: string; slug: string } | null;
                                  return (
                                                              <tr key={team.school_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--psp-card-bg)' }}>
                                                                                    <td style={{ padding: '0.5rem 0.75rem' }}>
                                                                                            {school ? (
                                                                                                <Link href={'/schools/' + school.slug} style={{ color: 'var(--psp-navy)', fontWeight: 600 }}>
                                                                                                        {school.name}
                                                                                                        </Link>Link>
                                                                                              ) : <span>Unknown</span>span>}
                                                                                            </td>td>
                                                                                    <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.wins ?? 0}</td>td>
                                                                                    <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.losses ?? 0}</td>td>
                                                                                    <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>
                                                                                            {team.win_pct != null ? String(Math.round(team.win_pct * 100)) + '%' : '--'}
                                                                                            </td>td>
                                                                                    <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_wins ?? 0}</td>td>
                                                                                    <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_losses ?? 0}</td>td>
                                                              </tr>tr>
                                                            );
        })}
                                                                                   </tbody>tbody>
                                                                     </t>table>
                                                 </>section>
                                                       );
                                                       })}
                                               </>main>
                                                 );
                                                       }</></>title: 'Standings | Philadelphia High School Sports',
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
                                            <p style={{ color: 'var(--psp-muted)' }}>Standings will be available once the season beginism.p<o/rpt> 
                                                  t y p e   {  <M/emtaaidna>t
                                                        a   }   f)r;o
                                            m   '}n
                                            e x tc'o;n
                                            sitm pboyrStp oLritn:k  Rfercoomr d'<nneuxmtb/elri,n kt'y;p
                                            eiomfp odratt a{. rcerceoartdesC>l i=e n{t} ;}
                                              f rfoomr  '(@csounpsatb ars eo/fs udpaatbaa.sree-cjosr'd;s
                                            )
                                             e{x
                                                   p o r t  icfo n(s!tb ymSeptoardta[tra.:s pMoertta_diadt]a)  =b y{S
                                                         p o rtti[trl.es:p o'rStt_aindd]i n=g s[ ]|; 
                                            P h i l abdyeSlppohrita[ rH.isgpho rStc_hiodo]l. pSupsohr(trs)';,
                                            
                                                  }d
                                            e s crreitputrino n(:
                                              ' C u r<rmeanitn  ssetaysloen= {s{t apnaddidnignsg :f o'r2 rPehmi'l,a dmealxpWhiidat hh:i g'h9 0s0cphxo'o,l  msaprogritns:. '',0
                                                  }a;u
                                            t
                                            oe'x p}o}r>t
                                              c o n s t  <rhe1v asltiydlaet=e{ {=  f3o6n0t0F;a
                                            m
                                            icloyn:s t' vSaPrO(R-T-_fNoAnMtE-Sb:e bRaesc)o'r,d <fnounmtbSeirz,e :s t'r2i.n5gr>e m=' ,{ 
                                                  c o l1o:r :' F'ovoatrb(a-l-lp's,p
                                            - n a2v:y )''B,a smkaertgbianlBlo't,t
                                            o m :3 :' 0'.B2a5sreebma'l l}'},>
                                            
                                                4 :   ' S o cSctearn'd,i
                                            n g s5
                                            :   ' L a c r<o/shs1e>'
                                            , 
                                                 6 :  <'pT rsatcykl e&= {F{i eclodl'o,r
                                            :   '7v:a r'(W-r-epsstpl-imnugt'e,d
                                            )}';,
                                             
                                            maasrygnicn Bfoutntcotmi:o n' 2greetmS't a}n}d>i{ndgast(a). s{e
                                                  a s ocno.nyseta rs}u pSaebaassoen <=/ pc>r
                                                  e a t e C l i{eOnbtj(e
                                                                       c t . e nptrroiceess(sb.yeSnpvo.rNtE)X.Tm_aPpU(B(L[IsCp_oSrUtPIAdBSAtSrE,_ UtReLa!m,s
                                                  ] )   = >p r{o
                                                        c e s s . e n v .cNoEnXsTt_ PsUpBoLrItCI_dS U=P ANBuAmSbEe_rA(NsOpNo_rKtEIYd!S
                                                  t r ));;
                                                  
                                                       c o n s t  r{e tduartna :( 
                                                  l a t e s t S e a s o<ns e}c t=i oanw akiety =s{usppaobratsIed
                                                  }   s t y.lfer=o{m{( 'msaeragsionnBso't)t
                                                  o m :   '.2s.e5lreecmt'( '}i}d>,
                                                    y e a r ' ) 
                                                           .<ohr2d esrt(y'lyee=a{r{' ,f o{n taFsacmeinldyi:n g':v afra(l-s-ef o}n)t
                                                  - b e b a.sl)i'm,i tf(o1n)t
                                                  S i z e :. s'i1n.g5lree(m)';,
                                                    c oilfo r(:! l'avtaers(t-S-epasspo-nn)a vrye)t'u,r nb onrudlelr;B
                                                  o t tcoomn:s t' 2{p xd astoal:i dr evcaorr(d-s- p}s p=- gaowladi)t' ,s uppaadbdaisneg
                                                  B o t t o.mf:r o'm0(.'5treeamm'_,s emaasrognisn'B)o
                                                  t t o m :. s'e1lreecmt'( '}s}c>h
                                                  o o l _ i d ,   s p o r t _ i{dS,P OwRiTn_sN,A MlEoSs[ssepso,r ttIide]s},
                                                    w i n _ p c t ,   l e a<g/uhe2_>w
                                                  i n s ,   l e a g u e _ l<otsasbelse,  sstcyhloeo=l{s{( nwaimdet,h :s l'u1g0)0'%)'
                                                  ,   b o r.deeqr(C'oslelaasposne_:i d''c,o lllaatpesset'S,e afsoonnt.Siidz)e
                                                  :   ' 0 ..9orredme'r (}'}w>i
                                                  n _ p c t ' ,   {   a s c e n<dtihnega:d >f
                                                  a l s e   } ) ; 
                                                       r e t u r n< t{r  ssetaysloen=:{ {l abtaecsktgSreoausnodn:,  'rveacro(r-d-sp:s pr-encaovryd)s' ,? ?c o[l]o r}:; 
                                                  '}#
                                                  f
                                                  fefx'p o}r}t> 
                                                  d e f a u l t   a s y n c   f u n c t<itohn  sSttyalned=i{n{g stPeaxgteA(l)i g{n
                                                        :   'cloenfstt' ,d aptaad d=i nagw:a i't0 .g5erteSmt a0n.d7i5nrgesm(') ;}
                                                        } > Sicfh o(o!ld<a/ttah >|
                                                  |   d a t a . r e c o r d s . l e n g<tthh  =s=t=y l0e)= {{{
                                                          p a d drientgu:r n' 0(.
                                                  5 r e m   0 .<7m5arienm 's t}y}l>eW=<{/{t hp>a
                                                        d d i n g :   ' 2 r e m ' ,   m a x W<itdht hs:t y'l9e0=0{p{x 'p,a dmdairnggi:n :' 0'.05 raeumt o0'. 7}5}r>e
                                                  m '   } } > L < /<thh1> 
                                                  s t y l e = { {   f o n t F a m i l y<:t h' vsatry(l-e-=f{o{n tp-abdedbiansg):' ,' 0f.o5nrteSmi z0e.:7 5'r2e.m5'r e}m}'>,W icno%l<o/rt:h >'
                                                  v a r ( - - p s p - n a v y ) '   } }<>t
                                                  h   s t y l e = { {  Sptaadnddiinngg:s 
                                    ' 0 . 5 r e m   0<./7h51r>e
                                    m '   } } > L e a<gpu es tWy<l/et=h{>{
                                            c o l o r :   ' v a r ( - - p s p -<mtuht esdt)y'l e}=}{>{S tpaandddiinnggs:  w'i0l.l5 rbeem  a0v.a7i5lraebml'e  }o}n>cLee atghuee  sLe<a/stohn> 
                                    b e g i n s . < / p > 
                                              < /<t/rm>a
                                              i n > 
                                                       ) ; 
                                                    } 
                                              < / tchoenasdt> 
                                              b y S p o r t :   R e c o r d<<tnbuomdbye>r
                                              ,   t y p e o f   d a t a . r e c{otredasm>s .=m a{p}(;(
                                              t e afmo,r  i()c o=n>s t{ 
                                                    r   o f   d a t a . r e c o r d s )  c{o
                                                          n s t   sicfh o(o!lb y=S ptoeratm[.rs.cshpooorlts_ iads] ){  bnyaSmpeo:r ts[trr.isnpgo;r ts_liudg]:  =s t[r]i;n
                                              g   }   |b ynSuplolr;t
                                              [ r . s p o r t _ i d ] . p u s h ( rr)e;t
                                              u r n} 
                                              ( 
                                                r e t u r n   ( 
                                                       < m a i n   s<ttyrl ek=e{y{= {ptaedadmi.nsgc:h o'o2lr_eimd'},  smtayxlWei=d{t{h :b a'c9k0g0rpoxu'n,d :m air g%i n2:  ='=0=  a0u t?o '' #}f}f>f
                                              '   :   ' v a<rh(1- -sptsypl-ec=a{r{d -fbogn)t'F a}m}i>l
                                              y :   ' v a r ( - - f o n t - b e b a s ) ' ,< tfdo nsttSyilzee=:{ {' 2p.a5drdeimn'g,:  c'o0l.o5rr:e m' v0a.r7(5-r-epms'p -}n}a>v
                                              y ) ' ,   m a r g i n B o t t o m :   ' 0 . 2 5 r{esmc'h o}o}l> 
                                              ?   ( 
                                                        S t a n d i n g s 
                                                           < / h 1 > 
                                                           < L i n k   h<rpe fs=t{y`l/es=c{h{o oclosl/o$r{:s c'hvoaorl(.-s-lpusgp}-`m}u tsetdy)l'e,= {m{a rcgoilnoBro:t t'ovma:r ('-2-rpesmp'- n}a}v>y{)d'a,t af.osnetaWseoing.hyte:a r6}0 0S e}a}s>o
                                                           n < / p > 
                                                                 { O b j e c t . e n t r i e s ( b{ysScphoorotl)..nmaampe(}(
                                                           [ s p o r t I d S t r ,   t e a m s ] )   = >   { 
                                                                   < / L i n k > 
                                                                   c o n s t   s p o r t I d   =   N u m b e r ( s p)o r:t I<dsSptarn)>;U
                                                                   n k n o w n < / srpeatnu>r}n
                                                                     ( 
                                                                                        < s e c t i o n   k<e/yt=d{>s
                                                                   p o r t I d }   s t y l e = { {   m a r g i n<Btodt tsotmy:l e'=2{.{5 rteemx't A}l}i>g
                                                                   n :   ' c e n t e r ' ,  <pha2d dsitnygl:e ='{0{. 5froenmt F0a.m7i5lrye:m '' v}a}r>({-t-efaomn.tw-ibnesb a?s?) '0,} <f/otndt>S
                                                                   i z e :   ' 1 . 5 r e m ' ,   c o l o r :   '<vtadr (s-t-yplsep=-{n{a vtye)x't,A lbiogrnd:e r'Bcoetnttoemr:' ,' 2ppaxd dsionlgi:d  'v0a.r5(r-e-mp s0p.-7g5orledm)'' ,} }p>a{dtdeianmg.Blootstsoems:  ?'?0 .05}r<e/mt'd,> 
                                                                   m a r g i n B o t t o m :   ' 1 r e m '   } }<>t
                                                                   d   s t y l e = { {   t e x t{ASlPiOgRnT:_ N'AcMeEnSt[esrp'o,r tpIadd]d}i
                                                                   n g :   ' 0 . 5 r e m   0<./7h52r>e
                                                                   m '   } } > 
                                                                               < t a b l e   s t y l e = { {   w i d{tthe:a m'.1w0i0n%_'p,c tb o!r=d enruCloll l?a pSster:i n'gc(oMlaltahp.sreo'u,n df(otnetaSmi.zwei:n _'p0c.t9 r*e m1'0 0})})> 
                                                                   +   ' % '   :   ' - - ' } 
                                                                     < t h e a d > 
                                                                                                 < / t<dt>r
                                                                                                   s t y l e = { {   b a c k g r o u n d :   '<vtadr (s-t-yplsep=-{n{a vtye)x't,A lcioglno:r :' c'e#nftfefr'' ,} }p>a
                                                                                                 d d i n g :   ' 0 . 5 r e m   0 . 7 5<rtehm 's t}y}l>e{=t{e{a mt.elxetaAgluieg_nw:i n'sl e?f?t '0,} <p/atddd>i
                                                                                                 n g :   ' 0 . 5 r e m   0 . 7 5 r e m '   } }<>tSdc hsotoyll<e/=t{h{> 
                                                                                                 t e x t A l i g n :   ' c e n t e r '<,t hp asdtdyilneg=:{ {' 0p.a5drdeimn g0:. 7'50r.e5mr'e m} }0>.{7t5eraemm.'l e}a}g>uWe<_/ltohs>s
                                                                                                 e s   ? ?   0 } < / t d > 
                                                                                                           < t h   s t y l e = { {   p a d<d/itnrg>:
                                                                                                   ' 0 . 5 r e m   0 . 7 5 r e m '   })};>
                                                                                                 L < / t h > 
                                                                                                       } ) } 
                                                                                                           < t h   s t y l e =<{/{t bpoaddyd>i
                                                                                                                 n g :   ' 0 . 5 r e m   0<./7t5arbelme'> 
                                                                                                                       } } > W i n % < / t h<>/
                                                                                                                       s e c t i o n > 
                                                                                                                                        ) ;<
                                                                         t h   s t y l}e)=}{
                                                                               {   p a d<d/imnagi:n >'
                                                                                                                       0 . 5)r;e
                                                                                                                       m} 0.75rem' }}>League W</>th>
                                                                                                                                         <th style={{ padding: '0.5rem 0.75rem' }}>League L</th>th>
                                                                                                                             </>tr>
                                                                                                                       </>thead>
                                                                                                                         <tbody>
                                                                                                                               {teams.map((team, i) => {
                                                                                           const school = team.schools as { name: string; slug: string } | null;
                                                                                           return (
                                                                                                                     <tr key={team.school_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--psp-card-bg)' }}>
                                                                                                                                           <td style={{ padding: '0.5rem 0.75rem' }}>
                                                                                                                                                 {school ? (
                                                                                                                                                     <Link href={`/schools/${school.slug}`} style={{ color: 'var(--psp-navy)', fontWeight: 600 }}>
                                                                                                                                                           {school.name}
                                                                                                                                                           </Link>Link>
                                                                                                                                                   ) : <span>Unknown</span>span>}
                                                                                                                                                 </td>td>
                                                                                                                                           <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.wins ?? 0}</td>td>
                                                                                                                                           <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.losses ?? 0}</td>td>
                                                                                                                                           <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>
                                                                                                                                                 {team.win_pct != null ? String(Math.round(team.win_pct * 100)) + '%' : '--'}
                                                                                                                                                 </td>td>
                                                                                                                                           <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_wins ?? 0}</td>td>
                                                                                                                                           <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_losses ?? 0}</td>td>
                                                                                                                           </tr>tr>
                                                                                                                   );
                                                                         })}
                                                                                                                               </tbody>tbody>
                                                                                                                 </>table>
                                                                                                                 </t>section>
                                                                                                         );
                                                                                                       })}
                                                                                                       </>main>
                                                                                                   );
                                                                                                       }</></></></></M>export const revalidate = 3600;

mport type { Metadata } from 'next';
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
