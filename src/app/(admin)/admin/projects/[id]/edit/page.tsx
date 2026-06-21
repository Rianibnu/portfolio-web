import { updateProject } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AiTextArea from "@/components/admin/ai-textarea";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const updateAction = updateProject.bind(null, project.id);

  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 bg-background-secondary hover:bg-background-tertiary rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter mb-1">
            Edit Project
          </h1>
          <p className="text-foreground-muted">
            Update your portfolio piece.
          </p>
        </div>
      </div>

      <form action={updateAction} className="space-y-6">
        <div className="bg-background border border-glass-border rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="title">
                Project Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={project.title}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., E-Commerce App"
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
                defaultValue={project.slug}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., e-commerce-app"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="description">
              Short Description <span className="text-error">*</span>
            </label>
            <AiTextArea
              id="description"
              name="description"
              required
              rows={2}
              defaultValue={project.description}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none resize-none"
              placeholder="Brief summary of the project..."
              type="short_description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="content">
              Full Content / Case Study
            </label>
            <AiTextArea
              id="content"
              name="content"
              rows={8}
              defaultValue={project.content || ""}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
              placeholder="Write the full case study here..."
              type="full_content"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="techStack">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              defaultValue={project.techStack.join(", ")}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
              placeholder="React, Next.js, TailwindCSS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="githubUrl">
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                defaultValue={project.githubUrl || ""}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="demoUrl">
                Live Demo URL
              </label>
              <input
                type="url"
                id="demoUrl"
                name="demoUrl"
                defaultValue={project.demoUrl || ""}
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="https://yourdemo.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground">
              Cover Image
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-foreground-subtle" htmlFor="coverImageFile">
                  Option 1: Upload New File
                </label>
                <input
                  type="file"
                  id="coverImageFile"
                  name="coverImageFile"
                  accept="image/*"
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-foreground file:text-background hover:file:bg-foreground/90 cursor-pointer text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-foreground-subtle" htmlFor="coverImage">
                  Option 2: Image URL
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  defaultValue={project.coverImage || ""}
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              <strong>Tip:</strong> You can upload a new image, update the URL, or clear both to automatically capture a screenshot of your <strong>Live Demo URL</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={project.featured}
              className="w-5 h-5 rounded border-glass-border text-foreground focus:ring-foreground"
            />
            <label className="text-sm font-bold text-foreground" htmlFor="featured">
              Highlight as Featured Project
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Save className="w-5 h-5" />
            Update Project
          </button>
        </div>
      </form>
    </div>
  );
}
