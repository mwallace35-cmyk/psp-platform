import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600;

const supabase = createClient(
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
