"use client";

import { useState } from "react";
import { Link2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export default function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-medium text-foreground-muted mr-2">Bagikan:</span>
      
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border hover:border-foreground/30 hover:bg-background-tertiary transition-all duration-200 group relative"
        aria-label="Copy link"
      >
        <Link2 size={18} className="text-foreground-muted group-hover:text-foreground transition-colors" />
        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded-md shadow-md whitespace-nowrap font-medium">
            Tersalin!
          </span>
        )}
      </button>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-200 group"
        aria-label="Share to WhatsApp"
      >
        <MessageCircle size={18} className="text-foreground-muted group-hover:text-[#25D366] transition-colors" />
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border text-foreground-muted hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all duration-300"
        aria-label="Share on X (Twitter)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border text-foreground-muted hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all duration-300"
        aria-label="Share on Facebook"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border text-foreground-muted hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all duration-300"
        aria-label="Share on LinkedIn"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
    </div>
  );
}
