// /api/confirm.js — One-tap appointment confirmation
// Customer taps the link in their reminder text, this marks
// their appointment confirmed in Google Sheet and texts Tre.
// No webhook needed, no conflict with GoHighLevel.

const OWNER_PHONE = '+18039685749';
const GAS_URL     = process.env.GAS_WEBHOOK_URL;

function twilioAuth() {
    const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM_NUMBER;
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

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send(confirmPage('error', 'Missing appointment ID.'));
  }

  if (!GAS_URL) {
    return res.status(500).send(confirmPage('error', 'System error. Please call Tre: 803-795-1194'));
  }

  try {
    // Tell GAS to mark this appointment as confirmed
    const gasResp = await fetch(GAS_URL, {
      method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'confirmAppointment', appointmentId: id })
                });

    const gasData = await gasResp.json();

    if (!gasData.ok) {
      return res.status(200).send(confirmPage('already', gasData.message || 'Already confirmed or not found.'));
}

    const { name, when, phone } = gasData;

    // Text Tre that customer confirmed
    const auth = twilioAuth();
    if (auth) {
      await sendSMS(auth, OWNER_PHONE,
        `CONFIRMED by customer tap link\n` +
        `${name || 'Customer'} confirmed for ${when || 'their appointment'}\n` +
        `Phone: ${phone || 'unknown'}`);
}

    return res.status(200).send(confirmPage('success',
      `You're confirmed, ${name || 'friend'}!`,
      when
    ));

} catch (err) {
    return res.status(500).send(confirmPage('error', 'Something went wrong. Call Tre: 803-795-1194'));
}
}

function confirmPage(status, message, when) {
  const isSuccess = status === 'success';
  const isAlready = status === 'already';
  const emoji = isSuccess ? '' : isAlready ? '' : '';
  const bg    = isSuccess ? '#0a0e27' : '#0a0e27';
  const accent = '#d4a017';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed | Mattress By Appointment Sumter</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #0a0e27;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
}
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(212,160,23,0.3);
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 420px;
      width: 100%;
}
    .emoji { font-size: 64px; margin-bottom: 16px; }
    h1 { color: #d4a017; font-size: 28px; margin-bottom: 12px; }
    p  { color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
    .when { color: #d4a017; font-weight: bold; font-size: 18px; margin: 16px 0; }
    .cta {
      display: inline-block;
      background: #d4a017;
      color: #0a0e27;
      font-weight: bold;
      padding: 14px 28px;
      border-radius: 50px;
      text-decoration: none;
      font-size: 16px;
      margin-top: 8px;
}
    .sub { font-size: 14px; color: rgba(255,255,255,0.5); margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <h1>${isSuccess ? "You're All Set!" : isAlready ? 'Already Confirmed' : 'Something went wrong'}</h1>
    <p>${message}</p>
    ${when ? `<div class="when">${when}</div>` : ''}
    ${isSuccess || isAlready ? `
    <p>Tre will be ready for you at:<br><strong>1809 Hwy 15 South, Sumter SC</strong></p>
    <a href="tel:8037951194" class="cta"> Call Tre — 803-795-1194</a>
    ` : `<a href="tel:8037951194" class="cta"> Call Tre — 803-795-1194</a>`}
    <p class="sub">Mattress By Appointment &mdash; Proudly Serving Sumter Since 2021</p>
  </div>
</body>
</html>`;
}
