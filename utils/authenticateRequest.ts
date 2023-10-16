import { authOptions } from "@/utils/authOptions";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function authenticateRequest(
  req: NextRequest
): Promise<User | null> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  } else {
    const user = session.user as User;
    return user && user.id ? user : null;
  }
}
