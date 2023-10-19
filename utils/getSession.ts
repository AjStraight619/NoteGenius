import { type User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "./authOptions";

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/register");
  }

  const user = session.user as User;
  const userId = user.id;

  if (user && user.id) {
    return userId;
  } else {
    return NextResponse.json({
      error:
        "Something else went wrong, try to reload the page, or log out and log back in.",
    });
  }
};
