import Hero from "@/components/sections/hero";
import FeaturedProjects from "@/components/sections/featured-projects";
import SkillsOverview from "@/components/sections/skills-overview";
import BlogHighlight from "@/components/sections/blog-highlight";
import ContactCTA from "@/components/sections/contact-cta";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const projectCount = await prisma.project.count();

  return (
    <>
      <Hero projectCount={projectCount} />
      <FeaturedProjects />
      <SkillsOverview />
      <BlogHighlight />
      <ContactCTA />
    </>
  );
}
