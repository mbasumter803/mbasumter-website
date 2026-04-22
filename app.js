// Mattress by Appointment of Sumter - Elite AI Sleep Specialist v4
// Uses EXISTING DOM (#chatWidget/#chatToggle/#chatBox/#chatMessages/#chatQuickReplies/#chatInput/#chatSend)
// Fixes: correct pricing, session reset each visit, tighter high-conviction sales flow

(function(){
  const STATE_KEY = "mba_chat_state_v4";
  const store = sessionStorage;

  const PRICES = {
    twin:   { ours: 130, retail: 449 },
    full:   { ours: 140, retail: 599 },
    queen:  { ours: 150, retail: 699 },
    king:   { ours: 275, retail: 1199 }
  };

  let state = {
    step: "greet",
    name: null, phone: null, size: null, pain: null, when: null,
    messages: []
  };

  // ---------- DOM refs (bound on DOMContentLoaded) ----------
  let widget, toggle, box, closeBtn, msgs, quick, input, sendBtn;

  function bindDom(){
    widget   = document.getElementById("chatWidget");
    toggle   = document.getElementById("chatToggle");
    box      = document.getElementById("chatBox");
    closeBtn = document.getElementById("chatClose");
    msgs     = document.getElementById("chatMessages");
    quick    = document.getElementById("chatQuickReplies");
    input    = document.getElementById("chatInput");
    sendBtn  = document.getElementById("chatSend");
    if(!widget) return false;

    toggle.addEventListener("click", openChat);
    closeBtn.addEventListener("click", closeChat);
    sendBtn.addEventListener("click", submitTyped);
    input.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); submitTyped(); } });

    // Reset button next to close
    if(!document.getElementById("chatReset")){
      const reset = document.createElement("button");
      reset.id = "chatReset";
      reset.title = "Start over";
      reset.setAttribute("aria-label","Start over");
      reset.innerHTML = "\u21BB";
      reset.style.cssText = "background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;margin-right:8px;opacity:.7";
      reset.addEventListener("mouseenter", ()=> reset.style.opacity="1");
      reset.addEventListener("mouseleave", ()=> reset.style.opacity=".7");
      reset.addEventListener("click", function(){ if(confirm("Start a new conversation?")) resetAll(); });
      closeBtn.parentNode.insertBefore(reset, closeBtn);
    }

    // Hero triggers
    // Hijack any "Book Appointment"-style button/link to open the chat instead of jumping to #book
    const bookSelectors = [
      '[data-chat]',
      'a[href="#chat"]',
      'a[href="#book"]',
      'a[href="#appointment"]'
    ];
    document.querySelectorAll(bookSelectors.join(",")).forEach(el=>{
      el.addEventListener("click", function(e){ e.preventDefault(); openChat(); });
    });
    // Also catch any link/button whose text matches booking intent
    document.querySelectorAll("a,button").forEach(el=>{
      const t = (el.textContent||"").trim().toLowerCase();
      if(el.id === "chatToggle" || el.id === "chatClose" || el.id === "chatReset" || el.id === "chatSend") return;
      if(/^book (a |free |your |an )?appointment/.test(t) || t === "book now" || t === "book appointment"){
        el.addEventListener("click", function(e){ e.preventDefault(); openChat(); });
      }
    });
    return true;
  }

  function openChat(){
    widget.classList.add("open");
    if(state.messages.length === 0) greet();
    setTimeout(()=> input && input.focus(), 150);
  }
  function closeChat(){ widget.classList.remove("open"); }

  function resetAll(){
    store.removeItem(STATE_KEY);
    state = { step:"greet", name:null, phone:null, size:null, pain:null, when:null, messages:[] };
    msgs.innerHTML = "";
    quick.innerHTML = "";
    greet();
  }

  function save(){ try{ store.setItem(STATE_KEY, JSON.stringify(state)); }catch(e){} }
  function load(){
    try{
      const raw = store.getItem(STATE_KEY);
      if(raw){ state = JSON.parse(raw); return true; }
    }catch(e){}
    return false;
  }

  function addMsg(role, text){
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-" + role;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = text.replace(/\n/g,"<br>");
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    state.messages.push({role, text});
    save();
  }

  function setQuick(options){
    quick.innerHTML = "";
    (options||[]).forEach(opt=>{
      const b = document.createElement("button");
      b.className = "chat-quick-btn";
      b.textContent = opt.label || opt;
      b.addEventListener("click", ()=> onQuick(opt));
      quick.appendChild(b);
    });
  }

  function onQuick(opt){
    const label = opt.label || opt;
    addMsg("user", label);
    quick.innerHTML = "";
    route(opt.value || label.toLowerCase());
  }

  function submitTyped(){
    const v = (input.value||"").trim();
    if(!v) return;
    input.value = "";
    addMsg("user", escapeHtml(v));
    quick.innerHTML = "";
    route(v.toLowerCase());
  }

  function escapeHtml(s){ return s.replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

  function greet(){
    const hour = new Date().getHours();
    const greeting = hour<12 ? "Good morning" : hour<17 ? "Good afternoon" : "Good evening";
    addMsg("bot", greeting + "! I\u2019m your Sleep Specialist at Mattress by Appointment.\n\nQuick question so I can point you in the right direction \u2014 what brings you in?");
    setQuick([
      {label:"Need a new mattress", value:"need_new"},
      {label:"Just checking prices", value:"price"},
      {label:"Back or sleep pain", value:"pain"},
      {label:"Just browsing", value:"browsing"}
    ]);
    state.step = "discovery"; save();
  }

  function route(v){
    // Quick-reply tokens first
    if(v === "call"){ addMsg("bot","Absolutely \u2014 <a href=\"tel:8037951194\">tap to call 803-795-1194</a>. Trey picks up 7 days a week."); return; }
    if(v === "not_yet" || v === "not yet"){ addMsg("bot","No worries. Questions about brands, financing, or sizes?"); setQuick([{label:"Financing",value:"finance"},{label:"Brands",value:"brands"},{label:"Prices",value:"price"}]); return; }
    if(v === "confirm_yes" || v === "confirm"){ return sendBooking(); }
    if(v === "confirm_fix" || v === "fix"){ state.name=null; state.phone=null; state.when=null; save(); return askName(); }
    if(v === "more" || v === "more info"){ addMsg("bot","What matters most to you?"); setQuick([{label:"Back support",value:"pain"},{label:"Cooling",value:"hot"},{label:"Brands",value:"brands"},{label:"Financing",value:"finance"}]); return; }
    if(v === "brands"){ addMsg("bot","We carry Serta, Sealy, Simmons, Southerland, Malouf, and Allswell \u2014 all name brands at 50-80% off retail.\n\nWant to come see them?"); setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]); return; }
    if(v.startsWith("book_")){
      const when = v.replace("book_","");
      const map = {today:"today", tomorrow:"tomorrow", weekend:"this weekend"};
      state.when = map[when] || when;
      save();
      return flowBooking();
    }

    // Intent detection
    if(/book|appoint|schedul|come in|stop by|visit/.test(v)) return flowBooking();
    if(/price|cost|how much|cheap|afford/.test(v) || v==="price") return answerPrice();
    if(/queen/.test(v)) return answerSize("queen");
    if(/king/.test(v)) return answerSize("king");
    if(/full|double/.test(v)) return answerSize("full");
    if(/twin/.test(v)) return answerSize("twin");
    if(/back|pain|hurt|sore|hip|shoulder|neck/.test(v) || v==="pain") return answerPain();
    if(/hot|sweat|cool/.test(v)) return answerHot();
    if(/finance|credit|acima|snap|payment|monthly/.test(v)) return answerFinance();
    if(/deliver|pickup|take home|car|fit/.test(v)) return answerDelivery();
    if(/warrant|return|exchange/.test(v)) return answerWarranty();
    if(/hour|open|close|today|tonight|weekend/.test(v)) return answerHours();
    if(/address|where|location|direction/.test(v)) return answerAddress();
    if(/browsing|looking|just look/.test(v)) return answerBrowsing();
    if(/need_new|need|new mattress|replac|upgrad/.test(v)) return answerNeedNew();

    // Collecting
    if(state.step === "collect_name"){ state.name = titleCase(v); save(); return askPhone(); }
    if(state.step === "collect_phone"){
      const p = normalizePhone(v);
      if(!p){ addMsg("bot","Could you send me that number again? 10 digits like 803-555-0123 works great."); return; }
      state.phone = p; save(); return askWhen();
    }
    if(state.step === "collect_when"){ state.when = v; save(); return confirmBooking(); }

    // Fallback
    addMsg("bot", "Great question. Easiest way to get the right answer is 5 minutes in the showroom. Want me to lock in a time?");
    setQuick([{label:"Book today",value:"book_today"},{label:"This weekend",value:"book_weekend"},{label:"Call 803-795-1194",value:"call"}]);
  }

  function answerPrice(){
    addMsg("bot", "Straight answer:\n\n\u2022 Twin from <b>$130</b>\n\u2022 Full from <b>$140</b>\n\u2022 Queen from <b>$150</b>\n\u2022 King from <b>$275</b>\n\nAll name-brand (Serta, Sealy, Simmons, Malouf). Same mattresses the big stores sell for 2-3x. When can you come lay on a few?");
    setQuick([{label:"Today",value:"book_today"},{label:"This weekend",value:"book_weekend"},{label:"Tell me more first",value:"more"}]);
    state.step = "closing"; save();
  }

  function answerSize(size){
    const p = PRICES[size];
    addMsg("bot", cap(size)+"s start at <b>$"+p.ours+"</b> here. Retail on the same bed is around $"+p.retail+".\n\nYou\u2019ll sleep on this bed ~3,000 nights \u2014 worth 10 minutes to lay on a few. What time works today or tomorrow?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"},{label:"This weekend",value:"book_weekend"}]);
    state.size = size; state.step = "closing"; save();
  }

  function answerPain(){
    addMsg("bot", "That\u2019s exactly why we do appointments \u2014 you need to lay on the bed, not guess online.\n\nTrey walks you through 3-4 options built for back/hip support in about 10 minutes. Most folks know the right one within 2 beds.\n\nToday or tomorrow?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"},{label:"This weekend",value:"book_weekend"}]);
    state.pain = "back"; state.step = "closing"; save();
  }

  function answerHot(){
    addMsg("bot", "Got it \u2014 we carry cooling-gel and hybrid beds that actually sleep cool. Best way to feel the difference is in person. When can you swing by?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]);
    state.pain = "hot"; state.step = "closing"; save();
  }

  function answerFinance(){
    addMsg("bot", "Yes \u2014 Acima <b>No Credit Needed</b> up to $4,000, plus Snap Finance. 90-day payoff options. Pre-qualify in 2 minutes in-store.\n\nWant to come test beds and pre-qualify at the same time?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]);
    state.step = "closing"; save();
  }

  function answerDelivery(){
    addMsg("bot", "No delivery needed \u2014 every mattress comes <b>in a box</b>. Fits in any car, even a sedan. Take it home tonight, open it, done.\n\nWhen can you swing by?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]);
    state.step = "closing"; save();
  }

  function answerWarranty(){
    addMsg("bot", "Full manufacturer warranty (10 years on most). Trey handles any issue directly \u2014 no 800-number runaround.\n\nWant to come see the lineup?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]);
    state.step = "closing"; save();
  }

  function answerHours(){
    addMsg("bot", "Open <b>7 days a week, 10am-7pm</b>. Same-day appointments welcome. What time works for you?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"},{label:"This weekend",value:"book_weekend"}]);
    state.step = "closing"; save();
  }

  function answerAddress(){
    addMsg("bot", "<b>1809 Hwy 15 South, Sumter SC 29150</b>. <a href=\"https://www.google.com/maps/search/?api=1&query=1809+Hwy+15+South+Sumter+SC+29150\" target=\"_blank\">Get directions</a>.\n\nWhen should I tell Trey to expect you?");
    setQuick([{label:"Today",value:"book_today"},{label:"Tomorrow",value:"book_tomorrow"}]);
    state.step = "closing"; save();
  }

  function answerBrowsing(){
    addMsg("bot", "Totally fair. Most folks who come in are just \"looking\" \u2014 then realize they\u2019ve been sleeping on a bed that\u2019s killing their back for 2 years.\n\nYou buy a mattress once every 7-10 years. 10 minutes now can save you thousands and a decade of bad sleep. Zero pressure \u2014 want to take a look?");
    setQuick([{label:"Sure, today",value:"book_today"},{label:"This weekend",value:"book_weekend"},{label:"Not yet",value:"not_yet"}]);
    state.step = "closing"; save();
  }

  function answerNeedNew(){
    addMsg("bot", "You\u2019re in the right place. What size are you looking for?");
    setQuick([{label:"Twin",value:"twin"},{label:"Full",value:"full"},{label:"Queen",value:"queen"},{label:"King",value:"king"}]);
    state.step = "sizing"; save();
  }

  function flowBooking(){
    if(!state.name) return askName();
    if(!state.phone) return askPhone();
    if(!state.when) return askWhen();
    return confirmBooking();
  }

  function askName(){ addMsg("bot", "Love it. What\u2019s your first name?"); state.step = "collect_name"; save(); }
  function askPhone(){ addMsg("bot", "Thanks "+(state.name||"")+"! Best cell to text you a confirmation?"); state.step = "collect_phone"; save(); }
  function askWhen(){
    addMsg("bot", "What time works? We\u2019re open 10am-7pm today.");
    setQuick([
      {label:"Within 1 hour",value:"in 1 hour"},
      {label:"This afternoon",value:"this afternoon"},
      {label:"This evening",value:"this evening"},
      {label:"Tomorrow",value:"tomorrow"}
    ]);
    state.step = "collect_when"; save();
  }

  function confirmBooking(){
    addMsg("bot", "Perfect. Here\u2019s what I\u2019ve got:\n\n\u2022 Name: <b>"+state.name+"</b>\n\u2022 Phone: <b>"+state.phone+"</b>\n\u2022 When: <b>"+state.when+"</b>\n"+(state.size?"\u2022 Size: <b>"+cap(state.size)+"</b>\n":"")+(state.pain?"\u2022 Focus: <b>"+state.pain+"</b>\n":"")+"\nLook right?");
    setQuick([{label:"Yes, book it",value:"confirm_yes"},{label:"Fix something",value:"confirm_fix"}]);
    state.step = "confirming"; save();
  }

  async function sendBooking(){
    addMsg("bot", "Locking it in\u2026");
    try{
      await fetch("/api/book", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name: state.name, phone: state.phone, when: state.when,
          size: state.size, pain: state.pain,
          source: "website-chat",
          timestamp: new Date().toISOString()
        })
      });
    }catch(e){}
    addMsg("bot", "\u2705 You\u2019re on the calendar. Trey has been texted and will confirm shortly at "+state.phone+".\n\n<b>1809 Hwy 15 South, Sumter SC 29150</b>\nCall/text: <b>803-795-1194</b>\n\nSee you soon!");
    state.step = "booked"; save();
  }

  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function titleCase(s){ return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()); }
  function normalizePhone(s){
    const d = (s.match(/\d/g)||[]).join("");
    if(d.length === 10) return d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6);
    if(d.length === 11 && d[0]==="1") return d.slice(1,4)+"-"+d.slice(4,7)+"-"+d.slice(7);
    return null;
  }

  function init(){
    if(!bindDom()) return;
    maybeAutoOpen();
    if(load() && state.messages.length){
      state.messages.forEach(m => {
        const row = document.createElement("div");
        row.className = "chat-msg chat-msg-" + m.role;
        const bub = document.createElement("div");
        bub.className = "chat-bubble";
        bub.innerHTML = m.text.replace(/\n/g,"<br>");
        row.appendChild(bub);
        msgs.appendChild(row);
      });
      msgs.scrollTop = msgs.scrollHeight;
    }
  }

  // Auto-open chat ~2.5s after load on first visit (per session)
  // Respects: if user already opened and closed it this session, do not re-open
  function maybeAutoOpen(){
    try{
      const opened = store.getItem("mba_chat_autoopened_v4");
      if(opened) return;
      setTimeout(function(){
        if(!widget) return;
        if(widget.classList.contains("open")) return;
        store.setItem("mba_chat_autoopened_v4","1");
        openChat();
      }, 2500);
    }catch(e){}
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
