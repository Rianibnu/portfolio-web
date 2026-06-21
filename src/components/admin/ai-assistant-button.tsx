"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIAssistantButtonProps {
  onGenerated: (text: string) => void;
  currentText: string;
  type: "short_description" | "full_content";
}

export default function AIAssistantButton({ onGenerated, currentText, type }: AIAssistantButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentText.trim()) {
      setError("Ketik sedikit ide atau draf terlebih dahulu sebelum menggunakan AI.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentText, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal generate konten");
      }

      onGenerated(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        className="inline-flex items-center gap-2 self-start px-3 py-1.5 text-sm font-medium rounded-md bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border border-purple-500/20 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isLoading ? "AI sedang merapikan..." : "✨ Rapihkan dengan AI"}
      </button>
      {error && <span className="text-xs text-error font-medium">{error}</span>}
    </div>
  );
}
