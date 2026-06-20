import Hero from "@/components/sections/hero";
import FeaturedProjects from "@/components/sections/featured-projects";
import SkillsOverview from "@/components/sections/skills-overview";
import ContactCTA from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsOverview />
      <ContactCTA />
    </>
  );
}
