import { Avatar } from "@radix-ui/themes";
type UserAvatarProps = {
  name: string | null | undefined;
};

export const UserAvatar = ({ name }: UserAvatarProps) => {
  return (
    <Avatar
      radius="small"
      color="cyan"
      fallback={`${name?.charAt(0).toUpperCase()}` || "U"}
    ></Avatar>
  );
};

export const AssistantAvatar = () => {
  return <Avatar radius="small" color="indigo" fallback={"N"}></Avatar>;
};
