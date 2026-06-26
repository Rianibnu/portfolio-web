import { updatePost } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AiTextArea from "@/components/admin/ai-textarea";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const updateAction = updatePost.bind(null, post.id);

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
            Edit Post
          </h1>
          <p className="text-foreground-muted">
            Update your blog article.
          </p>
        </div>
      </div>

      <form action={updateAction} className="space-y-6">
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
                defaultValue={post.title}
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
                defaultValue={post.slug}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., getting-started-with-nextjs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="category">
              Category <span className="text-error">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={post.category || "General"}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Mobile App">Mobile App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="excerpt">
              Excerpt / Short Summary
            </label>
            <AiTextArea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post.excerpt || ""}
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
              defaultValue={post.content}
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
              defaultValue={post.tags.join(", ")}
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
                  Option 1: Upload New File
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
                  defaultValue={post.thumbnail || ""}
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              <strong>Tip:</strong> You can upload a new image, update the URL, or leave both to keep the current thumbnail.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={post.published}
              className="w-5 h-5 rounded border-glass-border text-foreground focus:ring-foreground"
            />
            <label className="text-sm font-bold text-foreground" htmlFor="published">
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Save className="w-5 h-5" />
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
}
