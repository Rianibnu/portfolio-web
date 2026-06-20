import { createProject } from "../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProjectPage() {
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
            Add New Project
          </h1>
          <p className="text-foreground-muted">
            Create a new portfolio piece to showcase.
          </p>
        </div>
      </div>

      <form action={createProject} className="space-y-6">
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
                className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="e.g., e-commerce-app"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="description">
              Short Description <span className="text-error">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none resize-none"
              placeholder="Brief summary of the project..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="content">
              Full Content / Case Study
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
              placeholder="Write the full case study here..."
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
                  Option 1: Upload File
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
                  className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              <strong>Tip:</strong> You can upload an image, provide a direct URL, or leave both blank and we will automatically capture a screenshot of your <strong>Live Demo URL</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
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
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
