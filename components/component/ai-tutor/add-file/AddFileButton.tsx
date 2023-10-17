"use client";

import { FilePlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export default function AddFileButton() {
  return (
    <IconButton
      radius="medium"
      variant="outline"
      className="left-2 bottom-6 absolute"
      size={"1"}
      //   onClick={handleUploadButtonClick}
    >
      <FilePlusIcon />
    </IconButton>
  );
}
