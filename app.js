/* MBA Sumter - Elite AI Sleep Specialist */

const MBA = {
  phone: '803-795-1194',
  address: '1809 Hwy 15 South, Sumter, SC 29150',
  hours: 'Open 7 days, 10am-7pm',
  brands: ['Malouf','Serta','Sealy','Simmons','Southerland','Allswell'],
  prices: { Twin:150, Full:225, Queen:275, King:425 },
  retail: { Twin:499, Full:699, Queen:899, King:1299 },
  endpointURL: '/api/book'
};

const INTENTS = {
  pricing:    /\b(price|pricing|cost|how much|afford|cheap|budget|expensive|deal)\b/i,
  size:       /\b(twin|full|queen|king|size|double)\b/i,
  brand:      /\b(malouf|serta|sealy|simmons|southerland|allswell|tempur|purple|brand)\b/i,
  financing:  /\b(finance|financing|payment|credit|acima|snap|pay|monthly)\b/i,
  delivery:   /\b(deliver|shipping|pickup|pick up|how.*get|take home|box)\b/i,
  warranty:   /\b(warranty|return|guarantee|trial|defect)\b/i,
  hours:      /\b(hours|open|close|time|today|tomorrow|sunday|weekend|when.*open)\b/i,
  location:   /\b(where|address|located|location|directions|map|how.*find)\b/i,
  pain:       /\b(back pain|shoulder|neck|hip|hot|sweat|sag|old mattress|wake up|sore|ache|hurt|stiff|partner|spouse|toss)\b/i,
  firm:       /\b(firm|soft|medium|plush|hard|support)\b/i,
  justlook:   /\b(just looking|browsing|not ready|shopping around|comparing)\b/i,
  expensive:  /\b(too (expensive|much|pricey)|can.?t afford|over budget)\b/i,
  think:      /\b(think about|think it over|get back|let you know|talk to|decide)\b/i,
  appointment:/\b(appointment|book|schedule|come in|visit|see|showroom|tour)\b/i,
  yes:        /^(yes|yeah|yep|sure|ok|okay|sounds good|please|lets do it|y)\b/i,
  no:         /^(no|nope|not really|nah|n)\b/i
};

const KB = {
  pricing:  function(){ return 'Our pricing is direct-from-warehouse - 50-80% off retail. Queen mattresses start at $275 (retail around $899), Kings at $425 (retail around $1,299). Same name-brand mattresses you see at the big stores, roughly a third of the price. Most customers tell us they were expecting to spend double.'; },
  sizes:    function(){ return 'We carry every size:\n\n- Twin from $150\n- Full from $225\n- Queen from $275 (most popular)\n- King from $425\n\nWhat size are you shopping for?'; },
  brands:   function(){ return 'We carry 6 premium brands: Malouf, Serta, Sealy, Simmons, Southerland, and Allswell. All name-brand, all at warehouse pricing. When you come in, I can show you side-by-side comparisons - that is really the only way to know which one is right for your body.'; },
  financing:function(){ return 'Absolutely - even with no credit or bad credit. We work with Acima (up to $4,000, no credit needed, 90-day payment option) and Snap Finance (fast approval, all credit welcome). Most folks get approved in minutes. You can walk out today with zero down.'; },
  delivery: function(){ return 'Great news - no delivery needed! Every mattress we carry now ships compressed in a box. Fits in your car, SUV, or truck. You take it home the same day, unbox it at home, and it expands back to full size within a few hours. No waiting days for a delivery truck.'; },
  warranty: function(){ return 'All our mattresses come with full manufacturer warranties - most are 10-year coverage against defects. We walk you through the specific warranty at your appointment so you know exactly what is covered.'; },
  hours:    function(){ return 'We are open 7 days a week, 10am to 7pm. Same-day appointments usually available - I can often fit you in within the next hour or two.'; },
  location: function(){ return 'We are at 1809 Hwy 15 South, Sumter SC 29150. Private showroom, by-appointment only - that way you get the full place to yourself with no pressure.'; },
  firmness: function(){ return 'Great question - firmness is the #1 thing to test in person. Side sleepers usually do better on medium-soft (pressure relief on shoulders/hips), back sleepers on medium-firm (spine support), stomach sleepers on firm (keeps hips from sinking). Couples often need a middle ground. At the showroom we will have you lay on 3-4 different options for 5-10 minutes each - that is really the only way to know.'; },
  pain_back:function(){ return 'Back pain is the #1 thing we help people solve. If your current mattress is 7+ years old and you wake up sore, the mattress is almost certainly the cause. You will want medium-firm support that keeps your spine aligned - we have several that work beautifully for this, and I would love to show you side-by-side at your appointment.'; },
  pain_hot: function(){ return 'Sleeping hot kills deep sleep. The newer hybrid and gel-infused memory foam mattresses we carry are specifically built to sleep cool - we can show you which ones work best for hot sleepers when you come in.'; }
};

const PHILOSOPHY = {
  investmentAngle: 'You sleep on a mattress about 3,000 nights over its life - the right one is one of the best investments you will ever make. The wrong one costs you rest, your back, and your mood for years.',
  testingMatters: 'Here is the thing - a mattress is the one purchase you literally cannot judge from a picture. You have to lay on it. You will spend a third of the next 7-10 years of your life on it. 15 minutes in our private showroom is the only way to know you are making the right call.',
  privateShowroomValue: 'And because we are by-appointment only, you will not have a salesman hovering over your shoulder. Just you, the mattresses, and Trey (the owner) answering questions when you have them.',
  costPerNight: function(total){ const nights = 8*365; return ' That works out to about $' + (total/nights).toFixed(2) + ' per night over the life of the mattress.'; }
};

const state = {
  stage: 'greet',
  captureStep: null,
  customer: { name:null, phone:null, size:null, pain:null, preferredTime:null },
  history: [],
  asked: new Set(),
  turns: 0
};

const chat = {
  init: function(){
    this.widget   = document.getElementById('chatWidget');
    this.toggle   = document.getElementById('chatToggle');
    this.box      = document.getElementById('chatBox');
    this.messages = document.getElementById('chatMessages');
    this.input    = document.getElementById('chatInput');
    this.send     = document.getElementById('chatSend');
    this.close    = document.getElementById('chatClose');
    this.quick    = document.getElementById('chatQuickReplies');
    if(!this.widget) return;
    var self = this;
    this.toggle.addEventListener('click', function(){ self.open(); });
    this.close.addEventListener('click',  function(){ self.closeChat(); });
    this.send.addEventListener('click',   function(){ self.handleSend(); });
    this.input.addEventListener('keydown',function(e){ if(e.key==='Enter') self.handleSend(); });
    var openBtn = document.getElementById('openChat');
    if(openBtn) openBtn.addEventListener('click', function(){ self.open(); });
    setTimeout(function(){
      if(!sessionStorage.getItem('mba_chat_seen') && window.scrollY > 800){ self.open(); }
    }, 20000);
  },
  open: function(){
    this.widget.classList.add('open');
    sessionStorage.setItem('mba_chat_seen','1');
    if(state.turns === 0) botStart();
    this.input.focus();
  },
  closeChat: function(){ this.widget.classList.remove('open'); },
  addMsg: function(text, who){
    who = who || 'bot';
    var div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.innerHTML = String(text).replace(/\n/g, '<br>');
    this.messages.appendChild(div);
    this.messages.scrollTop = this.messages.scrollHeight;
    state.history.push({who: who, text: text});
  },
  setQuick: function(options){
    this.quick.innerHTML = '';
    if(!options || !options.length) return;
    var self = this;
    options.forEach(function(opt){
      var b = document.createElement('button');
      b.textContent = opt.label || opt;
      b.onclick = function(){ self.input.value = opt.value || opt; self.handleSend(); };
      self.quick.appendChild(b);
    });
  },
  handleSend: function(){
    var txt = this.input.value.trim();
    if(!txt) return;
    this.addMsg(txt, 'user');
    this.input.value = '';
    this.setQuick([]);
    setTimeout(function(){ botRespond(txt); }, 500 + Math.random()*400);
  }
};

function botStart(){
  state.turns++;
  var h = new Date().getHours();
  var greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  chat.addMsg(greet + '! I am your Sleep Specialist at Mattress by Appointment of Sumter. Before I help you find the perfect mattress - what brings you in today?\n\nAre you replacing an old mattress, upgrading for better sleep, or shopping for someone else?');
  chat.setQuick([
    {label:'Replacing an old one', value:'replacing my old mattress'},
    {label:'Upgrading sleep', value:'upgrading for better sleep'},
    {label:'For someone else', value:'shopping for someone else'},
    {label:'Just browsing', value:'just browsing'}
  ]);
  state.asked.add('reason');
}

function botRespond(msg){
  state.turns++;
  var lower = msg.toLowerCase();
  captureDetails(msg, lower);
  if(state.stage !== 'capture' && state.stage !== 'confirm' && INTENTS.appointment.test(lower)) return startBooking();
  if(state.stage === 'capture') return handleCapture(msg);
  if(state.stage === 'confirm') return handleConfirm(msg);
  if(INTENTS.justlook.test(lower))   return handleJustLooking();
  if(INTENTS.expensive.test(lower))  return handleExpensive();
  if(INTENTS.think.test(lower))      return handleThinkAboutIt();
  if(INTENTS.pain.test(lower))       return handlePain(lower);
  if(INTENTS.pricing.test(lower))    return respondAndAdvance(KB.pricing());
  if(INTENTS.financing.test(lower))  return respondAndAdvance(KB.financing());
  if(INTENTS.delivery.test(lower))   return respondAndAdvance(KB.delivery());
  if(INTENTS.warranty.test(lower))   return respondAndAdvance(KB.warranty());
  if(INTENTS.hours.test(lower))      return respondAndAdvance(KB.hours());
  if(INTENTS.location.test(lower))   return respondAndAdvance(KB.location());
  if(INTENTS.brand.test(lower))      return respondAndAdvance(KB.brands());
  if(INTENTS.firm.test(lower))       return respondAndAdvance(KB.firmness());
  if(INTENTS.size.test(lower) && !state.asked.has('size_ack')){
    state.asked.add('size_ack');
    var size = extractSize(lower) || 'Queen';
    var price = MBA.prices[size] || 275;
    return respondAndAdvance('Great choice - our ' + size + 's start at $' + price + ', which is typically less than half retail.' + PHILOSOPHY.costPerNight(price));
  }
  return advanceConversation(lower);
}

function respondAndAdvance(answer){
  chat.addMsg(answer);
  setTimeout(function(){ advanceConversation(''); }, 700);
}

function advanceConversation(lower){
  if(!state.asked.has('size_q') && !state.customer.size){
    state.asked.add('size_q');
    chat.addMsg('What size are you looking for?');
    chat.setQuick([
      {label:'Twin', value:'twin'},
      {label:'Full', value:'full'},
      {label:'Queen', value:'queen'},
      {label:'King', value:'king'},
      {label:'Not sure', value:'not sure'}
    ]);
    return;
  }
  if(!state.asked.has('pain_q') && !state.customer.pain){
    state.asked.add('pain_q');
    chat.addMsg('One more thing that will help me point you right - any specific sleep issues you are trying to fix? (Back pain, sleeping hot, partner tossing, old mattress sagging, etc.)');
    chat.setQuick([
      {label:'Back pain', value:'back pain'},
      {label:'Sleep hot', value:'i sleep hot'},
      {label:'Mattress sagging', value:'old mattress is sagging'},
      {label:'Just upgrading', value:'no issues'}
    ]);
    return;
  }
  if(!state.asked.has('pitch')){
    state.asked.add('pitch');
    return deliverThePitch();
  }
  return nudgeToBook();
}

function deliverThePitch(){
  var name = state.customer.name ? state.customer.name + ', ' : '';
  var pain = state.customer.pain;
  var msg = 'Here is the honest truth ' + name + '- ';
  msg += PHILOSOPHY.investmentAngle + '\n\n';
  msg += PHILOSOPHY.testingMatters + '\n\n';
  if(pain){
    msg += 'And based on what you told me about ' + pain + ', I already have 2-3 specific mattresses in mind I would love to show you. ';
  } else {
    msg += 'When you come in, I will line up 3-4 options in your range and let you actually lay on them. ';
  }
  msg += PHILOSOPHY.privateShowroomValue + '\n\n';
  msg += 'Want to grab a private appointment? Takes 60 seconds. Same-day usually available.';
  chat.addMsg(msg);
  chat.setQuick([
    {label:'Yes, book me', value:'yes book me'},
    {label:'Today', value:'today'},
    {label:'Tomorrow', value:'tomorrow'},
    {label:'Tell me more', value:'tell me more'}
  ]);
  state.stage = 'book';
}

function nudgeToBook(){
  chat.addMsg('Happy to answer anything else - but real talk, 15 minutes in our showroom will tell you more than 3 hours of reading online. Want me to grab you an appointment?');
  chat.setQuick([
    {label:'Book today', value:'book today'},
    {label:'Book tomorrow', value:'book tomorrow'},
    {label:'Another day', value:'another day'}
  ]);
  state.stage = 'book';
}

function handleJustLooking(){
  chat.addMsg('Totally get it - and honestly that is why our private appointments exist. No pressure, no commissioned salesman pushing you. You come in, lay on a few, ask questions, and leave. If it is not the right time, no hard feelings.\n\nMost "just looking" customers end up saving 50-80% off retail when they see the actual pricing in person. What is the best day for a quick no-pressure look?');
  chat.setQuick([
    {label:'Today', value:'today'},
    {label:'This weekend', value:'this weekend'},
    {label:'Next week', value:'next week'}
  ]);
  state.stage = 'book';
}

function handleExpensive(){
  chat.addMsg('Totally fair concern - and here is the thing most people do not realize: our Queen at $275 works out to about 9 cents a night over 8 years. A bad mattress costs you way more - in sleep, back pain, and replacing it early.\n\nPlus we offer no-credit-needed financing up to $4,000, so you can spread it out. Most folks walk out paying less per month than their streaming subscriptions.\n\nWant me to line up the best value options at your appointment?');
  chat.setQuick([
    {label:'Yes, show me', value:'yes book me'},
    {label:'Tell me about financing', value:'financing'}
  ]);
  state.stage = 'book';
}

function handleThinkAboutIt(){
  chat.addMsg('Smart - this is a 7-10 year decision, you should think it through. Here is what I will suggest though: the thinking gets way easier once you have actually laid on a few. Reading about mattresses is like reading about food - it only tells you so much.\n\nWhat if we grab a no-commitment appointment? Come see them, feel them, then sleep on the decision. Worst case you leave with better info. Best case you find THE ONE and save hundreds.');
  chat.setQuick([
    {label:'OK lets do it', value:'yes book me'},
    {label:'What are your hours?', value:'hours'}
  ]);
  state.stage = 'book';
}

function handlePain(lower){
  var response = '';
  if(/back|spine|lower/i.test(lower))        { state.customer.pain = 'back pain';          response = KB.pain_back(); }
  else if(/hot|sweat|warm/i.test(lower))     { state.customer.pain = 'sleeps hot';         response = KB.pain_hot(); }
  else if(/partner|spouse|toss/i.test(lower)){ state.customer.pain = 'partner disturbance';response = 'Partner tossing is brutal - motion isolation is the fix. The Sealy Hybrids and memory foam options we carry are specifically built to keep their movement from waking you. When you come in, lay on one and have them jump on the other side - you will feel the difference instantly.'; }
  else if(/sag|old|worn/i.test(lower))       { state.customer.pain = 'old mattress sagging';response = 'If your mattress is 7+ years old and sagging, you are losing real sleep quality every single night. The body adapts to the sag, but your spine pays the price. Honestly, waiting another month costs you more than a new mattress does.'; }
  else                                         { state.customer.pain = 'sleep issues';      response = 'Thanks for sharing that - those exact issues are what we help Sumter families solve every week. Come let me show you 2-3 specific mattresses that target what you are dealing with.'; }
  chat.addMsg(response + '\n\nReady to come see them? Takes 60 seconds to book.');
  chat.setQuick([
    {label:'Yes book me', value:'yes book me'},
    {label:'Tell me more', value:'tell me more'}
  ]);
  state.stage = 'book';
  state.asked.add('pain_q');
}

function startBooking(){
  state.stage = 'capture';
  if(!state.customer.name){
    state.captureStep = 'name';
    chat.addMsg('Perfect - let us lock this in. What is your first name?');
  } else if(!state.customer.phone){
    state.captureStep = 'phone';
    chat.addMsg('Perfect ' + state.customer.name + '. What is the best phone number for you?');
  } else {
    state.captureStep = 'time';
    askPreferredTime();
  }
}

function handleCapture(msg){
  var step = state.captureStep;
  if(step === 'name'){
    state.customer.name = msg.trim().split(/\s+/)[0];
    state.captureStep = 'phone';
    chat.addMsg('Nice to meet you ' + state.customer.name + '. What is the best phone number to reach you?');
    return;
  }
  if(step === 'phone'){
    var phone = msg.replace(/[^\d]/g,'');
    if(phone.length < 10){ chat.addMsg('Looks like that phone number is missing a digit - mind double-checking? Should be 10 digits.'); return; }
    state.customer.phone = formatPhone(phone);
    state.captureStep = 'time';
    askPreferredTime();
    return;
  }
  if(step === 'time'){
    state.customer.preferredTime = msg.trim();
    state.captureStep = 'confirm';
    state.stage = 'confirm';
    showConfirmation();
    return;
  }
}

function askPreferredTime(){
  chat.addMsg('When works best for you? We are open 7 days, 10am-7pm. Same-day usually available.');
  chat.setQuick([
    {label:'Today', value:'today'},
    {label:'Tomorrow morning', value:'tomorrow morning'},
    {label:'Tomorrow afternoon', value:'tomorrow afternoon'},
    {label:'This weekend', value:'this weekend'}
  ]);
}

function showConfirmation(){
  var c = state.customer;
  var summary = 'Perfect. Here is what I have:\n\n';
  summary += 'Name: ' + c.name + '\n';
  summary += 'Phone: ' + c.phone + '\n';
  summary += 'Preferred time: ' + c.preferredTime + '\n';
  if(c.size) summary += 'Looking for: ' + c.size + '\n';
  if(c.pain) summary += 'Priority: ' + c.pain + '\n';
  summary += '\nLocation: 1809 Hwy 15 South, Sumter SC 29150\nPhone: ' + MBA.phone + '\n\nWant me to lock this in and text Trey to confirm?';
  chat.addMsg(summary);
  chat.setQuick([
    {label:'Yes, confirm', value:'yes confirm'},
    {label:'Change something', value:'change'}
  ]);
}

function handleConfirm(msg){
  var lower = msg.toLowerCase();
  if(INTENTS.no.test(lower) || /change|edit|fix|wrong/.test(lower)){
    chat.addMsg('No problem - what would you like to change? Tell me your name again to restart.');
    state.stage = 'capture';
    state.captureStep = 'name';
    return;
  }
  submitBooking();
}

function submitBooking(){
  var c = state.customer;
  chat.addMsg('Locking it in...');
  fetch(MBA.endpointURL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      name: c.name, phone: c.phone, preferredTime: c.preferredTime,
      size: c.size || '', pain: c.pain || '',
      timestamp: new Date().toISOString(), source: 'website-chat'
    })
  }).catch(function(){});
  setTimeout(function(){
    chat.addMsg('You are booked, ' + c.name + '!\n\nTrey will text or call ' + c.phone + ' shortly to confirm your exact time.\n\n1809 Hwy 15 South, Sumter SC 29150\n\nCant wait to help you find the perfect mattress. If anything comes up, call ' + MBA.phone + '.');
    chat.setQuick([{label:'Call now', value:'call'}, {label:'Directions', value:'directions'}]);
    state.stage = 'done';
  }, 1200);
}

function captureDetails(msg, lower){
  if(!state.customer.size){ var size = extractSize(lower); if(size) state.customer.size = size; }
  if(!state.customer.phone){ var phone = msg.replace(/[^\d]/g,''); if(phone.length === 10 || phone.length === 11) state.customer.phone = formatPhone(phone); }
  if(!state.customer.name && state.turns < 4){
    var m = msg.match(/\bi.?m\s+(\w+)|my name is (\w+)|this is (\w+)/i);
    if(m) state.customer.name = (m[1]||m[2]||m[3]);
  }
}

function extractSize(lower){
  if(/\bking\b/.test(lower))  return 'King';
  if(/\bqueen\b/.test(lower)) return 'Queen';
  if(/\bfull|double\b/.test(lower)) return 'Full';
  if(/\btwin\b/.test(lower))  return 'Twin';
  return null;
}

function formatPhone(digits){
  var d = digits.slice(-10);
  return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
}

document.addEventListener('DOMContentLoaded', function(){ chat.init(); });
if(document.readyState !== 'loading') chat.init();
