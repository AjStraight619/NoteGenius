"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { Card, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "./_action";

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  const [error, setError] = useState<string>("");

  async function handleSubmit(data: FormData) {
    const { error } = await resetPassword(params.token, data);
    setError(error || "");
  }

  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <Card className="gap-4 flex flex-col">
        <Flex gap="4" direction="column" asChild>
          <form action={handleSubmit}>
            <h1 className="text-2xl font-light">Choose a new password</h1>
            <p>You can reset your password here.</p>
            <TextField
              name="password"
              type="password"
              size="3"
              placeholder="Password"
            />
            <TextField
              name="confirm"
              type="password"
              size="3"
              placeholder="Confirm password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <SubmitButton>Reset Password</SubmitButton>
            <Link
              href="/"
              className="text-sm text-neutral-700/80 flex items-center"
            >
              <CaretLeftIcon />
              <span>Return to Login</span>
            </Link>
          </form>
        </Flex>
      </Card>
    </main>
  );
}
