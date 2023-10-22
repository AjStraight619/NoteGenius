// import { UIFile } from "@/types/otherTypes";
// import { useState } from "react";

// const useLinks = () => {
//   const [files, setFiles] = useState<UIFile[]>([]);

//   const addFileToChat = async (chatId: string, fileId: string) => {
//     const res = await fetch("api/links", {
//       method: "POST",
//       body: JSON.stringify({ chatId, fileId }),
//     });
//     const updatedFile = await res.json();

//     setFiles([...files, updatedFile]);
//   };

//   const removeFileFromChat = async (fileId: string) => {
//     files = await fetch("api/links", {
//       method: "DELETE",
//       body: JSON.stringify({ fileId }),
//     });
//     setFiles(files.filter((file) => file.id !== fileId));
//   };

//   const moveFileToAnotherChat = async (
//     oldChatId: string,
//     newChatId: string,
//     fileId: string
//   ) => {
//     const updatedFile = await setFiles(
//       files.map((file) => (file.id === fileId ? updatedFile : file))
//     );
//   };

//   return {
//     files,
//     addFileToChat,
//     removeFileFromChat,
//     moveFileToAnotherChat,
//   };
// };

// export default useLinks;
