// /api/book.js — Twilio SMS (owner + customer) + Google Apps Script
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

      if (!name || name==='?' || String(name).trim().length < 2 ||
                  !phone || phone==='?' || String(phone).replace(/\D/g,'').length < 10) {
              return res.status(400).json({ ok:false, error:'Please include your name and a valid phone number so we can confirm your appointment.' });
      }

      const sid   = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from  = process.env.TWILIO_FROM_NUMBER;

      // Format customer phone for Twilio (+1XXXXXXXXXX)
      const rawDigits = String(phone).replace(/\D/g,'');
        const customerE164 = rawDigits.length === 10 ? '+1' + rawDigits
                                 : rawDigits.length === 11 && rawDigits[0] === '1' ? '+' + rawDigits
                                 : null;

      let ownerTexted = false, customerTexted = false, twilioRef = null;

      if (sid && token && from) {
              const authHeader = 'Basic ' + Buffer.from(sid + ':' + token).toString('base64');
              const twilioUrl  = 'https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json';

          // 1. Text owner
          const ownerBody = '📲 NEW MBA BOOKING — CALL TO VERIFY\n\n' +
                    (name !== '?' ? name : '(no name)') + '\n' +
                    (phone !== '?' ? phone : '(NO PHONE)') + '\n\n' +
                    'Wants: ' + size + '\nWhen: ' + when + '\nPain: ' + pain + '\nSource: ' + source;

          const ownerParams = new URLSearchParams();
              ownerParams.append('To', OWNER_PHONE);
              ownerParams.append('From', from);
              ownerParams.append('Body', ownerBody);

          const ownerResp = await fetch(twilioUrl, {
                    method: 'POST',
                    headers: { 'Authorization': authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: ownerParams.toString()
          });
              const ownerJson = await ownerResp.json();
              ownerTexted = ownerResp.ok;
              twilioRef   = ownerJson.sid || null;

          // 2. Text customer confirmation
          if (customerE164) {
                    const custBody = 'Hi ' + name + '! Your appointment at Mattress by Appointment is set for ' + when + '.\n\n' +
                                '📍 1809 Hwy 15 S, Sumter SC 29150\n' +
                                '📞 803-795-1194\n\n' +
                                'Please bring:\n' +
                                '• Photo ID\n' +
                                '• Bank info if interested in financing\n' +
                                '• Anyone who will be sleeping on the bed\n\n' +
                                'Tre will text or call to confirm shortly. Need a different time? Reply RESCHEDULE and we will swap it. See you soon! – MBA Sumter';

                const custParams = new URLSearchParams();
                    custParams.append('To', customerE164);
                    custParams.append('From', from);
                    custParams.append('Body', custBody);

                const custResp = await fetch(twilioUrl, {
                            method: 'POST',
                            headers: { 'Authorization': authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: custParams.toString()
                });
                    customerTexted = custResp.ok;
          }
      }

      // 3. Google Apps Script (Calendar + Sheet)
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
                          eventId    = gj.eventId   || null;
                          scheduled  = gj.scheduled || null;
                } catch { gasErr = 'non-json status ' + gr.status; }
        } catch(e) { gasErr = String(e && e.message || e); }

      return res.status(200).json({ ok:true, ownerTexted, customerTexted, ref:twilioRef, calendared, eventId, scheduled, gasErr });

  } catch (err) {
        return res.status(500).json({ ok:false, error:String(err && err.message || err) });
  }
}
