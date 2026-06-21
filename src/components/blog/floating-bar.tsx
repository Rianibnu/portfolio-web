"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Link as LinkIcon, Check } from "lucide-react";

export default function FloatingBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-md border border-glass-border rounded-full shadow-2xl"
        >
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-foreground group relative"
            title="Copy Link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <LinkIcon className="w-4 h-4 group-hover:text-accent transition-colors" />
            )}
          </button>
          
          <div className="w-[1px] h-6 bg-glass-border" />
          
          <button
            onClick={handleScrollTop}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-foreground group"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4 group-hover:text-accent transition-colors" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
