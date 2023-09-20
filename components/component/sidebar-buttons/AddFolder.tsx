"use client";
import React, { useState } from "react";
import {
  TextArea,
  Button,
  Dialog,
  TextField,
  IconButton,
  Flex,
  Text,
  Badge,
  Container,
} from "@radix-ui/themes";
import { FaFolderPlus } from "react-icons/fa";
import { type Folder } from "@prisma/client";
import { AddFolderProps } from "@/types/folderTypes";

const getColor = (key: string) => {
  switch (key) {
    case "Math":
      return "red";
    case "Reading":
      return "blue";
    case "Science":
      return "green";
    case "Other":
      return "cyan";
    default:
      return "purple"; // Default color for custom tags
  }
};

const AddFolder = ({ folders }: AddFolderProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Math: false,
    Reading: false,
    Science: false,
    Other: false,
  });
  const [newBadgeName, setNewBadgeName] = useState("");

  const toggleSelect = (name: string) => {
    if (name in selected) {
      setSelected((prevSelected) => ({
        ...prevSelected,
        [name]: !prevSelected[name],
      }));
    }
  };

  const addAnotherBadge = () => {
    if (newBadgeName && !(newBadgeName in selected)) {
      setSelected((prevSelected) => ({
        ...prevSelected,
        [newBadgeName]: false,
      }));
      setNewBadgeName("");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          className="hover:bg-gray-700"
          style={{ backgroundColor: "#2C2F33" }}
        >
          <FaFolderPlus
            style={{
              width: "24px",
              height: "24px",
              color: "white",
            }}
          />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title mt="4">New Folder</Dialog.Title>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="4" weight="bold">
              Folder Name
            </Text>
            <TextField.Input placeholder="Enter a Folder Name..." />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Add Tags
            </Text>
            <Flex gap="2" mt="2">
              {Object.keys(selected).map((key) => (
                <Badge
                  className="cursor-pointer"
                  color={selected[key] ? "gray" : getColor(key)}
                  onClick={() => toggleSelect(key)}
                >
                  {key}
                </Badge>
              ))}
            </Flex>
          </label>
          <label>
            <TextField.Input
              placeholder="Create Your Own Tag..."
              value={newBadgeName}
              onChange={(e) => setNewBadgeName(e.target.value)}
            />
            <Button mt="2" size="1" onClick={addAnotherBadge} color="gray">
              Add Custom Tag
            </Button>
          </label>
          <label>
            <Flex justify="center">
              <Button>Create Folder</Button>
            </Flex>
          </label>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddFolder;

//   <Dialog.Root>
//   <Dialog.Trigger>
//     <Button>Edit profile</Button>
//   </Dialog.Trigger>

//   <Dialog.Content style={{ maxWidth: 450 }}>
//     <Dialog.Title>Edit profile</Dialog.Title>
//     <Dialog.Description size="2" mb="4">
//       Make changes to your profile.
//     </Dialog.Description>

//     <Flex direction="column" gap="3">
//       <label>
//         <Text as="div" size="2" mb="1" weight="bold">
//           Name
//         </Text>
//         <TextField.Input
//           defaultValue="Freja Johnsen"
//           placeholder="Enter your full name"
//         />
//       </label>
//       <label>
//         <Text as="div" size="2" mb="1" weight="bold">
//           Email
//         </Text>
//         <TextField.Input
//           defaultValue="freja@example.com"
//           placeholder="Enter your email"
//         />
//       </label>
//     </Flex>

//     <Flex gap="3" mt="4" justify="end">
//       <Dialog.Close>
//         <Button variant="soft" color="gray">
//           Cancel
//         </Button>
//       </Dialog.Close>
//       <Dialog.Close>
//         <Button>Save</Button>
//       </Dialog.Close>
//     </Flex>
//   </Dialog.Content>
// </Dialog.Root>
