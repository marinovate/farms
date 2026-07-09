import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
        navigate({ to: "/profile" });
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
        </div>
      </div>
    </div>
  );
}
