/**
 * -admin.server.ts
 * All admin data operations run here — on the server — using the secret Supabase key.
 * This bypasses RLS so admins can read/write ALL data regardless of who is logged in.
 * The secret key is NEVER sent to the browser.
 * Note: The "-" prefix tells TanStack Router to ignore this file for route generation.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "placeholder";
  return createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── ORDERS ─────────────────────────────────────────────────────────────────

export const fetchAllOrders = createServerFn({ method: "GET" }).handler(async () => {
  const adminClient = getAdminClient();
  const { data: orders, error } = await adminClient
    .from("orders")
    .select("*, order_items(*, product:products(title))")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  try {
    const { data: profiles } = await adminClient.from("profiles").select("*");
    const profilesMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    return (orders ?? []).map((order: any) => ({
      ...order,
      profile: profilesMap.get(order.user_id) || null,
    }));
  } catch {
    return orders ?? [];
  }
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── ORDER STATS (dashboard) ─────────────────────────────────────────────────

export const fetchAllOrderStats = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await getAdminClient()
    .from("orders")
    .select("total_amount, created_at");
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const fetchAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await getAdminClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const insertProduct = createServerFn({ method: "POST" })
  .validator((d: Record<string, unknown>) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient().from("products").insert([data]);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .validator((d: { id: string; payload: Record<string, unknown> }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("products")
      .update(data.payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("products")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const fetchAllCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await getAdminClient()
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertCategory = createServerFn({ method: "POST" })
  .validator((d: { id?: string; name: string; image_url?: string | null }) => d)
  .handler(async ({ data }) => {
    const client = getAdminClient();
    if (data.id) {
      const { error } = await client
        .from("categories")
        .update({ name: data.name, image_url: data.image_url })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client
        .from("categories")
        .insert([{ name: data.name, image_url: data.image_url }]);
      if (error) throw new Error(error.message);
    }
    return { success: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("categories")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export const fetchAllCoupons = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await getAdminClient()
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const insertCoupon = createServerFn({ method: "POST" })
  .validator((d: { code: string; discount_amount: number; is_active: boolean }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient().from("coupons").insert([data]);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const toggleCouponStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; is_active: boolean }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("coupons")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteCoupon = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("coupons")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });
