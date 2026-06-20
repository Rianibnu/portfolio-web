"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  FolderGit2, 
  FileText, 
  MessageSquare, 
  LogOut,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-glass-border bg-background hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-glass-border">
          <Link href="/" className="flex items-center gap-2 group">
            <Code2 className="w-6 h-6 text-foreground transition-transform group-hover:rotate-12" />
            <span className="text-lg font-extrabold tracking-tighter">
              Admin<span className="text-foreground-muted font-light">Panel.</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-foreground-muted hover:bg-background-secondary hover:text-foreground"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-background" : "text-foreground-muted")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-glass-border flex items-center px-4 justify-between bg-background/80 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-foreground" />
            <span className="font-extrabold tracking-tighter">Admin.</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-error font-bold text-sm"
          >
            Sign Out
          </button>
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
