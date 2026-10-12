import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReduxProvider } from "./StoreProvider";
import "../styles/globals.css";
import { cn } from "@/utils/cn";
import { Ubuntu } from "next/font/google";

import Link from "next/link";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Roomy",
  description: "Roomy",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [{ name: "Roomy Team" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "/icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={cn("bg-magnolia", ubuntu.className)}>
        <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b bg-white dark:bg-gray-950">
          <Link className="flex items-center gap-2" href="/homepage">
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">Roomy</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9">
                <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
                <AvatarFallback>JP</AvatarFallback>
                <span className="sr-only">Toggle user menu</span>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={"/profile"}>
                <DropdownMenuItem>My Account</DropdownMenuItem>
              </Link>
              <Link href={"/my-listings"}>
                <DropdownMenuItem> My Listings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <ReduxProvider><Suspense fallback={<p>Loading...</p>}>{children}</Suspense></ReduxProvider>
      </body>
    </html>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
