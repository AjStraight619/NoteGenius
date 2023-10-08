"use client";
import React from "react";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

const SplitScreenButton = ({ isSplitScreen, toggleSplitScreen }: any) => {
  return (
    <div>
      <IconButton
        style={{ backgroundColor: "transparent" }}
        className="appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px]"
        onClick={toggleSplitScreen}
      >
        <ViewVerticalIcon
          style={{ width: "32px", height: "32px", color: "white" }}
        />
      </IconButton>
    </div>
  );
};

export default SplitScreenButton;
