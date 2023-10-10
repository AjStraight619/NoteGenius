import FolderPageClient from "@/components/component/folderpage/FolderPageClient";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { Folder, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const getFolders = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  } else {
    const user = session.user as User;

    if (user && user.id) {
      const userId = user.id;
      const folders = await prisma.folder.findMany({
        where: {
          userId: userId,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return folders;
    }
    return null;
  }
};

// Next.js page component responsible for initially fetching the folder data server-side
// and passing it down to client-side components for further interactivity and state management.
const FolderPage = async () => {
  let folders: Folder[] | null = await getFolders();
  return <FolderPageClient foldersToDisplay={folders} />;
};

export default FolderPage;
