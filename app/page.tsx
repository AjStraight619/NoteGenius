import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Note Genius</div>
          <div>
            <Link href="/folders">
              <span className="mx-2 p-2 text-2xl font-bold">Folders</span>
            </Link>
            <Link href="/chat">
              <span className="mx-2 p-2 text-2xl font-bold">Chat</span>
            </Link>
            {session ? (
              <>
                <span className="mx-2 text-2xl font-bold">
                  {session?.user?.name}
                </span>
                <Link href="/logout">
                  <span className="mx-2 p-2 bg-red-500 text-white rounded inline-block text-2xl font-bold">
                    Logout
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="mx-2 p-2 bg-red-500 text-white rounded inline-block text-2xl font-bold">
                    Sign In
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>{JSON.stringify(session)}</div>
      </main>
    </div>
  );
}
