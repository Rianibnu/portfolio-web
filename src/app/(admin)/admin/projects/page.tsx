import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter mb-1">
            Projects
          </h1>
          <p className="text-foreground-muted">
            Manage your portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      <div className="bg-background border border-glass-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-background-secondary/50">
                <th className="px-6 py-4 font-bold text-sm text-foreground-muted">Project</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground-muted">Status</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground-muted">Created</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground-muted">
                    No projects found. Click "Add Project" to create your first one.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-background-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-glass-bg border border-glass-border overflow-hidden">
                          {project.coverImage ? (
                            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground-subtle">Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{project.title}</p>
                          <p className="text-xs text-foreground-subtle">{project.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-glass-bg text-foreground-muted">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-2 text-foreground-muted hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={deleteProject.bind(null, project.id)}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
