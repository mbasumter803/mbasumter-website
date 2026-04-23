// /api/book.js - Vercel serverless function
// Receives booking POSTs from site chat -> texts Trey via Twilio + fires Google Apps Script
// (Calendar event + customer log spreadsheet).
//
// Required env vars in Vercel:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER
//   GAS_WEBHOOK_URL    - Google Apps Script Web App /exec URL

const OWNER_PHONE = '+18039685749';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const { name='?', phone='?', when='?', size='?', pain='?', source='website' } = req.body || {};

    // --- 1. Text Trey via Twilio ---
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_FROM_NUMBER;
    let ownerTexted = false;
    let twilioRef = null;
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

    // --- 2. Fire Google Apps Script (calendar + sheet log) ---
    let calendared = false;
    let eventId = null;
    let scheduled = null;
    const gas = process.env.GAS_WEBHOOK_URL;
    if (gas) {
      try {
        const gr = await fetch(gas, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, when, size, pain, source }),
          redirect: 'follow'
        });
        const gj = await gr.json();
        calendared = !!gj.ok;
        eventId = gj.eventId || null;
        scheduled = gj.scheduled || null;
      } catch(e) { /* non-fatal */ }
    }

    return res.status(200).json({ ok:true, ownerTexted, ref:twilioRef, calendared, eventId, scheduled });
  } catch (err) {
    return res.status(500).json({ ok:false, error:String(err && err.message || err) });
  }
}
