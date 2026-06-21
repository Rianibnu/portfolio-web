"use client";

import { useState } from "react";
import { Link2, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react";
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
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
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
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all duration-200 group"
        aria-label="Share to Twitter"
      >
        <Twitter size={18} className="text-foreground-muted group-hover:text-[#1DA1F2] transition-colors" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-200 group"
        aria-label="Share to LinkedIn"
      >
        <Linkedin size={18} className="text-foreground-muted group-hover:text-[#0A66C2] transition-colors" />
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-background-secondary border border-glass-border hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all duration-200 group"
        aria-label="Share to Facebook"
      >
        <Facebook size={18} className="text-foreground-muted group-hover:text-[#1877F2] transition-colors" />
      </a>
    </div>
  );
}
