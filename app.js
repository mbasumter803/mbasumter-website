// Mattress by Appointment Sumter — Elite Sleep Specialist v5
// Two-track: Budget (finance-led) + Quality (adjustable/premium)
// Hormozi offer-stack + Cardone conviction close
(function () {
    // ── State ──────────────────────────────────────────────────────────────────
   let state = { step:'greet', track:null, name:null, phone:null, size:null, pain:null, when:null, messages:[] };
    const SS = sessionStorage;
    const SS_KEY = 'mba_v5';
    const SS_AUTO = 'mba_v5_auto';

   // ── DOM refs ────────────────────────────────────────────────────────────────
   let widget, toggle, box, closeBtn, msgs, quick, input, sendBtn;

   function bindDom() {
         widget  = document.getElementById('chatWidget');
         toggle  = document.getElementById('chatToggle');
         box     = document.getElementById('chatBox');
         closeBtn= document.getElementById('chatClose');
         msgs    = document.getElementById('chatMessages');
         quick   = document.getElementById('chatQuickReplies');
         input   = document.getElementById('chatInput');
         sendBtn = document.getElementById('chatSend');
         if (!widget) return false;

      toggle.addEventListener('click', openChat);
         closeBtn.addEventListener('click', closeChat);
         sendBtn.addEventListener('click', submitTyped);
         input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); submitTyped(); } });

      // Reset button
      if (!document.getElementById('chatReset')) {
              const rb = document.createElement('button');
              rb.id = 'chatReset'; rb.title = 'Start over'; rb.setAttribute('aria-label','Start over');
              rb.innerHTML = '&#8635;';
              rb.style.cssText = 'background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;margin-right:8px;opacity:.7';
              rb.addEventListener('click', function(){ if(confirm('Start a new conversation?')) resetAll(); });
              closeBtn.parentNode.insertBefore(rb, closeBtn);
      }

      // Wire any Book Appointment buttons to open chat
      document.querySelectorAll('a,button').forEach(function(el){
              if (['chatToggle','chatClose','chatReset','chatSend'].includes(el.id)) return;
              const href = (el.getAttribute('href')||'').toLowerCase();
              const txt  = (el.textContent||'').trim().toLowerCase();
              if (href==='#chat'||href==='#book'||href==='#appointment'||el.dataset.chat!==undefined||
                            /^book (a |free |your |an )?appointment/.test(txt)||txt==='book now'||txt==='book appointment') {
                        el.addEventListener('click', function(e){ e.preventDefault(); openChat(); });
              }
      });
         return true;
   }

   function openChat() {
         widget.classList.add('open');
         if (state.messages.length === 0) greet();
         setTimeout(function(){ if(input) input.focus(); }, 150);
   }
    function closeChat() { widget.classList.remove('open'); }

   function resetAll() {
         SS.removeItem(SS_KEY);
         state = { step:'greet', track:null, name:null, phone:null, size:null, pain:null, when:null, messages:[] };
         msgs.innerHTML = ''; quick.innerHTML = '';
         greet();
   }

   function save() { try { SS.setItem(SS_KEY, JSON.stringify(state)); } catch(e){} }
    function load() {
          try { const r=SS.getItem(SS_KEY); if(r){ state=JSON.parse(r); return true; } } catch(e){}
          return false;
    }

   function addMsg(role, html) {
         const row = document.createElement('div');
         row.className = 'chat-msg chat-msg-' + role;
         const bub = document.createElement('div');
         bub.className = 'chat-bubble';
         bub.innerHTML = html.replace(/\n/g,'<br>');
         row.appendChild(bub);
         msgs.appendChild(row);
         msgs.scrollTop = msgs.scrollHeight;
         state.messages.push({ role, text: html });
         save();
   }

   function setQuick(opts) {
         quick.innerHTML = '';
         (opts||[]).forEach(function(opt){
                 const b = document.createElement('button');
                 b.className = 'chat-quick-btn';
                 b.textContent = opt.label || opt;
                 b.addEventListener('click', function(){ onQuick(opt); });
                 quick.appendChild(b);
         });
   }

   function onQuick(opt) {
         addMsg('user', opt.label || opt);
         quick.innerHTML = '';
         route(opt.value || (opt.label||opt).toLowerCase());
   }

   function submitTyped() {
         const v = (input.value||'').trim();
         if (!v) return;
         input.value = '';
         addMsg('user', esc(v));
         quick.innerHTML = '';
         route(v.toLowerCase());
   }

   function esc(s) { return s.replace(/[&<>"]/g, function(c){ return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]); }); }
    function cap(s) { return s.charAt(0).toUpperCase()+s.slice(1); }
    function titleCase(s) { return s.replace(/\w\S*/g, function(w){ return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase(); }); }
    function normPhone(s) {
          const d=(s.match(/\d/g)||[]).join('');
          if(d.length===10) return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);
          if(d.length===11&&d[0]==='1') return d.slice(1,4)+'-'+d.slice(4,7)+'-'+d.slice(7);
          return null;
    }

   // ── Greet ──────────────────────────────────────────────────────────────────
   function greet() {
         const h = new Date().getHours();
         const g = h<12 ? 'Good morning' : h<17 ? 'Good afternoon' : 'Good evening';
         addMsg('bot', g + '! I\'m your Sleep Specialist at <b>Mattress by Appointment Sumter</b>.\n\nWhat brings you in today?');
         setQuick([
           {label:'I need a new mattress', value:'need_new'},
           {label:'Checking prices',       value:'price'},
           {label:'Back or sleep pain',    value:'pain'},
           {label:'Adjustable base',       value:'adjustable'},
           {label:'Ju/s/t  Mbartotwrseisnsg 'b,y   A p p o i n t mveanltu eS:u'mbtreorw s— iEnlgi't}e
             C h a t] )v;5

   / /   Tswtoa tter.asctkesp:  =B u'ddgiestc o+v eQruya'l;i
     t y .   Hsoarvmeo(z)i;/
  C a r}d
  o
  n e  /m/e s──s aMgaiinng .r oSuntaepr  F──i──n──a──n──c──e── ──o──n──l──y──.──
  ──(──f──u──n──c──t──i──o──n── ──(──)── ──{──
                                            ── ── 
  c o nfsutn csttioorne  r=o ustees(svi)o n{S
                                            t o r a g/e/; 
                                            H
                                            a r dl etto ksetnast
                                            e   =   {i
                                                     f   ( v =s=t=e'pc:a l'lg'r)e e t ' , 
                                                      rtertaucrkn:  andudlMls,g (/'/b o'tb'u,d'g<eat 'h roerf ='"qtueall:i8t0y3'7
                                            9 5 1 1 9n4a"m>e<:b >nTualpl ,t
                                              o   c a lplh o8n0e3:- 7n9u5l-l1,1
                                            9 4 < / bs>i<z/ea:>  n— uTlrle,y
                                              p i c kpsa iunp:  7n udlaly,s
                                              a   w ewehke,n :1 0nauml–l7,p
                                            m . ' ) ;m
                                              e s s a giefs :( v[=]=
                                                              = ' c}o;n
                                                              f
                                                              i r ml_eyte sw'i)d g erte,t utrong gsleen,d Bboooxk,i ncgl(o)s;e
                                                                B t n ,  imfs g(sv,= =q=u'iccokn,f iirnmp_ufti,x 's)e n d{B tsnt;a
                                                                t
                                            e . nfaumnec=tniuolnl ;b isntdaDtoem.(p)h o{n
                                                                                        e = n u lwli;d gsetta t e=. wdhoecnu=mneunltl.;g estaEvlee(m)e;n trBeytIudr(n' cahsaktNWaimdeg(e)t;' )};

        itfo g(gvl=e= = '=n odto_cyuemte'n)t . g e t E lreemteunrtnB yhIadn(d'lcehNaottTYoegtg(l)e;'
                                            )
; 
      / /b oBxo o k   s h=o rdtoccuutmse
                                            n t . g eitfE l(evm.esnttaBrytIsdW(i'tchh(a'tbBoooxk'_)';)
)   { 
  c l o s e Bctonn s=t  dmoacpu m=e n{tb.ogoekt_Etloedmaeyn:t'BtyoIdda(y''c,hbaotoCkl_otsoem'o)r;r
                                      o w : ' tmosmgosr r o w '=, bdooocku_mweenetk.egnedt:E'ltehmiesn twBeyeIkde(n'dc'h,abtoMoeks_snaogwe:s''r)i;g
                                        h t   n oqwu'i}c;k
                                              =   d osctuamteen.tw.hgeent E=l emmaepn[tvB]y I|d|( 'vc.hraetpQluaiccek(R'ebpoloike_s'',)';'
                                        ) ; 
    i n p u ts a v e=( )d;o
                                      c u m e n t .rgeettuErlne mfelnotwBByoIodk(i'ncgh(a)t;I
                                        n p u t '})
                                        ;

          /s/e nIdnBttenn t=  — dboocoukmienngt
                                      . g e t Eilfe m(e/nbtoBoykI|da(p'pcohianttS|esncdh'e)d;u
                                      l | c o mief  i(n!|wsitdogpe tb)y |rveitsuirtn| wfaallks.e?;i
                                      n
                                      / . t e stto(gvg)l)e .raedtduErvne nftlLoiwsBtoeonkeirn(g'(c)l;i
                                      c
                                      k ' ,   o/p/e nICnhtaetn)t; 
                                        —   p r ocdluocste Bqtune.satdidoEnvse
                                      n t L i sitfe n(e/rp(r'icclei|ccko's,t |chloows emCuhcaht|)c;h
                                      e a p | asfefnodrBdt|nd.eaadld/E.vteensttL(ivs)t|e|nve=r=(=''cplriiccke'',)  s u brmeittuTrynp eadn)s;w
e r P r iicnep(u)t;.
  a d d E viefn t(L/iqsuteeenne/r.(t'eksety(dvo)w)n ' ,  rfeutnucrtni oann s(wee)r S{i
                                                                                     z e ( ' q u eiefn '()e;.
                                                                                          k e y   =i=f=  ('/Eknitnegr/'.)t e{s te(.vp)r)e v e n trDeetfuarunl ta(n)s;w esruSbimziet(T'ykpiendg('));; 
                                                                                                                                                                                               } 
                                                                                                                                                                                          i f} )(;/
  f
                                      u l l | diofu b(l!ed/o.ctuemsetn(tv.)g)e trEelteumrenn taBnysIwde(r'Scihzaet(R'efsueltl''))); 
{ 
      i f   (c/otnwsitn /r.etseestt (=v )d)o c u m ernett.ucrrne aatnesEwleermSeinzte((''btuwtitno'n)';)
                                                                                      ; 
      i f   (r/easdejtu.sitd| b=a s'ec|hraetmRoetsee|te'l;e
  v a t i o n |rheesaedt|.ftoiottl|ez e=r o'.S?tgarratv /o.vteers't;(
    v ) | | v = =r=e'saedtj.ussettaAbtlter'i)b urteet(u'ranr iaan-slwaebreAld'j,u s'tSatbalret( )o;v
    e r ' ) ;i
    f   ( / b a crke|speati.ni|nhnuerrtH|TsMoLr e=| h'i&p#|xs2h1oBuBl;d'e;r
         | n e c k | srpeisneet/..stteyslte(.vc)s|s|Tve=x=t= '=p a'ibna'c)k grreotuunrdn: tarnasnwsepraPraeinnt(;)b;o
    r d e r :info n(e/;hcootl|osrw:e#aftf|fc;ofooln|tt-esmipz/e.:t2e0sptx(;vc)u)r s o rr:eptouirnnt earn;smwaerrgHiont-(r)i;g
  h t : 8 pixf; o(p/afciintayn:c.e7|'c;r
                  e d i t | s nraeps|epta.yamdednEtv|emnotnLtihsltye|nqeura(l'imfoyu|sbeaedn.t?ecrr'e,d iftu|nncot.i?ocnr e(d)i t{| \r$e5s|efti.vset.y?ldeo.lolpaarc/i.ttye s=t ('v1)');  r}e)t;u
r n   a n s wreersFeitn.aandcdeE(v)e;n
t L i s tiefn e(r/(b'rmaonuds|esleeratvae|'s,e afluyn|cstiimomno n(s)| m{a lroeusfe|ta.lsltsywleel.lo|psaocuitthye r=l a'n.d7/'.;t e}s)t;(
  v ) )   r e truersne ta.nasdwdeErvBernatnLdiss(t)e;n
e r ( ' cilfi c(k/'d,e lfiuvnecrt|ipoinc k(u)p |{t
                                                 a k e . ? h o m ei|fc a(rc|ofnifti|rbmo(x'/S.ttaerstt (av )n)e wr ectounrvne rasnastwieornD?e'l)i)v erreys(e)t;A
  l l ( ) ;i
f   ( / w a r}r)a;n
     t | r e t u rcnl|oesxecBhtann.gpea|rgeunatrNaondtee.ei/n.steersttB(evf)o)r er(erteusrent ,a ncslwoesreWBatrnr)a;n
t y ( ) ;}


      i fd o(c/uhmoeunrt|.oqpueenr|ycSleolseec|ttoordAalyl|(t'oan,ibguhttt|owne'e)k.efnodr|Esaucnhd(afyu|nmcotnidoany |(sealt)u r{d
                                                                                                                                  a y / . t e sitf( v()[)' crheattuTrong galnes'w,e'rcHhoautrCsl(o)s;e
                                                                                                                                    ' , ' c hiaft R(e/saedtd'r,e'scsh|awthSeerned|'l]o.ciantdieoxnO|fd(ierle.citdi)o n>| m-a1p)/ .rteetsutr(nv;)
                                                                                                                                    )   r e t u rcno nasnts wte r=A d(derle.stse(x)t;C
                                                                                                                                  o n t e nitf  |(|/ p'i'l)l.otwr|ismh(e)e.tt|oaLcocweesrsCoarsye|(p)r;o
                                                                                                                                  t e c t o r /i.ft e(s/t^(bvo)o)k  r(eat u|rfnr eaen s|wyeoruArc c|easns o)r?ya(p)p;o
                                                                                                                                  i n t m einft /(./tfeisrtm(|ts)o f|t|| mte d=i=u=m |'pblouoskh /n.otwe's t|(|v )t)  =r=e=t u'rbno oakn sawpeproFiinrtmmneensts'( )|;|
                                                                                                                                      e l . gieft A(t/tcroiubpultee|(p'ahrrtenfe'r)| t=w=o=. ?'p#ecohpalte'| h|u|s bealn.dg|ewtiAftet|rsipbouutsee(/'.htreesft'()v )=)= =r e't#ubrono ka'n s|w|e reClo.ugpelteA(t)t;r
                                                                                                                                                                                                                                                   i b u t ei(f' d(a/tcah-iclhda|tk'i)d)| b{u
                                                                                                                                                                                                                                                                                            n k | t e e n / .etle.satd(dvE)v)e nrteLtiusrtne naenrs(w'ecrlKiicdk('),; 
                                                                                                                                                                                                                                                                                                                                                                 f u n c tiifo n( /(ceo)m p{a ree.|pmraetvternetsDse.f?afuilrtm(|)a;s holpeeyn|Cahmaatz(o)n;| o}n)l;i
                                                                                                                                                                                                                                                                                                                                                                                 n e | w a y f}a
                                                                                                                                  i r / . t}e)s;t
( v ) )  rreettuurrnn  tarnusew;e
r C o}m
p
a r ef(u)n;c
t i o n  iofp e(n/Cshaamte(.)? d{a
y | t o nwiigdhgte|tt.acklea.s?stLoinsitg.hatd|dt(a'koep.e?nh'o)m;e
. ? t o niifg h(ts/t.attees.tm(evs)s)a greest.ulrenn gatnhs w=e=r=S a0m)e Dgarye(e)t;(
  ) ; 
    i f  s(e/twTiixm|ewoeubts(iftuen|cstiitoen/ .(t)e s{t (ivf) )( irneptuutr)n  iandpduMts.gf(o'cbuost('),;' Y}o,u \1'5r0e) ;o
                                                        n   t}h
      e
        n efwu nscittieo!n  Tchleo soelCdh aotn(e)  i{s  wbiedignegt .rceltaisrseLdi.s tR.eraedmyo vteo( 'boopoekn?''));; 
                                                     } 

    iffu n(c/tbiroonw sriensge|tlAololk(i)n g{|
      j u s t .s?tlooroek./r.etmeosvte(Ivt)e|m|(v'=m=b=a'_bcrhoawts_ivn5g'')); 
r e t u rsnt oarnes.wreermBorvoewIstienmg((')m;b
                                           a _ a u tiof_ v(5/'n)e;e
                                                           d _ n e ws|tnaeteed |=n e{w  smtaetpt:r'egsrse|erte'p,l atcr|aucpkg:rnaudl/l.,t ensatm(ev:)n)u l l ,  rpehtounren: naunlslw,e rsNiezeed:Nneuwl(l),; 
p
                                                                                     a i n : n/u/l lC,o lwlheecnt: nsutlelp,s 
m e s s aigfe s(:s[t]a t}e;.
s t e p =m=s=g'sc.oilnlneecrtH_TnMaLm e=' )' ' ;{
    s t a tqeu.incakm.ei=ntnietrlHeTCMaLs e=( v')';; 
      s a v e (g)r;e erte(t)u;r
  n   a}s
k
P h ofnuen(c)t;i o}n
  s a v ei(f)  ({s
                 t a t e .tsrtye p{= =s=t'ocroel.lseecttI_tpehmo(n'em'b)a _{c
    h a t _ v 5 'c,o nJsStO Np.=sntorrimnPghiofnye((svt)a;t
    e ) ) ;   }  icfa(t!cph) {( ea)d d{M}s
                              g ( '}b
                                 o
                                t ' ,f'uCnocutlido ny oluo asde(n)d  {t
                                                                      h a t   nturmyb e{r
                                                                                          a g a i n ?c o1n0s td irgaiwt s=  — sltiokree .8g0e3t-I5t5e5m-(0'1m2b3a._'c)h;a tr_evt5u'r)n;;
                                                                                       } 
                                      i f  s(traatwe). p{h osntea=tpe;  =s aJvSeO(N).;p arresteu(rrna wa)s;k Wrheetnu(r)n; 
                                                                      t r u e ;} 
                                                                     } 
      i f}  (csattacthe .(set)e p{=}=
= ' c o lrleetcutr_nw hfeanl's)e ;{
    s t}a
t
e . wfhuennc=tvi;o ns abvoet(()t;e xrte)t u{r
n   c o ncfoinrsmtB orookwi n=g (d)o;c u}m
e
n t . c r/e/a tFeaElllebmaecnkt (—' deilvi't)e; 
  c l o s er
o w . c laadsdsMNsagm(e' b=o t''c,h'aGtr-emastg  qcuheastt-imosng -— baontd' ;h
  o n e s tcloyn,s tt hbeu bt r=u edsotc uamnesnwte.rc riesa ttehEilse:m e<nbt>(a' dmiavt't)r;e
s s   i sb usbo.mceltahsisnNga myeo u=r  'bcohdayt -hbausb btloe 't;e
l l   y obuu ba.bionunte.r<H/TbM>L  N=o  tpeixctt.urreep,l ancoe (r/e\vni/egw,,  'n<ob rs>p'e)c; 
s h e e tr ocwa.na ptpeelnld Cyhoiul dw(hbautb )1;0
  m i n umtsegss .ianp poeunrd Cshhiolwdr(oroomw )w;i
l l . \ nm\sngWsh.esnc rcoalnl Tyoopu  =c ommseg si.ns?c rIo\l'llHle ihgahvte; 
  T r e y  srteaatdey. mfeosrs aygoeus..'p)u;s
h ( {   rsoelteQ:u i'cbko(t['{,l atbeexlt::' Ttoedxaty '},)v;a
l u e : 'sbaovoek(_)t;o
  d a y}'
}
, { lfaubneclt:i'oTno msoertrQouwi'c,kv(aolputes:)' b{o
  o k _ t oqmuoircrko.wi'n}n,e{rlHaTbMeLl :=' T'h'i;s
     w e e k(eonpdt's, v|a|l u[e]:)'.bfooorkE_awcehe(kfeunndc't}i,o{nl a(boeplt:)' C{a
                                                                                     l l   u s ' ,cvoanlsute :b' c=a ldlo'c}u]m)e;n
                                                                                       t . c}r
   e
   a t e/E/l e─m─ eAnnts(w'ebru thtaonnd'l)e;r
     s   ─ ── ── ── ──b──.──c──l──a──s──s──N──a──m──e── ──=── ──'──c──h──a──t──-──q──u──i──c─
     k - bftunn'c;t
     i o n   a n sbw.etrePxrtiCcoen(t)e n{t
                                            =   o pstt.altaeb.etlr a|c|k  o=p t';b
     u d g e t ' ;b
     . a d d EavdednMtsLgi(s'tbeonte'r,(''Sctlriacikg'h,t  ftuanlckt i—o nh e(r)e \{'
                                          s   w h a t   w ea dhdaUvsee:r\(no\pnt• .Tlwaibne lf r|o|m  o<pbt>)$;1
                                          3 0 < / b >   ( rqeutiacikl. i$n4n4e9r)H\TnM•L  F=u l'l' ;f
                                          r o m   < b > $ 1r4o0u<t/eb(>o p(tr.evtaaliule  $|5|9 9()o\pnt• .Qluaebeenl  f|r|o mo p<tb)>.$t1o5L0o<w/ebr>C a(sree(t)a)i;l
                                            $ 6 9 9 ) \}n)•; 
K i n g   f rqoumi c<kb.>a$p2p7e5n<d/Cbh>i l(dr(ebt)a;i
l   $ 1 ,}1)9;9
) \ n}\
n
A l lf unnacmtei-obnr aanddd.U sAelrl( t5e0x–8t0)%  {o
                                                     f f   r ectoanislt.  rAonwd  =i fd obcuudmgeentt\.'csr etaitgehEtl e—m e<nbt>($'5d igve't)s; 
y o u   oruotw .tchlea sdsoNoarm et o=d a'yc<h/abt>- mwsigt hc hSanta-pm sFgi-nuasnecre',; 
9 0 - d acyo npsaty obfufb  o=p tdioocnu.m\enn\tn.Wchreena tceaEnl eymoeun tc(o'mdei vl'a)y; 
  o n   a  bfuebw.?c'l)a;s
  s N a m es e=t Q'ucihcakt(-[b{ulbabbleel':;'
  T o d a yb'u,bv.atleuxet:C'obnotoekn_tt o=d atye'x}t,;{
  l a b e lr:o'wT.haipsp ewnedeCkheinldd'(,bvuabl)u;e
: ' b o omks_gwse.eakpepnedn'd}C,h{illadb(erlo:w')T;e
  l l   m em sagbso.ustc rfoilnlaTnocpi n=g 'm,svgasl.usec:r'oflilnHaenicgeh't};]
  ) ; 
    s t asttea.tmee.ssstaegpe=s'.cpluosshi(n{g 'r;o lsea:v e'(u)s;e
      r ' ,} 
      t
                                   e x tf:u ntcetxito n} )a;n
s w e r Ssiazvee((s)i;z
e )  }{


     f ucnocntsito np  s=u b{mtiwtiTny:p{eod:(1)3 0{,
                                         r : 4 4 9c}o,nfsutl lv: {=o :(1i4n0p,urt:.5v9a9l}u,eq u|e|e n':'{)o.:t1r5i0m,(r):;6
       9 9 } , kiifn g(:!{vo): 2r7e5t,urr:n1;1
                             9 9 } } [isnipzuet].;v
a l u e  a=d d'M's;g
( ' b o ta'd,dcUaspe(rs(ivz)e;)
+ ' s   sqtuairctk .aitn n<ebr>H$T'M+Lp .=o +'''<;/
b > .   Trhoautt es(avm.et obLeodw erreCtaasiel(s) )f;o
r   $}'
  +
  p . r/+/'  ─a──t  GtRhEeE TcIhNaGi n──s──.──\──n──\──n──H──e──r──e──\──'──s── ──t──h──e── ──t──h──i──n──g── ──—─ ──y──o──u──\──'──l─
l   sfluenecpt ioonn  tghriese tm(a)t t{r
e s s   rcooungshtl yh  3=, 0n0e0w  nDiagthet(s).. gSepteHnoduirnsg( )1;0
                                          m i n uctoenss tl agy i=n gh  o<n  1a2  f?e w' Gboeodds  mtoor nfiinngd'  t:h eh  r<i g1h7t  ?o n'eG oiosd  tahfet esrmnaorotne's t:  d'eGcoiosdi oenv eynoiun gc'a;n
                                          m a k eb.o tY(ogu r+  b"o!d yI 'wmi lylo ukrn oSwl eiempm eSdpieactieallyi.s\tn \hneWrhea ta tt iMmaet twroerskss ?b'y) ;A
                                            p p o i nstemteQnuti cikn( [S{ulmatbeerl.:\'nT\ondRaeya'l, vqauliucek: '—b owohka_tt obdraiyn'g}s, {yloaub eiln: 'tToodmaoyr?r"o)w;'
                                            , v a l usee:t'Qbuoiockk_(t[o
                                            m o r r o w '{} ,l{albaeble:l :''NTeheids  aw eneekwe nmda't,tvraelsuse':,' bvoaolku_ew:e e'kneenedd'_}n]e)w;'
} , 
  s t a t e .{s ilzaeb=esli:z e';B asctka toer. sstleepe=p' cplaoisni'n,g 'v;a lsuaev:e (')p;a
                                                                                         i n '} 
}
, 
  f u n c t i{o nl aabneslw:e r'ACdhjeucsktianbgl ep(r)i c{e
    s ' ,   vsatlautee:. t'rparcikc e='  '}q,u
a l i t y ' ;{
    l a b eald:d M'sUgp(g'rbaodte' ,t'o< ba>dAjdujsutsatbalbel'e,  bvaasleuse :a r'ea daj ugsatmaeb-lceh'a n}g,e
  r < / b >   —{  elsapbeecli:a l'lJyu sfto rb rboawcski npga'i,n ,v aslnuoer:i n'gb,r oawcsiidn gr'e f}l
u x ,   o]r) ;c
o u p l esst awtiet.hs tdeipf f=e r'ednits ccoovmefroyr't; 
n e e d ss.a\vne\(n)W;e
  c a}r
r
y   p/r/e m─i──u mM AaIdNj uRsOtUaTbElRe  ──s──y──s──t──e──m──s── ──w──i──t──h── ──w──i──r──e──l──e──s──s── ──r──e──m──o──t──e──,── ─
h e afdu n&c tfiooont  reoluetvea(tvi)o n{,

  z e r o -/g/r aBvoiotkyi npgo sfiltoiwo na,c tainodn su
n d e r -ibfe d( vl i=g=h=t i'ncgo.n fQiureme_ny easd'j)u srteatbulren  ssyesntdeBmoso ksitnagr(t)i;n
g   a r oiufn d( v< b=>=$=9 9'9c<o/nbf>i,r mK_ifnigx 'f)r o{m  s<tba>t$e1.,n2a9m9e< /=b >n u— lwle;l ls tbaetleo.wp hwohnaet  =y onuu\l'ld;  psatya taet. wah ecnh a=i nn.u\lnl\;n Tshaivse (i)s;  rreeatlulryn  saosmkeNtahmien(g) ;y o}u
                                                              n e e di ft o( vt r=y= =i n' cpaelrls'o)n .{  Obnoet (m'iAnbustoel uitne ltyh e—  <bae dh raenfd= "ytoeul\:'8l0l3 7w9o5n1d1e9r4 "h>otwa py ohue rsel etpot  cfallalt  8y0o3u-r7 9w5h-o1l1e9 4l<i/fae>..  WThreeny  cpainc kyso uu pc o7m ed aiyns? 'a) ;w
                                                                e e k . 's)e;t Qrueitcukr(n[;{ l}a
                                                            b
                                                            e l : ' T/o/d aQyu'i,cvka lbuoeo:k'ibnogo ks_htoordtacyu't}s,
{ l a b eilf: '(Tvo.msotrarrotws'W,ivtahl(u'eb:o'obko_o'k)_)t o{m
  o r r o w ' }c,o{nlsatb emla:p' T=h i{s  twoedeakye:n d''t,ovdaalyu'e,: 'tboomookr_rwoewe:k e'ntdo'm}o,r{rloawb'e,l :w'eTeekleln dm:e  'mtohries' ,wveaelkueen:d''a,d jwuesetka:b l'el_amtoerre 't}h]i)s; 
w e e k 's t}a;t
  e . s i z e =s'tqauteee.nw'h;e ns t=a tmea.ps[tve.pr=e'pcllaocsei(n'gb'o;o ks_a'v,e (')';)
]   |}|

  v . rfeupnlcatcieo(n' baonoskw_e'r,P a'i'n)(;)
{ 
        saadvdeM(s)g;(
          ' b o t ' , 'rBeatcukr na nfdl ohwiBpo opkaiinng (f)r;o
          m   a   b}a
d
  m a t t/r/e sIsn tiesn to ndee toefc ttihoen  m—o sbto ockoimnmgo
n   —   ainfd  (m/obsoto kf|iaxpapbolien t— |psrcohbeldeumls| cpoemoep lien |psutto pu pb yw|ivtihs ifto|rr eyaedayr|sl.e\tn'\?nsH edroe \i'ts| swihgant  mmeo sutp /p.etoepslte( vd)o)n \r'ett ukrnno wf:l otwhBeo o"kriinggh(t)"; 
  m
a t t r e/s/s  Ifnotre nbta cdke tpeacitni odne p— etnodpsi cesn
t i r e liyf  o(n/ pyroiucre |bcoodsyt |thyopwe ,m usclhe|ecph epaops|iatfifoonr,d |adnodl lwahra/t.\t'ess ta(cvt)u a|l|l yv  c=a=u=s i'npgr itchee' )p arient.u rAn  maantstwreersPsr itchea(t) ;f
  i x e s  iofn e( /paedrjsuosnt\|'bsa sbea|crke mdoetset|rhoeyasd |sfoomoeto|neel eevlaste|\z'esr.o\.n?\gn|Tmhaasts\a'gse /e.xtaecsttl(yv )w h|y|  wve  =d=o=  a'papdojiunsttmaebnltes'.)  Trreetyu rwni laln swwaelrkA dyjouus ttahbrloeu(g)h; 
3 –4   o pitfi o(n/sq uaenedn /y.otue\s'tl(lv )k)n orwe twuhrinc ha nosnwee riSsi zrei(g'hqtu eweint'h)i;n
    2   b eidfs .( /Mkoisntg /p.etoepslte( vl)e)a vree ttuhrant  asnasmwee rdSaiyz.e\(n'\kniRnega'd)y; 
t o   f iixf  t(h/ifsu?l lW|hdaotu btliem/e. tweosrtk(sv?)')) ;r
                                                      e t u r ns eatnQsuwiecrkS(i[z{el(a'bfeull:l''T)o;d
a y ' , viafl u(e/:t'wbiono/k._tteosdta(yv')}), {rleatbuerln: 'aTnosmwoerrrSoiwz'e,(v'atlwuien:'')b;o
o k _ t oimfo r(r/obwa'c}k,|{plaaibne|lh:u'rTth|isso rwee|ehkiepn|ds'h,ovualldueer:|'nbeocokk|_swpeienkee/n.dt'e}s]t)(;v
  )   | |  svt a=t=e=. p'apiani=n''b)a crke/thuirpn  paanisnw'e;r Psatiant(e).;s
t e p = 'icfl o(s/ihnogt'|;s wseaavte|(c)o;o
l | n}i
g
h t  fsuwnecatti|osnl eaenps.wheortH/o.tt(e)s t{(
  v ) )   raedtduMrsng (a'nbsowte'r,H'oStl(e)e;p
                                                i n g   hioft  (i/sf iunsaunacl|lcyr ead imta|tntor ecsrse dpirto|bslneamp |—p adyemnesnet |fmooanmt htlrya|pbsa db ocdrye dhieta|ta fafnodr dt/h.etrees\t'(sv )n)o  raeitrufrlno wa.n\snw\enrWFei ncaanrcrey( )c;o
                                                  o l i n gi-fg e(l/ daenldi vheyrb|rpiidc k(ucpo|itla+kfeo ahmo)m eb|ecdasr |dtersuingkn|efdi tt|oc asrlreye/p. tseisgtn(ivf)i)c arnettluyr nc oaonlsewre.r DTehlei vdeirfyf(e)r;e
                                                n c e   iisf  r(e/awla rarnadn ty|orue tfuerenl| eixtc hiamnmgeed|ipaotleilcyy./\.nt\ensCto(mve) )t rrye tounren.  a1n0s wmeirnWuatrersa nitny (t)h;e
                                                  s h o wirfo o(m/ hvosu.r |yoepaerns| colfo swea|kwihnegn |utpo dsawye|attoinnigg hatt| w3eaemk.e nEda|ssyc hdeedcuilsei/o.nt.e sWth(evn) )w orrektsu rfno ra nysowue?r'H)o;u
                                                    r s ( ) ;s
                                                e t Q u iicfk (([/{aldadbreels:s'|Twohdearye'|,lvoaclautei:o'nb|odoikr_etcotdiaoyn'|}f,i{nlda byeolu:|'mTaopm/o.rtreoswt'(,vv)a)l uree:t'ubrono ka_ntsowmeorrArdodwr'e}s,s{(l)a;b
                                                                                                                                                                                                                           e l : ' Tihfi s( /wbereaknedn|ds'e,rvtaal|usee:a'lbyo|oski_mwmeoenkse|nmda'l}o]u)f;|
s o u t hsetraltaen.dp|aailnl=s'wsellele|pnsa mheo tb'r;a nsdt/a.ttee.sstt(evp)=)' crleotsuirnng 'a;n sswaevreB(r)a;n
d s (})
;

    f u nicft i(o/na maanzsowne|rwFailnmaanrcte|(o)n l{i
                                                       n e | w asytfaatier.|tcroasctkc=o'|bcuodmgpeatr'e;d
                                                       | c h e aapdedrM sogn(l'ibnoet/'.,t'eNsot (cvr)e)d irte?t uBrand  acnrsewdeirtV?s ODnoleisnne\(')t; 
m a t t eirf  h(e/rkei.d\sn?\|nc<hbi>lSdn|abpu nFki|ntaondcdel<e/rb/>. t— ensot (cvr)e)d irte tnuerend eadn,s wuepr Ktiod s$(4),;0
                                                       0 0 ,   9i0f- d(a/yp asratmnee-ra|ss-pcoausshe |ohputsiboann.d |Pwrief-eq|ucaoluipflye |itnw oa bpoeuotp l2e |mbiontuht eosf  iuns-/s.ttoerset.(\vn)\)n <rbe>t$u5r nd oawnns<w/ebr>C ogueptlse (y)o;u
                                                         s l e eipfi n(g/ foinr ma| snoafmte|-mberdainudm |mpaltutsrhe|shsa rtdo/n.itgehstt.( vY)o)u \r'evteu rbne eann spwuetrtFiinrgm ntehsiss( )o;f
                                                           f   l o nigf  e(n/onuog hs h—o wt|hcea nfcienla|nrceisncgh erdeumloevde?s/ .tthees tl(avs)t)  erxectuusren. \ann\snwWearnRte stcoh ecdoumlee (i)n; 
a n d   pirfe -(q/utahliinfky| mwahyiblee| nyootu  stuerset| nboetd sr?e'a)d;y
  | l a t esre|tnQouti cyke(t[/{.ltaebsetl(:v')T)o draeyt'u,rvna launes:w'ebroNookt_Rteoaddayy(')};,
                            { l a b eilf: '(T/obmroorwrsoiwn'g,|vlaoloukei:n'gb|ojouks_tt olmooorkr/o.wt'e}s,t{(lva)b)e lr:e'tWuhrant  aanrsew etrhBer opwrsiicnegs(?)';,
                                                       v a l u ei:f' p(r/inceee'd}_]n)e;w
                                                       | n e w  smtaattter.esstse|pr=e'pcllaocs|iunpgg'r;a ds|anveee(d)/;.
t e s}t
(
  v ) )f urnecttuironn  aannsswweerrNBereadnNdesw(()) ;{


        a/d/d MCsogl(l'ebcotti'n,g' Wset ecpasr
          r y   < bi>fS e(rsttaa,t eS.esatleyp,  =S=i=m m'ocnosl,l eScotu_tnhaemrel'a)n d{,
        M a l o u fs,t<a/tbe>. naanmde  <=b >tAiltllsewCealsle<(/vb)>; 
                                                                —  t h e   s asmaev en(a)m;e
            b r a n d sr eytouur\n' da sfkiPnhdo naet( )M;a
              t t r e s}s
        F i r mi fo r( sAtsahtlee.ys,t eapt  =5=0=– 8'0c%o lbleelcotw_ pthhoenier' )p r{i
                                                                                        c e . \ n \ ncTohnes td ipf f=e rneonrcmea liisz ewPeh\o'nree( va) ;s
                                                                                          m a l l   i nidfe p(e!npd)e n{t  boopte(r"aCtoiuolnd  wyiotuh  sleonwd  otvhearth enaudm.b eTrh aatg asianv?i nJguss tg o1e0s  ddiigrietcst l—y  ltiok ey o8u0.3\-n5\5n5W-a0n1t2 3t.o" )c;o mree tsueren ;t h}e
                                                                                          l i n e u ps?t'a)t;e
                                                                                            . p h o nsee t=Q upi;c
                                                                                        k ( [ { l a bsealv:e'(T)o;d
                                                                                        a y ' , v a lrueet:u'rbno oaks_ktWohdeany(')};,
                                                                                                                                  { l a b e}l
                                                                                        : ' T h iisf  w(esetkaetned.'s,tveapl u=e=:=' b'ocookl_lweecetk_ewnhde'n}',){ l{a
                                                                                                                                                                        b e l : ' W hsatta taer.ew htehne  =p rvi;c
                                                                                                                                                                          e s ? ' , v aslauvee:(')p;r
                                                                                                                                                                        i c e ' } ] )r;e
                                                                                                                                                                          t u r n  sctoantfei.rsmtBeopo=k'icnlgo(s)i;n
                                                                                                                                                                          g ' ;   s}a
                                                                                                                                                                          v
                                                                                                                                                                        e ( ) ; 
                                                                                        / /  }F
                                                                                        a
                                                                                        l l bfaucnkc t— ieolni taen shwaenrdDleilnigv
                                                                                        e r y ( )a n{s
                                                                                                     w e r F aaldldbMascgk(('vb)o;t
                                                                                                                            ' , '}E
                                                                                                                            v
                                                                                                                            e r y/ /m a─t──t rTeOsPsI Cc oHmAeNsD LrEoRlSl e──d── ──i──n── ──a── ──b──o──x── ──—─ ──f──i──t──s── ──i──n── ──a──n──y── ──c──a──r──,─
                                                                                                      
                                                                                        e v efnu nac tsieodna na nosrw eSrUPVr iwciet(h)  t{h
                                                                                                                                            e   b a cskt asteea.ttsr adcokw n=. \'nb\und<gbe>tT'a;k
                                                                                                                                            e   i t  bhootm(e" Hteornei'gsh tt.h<e/ bs>t rOapiegnh tt hter ubtohx ,o nl eptr iicti negx p—a nndo,  gdaomnees.: \Nno\ nw• aTiwtiinn gf roonm  a< bd>e$l1i3v0e<r/yb >t r(urcekt,a inlo  ~s$c4h4e9d)u\lni•n gF uwliln dforwosm,  <nbo> $t1i4p0p<i/nbg>  a( rcerteawi.l\ n~\$n5T9h9a)t\\n'• sQ uoeneen  mforroem  r<eba>s$o1n5 0t<o/ bj>u s(tr ectoamiel  i~n$ 6t9o9d)a\yn.•  WKhienng  wforrokms ?<'b)>;$
                                                                                                                                              2 7 5 < /sbe>t Q(uriectka(i[l{ l~a$b1e,l1:9'9T)o\dna\yn'A,lvla lnuaem:e'-bboroakn_dt o— dSaeyr't}a,,{ lSaebaelly:,' TSoimmomrornosw,' ,Mvaallouuef:.' bSoaomke_ tboemdosr rtohwe' }b]i)g; 
                                                                                                     s t o r esst asteel.ls tfeopr= '2c–l3oxs imnogr'e;. \sna\vneA(n)d; 
                                                                                                     i f  }b
                                                                                                     u
                                                                                                     d g eftu nicst itoing hatn:s w<ebr>W$a5r rdaonwtny (g)e t{s
                                                                                                                                                                 y o u  asdldeMespgi(n'gb ootn' ,i'tF utloln imgahntu.f<a/cbt>u rSenra pw aFrirnaanntcye ,—  n1o0  cyreeadrist  onne emdoesdt. \bne\dnsW.h eAnn dc ayno uy\o'ur ec odmeea lsieneg  twhietmh  iTnr epye rdsiorne?c"t)l;y
                                                                                                                                                                   ,   n o ts eat Q1u-i8c0k0( [n
                                                                                                                                                                                               u m b e r   t{h alta bbeolu:n c'eTso dyaoyu' ,a rvoaulnude :f o'rb owoeke_ktso.d\any\'n T}h,a
                                                                                                                                                                   t \ ' s   t h{e  laadbvealn:t a'gTeh iosf  wae elkoecnadl' ,s hvoapl.u eC:o m'eb osoeke_ wteheek ednidf'f e}r,e
                                                                                                                                                                   n c e .   W h{e nl acbaenl :y o'uT esltlo pm eb ya?b'o)u;t
                                                                                                                                                                                   f i n asnectiQnugi'c,k (v[a{lluaeb:e l':f'iTnoadnacye'', v}a
                                                                                                                                                                                     l u e : ']b)o;o
                                                                                                                                                                                     k _ t o dsatya't}e,.{sltaebpe l=: ''Tcolmoosrirnogw'';,
                                                                                                                                                                                     v a l u es:a'vbeo(o)k;_
                                                                                                                                                                                     t o m}o
                                                                                                                                                                                                             r
                                                                                                                                                                                                             r o wf'u}n]c)t;i
                                                                                                                                                                                                               o n   a nsstwaetreA.dsjtuespt=a'bclleo(s)i n{g
                                                                                                                                                                                                               ' ;   s asvtea(t)e;.
                                                                                                                                                                                                               t r a}c
                                                                                                                                                               k
                                                                                                                                                                 =  f'uqnucatliiotny 'a;n
                                                                                                                                                               s w e r Hbooutr(s"(A)d j{u
                                                                                                                                                                 s t a b laed dbMassge(s' baorte' ,a' Otpoetna l< bg>a7m ed-acyhsa nag ewre e—k ,e s1p0eacmi–a7lplmy< /ibf> .y oSua mdee-adla yw iatphp obianctkm epnatisn ,w eslncoormien g— ,w ea cdiodn \r'etf lhuaxv,e  oar  pjaucskte dw awnati ttihneg  lruoxoumr.y  Yoofu  rceoamdei nign ,o ry owua tgcehti nTgr eTyV\ 'ast  ftuhlel  paetrtfeenctti oann.g\lne\.n\Wnh\antW et icmaer rwyo rpkrse mfiourm  yaoduj utsotdaabyl?e' )s;y
                                                                                                                                                               s t e m ss:e\tnQ• uQiuceke(n[ {aldajbueslt:a'bTloed abya's,ev aflruoem: '<bbo>o$k9_9t9o<d/aby>'\}n,•{ lKaibnegl :a'dTjoumsotrarbolwe' ,bvaasleu ef:r'obmo o<kb_>t$o1m,o2r9r9o<w/'b}>,\{nl• aHbieglh:e'rT-heinsd  woepetkieonnds' ,avvaaliulea:b'lbeo\onk\_nwPeaeikreendd 'w}i]t)h; 
                                                                                                                                                                                              t h e   rsitgahtte .msattetpr=e'scsl,o smionsgt' ;p esoapvlee( )s;a
                                                                                                                                                                                              y   i}t
                                                                                                                                                                                          '
                                                                                                                                                                                          s   tfhuen cbteisotn  salnesewpe riAndvdersetsmse(n)t  {t
                                                                                                                                                                                                                                                  h e y ' vaed deMvsegr( 'mbaodte'.,\'n<\bn>H1o8n0e9s tHlwyy,  1y5o uS ohuatvhe,  tSou mltaeyr  oSnC  o2n9e1 5t0o< /ubn>d\enr<sat ahnrde fi=t".h t1t0p sm:i/n/uwtwews. gaonodg lyeo.uc'olml/ mnaepvse/rs ewaarncth /a? afplia=t1 &bqeude rayg=a1i8n0.9 +WHawnyt+ 1t5o+ Scooumteh +iSnu?m"t)e;r
                                                                                                                                                                                                                                                    + S C + 2s9e1t5Q0u"i ctka(r[g
                                                                                                                                                                                                                                                    e t = " _ b l{a nlka"b>e📍 lG:e t' Ydeisr,e cbtoiookn sa<n/ aa>p\pno\innEtamseyn tt'o,  fvianldu,e :f r'ebeo opka_rtkoidnagy 'r i}g,h
                                                                                                                                                               t   i n   f r{o nlta.b eWlh:e n' Tshhiosu lwde eIk etnedl'l,  Tvraelyu et:o  'ebxopoekc_tw eyeokue?n'd)'; 
                                                                                                                                                                             } , 
                                                                                                         s e t Q u{i clka(b[e{ll:a b'eTle:l'lT omdea ym'o,rvea'l,u ev:a'lbuoeo:k _'taoddjauys't}a,b{llea_bmeolr:e''T o}m
                                                                                                           o r r o w]'),;v
                                                                                                           a l u e :s'tbaotoek._sttoempo r=r o'wc'l}o]s)i;n
                                                                                                           g ' ; 
                                                                                                             s t a tsea.vset(e)p;=
                                                                                                                   ' c l}o
                                                                                                                     s
                                                                                                                              i n gf'u;n cstaivoen( )a;n
                                                                                                                                s w e}r
                                                                                                                   S
                                                                                                                   i z ef(usnicztei)o n{ 
                                                                                                                   a n s w ecroFnisrtm npersisc(e)s  {=
                                                                                                                     {   t waidnd:M s{g (o'ubrost:' ,1'3F0i,r mrneetsasi li:s  4o4n9e  }o,f  ftuhlel :m o{s to upresr:s o1n4a0l,  trheitnagisl :a b5o9u9t  }a,  mqauteterne:s s{  —o uarnsd:  o1n5e0 ,o fr etthaei lm:o s6t9 9m i}s,u nkdienrgs:t o{o do.u\rns\:n M2o7s5t,  preeotpaliel :t h1i1n9k9  t}h e}y; 
                                                                                                                     w a n t  cfoinrsmt  fpo r=  bparcikc essu[pspiozret].; 
                                                                                                                     B u t   as tbaetde .tshiazte\ '=s  stiozoe ;f
                                                                                                                       i r m   csrteaattee.ss tperpe s=s u'rcel opsoiinngt's; 
                                                                                                                     a t   y osuarv eh(i)p;s
                                                                                                                                        a n d  bsohto(ucladpe(rssi.z eT)o o+  s"osf ts,t ayrotu ra ts p<ibn>e$ "s a+g sp.. oTuhres  s+w e"e<t/ bs>p ohte rdee.p eSnadmse  ebnetdi rreulnys  o$n"  y+o upr. rbeotdayi lw e+i g"h ta ta ntdh es lceheapi np osstiotrieosn..\\nn\\nnH<ebr>eT'hsi st hies  tlhiitnegr a—l lyyo ui'mrpeo sgsoiibnlge  ttoo  sfliegeupr eo no utth ifsr omma tat rweesbss iftoer. <t/hbe>  n5e xmti n7u–1t0e sy elaarysi,n gr ooung hbleyd s3 ,a0n0d0  ynoiug\h'tlsl.  kSnpoewn deixnagc t1l0y  mwihnautt eyso ul anyeiendg.  oCno mae  ffeiwn do potuito.n sW hiesn  hwoowr kyso?u' )m;a
                                                                                                                                          k e   s usreet Qyuoiuc kg(e[t{ liatb erli:g'hTto.d\any\'n,Nvoa lguuee:s'sbionogk _ftroodma ya' }p,i{cltaubreel.: 'NToo mroergrroewt's,.v aJluuset: 'cboomoek _ltaoym oornr oiwt'.}\,n{\lnaWbhealt: 'tTihmies  wwoerekkse nfdo'r, vyaoluu?e":)';b
                                                                                                                                                                        o o k _ wseeetkQeunidc'k}(][)
                                                                                                                                                                          ; 
                                                                                                                                               s{t altaeb.eslt:e p'=T'ocdlaoys'i,n gv'a;l usea:v e'(b)o;o
                                                                                                                                                 k _ t}o
                                                                                                                                                                        d
                                                                                                                                                                        a y 'f u}n,c
                                                                                                                                                                          t i o n   a n{s wlearbCeolu:p l'eT(o)m o{r
                                                                                                                                                                          r o w ' ,a dvdaMlsuge(:' b'obto'o,k'_Gtroemaotr rpoowi'n t} ,— 
                                                                                                                                      a n d   s o m{e tlhaibnegl :m o'sTth ipse owpeleek emnids's,.  vIafl utew:o  'pbeooopkl_ew eaerkee nsdl'e e}p
                                                                                                                                                                        i n g   i]n) ;t
                                                                                                                                                                        h e  }b
                                                                                                                                      e
                                                                                                                                      d ,  ftuhnecyt iboont ha nnseweedr Ptaoi nt(r)y  {i
                                                                                                                                                                                        t . \ n \sntDaitfef.epraeinnt  =b o'dbya ctky/pselse,e pd ipfafienr'e;n
                                                                                                                                                                                        t   s l esetpa tpeo.ssitteipo n=s ,' cdliofsfienrge'n;t
                                                                                                                                                                                          p a i ns apvoei(n)t;s
                                                                                                                                                                                        .   A   mbaottt(r"eTshsa tt'hsa te\x'asc tpleyr fwehcyt  ifno-rp eornseo np airst nseor  icmapno rbtea nwtr o— nbga cfko ra ntdh es loetehpe rp.a\inn\ nc<obm>eBsr ifnrgo mw htoheev ewrr ownigl ls ubpep osrlte,e painndg  tohne riet'.s< /nbo>  wTahya tt\o' sk ntohwe  fornolmy  aw apyi cttou rken oowr  yao ur\e'vriee wb.o\tnh\ ngAo imnagt throemses  htahpapty'.s  Wteo\o' lslo fhta vlee tyso uy obuort hh itprsy  stihnek  saanmde  yboeudrs  sapnidn ef itnwdi swth.a tT owoo rfkisr mf opru tbso tphr eosfs uyroeu .o nW hyeonu rc asnh oyuolud ebrost ha ncdo mhei pisn.? 'T)h;e
                                                                                                                                                                                              r i g hste taQnusiwcekr( [d{elpaebnedls: 'oTno dyaoyu'r, vbaolduye,: 'yboouork _stloedeapy 'p}o,s{iltaiboenl,: 'aTnhdi sh owwe eykoeun dm'o,vvea laute :n'ibgohotk._\wne\enkTernedy' }w]i)l;l
                                                                                                                                                                                          w a l ks tyaotue .tshtreopu=g'hc l3o–s4i nogp't;i osnasv eb(u)i;l
                                                                                                                                                                                        t   f}o
                                                                                                                                      r
                                                                                                                                        b afcukn catnido nh iapn sswueprpKoirdt(.)  M{o
                                                                                                                                                                                      s t   p eaodpdlMes gk(n'obwo tw'h,i'cKhi dosn eg oi st hrrioguhgth  wmiatthtirne s2s ebse dfsa s— tt h— agtr'osw tiht .s\pnu\rntYso ua'rvee  rbeeaeln.  wGaokoidn gn euwps :u ntcwoimnfso ratnadb lfeu lllosn ga reen oouugrh .m oCsotm ea fffioxr diatb.l eW hoepnt iwoonrsk sa?n"d) ;w
                                                                                                                                                                                        e   h a vsee tkQiudi-cfkr(i[e
                                                                                                                                                                                                                  n d l y   o p{t iloanbse lt:h a'tT ohdoalyd' ,u pv.a\lnu\en:T w'ibno ofkr_otmo d<aby>'$ 1}3,0
                                                                                                                                                                                      < / b > ,   F{u llla bferlo:m  '<Tbo>m$o1r4r0o<w/'b,> .v aTlaukee:  i'tb ohookm_et oimno rar obwo'x  }t,o
                                                                                                                                                                                        d a y . \ n \{n Wlhaebne lc:a n' Tyhoius  cwoemeek einnd?'',) ;v
                                                                                                                                                                                        a l u e :s e'tbQouoikc_kw(e[e{kleanbde'l :}'
                                                                                                                                                                                        T o d a y]'),;v
                                                                                                                                                                                        a l u}e
                                                                                                                                      :
                                                                                                                                        ' b ofoukn_cttoidoany 'a}n,s{wlearbHeolt:(')T o{m
                                                                                                                                                                                  o r r o ws't,avtael.upea:i'nb o=o k'_stloemeoprsr ohwo't}'];)
                                                                                                                     ; 
                                                                                                                         s tsattaet.es.tsetpe p== ''cclloossiinngg'';; 
                                                                                                                   s a v e (s)a;v
                                                                                                                     e ( )};
                                                                                                                   
                                                                                                                                                               
                                                                                                                                                                    f ubnoctt(i"oSnl eaenpsiwnegr Choomtp airse (m)i s{e
                                                                                                                                                                      r a b l ea d— daMnsdg (i'tb'ost 'u,s'uFaalilry  qtuhees tmiaotnt r— eysosu  tsrhaopuplidn gc ohmepaatr.e\.n\\nn\WneH ecraer\r'ys  ctohoel ihnogn-egsetl  dainfdf eorpeennc-ec:o itlh eh ybbirgi dc hbaeidnss  thhaavte  a$c8t0u0a lilny  mbarrekaetthien ga nadn ds lreeenpt  cboaokle.d  Tihnet od iefvfeerrye nmcaet tbreetswse epnr iac ef.o aWme  mdaotnt\r'ets.s  Saanmde  aS ehrytbar,i ds aimse  sSoemaeltyh i—n go uyro uQ ufeeeenl  sitmamretdsi aatte l<yb.>\$n1\5n0C<o/mbe>  lvasy.  o$n6 9a9 +f eawt  —t hyeo uc'hlali nnso.t\inc\en Aintd  wointlhiinne ?m iYnouut\e'sr.e  Wghueens scianng .y oNuo  srweitnugr nb yp?o"l)i;c
                                                                                                                                                                      y   w i lsle tgQiuviec ky(o[u
                                                                                                                                                                                                  b a c k   t{h el a6b emlo:n t'hTso doafy 'b,a dv asllueee:p  'bbeofookr_et oydoauy 'f i}n,a
                                                                                                                   l l y   g i v{e  luapb ealn:d  'sTeonmdo rirto wb'a,c kv.a\lnu\en:T h'eb osomka_rttoemsotr rmoowv'e  }i,s
                                                                                                                     t o   c o m{e  llaabye lo:n  'iTth ifsi rwsete.k e1n0d 'm,i nvuatleuse :t e'lbloso ky_owue emkoerned 't h}a
                                                                                                                   n   1 0  ]h)o;u
                                                                                                                   r s  }o
                                                                                                                                                               f
                                                                                                                                                                 r efvuinecwtsi.o nW haenns wcearnF iynoaun cceo(m)e  {i
                                                                                                                                                                                                                       n ? ' ) ;s
                                                                                                                                                                                                                         t a t e .stertaQcuki c=k ('[b{uldagbeetl':;'
                                                                                                                                                                                                                         T o d a yb'o,tv(a"lYuees: '— baonodk _tthoidsa yi's} ,w{hlearbee lw:e' Trheiasl lwye ehkeelnpd 'p,evoaplluee.:\'nb\ono<kb_>wSeneakpe nFdi'n}a,n{clea b—e lN:o' WChraetd iatr eN etehdee dp.r<i/cbe>s ?D'o,evsanl'ute :m'aptrtiecre 'i}f] )y;o
                                                                                                                                                                   u r   c rsetdaitte .isst ebpa=d',c ltohsiinn,g 'o;r  snaovnee(x)i;s
                                                                                                                                                                                                                                                                                                                                                                         t e n}t
                                                                                                                                                               .
                                                                                                                                                                     M ofsutn cpteioopnl ea ngsewte raSpapmreoDvaeyd( )i n{ 
                                                                                                                                                               2   m i naudtdeMss gr(i'gbhott 'i,n' Ytehse  —s t<obr>es.a\mne\ nd•a y$,5  tdaokwen ,i ts lheoempe  otno niitg htto.n<i/gbh>t \Env• e9r0y- dmaayt tsraemses- acso-mceass hi no pat iboonxs,  afviatisl aibnl ea\nny•  cQaure.e nYso uf rcoamn  $b1e5 0s l— epeapyimnegn tosn  caa nb rbaen du nndeewr  n$a2m0e/-wbereakn\dn \mnaYtotur'evses  ptroonbiagbhlty. \bne\ennC opmuet tiinn,g  ltahyi so no faf  fbeewc,a upsiec ky otuh et hroiugghhtt  oynoeu,  cdoounled.n 'Wth aatf ftoirmde  iwto.r kYso?u' )c;a
                                                                                                                                                                   n .   C osmeet Qiuni cakn(d[ {wlea'blell :f'iWgiutrhei ni t1  ohuotu.r 'W,hveanl uweo:r'kisn  f1o rh oyuoru'?}",){;l
                                                                                                                                                                     a b e l :s'eTthQiusi cakf(t[e
                                                                                                                                                                                               r n o o n ' ,{v allaubee:l':t h'iTso daafyt e—r nloeotn\''}s, {dloa bietl':,' Tvhailsu ee:v e'nbionogk'_,tvoadlauye': '}t,h
                                                                                                                                                                                                             i s   e v e n{i nlga'b}e]l):; 
                                                                                                                                                                                                             ' T o m osrtraotwe'.,s tveapl=u'ec:l o'sbionogk'_;t osmaovrer(o)w;'
                                                                                                                                                                                                               } ,}
                                                                                                                                                                                               
                                                                                                                                                                                                
                                                                                                                                                                                                    f u n{c tliaobne la:n s'wTehriAsc cweeseskoernyd('),  {v
                                                                                                                                                                                                                                                     a l u e :a d'dbMosogk(_'wbeoetk'e,n'dY'e s} 
                                                                                                                                                                                                                                                     —   w e  ]c)a;r
                                                                                                                                                                                                 r y   p isltlaotwes.,s tmeapt t=r e'scsl opsriontge'c;t
                                                                                                                                                                                                 o r s ,  saanvde (b)e;d
                                                                                                                                                                                                 a c}c
                                                                                                                                                                                             e
                                                                                                                                                                   s s ofruinecst.i oTnr eayn scwaenr Dweallikv eyroyu( )t h{r
                                                                                                                                                                                                                             o u g h  bwohta(t" Npoa itrrsu cbke,s tn ow idtehl iwvheircyh efveeer,  mnaot twraeistsi nygo u—  peivcekr.y\ nm\antAtlrle spsa rcto moefs  tchoem psraemses eadp pioni nat mbeonxt..\ nC\onmFei tisn  iann da nkyn occakr  i— te vaelnl  ao uste daatn .o nYcoeu.  rWohleln  iwto riknst?o' )y;o
                                                                                                                                                                                                                               u r   r osoemt,Q uciuctk (i[t{ loapbeenl,: 'aTnodd aiyt' ,evxaplauned:s' biono km_itnoudtaeys'.}\,n{\lnaTbaekle: 'iTto mhoormreo wt'o,nviaglhute.: 'Sbloeoekp_ toonm oirtr otwo'n}i]g)h;t
                                                                                                                                                                                                                             .   I t 'sst atthea.ts teeaps=y'.c\lno\sniWnagn't;  tsoa vceo(m)e; 
                                                                                                                                                                                                                               g r a}b
                                                                                                                                                                    
                                                                                                                                                               o n ef?u"n)c;t
                                                                                                                                                                   i o n   asnestwQeuriBcrko(w[s
                                                                                                                                                                                             i n g ( )   {{
                                                                                                                                                                       l a b eald:d M'sTgo(d'abyo't,' ,v'aTloutea:l l'yb ogoekt_ tiotd a— yn'o  }p,r
                                                                                                                                                                         e s s u r e .{\ nl\anbHeelr:e \''Tso msoormreotwh'i,n gv awlouret:h  'tbhoionkk_itnogm oarbroouwt'  t}h
                                                                                                                                                                                                          o u g h :] )y;o
                                                                                                                                                                                                          u \ ' l ls tsapteen.ds taebpo u=t  '<cbl>o2s5i,n0g0'0; 
                                                                                                                                                                                                            h o u r ss<a/vbe>( )o;n
                                                                                                                                                                                                            y o}u
                                                                                                                                                                   r
                                                                                                                                                                     n efxutn cmtaitotnr easnss.w eMroWsatr rpaenotpyl(e)  w{h
                                                                                                                                                                                                                             o   c o mbeo ti(n" F"ujluls tm atnou flaocotku"r esrp ewnadr r1a0n tmyi n— u1t0e sy,e afrisn do nt hmeo srti gbhetd sb.e\dn,\ naAnndd  luenalviek ew otnhdee rbiingg  cwhhayi nt hsetyo rweasi,t eidf  ssoo mleotnhgi.n\gn \envNeor  hcaormde ss eulpl,.  yNoou  cdoemamli swsiitohn  Tgraemye sd.i rJeucsttl yc.o mNeo tl aay  1o-n8 0a0  fneuwm baenrd.  sNeoet  iaf  taincyktehti nsgy sstpeema.k sA  troe aylo up.e rZseorno  wrhios kk.n oWwhse ny ocua nb yy onua mset.o\pn \bnyT?h'a)t;'
                                                                                                                                                                                                                               s   h o ws eat Qluoiccakl( [b{ulsaibneels:s' Ssuhroeu,l dt owdoaryk'.,\vna\lnuWea:n'tb otook _ctoomdea ys'e}e, {tlhaeb elli:n'eTuhpi?s" )w;e
                                                                                                                                                                       e k e n ds'e,tvQauliucek:('[b
                                                                                                                                                                       o o k _ w e e{k elnadb'e}l,:{ l'aTboedla:y''N,o tv arleuaed:y  'ybeoto'k,_vtaolduaey:'' n}o,t
                                                                                                                                                                   _ y e t ' } ]{) ;l
                                                                                                                                                                     a b e l :s t'aTthei.ss tweepe=k'ecnldo's,i nvga'l;u es:a v'eb(o)o;k
                                                                                                                                                                     _ w e}e
                                                                                                                                                               k
                                                                                                                                                               e n df'u n}c
                                                                                                                                                                 t i o n  ]a)n;s
                                                                                                                                                               w e r N esetdaNteew.(s)t e{p
                                                                                                                                                                                            =   ' caldodsMisngg('';b
                                                                                                                                                                 o t ' , 'sYaovue\(')r;e
                                                                                                                                                                                     i n} 
                                                                                                     t
                                                                                                                                                               h e  fruingchtti opnl aacnes.w eWrhHaotu rssi(z)e  {a
                                                                                                                                                                                                                   r e   y obuo tw(o"r<kbi>nOgp ewni t7h ?d'a)y;s
                                                                                                                                                                                                                       a   w eseekt,Q u1i0cakm(–[7{plma.b<e/lb:>' TSwaimne'-,dvaayl uaep:p'otiwnitnm'e}n,t{sl aabreel :w'eFluclolm'e, v— ajluuset: 'lfeutl lu's} ,k{nloawb eylo:u''Qruee ecno'm,ivnagl.u\en:\'nqWuheaetn 't}i,m{el awboerlk:s' Kbiensgt' ,fvoarl uyeo:u' ktiondga'y} ,o{rl atbheils: 'wNeoetk ?s"u)r;e
                                                                                                                                                                                                                       y e t 's,evtaQluuiec:k'(n[o
                                                                                                                                                                                                                                               t _ s u r e _{s ilzaeb'e}l]:) ;'
                                                                                                                                                                                                                                                             T o d a ys't,a tvea.lsutee:p =''bsoiozki_ntgo'd;a ys'a v}e,(
                                                                                                                                                                                                                                                               ) ; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             } 
                                                                                                                                                                                                                   {
                                                                                                                                                                                                                       l afbuenlc:t i'oTno mhoarnrdolwe'N,o tvYaeltu(e):  {'
                                                                                                                                                                                                                         b o o k _atdodmMosrgr(o'wb'o t}',,
                                                                                                                                                                                                                         ' N o   p r o{b lleamb ealt:  a'lTlh.i sC awne eIk eannds'w,e rv aalnuyet:h i'nbgo oekl_swee e— kpernidc'i n}g
                                                                                                                                                                                                                         ,   b r a]n)d;s
                                                                                                                                                                                                                     ,   f i nsatnactien.gs,t eopr  =h o'wc ltohsei npgr'o;c
                                                                                                                                                                                                                     e s s   wsoarvkes(?)';)
                                                                                                                                                                                                                       ; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          } 
                                                                                                                                                                                                                    
                                                                                                                                                                                                                     s eftuQnucitciko(n[ {alnasbweelr:A'dPdrriecsisn(g)' ,{v
                                                                                                                                                                                                                                          a l u e :b'optr(i"c<eb'>}1,8{0l9a bHewly: '1F5i nSaonuctihn,g 'S,uvmatleure :S'Cf i2n9a1n5c0e<'/}b,>{\lna\bne<la: 'hBrreafn=d'sh't,tvpasl:u/e/:w'wbwr.agnodosg'l}e,.{cloamb/emla:p'sA/dsjeuasrtcahb/l?ea pbia=s1e&sq'u,evrayl=u1e8:0'9a+dHjwuys+t1a5b+lSeo'u}t]h)+;S
                                                                                                                                                                                                                                          u m t}e
                                                                                                                                                                                                                                      r
                                                                                                                                                                                                                                      + S C/+/2 9─1─ 5B0o'o ktianrgg eftl=o'w_ b─l──a──n──k──'──>──📍─ ──G──e──t── ──d──i──r──e──c──t──i──o──n──s──<──/──a──>──\──n──\──n─
                                                                                                                                                                                                                                      O p efnu n7c tdiaoyns ,f l1o0waBmo–7opkmi.n gE(a)s y{ 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        p a r k iinfg ,( !nsot aatpep.onianmtem)e n tr ewtauirtn. \ans\knNWahmeen( )s;h
                                                                                                                                                                                                                       o u l d  iIf  t(e!lslt aTtree.yp htoon ee)x preecttu ryno ua?s"k)P;h
                                                                                                                                                                                                                         o n e ( )s;e
                                                                                                                                                                                                                       t Q u i cikf( [(
                                                                                                                                                                                                                         ! s t a t e .{w hleanb)e l :r e'tTuordna ya's,k Wvhaelnu(e):; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ' b o o kr_ettoudrany 'c o}n,f
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        i r m B o o k{i nlga(b)e;l
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      :   '}T
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        o
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      m o rfruonwc't,i ovna lausek:N a'mbeo(o)k _{t
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  o m o r raodwd'M s}g,(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ' b o t ' , '{P elrafbeeclt:.  'QTuhiicsk  w— ewehkaetn\d''s,  yvoaulru ef:i r'sbto onka_mwee?e'k)e;n
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  d '   } 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    s t a t e].)s;t
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  e p = ' csotlalteec.ts_tneapm e=' ;' cslaovsei(n)g;'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        } 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          s afvuen(c)t;i
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      o n  }a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        s
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        k P hfounnec(t)i o{n
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             a n s waedrdBMrsagn(d'sb(o)t '{,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ' T h a nbkost ('" W+e  (csatrartye .tnhaem er|e|a'l' )n a+m e's!  — W<hba>tS\e'rst at,h eS ebaelsyt,  cSeilmlm onnusm,b eSro uttoh etrelxatn dy,o uM aal ocuofn,f iarnmda tAilolns?w'e)l;l
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             . < / b >s\tna\tneE.xsatcetp =s'acmoel lbeecdts_ pyhooun'ed' ;p asya vfeu(l)l; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               p r i}c
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           e
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             f ofru nactt iao nc haasiknW hsetno(r)e .{ 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               W e   m oavded Mvsogl(u'mbeo ta'n,d' Ablumyo sstm atrhte,r es o—  wyhoaut  gteitm e5 0w–8o0r%k so?f fW er\e'traei lo.p\enn\ n1N0oa mk–7npomc.k'o)f;f
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               s .   N os eotfQfu-ibcrka(n[d{sl.a bJeuls:t' Wniatmhei-nb r1a nhdo umra't,tvraelsusee:s' iant  1p rhiocuers' }t,h{alta bmealk:e' TMhaitst raefstse rFnioromn 'l,ovoakl ueem:b'atrhriass saifntge.r\nno\onnW'a}n,t{ ltaob eclo:m'eT hfiese le vtehnei ndgi'f,fvearleunec:e'?t"h)i;s
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 e v e nsientgQ'u}i,c{kl(a[b
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 e l : ' T o m{o rlraobwe'l,:v a'lTuoed:a'yt'o,m ovrarlouwe':} ,'{bloaobke_lt:o'dTahyi's  }w,e
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 e k e n d ' ,{v allaubee:l':t h'iTsh iwse ewkeeenkde'n}d]'),; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          v a l u es:t a'tbeo.oskt_ewpe=e'kceonldl'e c}t
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          _ w h e n]');; 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          s a v e (s)t;a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        t e .}s
                                                                                                                                                                                                                   t
                                                                                                                                                                                                                   e p  f=u n'cctlioosni ncgo'n;f
                                                                                                                                                                                                                   i r m B osoakvien(g)(;)
                                                                                                                                                                                                                     { 
                                                                                                                                                                                                                   } 
                                                                                                                                                                
                                                                                                                                                                   lfeutn cstuimomna rayn s=w e'r•V sNOanmlei:n e<(b)> '{+
                                                                                                                                                                     s t a t eb.onta(m"eG+r'e<a/tb >q\une• sPthioonne :—  a<nbd> 'h+osnteastte .apnhsowneer+:' <s/obm>e\ no• nWlhienne:  m<abt>t'r+esstsaetse .awrhee nf+i'n<e/.b >B'u;t
                                                                                                                                                                       h e r ei'fs  (wshtaatt et.hseiyz ec)a ns'utm mtaerlyl  +y=o u'.\\nn•\ nSYiozue :c a<nb'>t' +kcnaopw( sitfa tae .msaitzter)e+s's< /ibs> 'r;i
                                                                                                                                                                                                                         g h t   fiofr  (ysotuart eb.opdayi nf)r osmu mam apriyc t+u=r e',\ na•  Froecvuise:w ,< bo>r' +as tfaotaem. psaaimnp+l'e<./ bT>h'e; 
                                                                                                                                                                                                                   p e o p laed dwMrsigt(i'nbgo tt'h,o'sHee rree\v'ise wwsh adto nI'\t' vhea vgeo ty:o\unr\ nb'a+csku,m myaoruyr+ 'w\eni\gnhLto,o ky oruirg hstl?e'e)p; 
                                                                                                                                                                                                                     p o s i tsieotnQ,u iocrk (y[o{ulra bpeali:n'.Y\ens\,n Pbeooopkl ei ts!p'e,nvda l$u8e0:0'–$c1o,n2f0i0r mo_ny eas 'm}a,t{tlraebsesl :o'nFliixn es oamnedt hsilnege'p, voanl uiet: 'fcoorn f3i rwme_efkisx 'b}e]f)o;r
                                                                                                                                                                                                                         e   r e asltiaztien.gs tietp'=s' cwornofnigr.m iTnhge'n;  tshaevye'(r)e; 
                                                                                                                                                                                                                   s t u}c
                                                                                                                                                                                                                   k
                                                                                                                                                                                                                     w iatshy nac  rfeutnucrtni ohna ssselned Booro ksilnege(p)i n{g
                                                                                                                                                                                                                                                                                     o n   aa dmdiMsstga(k'eb ofto'r, 'yLeoacrksi.n\gn \intO uirn …'m)o;d
                                                                                                                                                                                                                                                                                   e l   i st rdyi f{f
                                                                                                                                                                                                                                                                                                     e r e n t :  acwoamiet  lfaeyt cohn( 'i/ta,p if/ebeolo ki't,,  {k
                                                                                                                                                                                                                                                                                                                                                                     n o w   i t ' s  mreitghhotd :— 'tPhOeSnT 't,a
                                                                                                                                                                                                                                                                                                       k e   i t   h o mhee atdheer ss:a{m'eC odnatye nfto-rT ylpees's: 'tahpapnl iycoaut'ido np/ajys oonn'l}i,n
                                                                                                                                                                                                                                                                                                       e . \ n \ n T h abto'dsy :nJoStO Na. sstarliensg ipfiyt(c{h .n aTmhea:ts'tsa tjeu.snta mae ,s mpahrotneer: swtaayt et.op hbounye ,a  wmhaetnt:rsetsast.e\.nw\hneWna,n ts itzoe :csotmaet es.esei zfeo|r| 'y?o'u,r spealifn?:"s)t;a
                                                                                                                                                                                                                                                                                                       t e . p asient|Q|u'i?c'k,( [s
                                                                                                                                                                                                                                                                                                                                   o u r c e : '{w elbasbietle:- c'hYaets',,  btoiomke sitta'm,p :vnaelwu eD:a t'eb(o)o.kt_otIoSdOaSyt'r i}n,g
                                                                                                                                                                                                                                                                                                     ( )   } ) 
                                                                                                                                                                                                                     {   l a b e}l):; 
                                                                                                                                                                                                                   ' T h i s}  wceaetkcehn(de'),{ }v
                                                                                                                                                                                                                                                                                   a l u e :a d'dbMosogk(_'wbeoetk'e,n'd&'# 9}9
                                                                                                                                                                                                                                                                                     8 9 ;   <]b)>;Y
                                                                                                                                                                                                                                                                                   o u \ ' rset aotne .tshtee pc a=l e'ncdlaors!i<n/gb'>; 
                                                                                                                                                                                                                                                                                     T r e y  shaavse (b)e;e
                                                                                                                                                                                                                                                                                   n   n}o
                                                                                                                                                                                                                   t
                                                                                                                                                                                                                   i f ifeudn catnido nw ialnls wcearlKli dtso( )c o{n
                                                                                                                                                                                                                                                                     f i r m  byootu(r" Atbismoel.u\tne\lnyY o—u \w'el lh aavles oT wgients  af rtoemx t< bc>o$n1f3i0r<m/abt>i otnh aatt  a'r+es tpaetref.epchto nfeo+r' .k\ind\sn'< br>o📍o m1s8 0a9n dH wbyu n1k5  sSe,t uSpusm.t\enr\ nSNCa m2e9-1b5r0a<n/db,> \dnu\rnaRbelmee,m baenrd  tpor ibcreidn gs:o\ ni• tP haocttou aIlDl\yn •m aBkaensk  siennfsoe .i fM oisntt epraersetnetds  ignr afbi noannec ianngd\ na• rAen ysohnoec kselde etphienyg  doind nt'hte  cboemde\ ns\onoSneeer .y\onu\ nsWoaonnt!  t—o  McBoAm eS upmitcekr 'o)n;e
                                                                                                                                                                                                                                                                       o u t ?s"t)a;t
                                                                                                                                                                                                                                                                       e . s t espe=t'Qbuoiockke(d['
                                                                                                                                                                                                                                                                     ;   s a v e ({) ;l
                                                                                                                                                                                                                                                                     a b e}l
                                                                                                                                                                                                                   :
                                                                                                                                                                                                                     ' T/o/d a──y 'I,n ivta l──u──e──:── ──'──b──o──o──k──_──t──o──d──a──y──'── ──}──,──
                                                                                                                                                               ── ── ── ── ── ── ──{── ──l──a──b──e──l─
                                                                                                                                                                                    :   'fTuonmcotriroonw 'm,a yvbaelAuuet:o O'pbeono(k)_ t{o
                                                                                                                                                                 m o r r otwr'y  }{
                                                                                                                                                                 
                                                                                                                                                                       ] ) ;i
                                                                                                                                                                                    f   ( S Ss.tgaetteI.tsetme(pS S=_ A'UcTlOo)s)i nrge't;u
                                                                                                                                                                                    r n ; 
                                                                                                                                                                 s a v e ( )/;/
                                                                                                                                                                 D e}l
                                                                                                                                                               a
                                                                                                                                                               y :  f5usn cdteisoknt oapn,s w7esr Cmooubpillee( )( l{e
                                                                                                                                                                                                                     s s   i nbtortu(s"iIvmep)o
                                                                                                                                                                                                                       r t a n t   pcooinnstt  — iasnMdo bIi'lme  g=l awdi nydoouw .miennnteiroWnieddt hi t<. \7n6\8n;I
                                                                                                                                                                                                                       f   y o u   ssheatrTei mtehoeu tb(efdu,n cwthiooenv(e)r{ 
                                                                                                                                                                                                                     e l s e   w i l li fb e( !swliedegpeitn g| |o nw iidtg ente.ecdlsa stsoL icsotm.ec ownittahi nyso(u'.o pFeinr'm)n)e srse tpurrenf;e
                                                                                                                                                                                                                       r e n c e ,   s lSeSe.ps eptoIstietmi(oSnS,_ AbUoTdOy, 't1y'p)e; 
                                                                                                                                                                                                                     —   a l l   o f  oipte nmCahtatte(r)s;,
                                                                                                                                                                                                                       a n d   t w}o,  piesoMpolbei llea y?i n7g0 0o0n  :i t5 0t0o0g)e;t
                                                                                                                                                                                                                     h e r   i}s  ctahtec ho(nel)y{ }r
                                                                                                                                                               e a l} 
                                                                                        w
                                                                                                     a y  ftuon cktnioown  iitn'ist (r)i g{h
                                                                                                       t   f o ri fb o(t!hb ionfd Dyoomu(.)\)n \rneIttu rpnr;e
                                                                                                     v e n t sm atyhbee AnueteodO pfeonr( )t;w
                                                                                                     o   t r iipfs  (alnoda dm(a)k e&s&  ssutraet ey.omue sbsoatghe sl.olveen gitth.)\ n{\
                                                                                                     n C a n   y osut abtoet.hm ecsosmaeg eisn. faotr Etahceh (sfaumnec ttiiomne(?m")){;
                                                                                                                                                                                       
                                                                                                                s e t Qcuoincskt( [r
                                                                                                                                   o w = d o c u{m elnatb.eclr:e a'tYeeEsl,e mween tc(a'nd icvo'm)e;  troodwa.yc'l,a svsaNlaumee:= ''cbhoaotk-_mtsogd acyh'a t}-,m
                                                                                                                  s g - ' + m .{r ollaeb;e
                                                                                                                  l :   ' T h i s  cwoeneskte nbdu bw=odrokcsu mbeenttt.ecrr'e,a tveaEllueem:e n'tb(o'odki_vw'e)e;k ebnudb'. c}l
                                                                                                                                                                                       a s s N a]m)e;=
                                                                                                       ' c h a ts-tbautbeb.lset'e;p
                                                                                                                                                                                         =   ' c l o s ibnugb'.;i
                                                                                                                                                                                       n n e r HsTaMvLe=(m).;t
                                                                                                                                                                                       e x t}.
                                                                                                     r
                                                                                                       e p lfaucnec(t/i\onn/ ga,n's<wberr>F'i)r;m
                                                                                                       n e s s ( )   { 
                                                                                                       r o w . abpopte(n"dFCihrimlnde(sbsu bi)s;  omnseg so.fa ptpheen dmCohsitl dp(erroswo)n;a
                                                                                                         l   t h i n g}s) ;a
                                                                                                       b o u t   a  mmsagtst.rsecsrso l— laTnodp =imts'gss .aslcsroo lolnHee iogfh tt;h
                                                                                                         e   m o s}t
                                                                                                       m i}s
                                                                                        u
                                                                                        n d eirfs t(odoodc.u\mne\nntP.eroepaldey Stthaitnek= =t=h'elyo akdnionwg 'w)h adto ctuhmeeyn tl.iakded EuvnetnitlL itshteeyn elra(y' DoOnM CsoonmteetnhtiLnoga ddeidf'f,eirneintt) ;a
                                                                                          n d  erlesael iiznei tt(h)e;y
                                                                                        '}v)e( )b;een wrong for years.\n\nFirm vs. plush, coil vs. foam, hybrid vs. all-foam — the right answer depends entirely on your body, your sleep position, and whether you share the bed.\n\nThere's no way to get that right from a description. But 10 minutes of la— and I'm not here to pressure you.\n\nBut let me ask you something: how long have you been thinking about getting a new mattress?\n\nMost people I tal
