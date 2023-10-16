import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import React from "react";
import { FaCog } from "react-icons/fa";

type SidebarProps = {
  children?: React.ReactNode;
  isSideBarOpen: boolean;
  toggleSideBar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  children,
  isSideBarOpen,
  toggleSideBar,
}) => {
  return (
    <>
      <div
        className={`fixed top-4 z-50 transition-transform duration-300 ${
          isSideBarOpen ? "translate-x-0" : "translate-x-[-100%]"
        }`}
        style={{
          left: isSideBarOpen ? "60px" : "36px",
        }}
      >
        <IconButton
          onClick={toggleSideBar}
          size={"2"}
          variant="outline"
          radius="medium"
        >
          <HamburgerMenuIcon width={"20px"} height={"20px"} />
        </IconButton>
      </div>

      <Box
        className={`fixed left-0 top-0 h-full flex flex-col justify-between transition-all ease-in-out duration-300 overflow-hidden  bg-[#2C2F33]  border-r border-gray-300 ${
          isSideBarOpen ? "w-[150px]" : "w-0"
        }`}
      >
        <Flex
          direction="column"
          className="p-4 flex-grow items-center justify-between space-y-8"
        >
          {isSideBarOpen && children}
        </Flex>

        {isSideBarOpen && (
          <IconButton
            mb={"4"}
            style={{ backgroundColor: "transparent" }}
            className="self-center mb-5 bg-[#2C2F33]"
          >
            <FaCog className="w-8 h-8 text-white" />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default Sidebar;
