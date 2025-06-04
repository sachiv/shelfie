import Navbar from "@/_ui/components/navbar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloWrapper from "./ApolloWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelfie",
  description: "One stop shop for all things books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ApolloWrapper>
            <Navbar />
            <main className="pt-16 xs:pt-20 sm:pt-24 container mx-auto min-h-svh flex flex-col items-stretch">
              {children}
            </main>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
