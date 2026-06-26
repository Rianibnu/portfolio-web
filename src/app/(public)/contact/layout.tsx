import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hubungi saya untuk diskusi proyek, kolaborasi, atau sekadar menyapa. Saya akan segera membalas pesan Anda.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://rirstudio.my.id"}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
