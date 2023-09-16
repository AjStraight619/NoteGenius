"use client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const [isClient, setIsClient] = useState(false); // to identify if the component is mounted

  useEffect(() => {
    // code here will only run on the client
    setIsClient(true); // set the flag to true once the component has mounted
  }, []);

  if (!isClient) {
    return null; // or a loading spinner or some initial content
  }

  return <SessionProvider>{children}</SessionProvider>;
};
