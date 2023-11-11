"use client";
import { addChat } from "@/actions/actions";
import { ChatWithMessages } from "@/types/otherTypes";
import { Button, Flex, TextFieldInput } from "@radix-ui/themes";
import { useRef } from "react";
import { v4 as uuid } from "uuid";

type AddChatFormProps = {
  onClose: () => void;
  addOptimisticChats: (newChat: ChatWithMessages) => void;
};

export const AddChatForm = ({
  onClose,
  addOptimisticChats,
}: AddChatFormProps) => {
  const chatTitleRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form
        ref={chatTitleRef}
        action={async (formData) => {
          chatTitleRef.current?.reset();
          addOptimisticChats({
            id: uuid(),
            userId: uuid(),
            title: formData.get("title") as string,
            chatMessages: [],
            files: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await addChat(formData);
        }}
      >
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          mt={"4"}
          gap={"5"}
          p={"4"}
        >
          <TextFieldInput
            type="text"
            name="title"
            placeholder="Name this chat"
          />

          <Button onClick={() => onClose()}>Add Chat</Button>
        </Flex>
      </form>
    </>
  );
};
