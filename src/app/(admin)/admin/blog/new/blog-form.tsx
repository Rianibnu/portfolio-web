"use client";

import { useState } from "react";
import { Save, Wand2, Loader2 } from "lucide-react";
import AiTextArea from "@/components/admin/ai-textarea";
import { createPost } from "../actions";

export default function BlogForm() {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleGenerateAll = async () => {
    if (!idea.trim()) {
      setError("Masukkan ide topik terlebih dahulu.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal meng-generate artikel");
      }

      const result = data.result;
      
      setTitle(result.title || "");
      setSlug(result.slug || "");
      setExcerpt(result.excerpt || "");
      setContent(result.content || "");
      setTags(Array.isArray(result.tags) ? result.tags.join(", ") : "");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto Generate Section */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-purple-600 flex items-center gap-2 mb-1">
            <Wand2 className="w-5 h-5" />
            Auto Generate dari Ide
          </h2>
          <p className="text-sm text-foreground-muted">
            Ketik satu kalimat ide atau topik, dan AI akan membuatkan Judul, Slug, Excerpt, Content, dan Tags secara otomatis.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Contoh: Tutorial membuat REST API dengan Next.js App Router"
            className="flex-1 px-4 py-3 rounded-lg bg-background border border-glass-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
            disabled={isGenerating}
          />
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Membangun Artikel...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Semua
              </>
            )}
          </button>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      {/* Main Form */}
      <form action={createPost} className="space-y-6">
        <div className="bg-background border border-glass-border rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="title">
                Post Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., Getting Started with Next.js"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="slug">
                URL Slug <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., getting-started-with-nextjs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="excerpt">
              Excerpt / Short Summary
            </label>
            <AiTextArea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={excerpt}
              onChange={setExcerpt}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none resize-none"
              placeholder="Brief summary of this blog post..."
              type="short_description"
              context="blog"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="content">
              Full Content <span className="text-error">*</span>
            </label>
            <AiTextArea
              id="content"
              name="content"
              required
              rows={12}
              value={content}
              onChange={setContent}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none font-mono text-sm"
              placeholder={"Write your article content here...\n\n## Section Heading\n\nYour paragraph text goes here."}
              type="full_content"
              context="blog"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="tags">
              Tags (Comma Separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
              placeholder="Next.js, React, Tutorial"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground">
              Thumbnail Image
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-foreground-subtle" htmlFor="thumbnailFile">
                  Option 1: Upload File
                </label>
                <input
                  type="file"
                  id="thumbnailFile"
                  name="thumbnailFile"
                  accept="image/*"
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-foreground file:text-background hover:file:bg-foreground/90 cursor-pointer text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-foreground-subtle" htmlFor="thumbnail">
                  Option 2: Image URL
                </label>
                <input
                  type="url"
                  id="thumbnail"
                  name="thumbnail"
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              <strong>Tip:</strong> You can upload an image or provide a direct URL. If left blank, a default placeholder will be used.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="w-5 h-5 rounded border-glass-border text-foreground focus:ring-foreground"
            />
            <label className="text-sm font-bold text-foreground" htmlFor="published">
              Publish Immediately
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Save className="w-5 h-5" />
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
