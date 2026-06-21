import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { deletePost, togglePublishPost } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Admin Panel",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter mb-1">
            Blog Posts
          </h1>
          <p className="text-foreground-muted">
            Manage your articles and tutorials.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-background-secondary border border-glass-border rounded-2xl">
          <h3 className="text-lg font-bold mb-2">No blog posts yet</h3>
          <p className="text-foreground-muted text-sm mb-6">
            Start writing your first article!
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-glass-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border bg-background-secondary/50">
                  <th className="px-6 py-4 font-bold text-sm text-foreground-muted">Post</th>
                  <th className="px-6 py-4 font-bold text-sm text-foreground-muted hidden md:table-cell">Tags</th>
                  <th className="px-6 py-4 font-bold text-sm text-foreground-muted hidden md:table-cell">Status</th>
                  <th className="px-6 py-4 font-bold text-sm text-foreground-muted hidden md:table-cell">Created</th>
                  <th className="px-6 py-4 font-bold text-sm text-foreground-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-background-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-glass-bg border border-glass-border overflow-hidden">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground-subtle">Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{post.title}</p>
                          <p className="text-xs text-foreground-subtle">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <form action={togglePublishPost.bind(null, post.id, !post.published)}>
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                            post.published
                              ? "bg-success/10 text-success"
                              : "bg-foreground-subtle/10 text-foreground-muted"
                          }`}
                        >
                          {post.published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted hidden md:table-cell">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-foreground-muted hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={deletePost.bind(null, post.id)}>
                          <button
                            type="submit"
                            className="p-2 text-foreground-muted hover:text-error transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
