import { createPost } from "../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import AiTextArea from "@/components/admin/ai-textarea";

export default function NewPostPage() {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 bg-background-secondary hover:bg-background-tertiary rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter mb-1">
            New Blog Post
          </h1>
          <p className="text-foreground-muted">
            Write a new article to publish on your blog.
          </p>
        </div>
      </div>

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
