import { FilePlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

type AddFileButtonProps = {
  onClick: () => void;
};

export default function AddFileButton({ onClick }: AddFileButtonProps) {
  return (
    <IconButton
      radius="medium"
      variant="outline"
      className="left-2 bottom-6 absolute"
      size={"1"}
      onClick={onClick}
    >
      <FilePlusIcon />
    </IconButton>
  );
}
