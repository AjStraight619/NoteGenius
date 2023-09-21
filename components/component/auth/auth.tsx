"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogInButton = () => {
  return (
    <span
      className="mx-2 p-2 text-2xl font-bold cursor-pointer hover:bg-gray-800"
      onClick={() => signIn()}
    >
      Log In
    </span>
  );
};

export const LogOutButton = () => {
  return (
    <span
      className="mx-2 p-2 text-2xl font-bold cursor-pointer hover:bg-gray-800"
      onClick={() => signOut()}
    >
      Log Out
    </span>
  );
};

export const RegisterButton = () => {
  const router = useRouter();
  return (
    <span
      className="mx-2 p-2 text-2xl font-bold cursor-pointer hover:bg-gray-800"
      onClick={() => router.push("/register")}
    >
      Sign Up
    </span>
  );
};
