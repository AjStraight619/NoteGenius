"use client";

import { SessionProvider } from "next-auth/react";

// type Props = {
//   children?: React.ReactNode;
//   sessions?: SessionProvider;
// };

export const Providers = ({ children, session }: any) => {
  return (
    <SessionProvider session={session} basePath="/api/auth">
      {children}
    </SessionProvider>
  );
};
