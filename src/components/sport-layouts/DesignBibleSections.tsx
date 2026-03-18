'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TopPerformer {
    name: string;
    stat: string;
}

interface RecentGame {
    home_school_name: string;
    away_school_name: string;
    home_score: number | null;
    away_score: number | null;
}

interface PowerRanking {
    rank: number;
    school_name: string;
}

interface DesignBibleSectionsProps {
    sport: string;
}

export default function DesignBibleSections({ sport }: DesignBibleSectionsProps) {
    const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
    const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
    const [powerRankings, setPowerRankings] = useState<PowerRanking[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchData = async () => {
                try {
                          const supabase = createClient();

                  // Fetch top performers
                  const { data: performersData } = await supabase
                            .from('football_player_seasons')
                            .select('person_name, rush_yards, pass_yards, rec_yards')
                            .eq('sport', sport)
                            .order('rush_yards', { ascending: false })
                            .limit(10);

                  if (performersData && performersData.length > 0) {
                              const performers = [
                                {
                                                name: performersData[0]?.person_name || '[Top Rusher]',
                                                stat: `${(performersData[0]?.rush_yards || 0).toLocaleString()}`,
                                },
                                {
                                                name: performersData[0]?.person_name || '[Top Passer]',
                                                stat: `${(performersData[0]?.pass_yards || 0).toLocaleString()}`,
                                },
                                {
                                                name: performersData[0]?.person_name || '[Top Receiver]',
                                                stat: `${(performersData[0]?.rec_yards || 0).toLocaleString()}`,
                                },
                                          ];
                              setTopPerformers(performers);
                  }

                  // Fetch recent games
                  const { data: gamesData } = await supabase
                            .from('games')
                            .select('home_school_name, away_school_name, home_score, away_score, game_date')
                            .eq('sport', sport)
                            .order('game_date', { ascending: false })
                            .limit(5);

                  if (gamesData) {
                              setRecentGames(gamesData as unknown as RecentGame[]);
                  }

                  // Fetch power rankings
                  const { data: rankingsData } = await supabase
                            .from('power_rankings')
                            .select('rank, school_name')
                            .eq('sport', sport)
                            .order('rank', { ascending: true })
                            .limit(5);

                  if (rankingsData) {
                              setPowerRankings(rankingsData as unknown as PowerRanking[]);
                  }
                } catch (error) {
                          console.error('Error fetching DesignBibleSections data:', error);
                } finally {
                          setLoading(false);
                }
        };

                fetchData();
  }, [sport]);

  if (loading) {
        return (
                <div style={'{u smea xcWliidetnht:' ;'
          1
    2i0m0ppoxr't,  {m aursgeiEnf:f e'c2tr,e mu saeuSttoa't,e  p}a dfdrionmg :' r'e0a c1t.'5;r
    eimm'p o}r}t> 
    {   c r e a t e C<ldiievn ts t}y lfer=o{m{  't@e/xltiAbl/isgunp:a b'acseen/tcelri'e,n tc'o;l
                                              o
                                              ri:n t'e#r6f6a6c'e  }T}o>pLPoeardfionrgm esre c{t
                                                                                              i o nnsa.m.e.:< /sdtirvi>n
                                                                                              g ; 
         s t<a/td:i vs>t
                                                                                              r i n g ;)
    ;}


   i}n
  t
  e r fraecteu rRne c(e
                      n t G a m<ed i{v
                                       s thyolmee=_{s{c hmoaoxlW_indatmhe::  's1t2r0i0npgx;'
                                                      ,   maawragyi_ns:c h'o2orle_mn aamuet:o 's,t rpiandgd;i
                                                      n g :h o'm0e _1s.c5orreem:'  n}u}m>b
                                     e r   |   n u<ldli;v
                                       s taywlaey=_{s{c odries:p lnauym:b e'rg r|i dn'u,l lg;r
                                                      i}d
                                                    T
                                                    eimnptleartfeaCcoel uPmonwse:r R'a1nfkri n1gf r{'
                                                    ,   graapn:k :' 2nruemmb'e r};}
  > 
  s c h o o l _ n{a/m*e :L esfttr iCnogl;u
                  m}n
  :
   iTnotpe rPfearcfeo rDmeesrisg n+B iPbolweeSre cRtainoknisnPgrso p*s/ }{

     s p o r t :< dsitvr>i
     n g ; 
       } 
      
      e x p o{r/t*  dTeOfPa uPlEtR FfOuRnMcEtRiSo n* /D}e
     s i g n B i b l e S e<cdtiivo
                            n s ( {   s p o r t   } :s tDyelsei=g{n{B
                              i b l e S e c t i o n s P r obpasc)k g{r
                                o u ncdo:n s't# f[8tfoapfPce'r,f
     o r m e r s ,   s e t T o p Pbeorrfdoerrm:e r's1]p x=  suosleiSdt a#tee2<eT8ofp0P'e,r
     f o r m e r [ ] > ( [ ] ) ; 
     b o rcdoenrsRta d[iruesc:e n't8Gpaxm'e,s
     ,   s e t R e c e n t G a m epsa]d d=i nugs:e S't1a.t5er<eRme'c,e
     n t G a m e [ ] > ( [ ] ) ; 
     m a rcgoinnsBto t[tpoomw:e r'R2arnekmi'n,g
     s ,   s e t P o w e r R a}n}k
     i n g s ]   =   u s e>S
     t a t e < P o w e r R a n<khi3n
                                g [ ] > ( [ ] ) ; 
          c o nsstty l[el=o{a{d
            i n g ,   s e t L o a d i n g ]  f=o nutsFeaSmtialtye:( t"r'uBee)b;a
     s
       N euusee'E,f fseacnts(-(s)e r=i>f "{,
     
             c o n s t   f e t c h D aftoan t=S iazsey:n c' 1(.)3 r=e>m '{,
     
                 t r y   { 
                             f o n tcWoenisgth ts:u p7a0b0a,s
     e   =   c r e a t e C l i e n t (c)o;l
     o
     r :   ' # 0 a 1 6/2/8 'F,e
     t c h   t o p   p e r f o r m e rmsa
     r g i n B o t t ocmo:n s't1 r{e md'a,t
     a :   p e r f o r m e r s D a t at e}x t=T raawnasifto rsmu:p a'buapspee
     r c a s e ' , 
           . f r o m ( ' f o o t b a llle_tptlearySepra_csienags:o n's1'p)x
     ' , 
                     . s e l e c t}(}'
     p e r s o n _ n a m e ,  >r
     u s h _ y a r d s ,   p a s s{_'y\aur2dBs5,0 'r}e cT_OyPa rPdEsR'F)O
     R M E R S 
               . e q ( ' s p o<r/th'3,> 
     s p o r t ) 
                 < d i v  .sotrydleer=({'{r udsihs_pylaaryd:s '',f l{e xa's,c efnldeixnDgi:r efcatlisoen :} )'
     c o l u m n ' ,   g a.pl:i m'i0t.(7150r)e;m
     '
       } } > 
             i f   ( p e r f o r m{etrospDPaetraf o&r&m epresr f&o&r mteorpsPDeartfao.rlmeenrgst.hl e>n g0t)h  {>
       0   ?   ( 
             c o n s t   p e r f o r mteorpsP e=r f[o
     r m e r s . m a p ( ( p e{r
       f o r m e r ,   i d x )   = >n a(m
     e :   p e r f o r m e r s D a t a [ 0<]d?i.vp ekresyo=n{_indaxm}e  s|t|y l'e[=T{o{p  dRiussphleary]:' ,'
     f l e x ' ,   j u s t i f y Csotnatte:n t`:$ {'(sppearcfeo-rbmeetrwseDeant'a [}0}]>?
     . r u s h _ y a r d s   | |   0 ) . t o L<oscpaalne Ssttryilneg=({){} `f,o
     n t F a m i l y :   " ' D}M, 
     S a n s ' ,   s a n s - s{e
     r i f " ,   f o n t S i z e :n a'm0e.:9 5preermf'o,r mceorlsoDra:t a'[#03]3?3.'p e}r}s>o
     n _ n a m e   | |   ' [ T o p   P a s s e r ]{'p,e
     r f o r m e r . n a m e } 
       s t a t :   ` $ { ( p e r f o r m e r s<D/astpaa[n0>]
     ? . p a s s _ y a r d s   | |   0 ) . t o<Lsopcaanl esSttyrlien=g{({) }f`o,n
     t W e i g h t :   7 0 0 ,} ,c
     o l o r :   ' # f 0 a 5 0{0
       '   } } > 
                       n a m e :   p e r f o r m e{rpseDraftoar[m0e]r?..sptearts}o
     n _ n a m e   | |   ' [ T o p   R e c e i<v/esrp]a'n,>
     
                                 s t a t :< /`d$i{v(>p
                                   e r f o r m e r s D a t a [ 0 ] ?).)r
                                 e c _ y a r d s   | |   0 ) .)t o:L o(c
                                 a l e S t r i n g ( ) } ` , 
                                     < d i v   s t y l e =}{,{
                                         c o l o r :   ' # 9]9;9
                                 ' ,   f o n t S i z es:e t'T0o.p9Preermf'o r}m}e>rNso( pdeartfao ramvearisl)a;b
                                 l e < / d i v > 
                                   } 
                                  
                                                  / /   F)e}t
                                 c h   r e c e n t   g a m<e/sd
                                 i v > 
                                           c o n s t  <{/ ddiavt>a
                                             :
                                             g a m e s D a t a  {}/ *=  PaOwWaEiRt  RsAuNpKaIbNaGsSe 
                                           * / } 
                                                         . f r o<md(i'vg
                                           a m e s ' ) 
                                                       s t y l e.=s{e{l
                                                         e c t ( ' h o m e _ s c h o obla_cnkagmreo,u nadw:a y'_#sfc8hfoaoflc_'n,a
                                           m e ,   h o m e _ s c o r e ,b oarwdaeyr_:s c'o1rpex,  sgoalmied_ d#aet2ee'8)f
                                           0 ' , 
                                                         . e q ( ' s p obrotr'd,e rsRpaodritu)s
                                           :   ' 8 p x ' , 
                                               . o r d e r ( ' g a m e _pdaadtdei'n,g :{  'a1s.c5ernedmi'n,g
                                           :   f a l s e   } ) 
                                             } } 
                                                       . l i m i>t
                                           ( 5 ) ; 
                                            
                                                         < hi3f
                                                             ( g a m e s D a t a )   { 
                                                               s t y l e = { { 
           s e t R e c e n t G a m e s (fgoanmteFsaDmaitlay :a s" 'uBnekbnaosw nN eause 'R,e cseanntsG-asmeer[i]f)";,
                                           
                                             } 
                                            
                                                       f o n/t/S iFzeet:c h' 1p.o3wreerm 'r,a
                                           n k i n g s 
                                                            c ofnosntt W{e idgahtta::  7r0a0n,k
                                           i n g s D a t a   }   =   a w a icto lsourp:a b'a#s0ea
                                           1 6 2 8 ' , 
                                                   . f r o m ( ' p o w e r _mraarngkiinnBgost't)o
                                           m :   ' 1 r e m ' , 
                                           . s e l e c t ( ' r a n k ,   s ctheoxotlT_rnaanmsef'o)r
                                           m :   ' u p p e r c a.seeq'(,'
                                           s p o r t ' ,   s p o r t ) 
                                               l e t t e r S p a.coirndge:r (''1rpaxn'k,'
                                           ,   {   a s c e n d i n g :  }t}r
                                           u e   } ) 
                                                         > 
                                               . l i m i t ( 5 ) ; 
                                            
                                             { ' \ u { 1 F 4iCfA }('r}a nPkOiWnEgRs DRaAtNaK)I N{G
                                               S 
                                                             s e t P<o/whe3r>R
                                           a n k i n g s ( r a n k i<ndgisvD asttay laes= {u{n kdnioswpnl aays:  P'ofwleerxR'a,n kfilnegx[D]i)r;e
                                           c t i o n :   ' c}o
                                           l u m n ' ,  }g acpa:t c'h0 .(5errermo'r )} }{>
                                           
                                                           c o n s o l e{.peorwreorrR(a'nEkrirnogrs  f&e&t cphoiwnegr RDaenskiignngBsi.blleenSgetcht i>o n0s  ?d a(t
                                           a : ' ,   e r r o r ) ; 
                                                   p o w}e rfRiannaklilnyg s{.
                                           m a p ( ( r a n ksientgL)o a=d>i n(g
                                           ( f a l s e ) ; 
                                             } 
                                               < d i}v;
                                           
                                            
                                                    f e t c h D a t a ( ) ; 
                                               k}e,y =[{srpaonrkti]n)g;.
                                           r
                                           a n ki}f
                                             ( l o a d i n g )   { 
                                                        r e t usrtny l(e
                                           = { { 
             < d i v   s t y l e = { {   m a x W i ddtihs:p l'a1y2:0 0'pfxl'e,x 'm,a
                                           r g i n :   ' 2 r e m   a u t o ' ,   p a d dailnigg:n I't0e m1s.:5 r'ecme'n t}e}r>'
                                           , 
                                                         < d i v   s t y l e = { {   t epxatdAdliinggn::  ''0c.e5nrteemr '0,' ,c
                                           o l o r :   ' # 6 6 6 '   } } > L o a d i n gb osredcetriBoontst.o.m.:< /'d1ipvx> 
                                           s o l i d   #<e/2dei8vf>0
                                           ' , 
                                               ) ; 
                                             } 
                                            
                                                r e t u r n   ( 
                                             } } 
                                               < d i v   s t y l e = { {   m a x>W
                                               i d t h :   ' 1 2 0 0 p x ' ,   m a r g i<ns:p a'n2
                                               r e m   a u t o ' ,   p a d d i n g :   ' 0  s1t.y5lree=m{'{ 
                                               } } > 
                                                            < d i v   s t y l e = { {   dbiascpklgaryo:u n'dg:r i'd#'f,0 ag5r0i0d'T,e
                                               m p l a t e C o l u m n s :   ' 1 f r   1 f r ' ,c oglaopr::  ''2#r0eam1'6 2}8}'>,
                                               
                                                 { / *   L e f t   C o l u m n :  wTiodpt hP:e r'f2o8rpmxe'r,s
                                                     +   P o w e r   R a n k i n g s   * / } 
                                                     h e i g h t<:d i'v2>8
                                                     p x ' , 
                                                       { / *   T O P   P E R F O R M E R S  b*o/r}d
                                                     e r R a d i u s :   '<4dpixv'
                                                     , 
                                                                           s t y l e = { { 
                 d i s p l a y :   'bfalcekxg'r,o
                                                     u n d :   ' # f 8 f a f c ' , 
                                                                       a l i g n Ibtoermdse:r :' c'e1nptxe rs'o,l
                                                     i d   # e 2 e 8 f 0 ' , 
                                                                             j u sbtoirfdyeCroRnatdeinuts::  ''c8epnxt'e,r
                                                     ' , 
                                                                             p a d d i n g :   ' 1 . 5froenmt'W,e
                                                     i g h t :   7 0 0 , 
                                                             m a r g i n B o t t o m :   ' 2 r e m ' ,f
                                                     o n t S i z e :   ' 0 . 9}r}e
                                                     m ' , 
                                                                   > 
                                                                              < h 3 
                                                     m a r g i n R i g h t :   ' 0s.t7y5lree=m{'{,
                                                       
                                                                                       f o n t F a m}i}l
                                                     y :   " ' B e b a s   N e u e ' ,   s a n>s
                                                     - s e r i f " , 
                                                       { r afnoknitnSgi.zrea:n k'}1
                                                     . 3 r e m ' , 
                                                                               < / s pfaonn>t
                                                                               W e i g h t :   7 0 0 , 
                                                                                               < s p a n   s t ycloel=o{r{:  f'o#n0taF1a6m2i8l'y,:
                                                                                 " ' D M   S a n s ' ,   s a n sm-asregriinfB"o,t tfoomn:t S'i1zree:m '',0
                                                                               . 9 5 r e m ' ,   c o l o r :   't#e3x3t3T'r a}n}s>f
                                                                               o r m :   ' u p p e r c a s e ' , 
                                                                                 { r a n k i n g . s c hloeotlt_enraSmpea c|i|n g':[ S'c1hpoxo'l, 
                                                                               N a m e ] ' } 
                                                                                 } } 
                                                                                                     < />s
                                                                                                     p a n > 
                                                                                                       { ' \ u 2 B 5 0 '<}/ dTiOvP> 
                                                                                                     P E R F O R M E R S 
                                                                                                                 ) ) 
                                                                                                             < / h 3 > 
                                                                                                                       )   :   ( 
                                                                                                                 < d i v   s t y l e = { {   d<idsipvl asyt:y l'ef=l{e{x 'c,o lfolre:x D'i#r9e9c9t'i,o nf:o n'tcSoilzuem:n '',0 .g9arpe:m '' 0}.}7>5Nroe mr'a n}k}i>n
                                                                                                             g s   a v a i l a b l e < / d{itvo>p
                                                                                                               P e r f o r m e r s   & &   t)o}p
                                                                                                             P e r f o r m e r s . l e<n/gdtihv >>
                                                                                                               0   ?   ( 
                                                                                                                     < / d i v > 
                                                                                                                                 t o p<P/edrifvo>r
                                                                                                                     m
                                                                                                                     e r s . m a p ( ({p/e*r fRoirgmhetr ,C oilduxm)n := >R e(c
                                                                                                                     e n t   S c o r e s   * / } 
                                                                                                                             < d i v  <kdeiyv=
                                                                                                                               { i d x }   s t y l es=t{y{l ed=i{s{p
                                                                                                                                 l a y :   ' f l e x ' ,  bjaucsktgirfoyuCnodn:t e'n#tf:8 f'asfpca'c,e
                                                                                                                     - b e t w e e n '   } } >b
                                                                                                                     o r d e r :   ' 1 p x   s o l i d   # e 2<es8pfa0n' ,s
                                                                                                                     t y l e = { {   f o n t Fbaomridleyr:R a"d'iDuMs :S a'n8sp'x,' ,s
                                                                                                                     a n s - s e r i f " ,   fpoandtdSiinzge::  ''10..59r5erme'm,'
                                                                                                                     ,   c o l o r :   ' #}3}3
                                                                                                                     3 '   } } > 
                                                                                                                         > 
                                                                                                                                          < h 3 
                                                                                                                       { p e r f o r msetry.lnea=m{e{}
                                                                                                                     
                                                                                                                                                 f o n t F a m<i/lsyp:a n">'
                                                                                                                     B e b a s   N e u e ' ,   s a n s - s e r<isfp"a,n
                                                                                                                       s t y l e = { {   f o n t WfeoingthSti:z e7:0 0',1 .c3orleomr':, 
                                                                                                                     ' # f 0 a 5 0 0 '   } } > 
                                                                                                                       f o n t W e i g h t :   7 0 0 , 
                                                                                                                       { p e r f o r m e rc.osltoart:} 
                                                                                                                     ' # 0 a 1 6 2 8 ' , 
                                                                                                                                         < / s p amna>r
                                                                                                                                         g i n B o t t o m :   ' 1 r e m ' , 
                                                                                                                                         < / d i v > 
                                                                                                                                                         t e x t T r a n s)f)o
                                                                                                                                         r m :   ' u p p e r c a s e '), 
                                                                                                                                         :   ( 
                                                                                                                                                               l e t t e r<Sdpiavc isntgy:l e'=1{p{x 'c,o
                                                                                                                                         l o r :   ' # 9 9 9 ' ,  }f}o
                                                                                                                                         n t S i z e :   ' 0 .>9
                                                                                                                                         r e m '   } } > N o   d a{t'a\ ua{v1aFi3lCa6b}l'e}< /RdEiCvE>N
                                                                                                                                         T   S C O R E S 
                                                                                                                                                     ) } 
                                                                                                                                             < / h 3 > 
                                                                                                                                                       < / d i v ><
       d i v   s t y l e = {<{/ ddiivs>p
         l
       a y :   ' f l e x ' ,{ /f*l ePxODWiErRe cRtAiNoKnI:N G'Sc o*l/u}m
       n ' ,   g a p :   ' 1<rdeimv'
         } } > 
                       s t y l e{=r{e{c
                         e n t G a m e s   & &   r e cbeanctkGgarmoeusn.dl:e n'g#tfh8 f>a f0c '?, 
       ( 
                                 b orredceern:t G'a1mpexs .smoalpi(d( g#aem2ee,8 fi0d'x,)
         = >   ( 
                         b o r d e r R a<ddiiuvs
                                          :   ' 8 p x ' , 
                           k e y = {piaddxd}i
       n g :   ' 1 . 5 r e m ' , 
                 s t y l e = { {}
                 } 
                            > 
                     p a d d i n<gh:3 
       ' 1 r e m ' , 
                     s t y l e = { { 
                   b a c k g r o u n d :  f'o#nftfFfa'm,i
       l y :   " ' B e b a s   N e u e ' ,   s abnosr-dseerr:i f'"1,p
       x   s o l i d   # e 2 e 8 f 0 ' ,f
       o n t S i z e :   ' 1 . 3 r e m ' , 
           b o r d e r R a d i u s :   'f6opnxt'W,e
       i g h t :   7 0 0 , 
                           b o r d e r Lceoflto:r :' 3'p#x0 as1o6l2i8d' ,#
       f 0 a 5 0 0 ' , 
                       m a r g i n B o t t o}m}:
         ' 1 r e m ' , 
                       > 
                     t e x t T r a n s f o r<md:i v' usptpyelrec=a{s{e 'f,o
       n t S i z e :   ' 0 . 8 5 r e m 'l,e tctoelroSrp:a c'i#nfg0:a 5'010p'x,' ,f
       o n t W e i g h t :   7 0 0 ,} }m
       a r g i n B o t t o m :  >'
       0 . 5 r e m ' ,   t e x t T r{a'n\suf{o1rFm4:C A'}u'p}p ePrOcWaEsRe 'R A}N}K>I
       N G S 
                                < / h 3 >F
                                i n a l 
                                                < d i v   s t y l e =<{/{d idvi>s
                                                  p l a y :   ' f l e x ' ,   f l e x D<idrievc tsitoynl:e ='{c{o lfuomnnt'W,e iggahpt::  '700.05,r efmo'n t}S}i>z
                                                e :   ' 0 . 9 5 r e m ' ,   c{oploowre:r R'a#n3k3i3n'g,s  m&a&r gpionwBeortRtaonmk:i n'g0s..2l5ernegmt'h  }>} >0
                                                  ?   ( 
                                                  {pgoawmeer.Rhaonmkei_nsgcsh.omoalp_(n(armaen k|i|n g')H o=m>e '(}
                                                  { g a m e . h o m e _ s c o r e   !<=d=i vn
                                                  u l l   ?   g a m e . h o m e _ s c o r ek e:y ='{—r'a}n{k'i n'g}.
                                                  r a n k } 
                                                    { g a m e .satwyalye_=s{c{h
                                                      o o l _ n a m e   | |   ' A w a y ' }   { g admies.palwaayy:_ s'cfolreex '!,=
                                                  =   n u l l   ?   g a m e . a w a y _ s c o rael i:g n'I—'t}e
                                                  m s :   ' c e n t e r ' , 
                                                            < / d i v > 
                                                                                  p a d d i n<g/:d i'v0>.
                                                            5 r e m   0 ' , 
                                                                        ) ) 
                                                                                     )  b:o r(d
                                                            e r B o t t o m :   ' 1 p x  <sdoilvi ds t#yel2ee=8{f{0 'c,o
                                                            l o r :   ' # 9 9 9 ' ,   f o n t S i z e}:} 
                                                            ' 0 . 9 r e m '   } } > N o   r e c e>n
                                                            t   g a m e s   a v a i l a b l e < / d i<vs>p
                                                            a n 
                                                                                ) } 
                                                                                s<t/ydliev=>{
                                                                                  { 
                                                                                                  < / d i v > 
                                                                         < / d i vb>a
                                                                         c k g r o<u/nddi:v >'
                                                                         # f 0)a;5
                                                                         0}0',
                                                                                                 color: '#0a1628',
                                                                                                 width: '28px',
                                                                                                 height: '28px',
                                                                                                 borderRadius: '4px',
                                                                                                 display: 'flex',
                                                                                                 alignItems: 'center',
                                                                                                 justifyContent: 'center',
                                                                                                 fontWeight: 700,
                                                                                                 fontSize: '0.9rem',
                                                                                                 marginRight: '0.75rem',
                                                                           }}
                                                                                             >
                                                                           {ranking.rank}
                                                                         </>span>
                                                                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', color: '#333' }}>
                                                                                  {ranking.school_name || '[School Name]'}
                                                                                  </span>span>
                                                            </vs>div>
                                                                            ))
                                                                          ) : (
                                                                            <div style={{ color: '#999', fontSize: '0.9rem' }}>No rankings available</div>div>
                                                                          )}
                                                            </>div>
                                                            </>div>
                                                  </>div>
                                                
                                                  {/* Right Column: Recent Scores */}
                                                        <div
                                                                    style={{
                                                                                  background: '#f8fafc',
                                                                                  border: '1px solid #e2e8f0',
                                                                                  borderRadius: '8px',
                                                                                  padding: '1.5rem',
                                                                    }}
                                                                  >
                                                                  <h3
                                                                                style={{
                                                                                                fontFamily: "'Bebas Neue', sans-serif",
                                                                                                fontSize: '1.3rem',
                                                                                                fontWeight: 700,
                                                                                                color: '#0a1628',
                                                                                                marginBottom: '1rem',
                                                                                                textTransform: 'uppercase',
                                                                                                letterSpacing: '1px',
                                                                                }}
                                                                              >
                                                                    {'\u{1F3C6}'} RECENT SCORES
                                                                  </h3>h3>
                                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                                    {recentGames && recentGames.length > 0 ? (
                                                                                  recentGames.map((game, idx) => (
                                                                                                    <div
                                                                                                                        key={idx}
                                                                                                                        style={{
                                                                                                                                              padding: '1rem',
                                                                                                                                              background: '#fff',
                                                                                                                                              border: '1px solid #e2e8f0',
                                                                                                                                              borderRadius: '6px',
                                                                                                                                              borderLeft: '3px solid #f0a500',
                                                                                                                          }}
                                                                                                                      >
                                                                                                                      <div style={{ fontSize: '0.85rem', color: '#f0a500', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                                                                                                                          Final
                                                                                                                        </div>div>
                                                                                                                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#333', marginBottom: '0.25rem' }}>
                                                                                                                        {game.home_school_name || 'Home'} {game.home_score !== null ? game.home_score : '—'}{' '}
                                                                                                                        {game.away_school_name || 'Away'} {game.away_score !== null ? game.away_score : '—'}
                                                                                                                        </div>div>
                                                                                                      </div>div>
                                                                                                  ))
                                                                                ) : (
                                                                                  <div style={{ color: '#999', fontSize: '0.9rem' }}>No recent games available</div>div>
                                                                              )}
                                                                  </div>div>
                                                        </div>div>
                                                </>div>
                                                </d>div>
                                  );
                                  }</dsitvr>
