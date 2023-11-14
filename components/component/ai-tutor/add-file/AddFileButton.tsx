import { PaperClipIcon } from "@heroicons/react/24/solid";
import { IconButton, Tooltip } from "@radix-ui/themes";

type AddFileButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function AddFileButton({
  onClick,
  className,
}: AddFileButtonProps) {
  return (
    <Tooltip content="Add file">
      <IconButton
        radius="medium"
        variant="ghost"
        className={`${className} hover:cursor-pointer`}
        size={"1"}
        onClick={onClick}
      >
        <PaperClipIcon className="h-6 w-6" />
      </IconButton>
    </Tooltip>
  );
}
