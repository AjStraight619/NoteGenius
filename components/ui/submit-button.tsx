"use client";

import { SymbolIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
  color?: string; // new prop for color
};

export const SubmitButton = ({
  children,
  className,
  color,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button className={`${className}`} type="submit" disabled={pending}>
      {pending ? <SymbolIcon className="animate-spin" /> : children}
    </Button>
  );
};
