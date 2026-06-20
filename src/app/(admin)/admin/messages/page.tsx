import { prisma } from "@/lib/prisma";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { markAsRead, markAsUnread, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter">Messages</h1>
        <p className="text-foreground-muted mt-1">
          {unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
            : "All messages have been read"}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-background-secondary border border-glass-border rounded-2xl">
          <Mail className="w-12 h-12 text-foreground-subtle mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No messages yet</h3>
          <p className="text-foreground-muted text-sm">
            When someone fills out the contact form, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.read
                  ? "bg-background-secondary/50 border-glass-border"
                  : "bg-background-secondary border-foreground/20 shadow-lg"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {!msg.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                    )}
                    <h3 className="text-base font-bold truncate">{msg.name}</h3>
                    <span className="text-xs text-foreground-subtle shrink-0">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted mb-3">{msg.email}</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {msg.read ? (
                    <form action={markAsUnread.bind(null, msg.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
                        title="Mark as unread"
                      >
                        <MailOpen className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form action={markAsRead.bind(null, msg.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
                        title="Mark as read"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                  <form action={deleteMessage.bind(null, msg.id)}>
                    <button
                      type="submit"
                      className="p-2 rounded-lg text-foreground-muted hover:bg-error/10 hover:text-error transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
