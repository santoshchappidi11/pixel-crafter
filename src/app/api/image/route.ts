import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 }
    );
  }

  const { prompt, model = "flux" } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return NextResponse.json({ error: "No user found" }, { status: 401 });

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?model=${model}&seed=${randomSeed}&width=512&height=512&nologo=True`;

  await fetch(imageURL);

  await prisma.post.create({
    data: {
      userId: user.id,
      prompt: prompt,
      url: imageURL,
      seed: randomSeed,
    },
  });

  return NextResponse.json({ url: imageURL });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return NextResponse.json({ error: "No user found!" }, { status: 401 });

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

// DELETE----> Delete a single post or all posts
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 }
    );
  }

  const { postId, deleteAll } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found!" }, { status: 401 });
  }

  try {
    // Check if deleteAll is true
    if (deleteAll) {
      await prisma.post.deleteMany({
        where: {
          userId: user.id,
        },
      });
      return NextResponse.json({ message: "Deleted successfully!" });
    }

    // Otherwise, delete a single post
    if (!postId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
