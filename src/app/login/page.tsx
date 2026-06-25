import { Suspense } from "react";
import { Code2 } from "lucide-react";
import LoginForm from "./login-form";

// Loading fallback shown while LoginForm (which uses useSearchParams) loads
function LoginFallback() {
  return (
    <div className="glass p-8 md:p-12 text-center">
      <div className="flex justify-center mb-8">
        <Code2 className="w-10 h-10 text-foreground" />
      </div>
      <h1 className="text-2xl font-extrabold tracking-tighter mb-2">
        Admin Access
      </h1>
      <p className="text-foreground-muted text-sm mb-8">
        Loading...
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
