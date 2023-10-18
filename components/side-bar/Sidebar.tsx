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
          style={{
            height: "100vh",
            overflowY: "auto",
            maxWidth: "175px",
            width: "15vw",
          }}
          className={`bg-gray-1 border-r border-gray-200 p-3 transition ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Flex
            direction="column"
            justify={"between"}
            align={"center"}
            className="space-y-2"
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
