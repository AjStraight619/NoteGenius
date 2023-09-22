"use client";
import { useState } from "react";
import { Folder } from "@prisma/client";
import { Flex, Box } from "@radix-ui/themes";
import { SplitScreenProps } from "@/types/folderTypes";

export default function SplitScreenComponent({
  folders,
  updateFolders,
}: SplitScreenProps) {
  return (
    <Flex className="h-screen">
      {/* Folders */}
      <Box className="w-1/2 p-4">
        {/* Folder rendering logic here using the folders prop */}
      </Box>

      {/* Notes or other content */}
      <Box className="w-1/2 p-4">{/* Content rendering logic here */}</Box>
    </Flex>
  );
}
