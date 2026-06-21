import type { Metadata } from "next";
import Image from "next/image";
import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/ui/section-heading";
import ExperienceTimeline from "@/components/sections/experience-timeline";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Rian Ibnu Rizal — Full Stack Web Developer & IT Support based in Indonesia.",
};

const interests = [
  "Full-stack developer",
  "Data analyst",
  "System analyst",
  "Frontend developer",
  "Backend developer",
  "Networking",
  "Cloud Computing",
  "Business analyst",
  "IT Support",
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <SectionWrapper className="pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="container-custom">
          <div className="flex flex-col-reverse md:flex-row gap-16 items-start">

            {/* Bio */}
            <div className="flex-1 space-y-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-tight">
                  Tentang <br />
                  <span className="text-foreground-muted font-light">Saya.</span>
                </h1>
                <p className="text-sm font-medium tracking-widest uppercase text-accent">
                  Full Stack Web Developer & IT Support — Indonesia
                </p>
              </div>

              <div className="space-y-6 text-foreground-muted text-lg font-light leading-relaxed max-w-2xl">
                <p>
                  <span className="font-semibold text-foreground">Rian Ibnu Rizal, S.T.</span> — lulusan S1 Teknik Informatika (IPK 3,47) serta <span className="font-semibold text-foreground">Founder RIR Studio</span>, dengan spesialisasi pengembangan aplikasi sebagai Full-Stack Developer dan manajemen IT Support/Helpdesk.
                </p>
                <p>
                  Berpengalaman dalam merancang flowmap bisnis, mengintegrasikan sistem kustom dengan vendor eksternal, serta memelihara infrastruktur jaringan demi menjamin stabilitas dan efisiensi operasional penuh.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 md:gap-8 pt-6 border-t border-glass-border">
                {[
                  { value: "4+", label: "Tahun Pengalaman" },
                  { value: "15+", label: "Proyek Dibangun" },
                  { value: "S.T", label: "Teknik Informatika" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                    <div className="text-xs font-semibold tracking-wider uppercase text-foreground-subtle">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div className="relative w-full max-w-sm mx-auto md:max-w-none md:mx-0 md:w-5/12 aspect-[4/5] md:aspect-square shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-background-secondary border border-glass-border overflow-hidden rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-[1.02]">
                <Image
                  src="/images/profile.jpg"
                  alt="Rian Ibnu Rizal Profile Photo"
                  fill
                  className="object-cover transition-all duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Experience */}
      <SectionWrapper className="border-t border-glass-border bg-background/50">
        <div className="container-custom">
          <SectionHeading
            title="Pengalaman"
            subtitle="Perjalanan profesional saya dalam pengembangan perangkat lunak."
          />
          <ExperienceTimeline />
        </div>
      </SectionWrapper>

      {/* Interests */}
      <SectionWrapper className="border-t border-glass-border">
        <div className="container-custom">
          <SectionHeading
            title="Minat & Ketertarikan"
            subtitle="Topik dan bidang yang menarik bagi saya."
          />
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {interests.map((interest) => (
              <div
                key={interest}
                className="px-6 py-3 rounded-full border border-glass-border bg-background-secondary text-foreground-muted font-medium text-sm hover:text-foreground hover:border-foreground transition-colors cursor-default"
              >
                {interest}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
