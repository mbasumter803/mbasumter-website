// /api/book.js - Vercel serverless function
// Receives booking POSTs from the site chat widget and texts Trey via Twilio.
// Required environment variables (set in Vercel Project Settings):
//   TWILIO_ACCOUNT_SID    - starts with AC...
//   TWILIO_AUTH_TOKEN     - Twilio auth token
//   TWILIO_FROM_NUMBER    - a Twilio-owned number in +1XXXXXXXXXX format
//
// Destination is hardcoded to 803-795-1194 (Trey Google Voice, will forward to his cell).

const OWNER_PHONE = "+18037951194";
const BUSINESS_NAME = "Mattress by Appointment of Sumter";

async function sendTwilioSms(to, body){
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if(!sid || !token || !from){
    console.error("[book] Missing Twilio env vars");
    return { ok:false, reason:"missing-env" };
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams();
  params.append("To", to);
  params.append("From", from);
  params.append("Body", body);
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const data = await res.json();
    if(!res.ok){
      console.error("[book] Twilio error", res.status, data);
      return { ok:false, reason:"twilio-error", status:res.status, detail:data };
    }
    return { ok:true, sid:data.sid };
  } catch(err){
    console.error("[book] fetch error", err);
    return { ok:false, reason:"fetch-error" };
  }
}

function normalizeToE164(raw){
  if(!raw) return null;
  const d = String(raw).replace(/\D/g, "");
  if(d.length === 10) return "+1" + d;
  if(d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

function formatOwnerMessage(b){
  const lines = [
    "New appointment booked via website:",
    "",
    `Name: ${b.name || "(not given)"}`,
    `Phone: ${b.phone || "(not given)"}`,
    `When: ${b.when || "(not given)"}`
  ];
  if(b.size) lines.push(`Size: ${b.size}`);
  if(b.pain) lines.push(`Focus: ${b.pain}`);
  lines.push("");
  lines.push("Source: " + (b.source || "website-chat"));
  return lines.join("\n");
}

function formatCustomerMessage(b){
  return [
    `Hi ${b.name || "there"}, this is ${BUSINESS_NAME}.`,
    ``,
    `Your appointment request is in - we have you down for ${b.when || "soon"}. Trey will text shortly to confirm.`,
    ``,
    `1809 Hwy 15 South, Sumter SC 29150`,
    `Questions? Reply here or call 803-795-1194.`
  ].join("\n");
}

export default async function handler(req, res){
  // CORS + preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if(req.method === "OPTIONS"){ res.status(200).end(); return; }
  if(req.method !== "POST"){ res.status(405).json({ok:false,error:"method"}); return; }

  let body = req.body;
  if(typeof body === "string"){ try{ body = JSON.parse(body); }catch(e){ body = {}; } }
  body = body || {};

  // Basic sanity/safety: required fields
  if(!body.name && !body.phone && !body.when){
    res.status(400).json({ok:false,error:"missing-fields"});
    return;
  }

  // Log for Vercel Observability (analytics cron will read these)
  console.log("[book] new booking", JSON.stringify({
    name: body.name || null,
    phone: body.phone || null,
    when: body.when || null,
    size: body.size || null,
    pain: body.pain || null,
    source: body.source || "website-chat",
    ts: new Date().toISOString()
  }));

  // Fire the owner text (primary goal). Never block success on customer text.
  const ownerMsg = formatOwnerMessage(body);
  const ownerResult = await sendTwilioSms(OWNER_PHONE, ownerMsg);

  // Optional customer confirmation (best effort, does not affect response)
  const custPhone = normalizeToE164(body.phone);
  if(custPhone && custPhone !== OWNER_PHONE){
    sendTwilioSms(custPhone, formatCustomerMessage(body)).catch(err => console.error("[book] customer text failed", err));
  }

  // Always return 200 to the chat widget so the customer never sees an error,
  // but include ownerResult so we can see in logs if Twilio failed.
  res.status(200).json({ ok:true, ownerTexted: ownerResult.ok, ref: ownerResult.sid || null });
}
