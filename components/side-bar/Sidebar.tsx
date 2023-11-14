import { Box, Flex, ScrollArea } from "@radix-ui/themes";
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
          position={"relative"}
          top={"0"}
          style={{
            height: "100vh",
            overflowY: "auto",
            maxWidth: "250px",
            width: "20vw",
            minWidth: "150px",
          }}
          className={`bg-gray-1 border-r border-gray-3 py-2 transition shadow overflow-x-hidden flex-shrink-0 absolute overflow-y-auto ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <ScrollArea>
            <Flex
              direction={"column"}
              justify={"between"}
              align={"center"}
              className="space-y-2"
              gap={"2"}
              p={"2"}
            >
              {isSidebarOpen && children}
            </Flex>
          </ScrollArea>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
