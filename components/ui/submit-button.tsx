"use client";

import { SymbolIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { ReactNode } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <SymbolIcon className="animate-spin" /> : children}
    </Button>
  );
};
