"use client";

import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Code2, ShieldAlert, Timer } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Show context-aware message when redirected due to session timeout
  const logoutReason = searchParams.get("reason");
  const sessionMessage = useMemo(() => {
    switch (logoutReason) {
      case "idle":
        return {
          icon: Timer,
          text: "Sesi Anda berakhir karena tidak ada aktivitas selama 30 menit. Silakan login kembali.",
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        };
      case "expired":
        return {
          icon: ShieldAlert,
          text: "Sesi Anda telah kedaluwarsa. Silakan login kembali untuk melanjutkan.",
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        };
      default:
        return null;
    }
  }, [logoutReason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 md:p-12 text-center">
          <div className="flex justify-center mb-8">
            <Code2 className="w-10 h-10 text-foreground" />
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tighter mb-2">
            Admin Access
          </h1>
          <p className="text-foreground-muted text-sm mb-8">
            Sign in to manage your portfolio
          </p>

          {/* Session timeout notification */}
          {sessionMessage && (
            <div className={`flex items-start gap-3 p-4 text-sm rounded-xl mb-6 ${sessionMessage.bg} border ${sessionMessage.border}`}>
              <sessionMessage.icon className={`w-5 h-5 ${sessionMessage.color} shrink-0 mt-0.5`} />
              <span className="text-foreground text-left">{sessionMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-glass-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-6 bg-foreground text-background font-bold rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
