import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export interface PaystackPaymentData {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  plan?: string;
  metadata?: Record<string, any>;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializePaystackPayment(
  data: PaystackPaymentData
): Promise<PaystackResponse> {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Paystack API error: ${response.statusText}`);
  }

  return response.json();
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Paystack verification error: ${response.statusText}`);
  }

  return response.json();
}

export function verifyPaystackWebhook(payload: string, signature: string): boolean {
  const computedSignature = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest("hex");

  return computedSignature === signature;
}
