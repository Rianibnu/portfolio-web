import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { deletePost, togglePublishPost } from "./actions";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Blog Posts</h1>
          <p className="text-foreground-muted mt-1">
            Manage your articles and tutorials
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
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
        <div className="bg-background-secondary border border-glass-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border text-left">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted">Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted hidden md:table-cell">Tags</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-glass-border/50 last:border-0 hover:bg-background-tertiary/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{post.title}</span>
                    <span className="block text-xs text-foreground-subtle mt-0.5">/{post.slug}</span>
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
                  <td className="px-6 py-4 text-right">
                    <form action={deletePost.bind(null, post.id)} className="inline">
                      <button
                        type="submit"
                        className="p-2 text-foreground-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
