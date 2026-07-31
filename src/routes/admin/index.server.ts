import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Server function to fetch order stats — runs on the server using the secret key.
// This bypasses RLS so the admin dashboard sees ALL orders, not just their own.
export const fetchAllOrderStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "placeholder";

  const adminClient = createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await adminClient
    .from("orders")
    .select("total_amount, created_at");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
});
