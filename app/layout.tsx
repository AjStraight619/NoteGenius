import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextThemeProvider, Providers } from "./provider";

import { Theme } from "@radix-ui/themes";
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
          <NextThemeProvider>
            <Theme appearance="dark" grayColor="gray" radius="full">
              {children}
            </Theme>
          </NextThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
