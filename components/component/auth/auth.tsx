"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const LogInButton = () => {
  return <button onClick={() => signIn()}>Log In</button>;
};

export const LogOutButton = () => {
  console.log("Log Out");
  return <button onClick={() => signOut()}>Log Out</button>;
};
