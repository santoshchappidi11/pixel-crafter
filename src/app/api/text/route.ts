import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        error: "You are Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found!" }, { status: 401 });
  }

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }
  const randomSeed = generateRandomNumber();

  const { prompt } = await request.json();

  // Updated prompt for brevity and clarity
  const userPrompt = `Enhance the following prompt into a concise description for generating an image: "${prompt}". Please limit the response to just a few lines.`;
  const model = "openai"; // or "mistral"
  const seed = randomSeed; // for random text generation everytime user requests
  const json = true; // set to true for JSON response
  const system = "Provide a short, creative description."; // Example system prompt

  // URL-encode parameters
  const encodedPrompt = encodeURIComponent(userPrompt);
  const encodedSystem = encodeURIComponent(system);

  const promptURL = `https://text.pollinations.ai/${encodedPrompt}?model=${model}&seed=${seed}&json=${json}&system=${encodedSystem}`;

  const response = await fetch(promptURL);
  if (!response.ok) {
    const errorMessage = await response.text(); // Log the exact error from the API
    console.error("API Error:", errorMessage);
    return NextResponse.json(
      { error: `API error: ${errorMessage}` },
      { status: 500 }
    );
  }

  const generatedText = await response.text();
  return NextResponse.json({ text: generatedText });
}
