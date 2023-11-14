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
  className,
}: SideBarToggleProps) => {
  return (
    <div className={`z-50  ${className}`}>
      <IconButton
        onClick={toggleSidebar}
        size={"2"}
        variant="outline"
        radius="medium"
        className="hover:cursor-pointer"
      >
        <HamburgerMenuIcon width={"20px"} height={"20px"} />
      </IconButton>
    </div>
  );
};

export default SideBarToggle;
