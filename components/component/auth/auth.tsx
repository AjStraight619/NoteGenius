"use client";

import { signIn, signOut } from "next-auth/react";

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





