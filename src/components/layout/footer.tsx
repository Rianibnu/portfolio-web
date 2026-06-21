"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Code2, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/icons";

const socialLinks = [
  { href: "https://github.com/rianibnu", icon: GithubIcon, label: "GitHub" },
  { href: "https://linkedin.com/in/rian-ibnu", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://instagram.com/rianibnu_", icon: InstagramIcon, label: "Instagram" },
  { href: "https://instagram.com/rirstudio.id", icon: InstagramIcon, label: "RIR Studio" },
  { href: "mailto:rianibnurizall@gmail.com", icon: Mail, label: "Email" },
  // { href: "https://wa.me/6285156434782", icon: Phone, label: "WhatsApp" },
];

const quickLinks = [
  { href: "/about", label: "Tentang" },
  { href: "/projects", label: "Proyek" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Kontak" },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative border-t border-glass-border bg-background">
      <div className="container-custom py-12 md:py-20">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-6 md:max-w-sm">
            <Link href="/" className="flex items-center gap-2 group relative w-56 h-20 md:w-64 md:h-24">
              <Image
                src="/images/logo-light-transparent.png"
                alt="RIR Studio Logo"
                fill
                sizes="(max-width: 768px) 224px, 256px"
                className="object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 dark:hidden"
              />
              <Image
                src="/images/logo-dark-transparent.png"
                alt="RIR Studio Logo"
                fill
                sizes="(max-width: 768px) 224px, 256px"
                className="object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 hidden dark:block"
              />
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed font-light">
              Full Stack Web Developer & IT Support. Ahli membangun solusi digital efisien
              menggunakan Laravel, VueJS, PostgreSQL, dan MySQL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Navigasi
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Terhubung
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-glass-border bg-background-secondary text-foreground-muted hover:text-foreground hover:border-foreground transition-all duration-300 hover:-translate-y-1"
                    aria-label={link.label}
                  >
                    <link.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-foreground-subtle font-medium">
            &copy; {currentYear} RIR Studio. All rights reserved.
          </p>
          <div className="flex gap-4 justify-center md:justify-end">
            <span className="text-xs text-foreground-subtle uppercase tracking-wider font-semibold">Dibuat dengan Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
