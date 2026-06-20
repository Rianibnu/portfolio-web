"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import SectionWrapper from "@/components/layout/section-wrapper";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setStatus("loading");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("message", formData.message);

    const result = await submitContactForm(data);

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <SectionWrapper className="pt-32 md:pt-40">
      <div className="container-custom max-w-2xl">

        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            Hubungi <span className="text-foreground-muted font-light">Saya.</span>
          </h1>
          <p className="text-lg text-foreground-muted font-light leading-relaxed">
            Punya ide proyek atau ingin berkolaborasi? Kirimkan pesan dan saya akan segera membalasnya secepat mungkin.
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-background-secondary border border-glass-border rounded-2xl"
          >
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
            <h3 className="text-2xl font-bold tracking-tight mb-2">Pesan Terkirim!</h3>
            <p className="text-foreground-muted font-light mb-8">
              Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="px-8 py-3 rounded-full border border-glass-border font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              Kirim Pesan Lainnya
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                <User className="w-4 h-4 text-foreground-subtle" />
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                className="w-full px-5 py-4 rounded-xl bg-background-secondary border border-glass-border text-foreground placeholder:text-foreground-subtle outline-none focus:border-foreground transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                <Mail className="w-4 h-4 text-foreground-subtle" />
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-xl bg-background-secondary border border-glass-border text-foreground placeholder:text-foreground-subtle outline-none focus:border-foreground transition-all duration-300"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                <MessageSquare className="w-4 h-4 text-foreground-subtle" />
                Pesan
              </label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ceritakan tentang proyek Anda..."
                className="w-full px-5 py-4 rounded-xl bg-background-secondary border border-glass-border text-foreground placeholder:text-foreground-subtle outline-none focus:border-foreground transition-all duration-300 resize-none"
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-error/10 text-error text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Terjadi kesalahan. Silakan coba lagi.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Pesan
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </SectionWrapper>
  );
}
