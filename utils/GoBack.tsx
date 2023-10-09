"use client";
import React from "react";
import { PinLeftIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <IconButton onClick={handleGoBack}>
      <PinLeftIcon />
    </IconButton>
  );
};

export default GoBack;
