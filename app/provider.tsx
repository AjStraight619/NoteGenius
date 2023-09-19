"use client";

import { SessionProvider } from "next-auth/react";

export const Providers = ({ children, session }: any) => {
  return (
    <SessionProvider session={session} basePath="/api/auth">
      {children}
    </SessionProvider>
  );
};
