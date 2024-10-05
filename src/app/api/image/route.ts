import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt } = await request.json();

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&nologo=True`;

  await fetch(imageURL);

  return NextResponse.json({ url: imageURL });
}
