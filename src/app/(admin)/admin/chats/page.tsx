import { prisma } from "@/lib/prisma";
import { Bot, User, MessageSquareText, Trash2, Mail, MailOpen } from "lucide-react";
import { markChatAsRead, markChatAsUnread, deleteChatSession } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Logs | Admin Panel",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function timeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(date);
}

export default async function AdminChatsPage() {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  const unreadCount = sessions.filter((s) => !s.read).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter">Chat Logs</h1>
        <p className="text-foreground-muted mt-1">
          {unreadCount > 0
            ? `Ada ${unreadCount} percakapan baru yang belum dibaca`
            : "Semua percakapan sudah dibaca"}
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-background-secondary border border-glass-border rounded-2xl">
          <MessageSquareText className="w-12 h-12 text-foreground-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Belum ada percakapan</h3>
          <p className="text-foreground-muted text-sm">
            Ketika pengunjung menggunakan widget chat, percakapan mereka akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => {
            // Get first user message as preview
            const firstUserMsg = session.messages.find((m) => m.role === "user");
            const userMsgCount = session.messages.filter((m) => m.role === "user").length;

            return (
              <div
                key={session.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  session.read
                    ? "bg-background-secondary/50 border-glass-border"
                    : "bg-background-secondary border-foreground/20 shadow-lg"
                }`}
              >
                {/* Session Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-glass-border">
                  <div className="flex items-center gap-3 min-w-0">
                    {!session.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm">
                          {session.visitorIp || "Pengunjung"}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-background-tertiary text-foreground-muted">
                          {userMsgCount} pesan
                        </span>
                      </div>
                      <p className="text-xs text-foreground-subtle mt-0.5">
                        {timeAgo(session.updatedAt)}
                        {firstUserMsg && (
                          <span className="ml-2 text-foreground-muted">
                            — &ldquo;{firstUserMsg.content.slice(0, 60)}
                            {firstUserMsg.content.length > 60 ? "..." : ""}&rdquo;
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {session.read ? (
                      <form action={markChatAsUnread.bind(null, session.id)}>
                        <button
                          type="submit"
                          className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
                          title="Tandai belum dibaca"
                        >
                          <MailOpen className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form action={markChatAsRead.bind(null, session.id)}>
                        <button
                          type="submit"
                          className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
                          title="Tandai sudah dibaca"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                    <form action={deleteChatSession.bind(null, session.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-foreground-muted hover:bg-error/10 hover:text-error transition-colors"
                        title="Hapus percakapan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="px-6 py-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {session.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          msg.role === "user"
                            ? "bg-foreground text-background"
                            : "bg-accent/15 text-accent"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-3.5 h-3.5" />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-foreground text-background rounded-2xl rounded-tr-md"
                            : "bg-background border border-glass-border rounded-2xl rounded-tl-md text-foreground"
                        }`}
                      >
                        {msg.content}
                        <div
                          className={`text-[10px] mt-1 ${
                            msg.role === "user"
                              ? "text-background/60"
                              : "text-foreground-subtle"
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
