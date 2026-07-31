import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const redirectTo: string = search?.redirect || "/profile";
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirectTo as any });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert(
          "Registration successful! Check your email if confirmation is enabled, otherwise you can log in.",
        );
        setIsLogin(true);
      }
    } catch (error: Error | unknown) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: Image & Brand */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[var(--forest-deep)]">
        <img 
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80" 
          alt="Fresh produce" 
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
          <Link to="/" className="font-display text-3xl font-bold tracking-tight">Marinovate.</Link>
          <div>
            <h2 className="font-display text-4xl mb-4 leading-tight">Farm fresh goodness,<br/>delivered to your door.</h2>
            <p className="text-white/80 max-w-sm">Sign in to access your orders, track deliveries, and discover exclusive farm products.</p>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-white relative">
        <div className="absolute top-6 left-6 md:hidden">
           <Link to="/" className="font-display text-2xl font-bold text-[var(--forest-deep)] tracking-tight">Marinovate.</Link>
        </div>
        
        <Link to="/" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[var(--forest-deep)] transition absolute top-8 right-8">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-500 mb-8">
            {isLogin ? "Enter your details to access your account." : "Start your journey with fresh, organic produce."}
          </p>

          <form onSubmit={handleAuth} className="space-y-5 mb-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="rounded-xl h-12 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white text-base font-medium shadow-lg shadow-forest-deep/20 transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--forest-deep)] font-medium hover:underline"
            >
              {isLogin ? "Create one now" : "Sign in instead"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 transition-all active:scale-[0.98] shadow-sm"
          >
            {/* Google logo */}
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
              <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
              <path d="M11.0051 28.6006C10.0973 25.6199 10.0973 22.4101 11.0051 19.4294V13.2475H3.03298C-0.371021 20.0134 -0.371021 28.0166 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
              <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2475L11.005 19.4294C12.901 13.7415 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
