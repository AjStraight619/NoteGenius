"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import * as Form from "@radix-ui/react-form";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        signIn(undefined, { callbackUrl: "http://localhost:3000/" });
      }
    } catch (error: any) {
      setError(error?.message);
      alert("Your password is too short");
      console.log(error);
    }
  };

  return (
    <Form.Root onSubmit={onSubmit} className="space-y-4 w-full sm:w-[400px]">
      <Form.Field name="email" className="flex flex-col">
        <Form.Label className="FormLabel">Name</Form.Label>
        <Form.Control asChild>
          <TextFieldInput
            className="Input"
            type="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Enter your name..."
          />
        </Form.Control>
      </Form.Field>
      <Form.Field name="email" className="flex flex-col">
        <Form.Label className="FormLabel">Email</Form.Label>
        <Form.Control asChild>
          <TextFieldInput
            className="Input"
            type="email"
            required
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="Enter your email..."
          />
        </Form.Control>
        <Form.Message match="valueMissing">
          Please enter your email
        </Form.Message>
        <Form.Message match="typeMismatch">
          Please provide a valid email
        </Form.Message>
      </Form.Field>

      <Form.Field name="password" className="flex flex-col">
        <Form.Label className="FormLabel">Password</Form.Label>
        <Form.Control asChild>
          <TextFieldInput
            className="Input"
            type="password"
            required
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Create a password..."
          />
        </Form.Control>
        <Form.Message match="valueMissing">
          Please enter a password
        </Form.Message>
        {error && <div>{error}</div>}
      </Form.Field>
      <Form.Submit asChild>
        <Button>Sign up</Button>
      </Form.Submit>
    </Form.Root>
  );
};
