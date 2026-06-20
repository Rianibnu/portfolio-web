"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Code2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
