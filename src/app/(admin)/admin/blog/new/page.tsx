import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "./blog-form";

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

      <BlogForm />
    </div>
  );
}
