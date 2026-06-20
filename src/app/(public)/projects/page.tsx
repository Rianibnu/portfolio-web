import type { Metadata } from "next";
import SectionWrapper from "@/components/layout/section-wrapper";
import ProjectCard from "@/components/ui/project-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects showcasing full-stack skills.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <SectionWrapper className="pt-32 md:pt-40">
      <div className="container-custom">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            Semua <span className="text-foreground-muted font-light">Proyek.</span>
          </h1>
          <p className="text-lg text-foreground-muted font-light leading-relaxed">
            Arsip lengkap proyek yang pernah saya kerjakan, mulai dari aplikasi full-stack hingga eksperimen teknologi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <p className="text-foreground-muted col-span-2 py-12 text-center text-lg">
              Belum ada proyek yang dipublikasikan. Coba periksa kembali nanti!
            </p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                githubUrl={project.githubUrl || undefined}
                demoUrl={project.demoUrl || undefined}
                index={index} 
                className="min-h-[400px]" 
              />
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
