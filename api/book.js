// /api/book.js - Vercel serverless function
// Receives booking POSTs from site chat -> texts Trey via Twilio + fires Google Apps Script
// (Calendar event + customer log spreadsheet).

const OWNER_PHONE = '+18039685749';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const { name='?', phone='?', when='?', size='?', pain='?', source='website' } = req.body || {};

    // --- 1. Twilio SMS ---
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

    // --- 2. Google Apps Script (Calendar + Sheet) ---
    // Apps Script /exec redirects to googleusercontent.com. We must follow manually, 302.
    let calendared = false;
    let eventId = null;
    let scheduled = null;
    let gasErr = null;
    const gas = process.env.GAS_WEBHOOK_URL;
    if (gas) {
      try {
        const payload = JSON.stringify({ name, phone, when, size, pain, source });
        // First call: usually returns 302 to googleusercontent
        let gr = await fetch(gas, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          redirect: 'manual'
        });
        // Follow redirects manually (up to 3 hops) while preserving method+body
        let hops = 0;
        while ((gr.status === 301 || gr.status === 302 || gr.status === 303 || gr.status === 307) && hops < 3) {
          const loc = gr.headers.get('location');
          if (!loc) break;
          gr = await fetch(loc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            redirect: 'manual'
          });
          hops++;
        }
        const txt = await gr.text();
        try {
          const gj = JSON.parse(txt);
          calendared = !!gj.ok;
          eventId = gj.eventId || null;
          scheduled = gj.scheduled || null;
          if (!gj.ok) gasErr = gj.error || 'gas not ok';
        } catch(pe) {
          gasErr = 'gas non-json: ' + txt.substring(0, 200);
        }
      } catch(e) { gasErr = String(e && e.message || e); }
    } else {
      gasErr = 'no GAS_WEBHOOK_URL';
    }

    return res.status(200).json({ ok:true, ownerTexted, ref:twilioRef, calendared, eventId, scheduled, gasErr });
  } catch (err) {
    return res.status(500).json({ ok:false, error:String(err && err.message || err) });
  }
}
