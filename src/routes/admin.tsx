import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      // Check local storage bypass first
      if (localStorage.getItem("adminBypass") === "true") {
        setIsAdmin(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@marinovate.com";

      if (session && session.user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleHardcodedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === "admin@marinovate.com" && passwordInput === "vasu@123") {
      localStorage.setItem("adminBypass", "true");
      setIsAdmin(true);
    } else {
      alert("Invalid admin credentials");
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--forest-deep)]" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-10 text-center lg:text-left">
              <Link to="/" className="inline-block flex flex-col items-center lg:items-start">
                <img src="/logo.png" alt="Marinovate Farms" className="h-20 w-20 object-contain rounded-xl mb-4" />
                <h2 className="text-3xl font-display font-bold tracking-tight text-gray-900">
                  Admin Access
                </h2>
              </Link>
            </div>

            <h2 className="mt-8 text-3xl font-display font-bold leading-9 tracking-tight text-gray-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to manage products, orders, and customer data.
            </p>

            <div className="mt-10">
              <form onSubmit={handleHardcodedLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--forest-deep)] sm:text-sm sm:leading-6"
                      placeholder="admin@marinovate.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  <div className="mt-2">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--forest-deep)] sm:text-sm sm:leading-6"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-xl bg-gradient-to-r from-[var(--forest-deep)] to-emerald-900 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:from-emerald-900 hover:to-[var(--forest-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                  >
                    Secure Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1595858801835-f09b2e88aeb7?w=1600&q=80"
            alt="Farm landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--forest-deep)]/80 to-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-xl text-center text-white">
              <h1 className="text-5xl font-display font-bold mb-6">Premium Management</h1>
              <p className="text-lg text-gray-200">
                Oversee the complete lifecycle of our premium farm produce, from harvest to delivery, ensuring exceptional quality at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gradient-to-b from-[var(--forest-deep)] to-[#0B1E19] border-r border-[#0B1E19]/10 shadow-xl flex flex-col print:hidden">
        <div className="p-6 border-b border-white/10 flex flex-col items-center">
          <img src="/logo.png" alt="Marinovate Farms" className="h-24 w-24 object-contain bg-white rounded-2xl p-1 mb-4 shadow-md" />
          <h2 className="text-xl font-display font-bold text-white tracking-wider mb-6 text-center uppercase">Marinovate Farms</h2>
          <Link 
            to="/" 
            target="_blank"
            className="w-full flex items-center justify-center p-2.5 text-sm font-semibold rounded-xl text-[var(--forest-deep)] bg-white hover:bg-gray-100 transition-colors shadow-lg"
          >
            View Site
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4 flex-1">
          <Link
            to="/admin"
            className="p-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            activeProps={{ className: "bg-gradient-to-r from-[var(--fresh)] to-emerald-500 text-white font-bold shadow-md" }}
            activeOptions={{ exact: true }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="p-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            activeProps={{ className: "bg-gradient-to-r from-[var(--fresh)] to-emerald-500 text-white font-bold shadow-md" }}
          >
            Products
          </Link>
          <Link
            to="/admin/categories"
            className="p-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            activeProps={{ className: "bg-gradient-to-r from-[var(--fresh)] to-emerald-500 text-white font-bold shadow-md" }}
          >
            Categories
          </Link>
          <Link
            to="/admin/coupons"
            className="p-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            activeProps={{ className: "bg-gradient-to-r from-[var(--fresh)] to-emerald-500 text-white font-bold shadow-md" }}
          >
            Coupons
          </Link>
          <Link
            to="/admin/orders"
            className="p-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            activeProps={{ className: "bg-gradient-to-r from-[var(--fresh)] to-emerald-500 text-white font-bold shadow-md" }}
          >
            Orders & Invoices
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 relative bg-gray-50">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=100&w=3840&auto=format&fit=crop")' }}
        />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
