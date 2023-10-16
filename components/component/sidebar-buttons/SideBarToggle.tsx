"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

type SideBarToggleProps = {
  setIsSideBarOpen: any;
  isSideBarOpen: boolean;
};

const SideBarToggle = ({
  setIsSideBarOpen,
  isSideBarOpen,
}: SideBarToggleProps) => {
  const toggleSideBar = () => {
    setIsSideBarOpen((prev: any) => !prev);
  };
  return (
    <div
      className={`z-50 transition-transform duration-300 ${
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
  );
};

export default SideBarToggle;
