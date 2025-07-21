import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thewriteblog",
  description:
    "A blog about writing, programming, and learning in public. Join me on my journey as I share insights, tutorials, and experiences in software development and creative writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.variable}  min-h-screen flex flex-col antialiased  `}
        >
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
