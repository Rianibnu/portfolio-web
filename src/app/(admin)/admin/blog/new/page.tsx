import { createPost } from "../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewPostPage() {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 rounded-xl border border-glass-border hover:bg-background-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter">New Blog Post</h1>
          <p className="text-foreground-muted mt-1">Write a new article</p>
        </div>
      </div>

      <form action={createPost} className="space-y-6 bg-background-secondary border border-glass-border rounded-2xl p-6 md:p-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
            placeholder="My Amazing Article"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="slug">
            URL Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
            placeholder="my-amazing-article"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="excerpt">
            Excerpt <span className="text-foreground-muted font-normal">(short summary)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none resize-none"
            placeholder="A brief description of this post..."
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="content">
            Content <span className="text-foreground-muted font-normal">(supports ## headings)</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none resize-y font-mono text-sm"
            placeholder="Write your article content here...&#10;&#10;## Section Heading&#10;&#10;Your paragraph text goes here."
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="thumbnail">
            Thumbnail URL <span className="text-foreground-muted font-normal">(optional)</span>
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground" htmlFor="tags">
            Tags <span className="text-foreground-muted font-normal">(comma separated)</span>
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
            placeholder="Next.js, React, Tutorial"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-glass-border">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="w-5 h-5 rounded border-glass-border accent-foreground"
          />
          <label htmlFor="published" className="text-sm font-bold text-foreground cursor-pointer">
            Publish immediately
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-xl font-bold hover:scale-105 transition-transform"
        >
          <Save className="w-5 h-5" />
          Save Post
        </button>
      </form>
    </div>
  );
}
