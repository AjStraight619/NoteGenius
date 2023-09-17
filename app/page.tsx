import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { signIn, signOut } from "next-auth/react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{JSON.stringify(session)}</div>
    </main>
  );
}
