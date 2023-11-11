"use client";

import { SymbolIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { ReactNode } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

export const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button className={`${className}`} type="submit" disabled={pending}>
      {pending ? <SymbolIcon className="animate-spin" /> : children}
    </Button>
  );
};
