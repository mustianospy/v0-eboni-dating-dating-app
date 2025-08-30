export const dynamic = "force-dynamic"

export async function POST(req) { return new Response("Webhook bypassed", { status: 200 }) }
