import { prisma } from "@/lib/prisma";
import { FolderGit2, FileText, MessageSquare, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch stats from DB
  const projectCount = await prisma.project.count();
  const postCount = await prisma.post.count();
  const unreadMessagesCount = await prisma.contact.count({
    where: { read: false },
  });

  const stats = [
    {
      name: "Total Projects",
      value: projectCount,
      icon: FolderGit2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Published Posts",
      value: postCount,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Unread Messages",
      value: unreadMessagesCount,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      name: "Page Views (Mock)",
      value: "12.4k",
      icon: Eye,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-2">
          Dashboard Overview
        </h1>
        <p className="text-foreground-muted font-medium">
          Welcome back, Admin. Here's what's happening with your portfolio today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 rounded-2xl bg-background border border-glass-border hover:border-foreground/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground-muted mb-1">
                {stat.name}
              </p>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section could go here */}
      <div className="mt-12 p-8 rounded-2xl border border-glass-border border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mb-4">
          <FolderGit2 className="w-8 h-8 text-foreground-muted" />
        </div>
        <h3 className="text-xl font-bold mb-2">Ready to showcase your work?</h3>
        <p className="text-foreground-muted max-w-sm">
          Head over to the Projects tab to start adding your amazing portfolio items to the database.
        </p>
      </div>
    </div>
  );
}
