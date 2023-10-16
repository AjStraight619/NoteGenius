import "@/app/globals.css";
import { Providers } from "@/app/provider";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note Genius",
};

export default function AIPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Theme appearance="dark" grayColor="gray" radius="full">
        <nav className="fixed justify-center flex"></nav>
        {children}
      </Theme>
    </Providers>
  );
}
