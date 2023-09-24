import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./provider";
import { Inter } from "next/font/google";

import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Genius",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Providers>
        <body className={inter.className}>
          <Theme appearance="dark" accentColor="blue">
            {children}
          </Theme>
        </body>
      </Providers>
    </html>
  );
}
