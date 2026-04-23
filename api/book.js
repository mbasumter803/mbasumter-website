// /api/book.js
// Twilio SMS + Google Apps Script (Calendar + Sheet log)

const OWNER_PHONE = '+18039685749';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwp7Z52-hIHS4ueGkSvukwqNglsc0zpin2X1QsH9v7WR_6WEir8uxW1WFFZt7Hxt2tgfw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const { name='?', phone='?', when='?', size='?', pain='?', source='website' } = req.body || {};

    // 1. Twilio SMS to owner
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_FROM_NUMBER;
    let ownerTexted = false, twilioRef = null;
    if (sid && token && from) {
      const body = 'NEW MBA BOOKING\nName: ' + name + '\nPhone: ' + phone + '\nWhen: ' + when + '\nSize: ' + size + '\nPain: ' + pain + '\nSource: ' + source;
      const params = new URLSearchParams();
      params.append('To', OWNER_PHONE);
      params.append('From', from);
      params.append('Body', body);
      const auth = Buffer.from(sid + ':' + token).toString('base64');
      const r = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json', {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      const j = await r.json();
      ownerTexted = r.ok;
      twilioRef = j.sid || null;
    }

    // 2. Google Apps Script (Calendar event + customer log)
    let calendared = false, eventId = null, scheduled = null, gasErr = null;
    try {
      const gr = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, when, size, pain, source })
      });
      const txt = await gr.text();
      try {
        const gj = JSON.parse(txt);
        calendared = !!gj.ok;
        eventId = gj.eventId || null;
        scheduled = gj.scheduled || null;
      } catch { gasErr = 'non-json status ' + gr.status; }
    } catch(e) { gasErr = String(e && e.message || e); }

    return res.status(200).json({ ok:true, ownerTexted, ref:twilioRef, calendared, eventId, scheduled, gasErr });
  } catch (err) {
    return res.status(500).json({ ok:false, error:String(err && err.message || err) });
  }
}
