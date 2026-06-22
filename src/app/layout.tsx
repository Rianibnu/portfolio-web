import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://rirstudio.my.id"),
  title: {
    default: "Rian Ibnu Rizal — Full Stack Web Developer",
    template: "%s | Rian Ibnu Rizal",
  },
  description:
    "Full Stack Web Developer & IT Support. Ahli membangun solusi digital efisien menggunakan Laravel, VueJS, PostgreSQL, dan MySQL.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "web development",
    "laravel",
    "vuejs",
    "postgresql",
    "rian ibnu rizal",
    "rir studio",
  ],
  authors: [{ name: "Rian Ibnu Rizal" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Rian Ibnu Rizal",
    title: "Rian Ibnu Rizal — Full Stack Web Developer",
    description:
      "Full Stack Web Developer & IT Support. Ahli membangun solusi digital efisien menggunakan Laravel, VueJS, PostgreSQL, dan MySQL.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rian Ibnu Rizal — Full Stack Web Developer",
    description:
      "Full Stack Web Developer & IT Support. Ahli membangun solusi digital efisien menggunakan Laravel, VueJS, PostgreSQL, dan MySQL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rian Ibnu Rizal",
    url: "https://rirstudio.my.id",
    jobTitle: "Full Stack Web Developer",
    worksFor: {
      "@type": "Organization",
      name: "RIR Studio"
    },
    sameAs: [
      "https://github.com/Rianibnu",
      "https://linkedin.com/in/rianibnu",
      // Tambahkan URL LinkedIn atau sosmed lainnya di sini
    ]
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Global Premium Background Pattern */}
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
            <div className="absolute inset-0 bg-grid opacity-[0.4]" />
            <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-background-secondary/50 to-transparent pointer-events-none" />
          </div>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
