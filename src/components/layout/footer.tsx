"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";

const socialLinks = [
  { href: "https://github.com/rianibnu", icon: GithubIcon, label: "GitHub" },
  { href: "https://linkedin.com/in/rian-ibnu", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://instagram.com/rianibnu_", icon: InstagramIcon, label: "Instagram" },
  { href: "https://instagram.com/rirstudio.id", icon: InstagramIcon, label: "RIR Studio" },
  { href: "mailto:rianibnurizall@gmail.com", icon: Mail, label: "Email" },
];

const quickLinks = [
  { href: "/about", label: "Tentang Saya" },
  { href: "/projects", label: "Portfolio Proyek" },
  { href: "/blog", label: "Artikel Blog" },
  { href: "/contact", label: "Hubungi Saya" },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-background overflow-hidden border-t border-glass-border">
      {/* Decorative top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Decorative background blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8">

          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4 flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="inline-block relative w-48 h-16 md:w-56 md:h-20 transition-transform hover:scale-105 duration-300 -ml-2">
              <Image
                src="/images/logo-light-transparent.png"
                alt="RIR Studio Logo"
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-contain opacity-90 dark:hidden"
              />
              <Image
                src="/images/logo-dark-transparent.png"
                alt="RIR Studio Logo"
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-contain opacity-90 hidden dark:block"
              />
            </Link>

            <p className="text-base text-foreground-muted leading-relaxed font-light max-w-sm">
              Full Stack Web Developer & IT Support. Ahli membangun solusi digital yang efisien, modern, dan scalable.
            </p>

            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-accent transition-colors group px-6 py-3 rounded-full bg-background-secondary border border-glass-border hover:border-accent/50">
              Mari berkolaborasi
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7 space-y-4 text-center md:text-left">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest relative inline-block">
              Navigasi
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-1/2 h-[2px] bg-accent rounded-full" />
            </h3>
            <ul className="space-y-2.5 pt-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground transition-all duration-300 font-medium text-sm inline-flex relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest relative inline-block">
              Terhubung
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-1/2 h-[2px] bg-accent rounded-full" />
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-xl border border-glass-border bg-background-secondary/50 text-foreground-muted hover:text-foreground hover:border-accent/50 hover:bg-background-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(var(--accent),0.2)]"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5 relative z-10" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-subtle font-medium text-center md:text-left">
            &copy; {currentYear} RIR Studio. All rights reserved.
          </p>
          <div className="flex gap-4 items-center text-sm text-foreground-subtle font-medium">
            <span>Bandung, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
