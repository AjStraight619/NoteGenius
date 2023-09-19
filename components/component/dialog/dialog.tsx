// "use client";
// import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import { Cross2Icon } from "@radix-ui/react-icons";
// import { TextArea, Button } from "@radix-ui/themes";

// const DialogDemo = () => (
//   <Dialog.Root>
//     <Dialog.Trigger asChild>
//       <Button>Edit profile</Button>
//     </Dialog.Trigger>
//     <Dialog.Portal>
//       <Dialog.Overlay className="bg-gray-700 bg-opacity-90 fixed inset-0" />
//       <Dialog.Content className="bg-[#2C2F33] rounded-md shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] p-6">
//         <Dialog.Title className="m-0 font-semibold text-white text-lg">
//           Edit profile
//         </Dialog.Title>
//         <Dialog.Description className="m-2 mb-5 text-white text-base leading-[1.5]">
//           Make changes to your profile here. Click save when you're done.
//         </Dialog.Description>
//         <fieldset className="flex gap-5 items-center mb-4">
//           <label
//             className="text-base text-white w-24 text-right"
//             htmlFor="name"
//           >
//             Name
//           </label>

//           <TextArea
//             className="w-full flex-1 inline-flex items-center justify-center rounded-sm px-2.5 text-base"
//             id="name"
//             defaultValue="Folder name..."
//           />
//         </fieldset>
//         <fieldset className="flex gap-5 items-center mb-4">
//           <label
//             className="text-base text-white w-24 text-right"
//             htmlFor="username"
//           >
//             Username
//           </label>
//           <TextArea
//             className="w-full flex-1 inline-flex items-center justify-center rounded-sm px-2.5 text-base"
//             id="username"
//             defaultValue="@peduarte"
//           />
//         </fieldset>
//         <div className="flex mt-6 justify-end">
//           <Dialog.Close asChild>
//             <button className="inline-flex items-center justify-center rounded-sm px-4 text-base font-semibold h-9 bg-[#22C55E] text-[#16A34A]">
//               Save changes
//             </button>
//           </Dialog.Close>
//         </div>
//         <Dialog.Close asChild>
//           <button
//             className="absolute top-2.5 right-2.5 rounded-full h-6 w-6 inline-flex items-center justify-center text-[#4C1D95]"
//             aria-label="Close"
//           >
//             <Cross2Icon />
//           </button>
//         </Dialog.Close>
//       </Dialog.Content>
//     </Dialog.Portal>
//   </Dialog.Root>
// );

// export default DialogDemo;
