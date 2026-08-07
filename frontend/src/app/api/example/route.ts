import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const examples = await prisma.example.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(examples);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch examples" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const newExample = await prisma.example.create({
      data: { message },
    });

    return NextResponse.json(newExample, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create example" },
      { status: 500 }
    );
  }
}
