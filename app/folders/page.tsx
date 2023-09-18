import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { type User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaFolder } from "react-icons/fa";
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
  }
};

const FolderPage = async () => {
  const folders = await getFolders();

  // return (
  //   <div className="flex justify-between mt-16">
  //     {/* Main Content */}
  //     <div className="w-3/4">
  //       <div className="flex flex-wrap gap-4 mt-4 items-start justify-start">
  //         {folders ? (
  //           folders.map((folder) => (
  //             <div
  //               key={folder.id}
  //               className="p-2 min-w-[50%] md:min-w-0 md:w-auto"
  //             >
  //               <Link href={`/folders/notes/${folder.id}`}>
  //                 <FaFolder size={32} />
  //                 <div>{folder.name}</div>
  //               </Link>
  //             </div>
  //           ))
  //         ) : (
  //           <div>No folders available</div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="w-1/4">
  //       <FolderSidebar folders={folders} />
  //     </div>
  //   </div>
  // );

  return <FolderPageClient foldersToDisplay={folders} />;
};

export default FolderPage;
