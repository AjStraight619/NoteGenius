import { Box, Flex } from "@radix-ui/themes";
import React from "react";
import "./sidebar.css";

type SidebarProps = {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
};

const Sidebar = ({ children, isSidebarOpen }: SidebarProps) => {
  return (
    <>
      {isSidebarOpen && (
        <Box
          position={"sticky"}
          top={"0"}
          className={`h-screen bg-gray-3 border-r border-gray-200 flex flex-col justify-start p-3 transition ${
            isSidebarOpen ? "w-full md:w-1/4 lg:w-1/5" : "w-0"
          } ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
        >
          <Flex
            direction="column"
            justify={"between"}
            align={"center"}
            className=" flex-grow space-y-2"
            gap={"2"}
          >
            {isSidebarOpen && children}
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
