// /api/remind.js — Appointment reminder system for MBA Sumter
// Reads upcoming appointments from Google Sheet via GAS, sends
// 24hr and 1hr reminder texts with a one-tap confirm link.
// Zero impact on GoHighLevel / Sell More Mattresses — outbound only.

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

function toE164(phone) {
    const d = String(phone).replace(/\D/g, '');
    if (d.length === 10) return '+1' + d;
    if (d.length === 11 && d[0] === '1') return '+' + d;
    return null;
  }

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Security: only allow cron or internal calls
    const authHeader = req.headers['authorization'] || '';
    const cronSecret = process.env.CRON_SECRET || 'mba-remind-2024';
    if (authHeader !== `Bearer ${cronSecret}`) {
          return res.status(401).json({ ok: false, error: 'Unauthorized' });
        }

    if (!GAS_URL) return res.status(500).json({ ok: false, error: 'GAS_WEBHOOK_URL not set' });

    try {
          // Fetch upcoming appointments from Google Sheet via GAS
          const gasResp = await fetch(GAS_URL + '?action=getUpcoming', {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
                });
          const gasData = await gasResp.json();

          if (!gasData.ok || !Array.isArray(gasData.appointments)) {
                  return res.status(200).json({ ok: true, sent: 0, note: 'No appointments returned from GAS' });
                }

          const auth = twilioAuth();
          if (!auth) return res.status(500).json({ ok: false, error: 'Twilio env vars missing' });

          const now   = Date.now();
          const HR1   = 60 * 60 * 1000;
          const HR24  = 24 * HR1;
          let sent = 0;

          for (const appt of gasData.appointments) {
                  const { name, phone, when, size, appointmentId, reminderSent24, reminderSent1 } = appt;
                  if (!phone || !when || !appointmentId) continue;

                  const apptTime = new Date(when).getTime();
                  if (isNaN(apptTime)) continue;

                  const diff = apptTime - now;

                  // 24hr window: between 25hr and 23hr from now
                  const need24 = diff > 23 * HR1 && diff < 25 * HR1 && !reminderSent24;
                  // 1hr window: between 80min and 40min from now
                  const need1  = diff > 40 * 60 * 1000 && diff < 80 * 60 * 1000 && !reminderSent1;

                  if (!need24 && !need1) continue;

                  const customerPhone = toE164(phone);
                  if (!customerPhone) continue;

                  const confirmUrl = `https://mbasumter.com/api/confirm?id=${appointmentId}`;
                  const timeLabel  = need24 ? 'tomorrow' : 'in about 1 hour';
                  const custMsg =
                    `Hi ${name}! Reminder: your mattress appointment with Tre is ${timeLabel}.\n` +
                    `📍 1809 Hwy 15 S, Sumter SC\n` +
                    `🕐 ${when}\n\n` +
                    `Tap to confirm your spot:\n${confirmUrl}\n\n` +
                    `Questions? Call/text Tre: 803-795-1194`;

                  const ownerMsg =
                    `⏰ REMINDER SENT — ${need24 ? '24HR' : '1HR'}\n` +
                    `${name} | ${phone}\n` +
                    `Appt: ${when} | ${size || 'size unknown'}`;

                  // Text customer
                  const custOk = await sendSMS(auth, customerPhone, custMsg);
                  // Text owner
                  await sendSMS(auth, OWNER_PHONE, ownerMsg);

                  if (custOk) {
                            // Tell GAS to mark reminder as sent
                            await fetch(GAS_URL, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                                      action: 'markReminder',
                                                      appointmentId,
                                                      type: need24 ? '24hr' : '1hr'
                                                    })
                                      });
                            sent++;
                          }
                }

          return res.status(200).json({ ok: true, sent, checked: gasData.appointments.length });

        } catch (err) {
          return res.status(500).json({ ok: false, error: String(err?.message || err) });
        }
  }
