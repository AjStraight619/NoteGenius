import { getServerSession } from "next-auth";
import { User } from "./user";
import { authOptions } from "@/utils/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        Client Session: <User />
        Server Session: <pre>{JSON.stringify(session)}</pre>
      </div>
    </main>
  );
}
