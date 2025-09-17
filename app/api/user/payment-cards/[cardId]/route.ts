import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { cardId: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  // Example: Fetch a card if needed
  // const card = await prisma.paymentCard.findUnique({ where: { id: params.cardId } });

  return NextResponse.json({
    message: "Card endpoint hit",
    cardId: params.cardId,
  });
}
