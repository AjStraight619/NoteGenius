// "use client";

// import { Dialog } from "@radix-ui/themes";
// import { useState } from "react";

// type AddFileDialog = {
//   addOptimisticFiles: (newFile: any) => void;
//   setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
//   isProcessing: boolean;
// };

// export const AddFileDialog = ({
//   addOptimisticFiles,
//   setIsProcessing,
//   isProcessing,
//   handleUploadButtonClick,
// }: any) => {
//   const [open, setOpen] = useState(false);

//   const handleClose = () => {
//     setOpen(false);
//   };
//   return (
//     <Dialog.Root open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger>
//         {/* <IconButton
//           radius="medium"
//           variant="outline"
//           className="left-2 bottom-6 absolute"
//           size={"1"}
//           onClick={handleUploadButtonClick}
//         >
//           <FilePlusIcon />
//         </IconButton> */}
//       </Dialog.Trigger>
//       <Dialog.Content>
//         <Dialog.Description>
//           Select options for creating a new chat.
//         </Dialog.Description>
//         {/* <ConvertFileToText
//           onClose={handleClose}
//           addOptimisticFiles={addOptimisticFiles}
//           setIsProcessing={setIsProcessing}
//           isProcessing={isProcessing}

//         /> */}
//       </Dialog.Content>
//       <Dialog.Close></Dialog.Close>
//     </Dialog.Root>
//   );
// };
