import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function verifyPaystackSignature(secret: string, payload: string, signatureHeader: string | null) {
  if (!signatureHeader) return false;
  const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
  return hash === signatureHeader;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) return NextResponse.json({ error: "Missing PAYSTACK_SECRET_KEY" }, { status: 500 });

  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const isValid = verifyPaystackSignature(secretKey, bodyText, signature);
  if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  let event: Record<string, any>;
  try { event = JSON.parse(bodyText); } 
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  switch (event.event) {
    case "charge.success": console.log("💰 Payment success:", event.data.reference); break;
    case "charge.failed": console.log("❌ Payment failed:", event.data.reference); break;
    default: console.log("ℹ️ Unhandled event:", event.event); break;
  }

  return new NextResponse("OK", { status: 200 });
}
