import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/layout/section-wrapper";
import ProjectCard from "@/components/ui/project-card";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProjects() {
  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return (
    <SectionWrapper className="relative">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              Proyek Pilihan
            </h2>
            <p className="text-foreground-muted text-lg font-light leading-relaxed">
              Koleksi proyek yang menunjukkan pendekatan saya dalam memecahkan masalah kompleks melalui kode yang elegan.
            </p>
          </div>
          <Link
            href="/projects"
            className="group hidden md:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Lihat semua proyek
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuredProjects.map((project, index) => {
            // Bento logic: first item spans full width or large area, next items share space
            // E.g., Item 0 = col-span-8, Item 1 = col-span-4, Item 2 = col-span-12 or col-span-6 etc.
            let spanClass = "md:col-span-12";
            if (index === 0) spanClass = "md:col-span-8 lg:col-span-8";
            else if (index === 1) spanClass = "md:col-span-4 lg:col-span-4";
            else if (index === 2) spanClass = "md:col-span-12 lg:col-span-12 lg:flex-row";

            return (
              <ProjectCard
                key={project.slug}
                {...project}
                githubUrl={project.githubUrl || undefined}
                demoUrl={project.demoUrl || undefined}
                index={index}
                className={`${spanClass} min-h-[400px]`}
              />
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Lihat semua proyek
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
