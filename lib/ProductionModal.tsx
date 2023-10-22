"use client";
import { Box, Button, Dialog, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";

const ProductionModal = () => {
  const [open, setOpen] = useState(false);
  const handleDialogClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setOpen(true);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Flex direction={"column"} gap={"2"}>
          <Dialog.Title>System Updates</Dialog.Title>
          <Dialog.Description>
            This application is in development. I am actively deploying updates
            to enhance user experience. Some of the functionality of the
            application may be limited.
          </Dialog.Description>
          <Dialog.Close>
            <Box className="flex justify-end">
              <Button onClick={() => handleDialogClose}>Close</Button>
            </Box>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProductionModal;
