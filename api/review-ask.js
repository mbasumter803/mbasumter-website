// /api/review-ask.js — Post-visit review request automation for MBA Sumter
// Fires hourly via Vercel cron. Reads appointments from Google Sheet
// that ended 1.5-3 hours ago and haven't received a review ask yet.
// Sends a personalized SMS with the Google review link.
// Outbound only — zero impact on GoHighLevel / Sell More Mattresses.

const OWNER_PHONE   = '+18039685749';
const GAS_URL       = process.env.GAS_WEBHOOK_URL;
const REVIEW_URL    = 'https://g.page/r/5454551619852600338/review';

function twilioAuth() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return null;
  return {
    sid, token, from,
    url: `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    header: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64')
  };
}

async function sendSMS(auth, to, body) {
  const params = new URLSearchParams();
  params.append('To',   to);
  params.append('From', auth.from);
  params.append('Body', body);
  const r = await fetch(auth.url, {
    method: 'POST',
    headers: { 'Authorization': auth.header, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  return r.ok;
}

function toE164(phone) {
  const d = String(phone).replace(/\D/g, '');
  if (d.length === 10) return '+1' + d;
  if (d.length === 11 && d[0] === '1') return '+' + d;
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Security: only allow cron calls
  const authHeader  = req.headers['authorization'] || '';
  const cronSecret  = process.env.CRON_SECRET || 'mba-remind-2024';
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  if (!GAS_URL) return res.status(500).json({ ok: false, error: 'GAS_WEBHOOK_URL not set' });

  try {
    // Fetch all recent appointments from GAS
    const gasResp = await fetch(GAS_URL + '?action=getReviewCandidates');
    const gasData = await gasResp.json();

    if (!gasData.ok || !Array.isArray(gasData.appointments)) {
      return res.status(200).json({ ok: true, sent: 0, note: 'No candidates returned' });
    }

    const auth = twilioAuth();
    if (!auth) return res.status(500).json({ ok: false, error: 'Twilio env vars missing' });

    const now      = Date.now();
    const MIN90    = 90  * 60 * 1000;   // 1.5 hours
    const MIN180   = 180 * 60 * 1000;   // 3 hours
    let sent = 0;

    for (const appt of gasData.appointments) {
      const { name, phone, when, appointmentId, reviewAskSent } = appt;
      if (!phone || !when || !appointmentId || reviewAskSent) continue;

      const apptEnd = new Date(when).getTime() + 45 * 60 * 1000; // appt + 45 min
      const diff    = now - apptEnd;

      // Send review ask between 1.5h and 3h after appointment ended
      if (diff < MIN90 || diff > MIN180) continue;

      const customerPhone = toE164(phone);
      if (!customerPhone) continue;

      const firstName = (name || 'friend').split(' ')[0];
      const custMsg =
        `Hi ${firstName}! Thanks for visiting Mattress By Appointment today. \n\n` +
        `Hope you love your new mattress! \n\n` +
        `If you have 30 seconds, a Google review would mean the world to Tre and helps other Sumter families find us:\n` +
        `${REVIEW_URL}\n\n` +
        `Questions? Call/text Tre anytime: 803-795-1194\n` +
        `– MBA Sumter`;

      const ok = await sendSMS(auth, customerPhone, custMsg);

      if (ok) {
        // Mark review ask sent in sheet
        await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'markReviewAsk', appointmentId })
        }).catch(() => {});
        sent++;
      }
    }

    return res.status(200).json({ ok: true, sent, checked: gasData.appointments.length });

  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
