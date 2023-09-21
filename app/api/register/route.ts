import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  const hashed = await hash(password, 12);

  const alreadyUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!alreadyUser) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
      },
    });
  } else {
    return NextResponse.json({
      error: "This user is already associated with an account",
    });
  }
}
