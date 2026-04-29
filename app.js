// MBA Sumter Tre v6 — Pain-first, 30-min slots, smart two-track
(function(){
'use strict';
var state={step:'greet',track:null,name:null,phone:null,size:null,pain:null,day:null,time:null,messages:[]};
var SS=sessionStorage,SS_KEY='mba_v6',SS_AUTO='mba_v6_auto';
var SLOTS=['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM'];
var blockedSlots=[];
var slotsLoaded=false;
function loadBlockedSlots(){
  if(slotsLoaded)return;
  slotsLoaded=true;
  try{
    fetch('https://script.google.com/macros/s/AKfycbwp7Z52-hIHS4ueGkSvukwqNglsc0zpin2X1QsH9v7WR_6WEir8uxW1WFFZt7Hxt2tgfw/exec?action=blocked')
    .then(function(r){return r.json();})
    .then(function(d){if(d&&d.blocked)blockedSlots=d.blocked;})
    .catch(function(){});
  }catch(e){}
}
function getAvailableSlots(day){
  var now=new Date();
  var cutoff=new Date(now.getTime()+60*60*1000);
  var isToday=(day==='Today'||day===(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()]));
  return SLOTS.filter(function(slot){
    var dayKey=day+' '+slot;
    if(blockedSlots.indexOf(dayKey)>-1)return false;
    if(isToday){
      var parts=slot.match(/([0-9]+):([0-9]+) ([AP]M)/);
      if(parts){
        var h=parseInt(parts[1]);var m=parseInt(parts[2]);var ampm=parts[3];
        if(ampm==='PM'&&h!==12)h+=12;
        if(ampm==='AM'&&h===12)h=0;
        var slotTime=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0);
        if(slotTime<cutoff)return false;
      }
    }
    return true;
  });
}
var widget,toggle,box,closeBtn,msgs,quick,input,sendBtn;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]);});}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function titleCase(s){return s.replace(/[a-zA-Z][a-zA-Z]*/g,function(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase();});}
function hi(){return state.name?esc(state.name.split(' ')[0]):'';}
function normPhone(s){var d=(s.match(/[0-9]/g)||[]).join('');if(d.length===10)return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);if(d.length===11&&d[0]==='1')return d.slice(1,4)+'-'+d.slice(4,7)+'-'+d.slice(7);return null;}
function save(){try{SS.setItem(SS_KEY,JSON.stringify(state));}catch(e){}}
function load(){try{var r=SS.getItem(SS_KEY);if(r){state=JSON.parse(r);return true;}}catch(e){}return false;}
function bindDom(){
  widget=document.getElementById('chatWidget');toggle=document.getElementById('chatToggle');box=document.getElementById('chatBox');closeBtn=document.getElementById('chatClose');msgs=document.getElementById('chatMessages');quick=document.getElementById('chatQuickReplies');input=document.getElementById('chatInput');sendBtn=document.getElementById('chatSend');
  if(!widget)return false;
  toggle.addEventListener('click',openChat);closeBtn.addEventListener('click',closeChat);sendBtn.addEventListener('click',submitTyped);
  input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();submitTyped();}});
  if(!document.getElementById('chatReset')){var rb=document.createElement('button');rb.id='chatReset';rb.title='Start over';rb.setAttribute('aria-label','Start over');rb.innerHTML='&#8635;';rb.style.cssText='background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;margin-right:8px;opacity:.7';rb.addEventListener('click',function(){if(confirm('Start fresh?'))resetAll();});closeBtn.parentNode.insertBefore(rb,closeBtn);}
  document.querySelectorAll('a,button').forEach(function(el){if(['chatToggle','chatClose','chatReset','chatSend'].indexOf(el.id)>-1)return;var href=(el.getAttribute('href')||'').toLowerCase();var txt=(el.textContent||'').trim().toLowerCase();if(href==='#chat'||href==='#book'||href==='#appointment'||el.dataset.chat!==undefined||txt==='book now'||txt==='book appointment'||/^book (a |free |your |an )?appointment/.test(txt)){el.addEventListener('click',function(e){e.preventDefault();openChat();});}});
  return true;
}
function openChat(){loadBlockedSlots();widget.classList.add('open');if(state.messages.length===0)greet();setTimeout(function(){if(input)input.focus();},200);}
function closeChat(){widget.classList.remove('open');}
function resetAll(){SS.removeItem(SS_KEY);state={step:'greet',track:null,name:null,phone:null,size:null,pain:null,day:null,time:null,messages:[]};msgs.innerHTML='';quick.innerHTML='';greet();}
function addMsg(role,html){var row=document.createElement('div');row.className='chat-msg chat-msg-'+role;var bub=document.createElement('div');bub.className='chat-bubble';bub.innerHTML=html;row.appendChild(bub);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;state.messages.push({role:role,text:html});save();}
function setQuick(opts){quick.innerHTML='';(opts||[]).forEach(function(opt){var b=document.createElement('button');b.className='chat-quick-btn';b.textContent=opt.label||opt;b.addEventListener('click',function(){onQuick(opt);});quick.appendChild(b);});}
function onQuick(opt){addMsg('user',opt.label||opt);quick.innerHTML='';route(opt.value||(opt.label||opt).toLowerCase());}
function submitTyped(){var v=(input.value||'').trim();if(!v)return;input.value='';addMsg('user',esc(v));quick.innerHTML='';route(v.toLowerCase());}
function greet(){var h=new Date().getHours();var g=h<12?'Good morning':h<17?'Good afternoon':'Good evening';addMsg('bot',g+'! I&#39;m Tre, owner of <b>Mattress by Appointment Sumter</b>.<br><br>Quick question &#8212; what&#39;s going on with your current sleep situation?');setQuick([{label:'My mattress is old / worn out',value:'old_mattress'},{label:'Back or body pain',value:'pain'},{label:'Sleeping hot / not comfortable',value:'hot'},{label:'Looking for an upgrade',value:'upgrade'},{label:'Just checking prices',value:'price'}]);state.step='discovery';save();}
function route(v){
  if(v==='confirm_yes')return sendBooking();
  if(v==='confirm_fix'){state.name=null;state.phone=null;state.day=null;state.time=null;save();return askName();}
  if(v==='not_yet')return handleNotYet();
  if(v==='call_us')return addMsg('bot','<a href="tel:8037951194"><b>Tap to call 803-795-1194</b></a> &#8212; Tre answers 7 days a week, 10am-7pm.');
  if(v==='today'||v==='tomorrow'||v==='day_after'||/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(v)){if(v==='day_after'){var __D=new Date();var __DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][(__D.getDay()+2)%7];state.day=__DN;}else{state.day=cap(v);}save();return askTime();}if(v==='earliest_yes'){var __E2=findEarliestAvailable();if(__E2){state.day=__E2.dayStored;state.time=__E2.time;save();if(!state.name)return askName();if(!state.phone)return askPhone();return confirmBooking();}return askDay();}if(v==='earliest_no'){return askDay();}
  if(v.indexOf('slot_')===0){state.time=v.replace('slot_','');save();if(!state.name)return askName();if(!state.phone)return askPhone();return confirmBooking();}
  if(state.step==='collect_name'){if(v.length<2||/[0-9]/.test(v)){addMsg('bot','Just your first name works!');return;}state.name=titleCase(v);save();return askPhone();}
  if(state.step==='collect_phone'){var p=normPhone(v);if(!p){addMsg('bot','Hmm, that does not look right. Try your 10-digit number like 803-555-0123.');return;}state.phone=p;save();if(!state.day)return askDay();if(!state.time)return askTime();return confirmBooking();}
  if(/price|cost|how much|cheap|afford|deal|starting/.test(v)||v==='price')return answerPrice();
  if(/queen/.test(v)&&!/adjust|base/.test(v))return answerSize('queen');
  if(/king/.test(v)&&!/adjust|base/.test(v))return answerSize('king');
  if(/full|double/.test(v))return answerSize('full');
  if(/twin/.test(v))return answerSize('twin');
  if(/adjust|base|remote|elevat|zero.?grav|snor/.test(v)||v==='adjustable')return answerAdjustable();
  if(/back|pain|hurt|sore|hip|shoulder|neck|spine|ache/.test(v)||v==='pain')return answerPain();
  if(/hot|sweat|cool|temp|night.?sweat/.test(v)||v==='hot')return answerHot();
  if(/old|worn|sag|spring|poke|lumpy|dip|sink|broke|replace|upgrade/.test(v)||v==='old_mattress'||v==='upgrade')return answerNeedNew();
  if(/financ|credit|snap|payment|monthly|qualify|afford/.test(v))return answerFinance();
  if(/brand|serta|sealy|simmons|malouf|allswell|southerland/.test(v))return answerBrands();
  if(/deliver|pickup|take.?home|ship|box|roll/.test(v))return answerDelivery();
  if(/warrant|return|exchange|guarantee/.test(v))return answerWarranty();
  if(/hour|open|close|when.?(are|do).?you|schedule/.test(v))return answerHours();
  if(/address|where|location|direction|map|hwy/.test(v))return answerAddress();
  if(/firm|soft|medium|plush|comfort|feel|which.?mattress/.test(v))return answerFirmness();
  if(/couple|partner|husband|wife|spouse|both/.test(v))return answerCouple();
  if(/child|kid|bunk|teen|daughter|son/.test(v))return answerKid();
  if(/compare|mattress.?firm|ashley|amazon|online|wayfair|review/.test(v))return answerCompare();
  if(/same.?day|take.?home.?tonight/.test(v))return answerSameDay();
  if(/think|later|not.?sure|maybe|considering/.test(v))return handleNotYet();
  if(/just.?look|just.?brows|no.?rush|shop.?around/.test(v))return answerBrowsing();
  if(/pillow|sheet|accessor|protector|frame|foundation/.test(v))return answerAccessory();
  if(/yes|yeah|sure|ok|okay|sounds.?good|ready/.test(v)&&state.step==='closing')return flowBooking();
  addMsg('bot',(hi()?hi()+', great question. ':'')+'Here is the truth &#8212; <b>the right mattress is something your body tells you, not a website.</b><br><br>10 minutes in our showroom and you will know immediately. When can you come in?');
  setQuick([{label:'Book today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'},{label:'Call us',value:'call_us'}]);
  state.step='closing';save();
}
function answerPrice(){state.track='budget';addMsg('bot','Straight up &#8212; here is what we carry:<br><br>Twin from <b>$130</b> <s style="color:#999;font-size:12px">retail $449</s><br>Full from <b>$140</b> <s style="color:#999;font-size:12px">retail $599</s><br>Queen from <b>$150</b> <s style="color:#999;font-size:12px">retail $699</s><br>King from <b>$275</b> <s style="color:#999;font-size:12px">retail $1,199</s><br><br>All name-brand. All 50-80% off retail. Budget tight? <b>$5 down gets you out the door today</b> with Snap Finance, 90-day payoff option.<br><br>When do you want to come try a few?');setQuick([{label:'Come in today',value:'today'},{label:'In 2 days',value:'day_after'},{label:'Tell me about financing',value:'finance'},{label:'What sizes do you have?',value:'old_mattress'}]);state.step='closing';save();}
function answerSize(sz){var p={twin:{o:130,r:449},full:{o:140,r:599},queen:{o:150,r:699},king:{o:275,r:1199}}[sz];state.size=sz;state.track='budget';addMsg('bot',cap(sz)+'s start at <b>$'+p.o+'</b> &#8212; same brand you would pay $'+p.r+' for at retail.<br><br>You will sleep on this mattress roughly 3,000 nights. 10 minutes laying on a few and your body tells you immediately &#8212; no guessing.<br><br>When works for you?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerAdjustable(){state.track='quality';addMsg('bot','<b>Adjustable bases are a total game-changer.</b><br><br>Wireless remote, head and foot elevation, zero-gravity position, under-bed lighting. You try one once and you wonder how you slept flat your whole life.<br><br>Queen adjustable systems from <b>$999</b>, King from <b>$1,299</b> &#8212; well below chain pricing.<br><br>One visit and you will understand immediately. When can you come in?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.size='queen';state.step='closing';save();}
function answerPain(){state.pain='back/body pain';addMsg('bot','Back and hip pain from a bad mattress is one of the most common &#8212; and most fixable &#8212; problems people live with for years.<br><br>The right mattress depends entirely on your body weight, sleep position, and what is actually causing the issue. A bed that fixes one person can make another worse.<br><br>That is exactly why we do appointments. Tre walks you through a few options &#8212; most people find the right bed in 2-3 tries and leave the same day.<br><br>'+(hi()?hi()+', when':'When')+' can you come in?');setQuick([{label:'Today &#8212; I need this fixed',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerHot(){state.pain='sleeps hot';addMsg('bot','Sleeping hot is almost always a mattress problem &#8212; dense foam traps body heat with no airflow.<br><br>We carry cooling-gel and open-coil hybrid beds that sleep significantly cooler. The difference is real &#8212; you feel it the moment you lay down.<br><br>10 minutes vs years of waking up at 3am. Easy call. When works?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
  {label:'In 2 days',value:'day_after'}function answerFinance(){state.track='budget';addMsg('bot','No credit? Bad credit? Does not matter here.<br><br><b>Snap Finance</b> &#8212; no credit needed, up to $4,000, 90-day same-as-cash option. Pre-qualify in the store in about 2 minutes.<br><br><b>$5 down</b> gets you sleeping on a name-brand mattress tonight. You have been putting this off long enough.<br><br>Come in, test the beds, and we will get you sorted out.');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'What are the prices?',value:'price'}]);state.step='closing';save();}
  {label:'In 2 days',value:'day_after'}function answerDelivery(){addMsg('bot','Every mattress comes rolled and compressed in a box &#8212; fits in any car, even a sedan.<br><br><b>Take it home tonight.</b> No delivery truck, no scheduling window, no waiting.<br><br>When do you want to come pick yours up?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'}]);state.step='closing';save();}
function answerWarranty(){addMsg('bot','Full manufacturer warranty &#8212; 10 years on most models. And you deal with Tre directly, not a 1-800 number reading a script.<br><br>That is the advantage of a local shop. When can you stop by?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerHours(){addMsg('bot','Open <b>7 days a week, 10am-7pm</b>. Same-day appointments welcome &#8212; you come in and get Tre&#39;s full attention from the moment you walk through the door.<br><br>What time works?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerAddress(){addMsg('bot','<b>1809 Hwy 15 South, Sumter SC 29150</b><br><a href="https://www.google.com/maps/search/?api=1&query=1809+Hwy+15+South+Sumter+SC+29150" target="_blank" style="color:#d4a017;font-weight:700">Get directions</a><br><br>Free parking right out front. When should I tell Tre to expect you?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerFirmness(){addMsg('bot','Firmness is one of the most personal &#8212; and most misunderstood &#8212; things about a mattress.<br><br>Too firm creates pressure points at hips and shoulders. Too soft, your spine sags. The right spot depends on your body weight and sleep position.<br><br><b>Impossible to figure out online.</b> 5 minutes laying on a few beds and your body tells you. Most people are surprised by what they actually prefer.<br><br>When can you come find out?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerCouple(){addMsg('bot','Important &#8212; if two people are sleeping in the bed, both need to try it.<br><br>Different body types and sleep positions mean a perfect mattress for one can be wrong for the other. We see this all the time.<br><br><b>Bring whoever is sleeping on it.</b> We will find something that works for both &#8212; and it saves you a second trip.<br><br>When can you both come in?');setQuick([{label:'Today',value:'today'},{label:'In 2 days',value:'day_after'}]);state.step='closing';save();}
function answerKid(){state.track='budget';addMsg('bot','Kids go through mattresses fast &#8212; so we keep it simple and affordable.<br><br>Twin from <b>$130</b>, Full from <b>$140</b>. Rolls up, fits in any car, take it home today.<br><br>When can you come in?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'}]);state.step='closing';save();}
function answerCompare(){addMsg('bot','You should compare &#8212; here is the honest truth:<br><br>Big chains have $600-$800 in rent, commissions, and advertising baked into every price. We do not. Same Serta, same Sealy &#8212; our Queen starts at <b>$150</b> vs $699+ at the chains.<br><br>Online? You are guessing. No return policy gives you back weeks of bad sleep.<br><br>10 minutes in person tells you more than 10 hours of reviews. When can you come in?');setQuick([{label:'Today',value:'today'},{label:'In 2 days',value:'day_after'},{label:'Check prices',value:'price'}]);state.step='closing';save();}
function answerSameDay(){addMsg('bot','Yes &#8212; <b>same day, take it home tonight.</b> Every mattress comes in a box, fits in any car.<br><br>What time today works for you?');state.day='Today';save();setTimeout(function(){askTime();},600);}
function answerBrowsing(){addMsg('bot','Totally get it &#8212; no pressure at all.<br><br>Worth knowing: you will spend about <b>25,000 hours</b> on your next mattress. Most people who come in just to look spend 10 minutes, find the right bed, and leave wondering why they waited.<br><br>No hard sell. Zero risk. When can you stop by?');setQuick([{label:'Sure &#8212; today',value:'today'},{label:'In 2 days',value:'day_after'},{label:'Not ready yet',value:'not_yet'}]);state.step='closing';save();}
function answerAccessory(){addMsg('bot','Yes &#8212; we carry pillows, mattress protectors, and accessories. Tre will match you with what pairs best with your mattress. All part of the same appointment.<br><br>When works?');setQuick([{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'}]);state.step='closing';save();}
function handleNotYet(){addMsg('bot','No rush'+(hi()?' '+hi():'')+'. Can I answer anything while you are thinking it over?<br><br>Sometimes the thing holding people back is one question they have not gotten a straight answer to yet.');setQuick([{label:'Prices',value:'price'},{label:'Financing options',value:'finance'},{label:'Brands we carry',value:'brands'},{label:'Adjustable bases',value:'adjustable'},{label:'How does it work?',value:'hours'}]);}
function flowBooking(){if(!state.day)return askDay();if(!state.time)return askTime();if(!state.name)return askName();if(!state.phone)return askPhone();return confirmBooking();}
function askDay(){var today=new Date();var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var tn=days[today.getDay()];var tom=days[(today.getDay()+1)%7];addMsg('bot',(hi()?'Perfect, '+hi()+'! ':'Perfect! ')+'What day works best?');setQuick((function(){var arr=[];var hr=today.getHours();if(hr<19)arr.push({label:'Today ('+tn+')',value:'today'});arr.push({label:'Tomorrow ('+tom+')',value:'tomorrow'});var d2=days[(today.getDay()+2)%7];arr.push({label:d2,value:d2.toLowerCase()});return arr;})());state.step='collect_day';save();}
function findEarliestAvailable(){var now=new Date();var dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];for(var off=0;off<=2;off++){var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+off);var dn=dayNames[d.getDay()];var label=off===0?'Today':(off===1?'Tomorrow':dn);var queryDay=off===0?'Today':dn;var slots=getAvailableSlots(queryDay);if(slots&&slots.length>0)return {day:label,time:slots[0],dayValue:off===0?'today':(off===1?'tomorrow':dn.toLowerCase()),dayStored:queryDay};}return null;}function askTime(){
  var slots=getAvailableSlots(state.day||'');
  if(slots.length===0){
    var __E=findEarliestAvailable();if(__E){addMsg('bot','That day is fully booked. The earliest I have open is <b>'+__E.day+' at '+__E.time+'</b>. Want me to lock that in?');setQuick([{label:'Yes — '+__E.day+' '+__E.time,value:'earliest_yes'},{label:'Pick another day',value:'earliest_no'}]);state.step='collect_time_earliest';save();return;}addMsg('bot','We are fully booked the next 2 days. Tap <a href="tel:18037951194"><b>803-795-1194</b></a> — Tre will work you in.');return;
    askDay();
    return;
  }
  addMsg('bot','Great'+(state.day?' &#8212; <b>'+state.day+'</b>':'')+'. Pick a time (open 10am-7pm):');
  setQuick(slots.map(function(s){return {label:s,value:'slot_'+s};}));
  state.step='collect_time';save();
}
function askName(){addMsg('bot','Almost done! What is your name?');state.step='collect_name';save();}
function askPhone(){addMsg('bot','Thanks'+(hi()?' '+hi():'')+'. Best cell number for your text confirmation?');state.step='collect_phone';save();}
function confirmBooking(){var s='Day: <b>'+(state.day||'?')+'</b><br>Time: <b>'+(state.time||'?')+'</b><br>Name: <b>'+esc(state.name||'?')+'</b><br>Phone: <b>'+esc(state.phone||'?')+'</b>';if(state.size)s+='<br>Size: <b>'+cap(state.size)+'</b>';if(state.pain)s+='<br>Focus: <b>'+esc(state.pain)+'</b>';addMsg('bot','Here is what I have:<br><br>'+s+'<br><br>Look right?');setQuick([{label:'Yes &#8212; book it!',value:'confirm_yes'},{label:'Fix something',value:'confirm_fix'}]);state.step='confirming';save();}
async function sendBooking(){addMsg('bot','Locking it in...');var when=(state.day||'?')+' at '+(state.time||'?');try{await fetch('/api/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:state.name,phone:state.phone,when:when,size:state.size||'Not specified',pain:state.pain||'General shopping',source:'website-chat-v6',timestamp:new Date().toISOString()})});}catch(e){}addMsg('bot','<b>You are on the calendar!</b><br><br>Tre has been notified and will call to confirm your appointment for <b>'+esc(when)+'</b>.<br><br>You will also get a text confirmation at '+esc(state.phone||'your number')+'.<br><br><b>1809 Hwy 15 S, Sumter SC 29150</b><br>803-795-1194<br><br>Please bring:<br>&#8212; Photo ID<br>&#8212; Bank info if you want financing<br>&#8212; Anyone sleeping on the bed<br><br>See you soon! &#8212; MBA Sumter');state.step='booked';save();}
function maybeAutoOpen(){return;}
function init(){if(!bindDom())return;maybeAutoOpen();if(load()&&state.messages.length){state.messages.forEach(function(m){var row=document.createElement('div');row.className='chat-msg chat-msg-'+m.role;var bub=document.createElement('div');bub.className='chat-bubble';bub.innerHTML=m.text;row.appendChild(bub);msgs.appendChild(row);});msgs.scrollTop=msgs.scrollHeight;}}
function bindInlineOpener(){var b=document.getElementById('openInlineChat');var w=document.getElementById('chatWidget');if(b&&w){b.addEventListener('click',function(){w.style.display='block';b.style.display='none';try{if(typeof openChat==='function'){openChat();}else{w.classList.add('open');if(state.messages.length===0){greet();}}}catch(e){}});}}
function initAll(){init();bindInlineOpener();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAll);}else{initAll();}
})();


/* === MBA v7 — Quick Book Chips === */
(function(){
'use strict';
var QB={day:null,time:null,name:'',phone:''};
var SLOTS=['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM'];
var blocked=[];
function fetchBlocked(){try{fetch('https://script.google.com/macros/s/AKfycbwp7Z52-hIHS4ueGkSvukwqNglsc0zpin2X1QsH9v7WR_6WEir8uxW1WFFZt7Hxt2tgfw/exec?action=blocked').then(function(r){return r.json();}).then(function(d){if(d&&d.blocked)blocked=d.blocked;}).catch(function(){});}catch(e){}}
function avail(day){var now=new Date();var cutoff=new Date(now.getTime()+60*60*1000);var dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var todayName=dayNames[now.getDay()];var isToday=(day==='Today'||day===todayName);return SLOTS.filter(function(slot){if(blocked.indexOf(day+' '+slot)>-1)return false;if(isToday){var p=slot.match(/([0-9]+):([0-9]+) ([AP]M)/);if(p){var h=parseInt(p[1]);var m=parseInt(p[2]);var ap=p[3];if(ap==='PM'&&h!==12)h+=12;if(ap==='AM'&&h===12)h=0;var st=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0);if(st<cutoff)return false;}}return true;});}
function nextDays(){var now=new Date();var dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var todayName=dayNames[now.getDay()];var tomName=dayNames[(now.getDay()+1)%7];var d3=dayNames[(now.getDay()+2)%7];var d4=dayNames[(now.getDay()+3)%7];var hr=now.getHours();var arr=[];if(hr<19)arr.push({label:'Today ('+todayName+')',value:'Today'});arr.push({label:'Tomorrow ('+tomName+')',value:tomName});arr.push({label:d3,value:d3});return arr;}
function renderDays(){var c=document.getElementById('qbDayChips');if(!c)return;c.innerHTML='';nextDays().forEach(function(d){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=d.label;b.addEventListener('click',function(){QB.day=d.value;Array.prototype.forEach.call(c.children,function(ch){ch.classList.remove('active');});b.classList.add('active');var lbl=document.getElementById('qbDayLabel');if(lbl)lbl.textContent='— '+d.label;document.getElementById('qbTimeStep').style.display='block';renderTimes();});c.appendChild(b);});}
function renderTimes(){var c=document.getElementById('qbTimeChips');if(!c)return;c.innerHTML='';var slots=avail(QB.day);if(slots.length===0){c.innerHTML='<p style="color:#888;font-size:14px;margin:0">No times left for that day. Pick another above.</p>';return;}slots.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s;b.addEventListener('click',function(){QB.time=s;Array.prototype.forEach.call(c.children,function(ch){ch.classList.remove('active');});b.classList.add('active');document.getElementById('qbContactStep').style.display='block';setTimeout(function(){var p=document.getElementById('qbPhone');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'center'});if(p)p.focus();},200);});c.appendChild(b);});}
function normPhone(s){var d=(String(s).match(/[0-9]/g)||[]).join('');if(d.length===10)return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);if(d.length===11&&d[0]==='1')return d.slice(1,4)+'-'+d.slice(4,7)+'-'+d.slice(7);return null;}
function bindConfirm(){var btn=document.getElementById('qbConfirm');if(!btn)return;btn.addEventListener('click',function(){var phoneEl=document.getElementById('qbPhone');var nameEl=document.getElementById('qbName');var p=normPhone(phoneEl.value||'');if(!p){phoneEl.style.borderColor='#c00';phoneEl.focus();phoneEl.placeholder='Enter 10-digit phone';return;}QB.phone=p;QB.name=(nameEl.value||'').trim()||'Web booking';btn.disabled=true;btn.textContent='Booking...';try{fetch('/api/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:QB.name,phone:QB.phone,when:QB.day+' at '+QB.time,size:'Not specified',pain:'Quick book (web)',source:'website-quickbook-v7',timestamp:new Date().toISOString()})}).catch(function(){});}catch(e){}document.getElementById('qbDayStep').style.display='none';document.getElementById('qbTimeStep').style.display='none';document.getElementById('qbContactStep').style.display='none';var done=document.getElementById('qbDoneStep');done.style.display='block';document.getElementById('qbDoneMsg').innerHTML='Tre will text and call to confirm <strong>'+QB.day+' at '+QB.time+'</strong>.<br>Confirmation text coming to '+QB.phone+'.<br><br>1809 Hwy 15 S, Sumter SC';});}
function liveStatus(){var el=document.getElementById('liveStatus');if(!el)return;var hr=new Date().getHours();if(hr>=10&&hr<19){el.textContent='Open Now';el.style.color='#81e08a';}else{el.textContent='Closed — Opens 10am';el.style.color='#ffa500';}}
function init7(){fetchBlocked();renderDays();bindConfirm();liveStatus();setInterval(liveStatus,60000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init7);else init7();
})();


/* tap rescue v1 */
(function(){
    function rescue(root){
          if(!root||!root.querySelectorAll) return;
          var els = root.querySelectorAll('.chip,.btn,.btn-ghost-dark,.btn-call-big,#qbConfirm,a.ms-btn,a.ms-call,a.ms-book');
          els.forEach(function(el){
                  if(el.dataset.tapRescued) return;
                  el.dataset.tapRescued='1';
                  el.style.touchAction='manipulation';
                  el.addEventListener('pointerup', function(e){
                            if(e.pointerType==='mouse') return;
                            if(el.tagName==='A' && el.href){ window.location.href=el.href; return; }
                            el.click();
                  }, {passive:true});
          });
    }
    if(document.readyState==='loading'){
          document.addEventListener('DOMContentLoaded', function(){ rescue(document); });
    } else { rescue(document); }
    var mo = new MutationObserver(function(muts){
          muts.forEach(function(m){ m.addedNodes.forEach(function(n){ if(n.nodeType===1) rescue(n); }); });
    });
    mo.observe(document.body || document.documentElement, {childList:true, subtree:true});
})();
