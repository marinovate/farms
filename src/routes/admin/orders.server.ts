import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// This function runs ONLY on the server — the secret key is never sent to the browser.
export const fetchAllOrders = createServerFn({ method: "GET" }).handler(async () => {
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
    .select(
      `
      *,
      order_items (
        *,
        product:products(title)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
});
