// Mattress by Appointment Sumter — Elite Sleep Specialist v5
// Two-track: Budget (finance-led) + Quality (adjustable/premium)
// Hormozi offer-stack + Cardone conviction close
(function () {
  let state = { step:'greet', track:null, name:null, phone:null, size:null, pain:null, when:null, messages:[] };
  const SS = sessionStorage;
  const SS_KEY = 'mba_v5';
  const SS_AUTO = 'mba_v5_auto';
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
    if (!document.getElementById('chatReset')) {
      const rb = document.createElement('button');
      rb.id = 'chatReset'; rb.title = 'Start over'; rb.setAttribute('aria-label','Start over');
      rb.innerHTML = '&#8635;';
      rb.style.cssText = 'background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;margin-right:8px;opacity:.7';
      rb.addEventListener('click', function(){ if(confirm('Start a new conversation?')) resetAll(); });
      closeBtn.parentNode.insertBefore(rb, closeBtn);
    }
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

  function greet() {
    const h = new Date().getHours();
    const g = h<12 ? 'Good morning' : h<17 ? 'Good afternoon' : 'Good evening';
    addMsg('bot', g + "! I'm your Sleep Specialist at <b>Mattress by Appointment Sumter</b>.\n\nWhat brings you in today?");
    setQuick([
      {label:'I need a new mattress', value:'need_new'},
      {label:'Checking prices',       value:'price'},
      {label:'Back or sleep pain',    value:'pain'},
      {label:'Adjustable base',       value:'adjustable'},
      {label:'Just browsing',         value:'browsing'}
    ]);
    state.step = 'discovery';
    save();
  }

  function route(v) {
    if (v==='call') return addMsg('bot','<a href="tel:8037951194"><b>Tap to call 803-795-1194</b></a> — Trey picks up 7 days a week, 10am-7pm.');
    if (v==='confirm_yes') return sendBooking();
    if (v==='confirm_fix') { state.name=null; state.phone=null; state.when=null; save(); return askName(); }
    if (v==='not_yet') return handleNotYet();
    if (v.startsWith('book_')) {
      const map = {book_today:'today',book_tomorrow:'tomorrow',book_weekend:'this weekend',book_now:'right now'};
      state.when = map[v] || v.replace('book_','');
      save();
      return flowBooking();
    }
    if (/book|appoint|schedul|come in|stop by|visit|walk.?in/.test(v)) return flowBooking();
    if (/price|cost|how much|cheap|afford|deal/.test(v)||v==='price') return answerPrice();
    if (/queen/.test(v)) return answerSize('queen');
    if (/king/.test(v)) return answerSize('king');
    if (/full|double/.test(v)) return answerSize('full');
    if (/twin/.test(v)) return answerSize('twin');
    if (/adjust|base|remote|elevation|head|foot|zero.?grav/.test(v)||v==='adjustable') return answerAdjustable();
    if (/back|pain|hurt|sore|hip|shoulder|neck|spine/.test(v)||v==='pain') return answerPain();
    if (/hot|sweat|cool|temp/.test(v)) return answerHot();
    if (/finance|credit|snap|payment|monthly|qualify|bad.?credit|no.?credit/.test(v)) return answerFinance();
    if (/brand|serta|sealy|simmons|malouf|allswell|southerland/.test(v)) return answerBrands();
    if (/deliver|pickup|take.?home|car|fit|box/.test(v)) return answerDelivery();
    if (/warrant|return|exchange|guarantee/.test(v)) return answerWarranty();
    if (/hour|open|close|today|tonight|weekend|sunday|monday|saturday/.test(v)) return answerHours();
    if (/address|where|location|direction|map/.test(v)) return answerAddress();
    if (/pillow|sheet|accessory|protector/.test(v)) return answerAccessory();
    if (/firm|soft|medium|plush/.test(v)) return answerFirmness();
    if (/couple|partner|two.?people|husband|wife|spouse/.test(v)) return answerCouple();
    if (/child|kid|bunk|teen/.test(v)) return answerKid();
    if (/compare|mattress.?firm|ashley|amazon|online|wayfair/.test(v)) return answerCompare();
    if (/same.?day|take.?tonight|take.?home.?tonight/.test(v)) return answerSameDay();
    if (/browsing|looking|just.?look/.test(v)||v==='browsing') return answerBrowsing();
    if (/need_new|need|new mattress|replac|upgrad/.test(v)) return answerNeedNew();
    if (state.step==='collect_name') { state.name=titleCase(v); save(); return askPhone(); }
    if (state.step==='collect_phone') {
      const p=normPhone(v);
      if(!p){ addMsg('bot','Could you send that number again? 10 digits like 803-555-0123.'); return; }
      state.phone=p; save(); return askWhen();
    }
    if (state.step==='collect_when') { state.when=v; save(); return confirmBooking(); }
    addMsg('bot','Great question — and honestly the truest answer is: <b>a mattress is something your body has to tell you about.</b> No picture or review can tell you what 10 minutes in our showroom will.\n\nWhen can you come in?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'},{label:'Call us',value:'call'}]);
  }

  function answerPrice() {
    state.track = 'budget';
    addMsg('bot','Straight talk:\n\n- Twin from <b>$130</b> (retail $449)\n- Full from <b>$140</b> (retail $599)\n- Queen from <b>$150</b> (retail $699)\n- King from <b>$275</b> (retail $1,199)\n\nAll name-brand. All 50-80% off retail. And if budget is tight — <b>$5 gets you out the door today</b> with Snap Finance, 90-day payoff option.\n\nWhen can you come lay on a few?');
    setQuick([{label:'Today',value:'book_today'},{label:'This weekend',value:'book_weekend'},{label:'Tell me about financing',value:'finance'}]);
    state.step='closing'; save();
  }
  function answerSize(size) {
    const p = {twin:{o:130,r:449},full:{o:140,r:599},queen:{o:150,r:699},king:{o:275,r:1199}}[size];
    addMsg('bot',cap(size)+'s start at <b>$'+p.o+'</b>. That same bed retails for $'+p.r+' at the chains.\n\nYou will sleep on this mattress roughly 3,000 nights. Spending 10 minutes laying on a few beds to find the right one is the smartest decision you can make. Your body will know immediately.\n\nWhat time works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.size=size; state.step='closing'; save();
  }
  function answerAdjustable() {
    state.track = 'quality';
    addMsg('bot','<b>Adjustable bases are a game-changer</b> — especially for back pain, snoring, acid reflux, or couples with different comfort needs.\n\nWe carry premium adjustable systems with wireless remote, head and foot elevation, zero-gravity position, and under-bed lighting. Queen adjustable systems starting around <b>$999</b>, King from <b>$1,299</b> — well below what you would pay at a chain.\n\nThis is something you need to try in person. One minute in the bed and you will wonder how you slept flat your whole life. When can you come in?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.size='queen'; state.step='closing'; save();
  }
  function answerPain() {
    addMsg('bot','Back and hip pain from a bad mattress is one of the most common — and most fixable — problems people put up with for years.\n\nThe right mattress for back pain depends entirely on your body type, sleep position, and what is actually causing the pain. A mattress that fixes one person can destroy another.\n\nThat is exactly why we do appointments. Trey will walk you through 3-4 options and you will know which one is right within 2 beds. Most people leave same day.\n\nReady to fix this? What time works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.pain='back/hip pain'; state.step='closing'; save();
  }
  function answerHot() {
    addMsg('bot','Sleeping hot is usually a mattress problem — dense foam traps body heat with no airflow.\n\nWe carry cooling-gel and hybrid beds designed to sleep significantly cooler. The difference is real and you feel it immediately.\n\nCome try one. 10 minutes vs. years of waking up sweating. Easy decision. When works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.pain='sleeps hot'; state.step='closing'; save();
  }
  function answerFinance() {
    state.track='budget';
    addMsg('bot','No credit? Bad credit? Does not matter here.\n\n<b>Snap Finance</b> — no credit needed, up to $4,000, 90-day same-as-cash option. Pre-qualify in about 2 minutes in-store.\n\n<b>$5 down</b> gets you sleeping on a name-brand mattress tonight. You have been putting this off long enough.\n\nWant to come in and pre-qualify while you test beds?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'What are the prices?',value:'price'}]);
    state.step='closing'; save();
  }
  function answerBrands() {
    addMsg('bot','We carry <b>Serta, Sealy, Simmons, Southerland, Malouf,</b> and <b>Allswell</b> — the same name brands at Mattress Firm or Ashley, at 50-80% below their price.\n\nSmall independent operation, low overhead. That savings goes directly to you.\n\nWant to come see the lineup?');
    setQuick([{label:'Today',value:'book_today'},{label:'This weekend',value:'book_weekend'},{label:'What are the prices?',value:'price'}]);
    state.step='closing'; save();
  }
  function answerDelivery() {
    addMsg('bot','Every mattress comes rolled in a box — fits in any car, even a sedan.\n\n<b>Take it home tonight.</b> Open the box, let it expand, done. No delivery truck, no scheduling windows.\n\nThat is one more reason to come in today. When works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'}]);
    state.step='closing'; save();
  }
  function answerWarranty() {
    addMsg('bot','Full manufacturer warranty — 10 years on most beds. And you deal with Trey directly, not a 1-800 number.\n\nThat is the advantage of a local shop. Come see the difference. When can you stop by?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'}]);
    state.step='closing'; save();
  }
  function answerHours() {
    addMsg('bot','Open <b>7 days a week, 10am-7pm</b>. Same-day appointments welcome — you come in, you get Trey full attention.\n\nWhat time works for you?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.step='closing'; save();
  }
  function answerAddress() {
    addMsg('bot','<b>1809 Hwy 15 South, Sumter SC 29150</b>\n<a href="https://www.google.com/maps/search/?api=1&query=1809+Hwy+15+South+Sumter+SC+29150" target="_blank">Get directions</a>\n\nEasy to find, free parking right in front. When should I tell Trey to expect you?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'}]);
    state.step='closing'; save();
  }
  function answerFirmness() {
    addMsg('bot','Firmness is one of the most personal things about a mattress — and most misunderstood.\n\nToo firm creates pressure points at hips and shoulders. Too soft, your spine sags. The sweet spot depends entirely on your body weight and sleep position.\n\n<b>This is impossible to figure out from a website.</b> 5 minutes laying on beds and you will know exactly. When works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'},{label:'This weekend',value:'book_weekend'}]);
    state.step='closing'; save();
  }
  function answerCouple() {
    addMsg('bot','Important point — if two people are sleeping in the bed, they both need to try it.\n\nDifferent body types, sleep positions, pain points. A perfect mattress for one partner can be wrong for the other.\n\n<b>Bring whoever will be sleeping on it.</b> We will find what works for both of you. When can you both come in?');
    setQuick([{label:'Today',value:'book_today'},{label:'This weekend',value:'book_weekend'}]);
    state.step='closing'; save();
  }
  function answerKid() {
    addMsg('bot','Kids go through mattresses fast. Good news: twins and fulls are our most affordable options.\n\nTwin from <b>$130</b>, Full from <b>$140</b>. Take it home in a box today.\n\nWhen can you come in?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'}]);
    state.step='closing'; save();
  }
  function answerCompare() {
    addMsg('bot','You should compare — here is the honest difference: big chains have $800 in marketing and rent baked into every price. We do not. Same Serta, same Sealy — our Queen starts at <b>$150</b> vs $699+ at the chains.\n\nAnd online? You are guessing. No return policy gives you back months of bad sleep.\n\nThe smartest move is to come lay on it first. 10 minutes tells you more than 10 hours of reviews. When can you come in?');
    setQuick([{label:'Today',value:'book_today'},{label:'This weekend',value:'book_weekend'},{label:'What are the prices?',value:'price'}]);
    state.step='closing'; save();
  }
  function answerSameDay() {
    addMsg('bot','Yes — <b>same day, take it home tonight.</b> Every mattress comes in a box, fits in any car. You can be sleeping on a brand new name-brand mattress tonight.\n\nCome in, lay on a few, pick the right one. What time works?');
    setQuick([{label:'Within 1 hour',value:'in 1 hour'},{label:'This afternoon',value:'this afternoon'},{label:'This evening',value:'this evening'}]);
    state.step='closing'; save();
  }
  function answerAccessory() {
    addMsg('bot','Yes — we carry pillows, mattress protectors, and bed accessories. Trey can walk you through what pairs best with whichever mattress you pick.\n\nAll part of the same appointment. When works?');
    setQuick([{label:'Today',value:'book_today'},{label:'Tomorrow',value:'book_tomorrow'}]);
    state.step='closing'; save();
  }
  function answerBrowsing() {
    addMsg('bot','Totally get it — no pressure.\n\nHere is something worth thinking about: you will spend about <b>25,000 hours</b> on your next mattress. Most people who come in just to look spend 10 minutes, find the right bed, and leave wondering why they waited so long.\n\nNo hard sell. No commission games. Just come lay on a few. Zero risk. When can you stop by?');
    setQuick([{label:'Sure, today',value:'book_today'},{label:'This weekend',value:'book_weekend'},{label:'Not ready yet',value:'not_yet'}]);
    state.step='closing'; save();
  }
  function answerNeedNew() {
    addMsg('bot','You are in the right place. What size are you working with?');
    setQuick([{label:'Twin',value:'twin'},{label:'Full',value:'full'},{label:'Queen',value:'queen'},{label:'King',value:'king'}]);
    state.step='sizing'; save();
  }
  function handleNotYet() {
    addMsg('bot','No problem at all. Can I answer anything else — pricing, brands, financing, or how the process works?');
    setQuick([{label:'Pricing',value:'price'},{label:'Financing',value:'finance'},{label:'Brands',value:'brands'},{label:'Adjustable bases',value:'adjustable'}]);
  }

  function flowBooking() {
    if (!state.name) return askName();
    if (!state.phone) return askPhone();
    if (!state.when) return askWhen();
    return confirmBooking();
  }
  function askName() {
    addMsg('bot','Perfect. Quick — what is your first name?');
    state.step='collect_name'; save();
  }
  function askPhone() {
    addMsg('bot','Thanks ' + (state.name||'') + '! What is the best cell number to text you a confirmation?');
    state.step='collect_phone'; save();
  }
  function askWhen() {
    addMsg('bot','Almost there — what time works? We are open 10am-7pm.');
    setQuick([{label:'Within 1 hour',value:'in 1 hour'},{label:'This afternoon',value:'this afternoon'},{label:'This evening',value:'this evening'},{label:'Tomorrow',value:'tomorrow'},{label:'This weekend',value:'this weekend'}]);
    state.step='collect_when'; save();
  }
  function confirmBooking() {
    let s = '- Name: <b>'+state.name+'</b>\n- Phone: <b>'+state.phone+'</b>\n- When: <b>'+state.when+'</b>';
    if (state.size) s += '\n- Size: <b>'+cap(state.size)+'</b>';
    if (state.pain) s += '\n- Focus: <b>'+state.pain+'</b>';
    addMsg('bot','Here is what I have got:\n\n'+s+'\n\nLook right?');
    setQuick([{label:'Yes, book it!',value:'confirm_yes'},{label:'Fix something',value:'confirm_fix'}]);
    state.step='confirming'; save();
  }
  async function sendBooking() {
    addMsg('bot','Locking it in...');
    try {
      await fetch('/api/book', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name:state.name, phone:state.phone, when:state.when, size:state.size||'?', pain:state.pain||'?', source:'website-chat', timestamp:new Date().toISOString() })
      });
    } catch(e){}
    addMsg('bot','<b>You are on the calendar!</b> Trey has been notified and will call to confirm your time.\n\nYou will also get a text confirmation at '+state.phone+'.\n\n<b>1809 Hwy 15 S, Sumter SC 29150</b>\n\nRemember to bring:\n- Photo ID\n- Bank info if interested in financing\n- Anyone sleeping on the bed\n\nSee you soon! — MBA Sumter');
    state.step='booked'; save();
  }

  function maybeAutoOpen() {
    try {
      if (SS.getItem(SS_AUTO)) return;
      const isMobile = window.innerWidth < 768;
      setTimeout(function(){
        if (!widget || widget.classList.contains('open')) return;
        SS.setItem(SS_AUTO,'1');
        openChat();
      }, isMobile ? 7000 : 5000);
    } catch(e){}
  }

  function init() {
    if (!bindDom()) return;
    maybeAutoOpen();
    if (load() && state.messages.length) {
      state.messages.forEach(function(m){
        const row=document.createElement('div'); row.className='chat-msg chat-msg-'+m.role;
        const bub=document.createElement('div'); bub.className='chat-bubble';
        bub.innerHTML=m.text.replace(/\n/g,'<br>');
        row.appendChild(bub); msgs.appendChild(row);
      });
      msgs.scrollTop=msgs.scrollHeight;
    }
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
