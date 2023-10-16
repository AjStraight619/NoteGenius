"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children, session }: any) => {
  return (
    <SessionProvider session={session} basePath="/api/auth">
      {children}
    </SessionProvider>
  );
};

export const NextThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
