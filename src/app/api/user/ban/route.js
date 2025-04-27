import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { userId, banned } = await req.json();

  if (!userId || typeof banned !== "boolean") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const buyerExists = await prisma.buyer.findUnique({
      where: { id: userId },
    });

    if (!buyerExists) {
      return NextResponse.json({ message: "Buyer not found" }, { status: 404 });
    }

    await prisma.buyer.update({
      where: { id: userId },
      data: { banned: banned },
    });

    return NextResponse.json({ message: "Buyer ban status updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
