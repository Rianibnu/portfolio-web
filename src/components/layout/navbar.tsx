"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/projects", label: "Proyek" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Hide the global navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background-secondary/95 backdrop-blur-xl border-b border-glass-border shadow-md py-4"
          : "bg-background-secondary border-b border-glass-border shadow-sm py-5"
      )}
    >
      <nav className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50 relative w-32 h-10 sm:w-40 sm:h-12 md:w-52 md:h-16">
          <Image
            src="/images/logo-light-transparent.png"
            alt="RIR Studio Logo"
            fill
            sizes="(max-width: 768px) 160px, 208px"
            className="object-contain opacity-90 hover:opacity-100 transition-all duration-300 dark:hidden"
            priority
          />
          <Image
            src="/images/logo-dark-transparent.png"
            alt="RIR Studio Logo"
            fill
            sizes="(max-width: 768px) 160px, 208px"
            className="object-contain opacity-90 hover:opacity-100 transition-all duration-300 hidden dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-base font-semibold tracking-wide transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-foreground rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-base font-bold rounded-full bg-foreground text-background hover:scale-105 transition-all duration-300"
          >
            Mari Berdiskusi
          </Link>
        </div>

        {/* Mobile Menu Toggle & Theme */}
        <div className="flex md:hidden items-center gap-2 sm:gap-3 z-50">
          <div className="scale-90 sm:scale-100">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 -mr-2 text-foreground hover:bg-background-secondary rounded-full transition-colors flex items-center justify-center"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 md:hidden bg-background border-b border-glass-border shadow-2xl overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-4 rounded-xl text-lg font-bold tracking-tight transition-all duration-200",
                          isActive
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-background-secondary border border-transparent"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 mt-2 border-t border-glass-border"
              >
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-4 rounded-xl text-base font-bold bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  Mari Berdiskusi
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
