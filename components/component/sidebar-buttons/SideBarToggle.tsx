"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

type SideBarToggleProps = {
  toggleSidebar: () => void;
  isSideBarOpen: boolean;
  className?: string;
};

const SideBarToggle = ({
  toggleSidebar,
  isSideBarOpen,
}: SideBarToggleProps) => {
  return (
    <div
      className={`z-50 transition-transform duration-300 ${
        isSideBarOpen ? "translate-x-0" : "translate-x-[-10%]"
      }`}
      style={{
        left: isSideBarOpen ? "140px" : "10px",
        top: isSideBarOpen ? "13px" : "10px",
        position: "fixed",
      }}
    >
      <IconButton
        onClick={toggleSidebar}
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
