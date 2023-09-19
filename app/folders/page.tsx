import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { type User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import FolderPageClient from "@/components/component/folderpage/FolderPageClient";

const getFolders = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  } else {
    const user = session.user as User;

    if (user && user.id) {
      const userId = user.id;
      const folders = await prisma.folder.findMany({
        where: {
          userId: userId,
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
  // TODO: Fix typing issue
  let folders: any | null = await getFolders();

  return <FolderPageClient foldersToDisplay={folders} />;
};

export default FolderPage;
