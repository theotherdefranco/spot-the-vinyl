import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Spot the Vinyl",
  description: "Spot the Vinyl",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={"${inter.variable}"}>
          <TopNav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
