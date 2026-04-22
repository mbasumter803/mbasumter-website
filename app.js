// AI SLEEP SPECIALIST - MATTRESS BY APPOINTMENT SUMTER SC
const BUSINESS = {
    name: "Mattress by Appointment of Sumter",
    phone: "803-795-1194",
    email: "mbasumter803@gmail.com",
    address: "1809 Hwy 15 South, Sumter SC 29150"
};

const state = { step: 0, answers: {}, started: false };

const flow = [
  { id: 'welcome', text: "Hey! I am your AI Sleep Specialist. I will help you find the perfect mattress and book your private appointment in under 2 minutes. Ready to start?", replies: ["Yes, let's go!", "Tell me prices first"] },
  { id: 'size', text: "Great! What size mattress are you looking for?", replies: ["Twin", "Twin XL", "Full", "Queen", "King", "Not sure"] },
  { id: 'position', text: "How do you usually sleep?", replies: ["Back sleeper", "Side sleeper", "Stomach sleeper", "I move around a lot"] },
  { id: 'firmness', text: "What firmness do you prefer?", replies: ["Soft / plush", "Medium", "Firm", "Not sure"] },
  { id: 'budget', text: "What is your budget? Remember we are 50-80% off retail.", replies: ["Under $300", "$300 - $600", "$600 - $1000", "$1000+", "Flexible"] },
  { id: 'recommend', recommend: true },
  { id: 'name', text: "Perfect! Let's book your private appointment. What is your first name?", input: true },
  { id: 'phone', text: "What is the best phone number to reach you?", input: true },
  { id: 'date', text: "When works best? Pick a day:", dateSelect: true },
  { id: 'time', text: "What time works? We are open 10am - 7pm.", timeSelect: true },
  { id: 'confirm', confirm: true }
  ];

function openChat() {
    document.getElementById('chat-panel').classList.add('open');
    if (!state.started) { state.started = true; startFlow(); }
}

function closeChat() { document.getElementById('chat-panel').classList.remove('open'); }

function startFlow() {
    state.step = 0; state.answers = {};
    document.getElementById('chat-body').innerHTML = '';
    showCurrent();
}

function showCurrent() {
    const node = flow[state.step];
    if (!node) return;
    if (node.recommend) return showRecommendation();
    if (node.confirm) return showConfirmation();
    const text = typeof node.text === 'function' ? node.text(state.answers) : node.text;
    setTimeout(() => addAIMessage(text, node.replies, node.input, node.dateSelect, node.timeSelect), 500);
}

function addAIMessage(text, replies, input, dateSelect, timeSelect) {
    const body = document.getElementById('chat-body');
    showTyping();
    setTimeout(() => {
          hideTyping();
          const msg = document.createElement('div');
          msg.className = 'msg ai';
          msg.innerHTML = '<div class="msg-avatar">S</div><div class="msg-bubble">' + text + '</div>';
          body.appendChild(msg);
          if (replies) {
                  const rep = document.createElement('div');
                  rep.className = 'quick-replies';
                  replies.forEach(r => {
                            const b = document.createElement('button');
                            b.className = 'quick-reply';
                            b.textContent = r;
                            b.onclick = () => handleReply(r);
                            rep.appendChild(b);
                  });
                  body.appendChild(rep);
          }
          if (dateSelect) showDatePicker(body);
          if (timeSelect) showTimePicker(body);
          body.scrollTop = body.scrollHeight;
          const inp = document.getElementById('chat-input');
          const btn = document.querySelector('.send-btn');
      if (inp) inp.style.display = input ? 'block' : 'none';
          if (btn) btn.style.display = input ? 'flex' : 'none';
          if (input && inp) inp.focus();
    }, 800);
}

function addUserMessage(text) {
    const body = document.getElementById('chat-body');
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.innerHTML = '<div class="msg-bubble">' + text + '</div>';
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function showTyping() {
    const body = document.getElementById('chat-body');
    const t = document.createElement('div');
    t.className = 'msg ai'; t.id = 'typing-ind';
    t.innerHTML = '<div class="msg-avatar">S</div><div class="msg-bubble" style="padding:0"><div class="typing"><span></span><span></span><span></span></div></div>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById('typing-ind');
    if (t) t.remove();
}

function handleReply(text) {
    addUserMessage(text);
    const node = flow[state.step];
    state.answers[node.id] = text;
    if (node.id === 'welcome' && text.toLowerCase().includes('price')) {
          setTimeout(() => addAIMessage("Great question! Mattresses start at $150 for twin. Queens are typically $300-$700. You save 50-80% vs retail stores for the same brands. We also have financing with no credit check. Ready to continue?", ["Yes, let's go!"]), 300);
          return;
    }
    state.step++;
    showCurrent();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    const node = flow[state.step];
    state.answers[node.id] = text;
    state.step++;
    showCurrent();
}

function showRecommendation() {
    const a = state.answers;
    let rec = "Based on what you told me";
    if (a.position === 'Side sleeper') rec += ", as a side sleeper, I recommend a medium-to-plush hybrid for shoulder and hip pressure relief";
    else if (a.position === 'Back sleeper') rec += ", back sleepers do best on medium-firm mattresses that support the lower back";
    else if (a.position === 'Stomach sleeper') rec += ", stomach sleepers need firmer support to keep the spine aligned";
    else rec += ", we will match you with a versatile mattress perfect for multiple positions";
    rec += ". In your budget, we have premium options from Malouf, Serta, Sealy, and Southerland that fit perfectly. Let's book your appointment so you can try them!";
    addAIMessage(rec, ["Book my appointment!"]);
    state.step++;
}

function showDatePicker(body) {
    const today = new Date();
    const grid = document.createElement('div');
    grid.className = 'slot-grid';
    for (let i = 0; i < 6; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          const b = document.createElement('button');
          b.className = 'time-slot';
          const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          b.innerHTML = '<strong>' + day + '</strong><br>' + month;
          b.onclick = () => {
                  state.answers.date = d.toISOString().split('T')[0];
                  state.answers.dateDisplay = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                  addUserMessage(state.answers.dateDisplay);
                  state.step++;
                  showCurrent();
          };
          grid.appendChild(b);
    }
    body.appendChild(grid);
}

function showTimePicker(body) {
    const times = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    const grid = document.createElement('div');
    grid.className = 'slot-grid';
    times.forEach(t => {
          const b = document.createElement('button');
          b.className = 'time-slot';
          b.textContent = t;
          b.onclick = () => {
                  state.answers.time = t;
                  addUserMessage(t);
                  state.step++;
                  showCurrent();
          };
          grid.appendChild(b);
    });
    body.appendChild(grid);
}

function showConfirmation() {
    const a = state.answers;
    const body = document.getElementById('chat-body');
    showTyping();
    setTimeout(() => {
          hideTyping();
          const summary = 'Confirmed! You are booked.<br><br><strong>' + a.name + '</strong><br>' + a.phone + '<br>Date: ' + a.dateDisplay + '<br>Time: ' + a.time + '<br>Location: ' + BUSINESS.address + '<br><br>I have notified Trey - you will receive a confirmation call or text shortly. Questions? Call <a href="tel:+18037951194" style="color:#d4a74c;font-weight:700">' + BUSINESS.phone + '</a>';
          const msg = document.createElement('div');
          msg.className = 'msg ai';
          msg.innerHTML = '<div class="msg-avatar">S</div><div class="msg-bubble">' + summary + '</div>';
          body.appendChild(msg);
          body.scrollTop = body.scrollHeight;
          sendBooking(a);
          const inp = document.getElementById('chat-input');
          const btn = document.querySelector('.send-btn');
          if (inp) inp.style.display = 'none';
          if (btn) btn.style.display = 'none';
    }, 900);
}

function sendBooking(a) {
    fetch('https://formsubmit.co/ajax/mbasumter803@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
                  name: a.name,
                  phone: a.phone,
                  appointment_date: a.dateDisplay,
                  appointment_time: a.time,
                  mattress_size: a.size || 'Not specified',
                  sleep_position: a.position || 'Not specified',
                  firmness: a.firmness || 'Not specified',
                  budget: a.budget || 'Not specified',
                  _subject: 'NEW APPOINTMENT: ' + a.name + ' - ' + a.dateDisplay + ' at ' + a.time
          })
    }).catch(e => console.log('notify error', e));
}
