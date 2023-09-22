"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  TextField,
  IconButton,
  Flex,
  Text,
  Badge,
} from "@radix-ui/themes";
import { FaFolderPlus } from "react-icons/fa";
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
  const [folderName, setFolderName] = useState("");

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

  const checkIsValidName = (name: string) => {
    const existingFolder = folders?.find(
      (folder) => folder.name.toLowerCase() === name.toLowerCase()
    );
    return existingFolder === undefined;
  };

  const handleCreateFolder = async () => {
    // Client-side validation
    if (!checkIsValidName(folderName)) {
      // Show an error message that a folder with the same name already exists
      console.log("Folder name already exists!");
      return;
    }

    // Proceed to hit the API to add the new folder
    try {
      // API call logic here
      // ...
    } catch (error) {
      console.error("An error occurred:", error);
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
                  key={key} // Add this line
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
