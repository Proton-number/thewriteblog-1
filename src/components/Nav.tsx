"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Nav() {
  const { isSignedIn } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "About", href: "/About" },
    { label: "Contact", href: "Contact" },
    { label: "Blogs", href: "/Blog" },
  ];

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-3 border-b shadow-sm bg-white">
      <Link href="/" className="text-xl md:text-2xl font-semibold">
        thewriteblog
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map(
          (link) =>
            !(!isSignedIn && link.label === "Blogs") && (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm hover:text-gray-600 transition-colors"
              >
                {link.label}
              </Link>
            )
        )}
        {!isSignedIn && (
          <>
            <Link href="/Login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/Signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
        {isSignedIn && <UserButton />}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            ref={navRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 z-50 flex flex-col gap-6"
          >
            <div className="flex justify-end">
              <X
                onClick={() => setIsMobileOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map(
                (link) =>
                  !(!isSignedIn && link.label === "Blogs") && (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Button variant="link" className="w-full justify-start">
                        {link.label}
                      </Button>
                    </Link>
                  )
              )}

              {!isSignedIn ? (
                <div className="items-center flex flex-col gap-2">
                  <Link href="/Login" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="link" className="w-full justify-start">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/Signup" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="link" className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-4 flex justify-center">
                  <UserButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
