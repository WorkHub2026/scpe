import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Somaliland Gov Communication",
  description: "Government Communication Platform for Somaliland",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} font-sans antialiased bg-gray-100`}
      >
        <AuthProvider>{children}</AuthProvider>

        <Analytics />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
