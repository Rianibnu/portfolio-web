import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hubungi saya untuk diskusi proyek, kolaborasi, atau sekadar menyapa. Saya akan segera membalas pesan Anda.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
