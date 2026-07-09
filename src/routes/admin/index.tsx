import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2, Database } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0 });
  const [monthlyData, setMonthlyData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("total_amount, created_at");
      if (error) throw error;

      let revenue = 0;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyTotals = new Array(12).fill(0);

      data?.forEach((order) => {
        revenue += order.total_amount;
        const date = new Date(order.created_at);
        monthlyTotals[date.getMonth()] += order.total_amount;
      });

      setStats({ totalRevenue: revenue, totalSales: data?.length || 0 });
      setMonthlyData(months.map((name, index) => ({ name, total: monthlyTotals[index] })));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm("This will insert default products. Proceed?")) return;
    setSeeding(true);
    try {
      const defaultProducts = [
        { title: "Farm Fresh Tomatoes", price: 40, category: "Vegetables", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80", trending: true },
        { title: "Red Onions", price: 35, category: "Vegetables", image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80", trending: false },
        { title: "Organic Spinach", price: 25, category: "Vegetables", image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80", trending: true },
        { title: "Sweet Potatoes", price: 50, category: "Vegetables", image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", trending: false },
        { title: "Fresh Apples", price: 120, category: "Fruits", image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=800&q=80", trending: true },
        { title: "Bananas", price: 60, category: "Fruits", image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80", trending: false },
        { title: "Tiger Prawns", price: 800, category: "Seafood", image_url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80", trending: true },
        { title: "Rohu Fish", price: 350, category: "Seafood", image_url: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=800&q=80", trending: false },
      ];
      const { error } = await supabase.from("products").insert(defaultProducts);
      if (error) throw error;
      alert("Database seeded successfully!");
    } catch (error: any) {
      alert("Failed to seed database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--forest-deep)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={seedDatabase}
          disabled={seeding}
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Seed Mock Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[var(--forest-deep)]/5">
            <CardTitle className="text-sm font-medium text-[var(--forest-deep)]">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-display font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[var(--gold)]/10">
            <CardTitle className="text-sm font-medium text-[var(--forest-deep)]">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-display font-bold text-gray-900">+{stats.totalSales}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-display font-bold mb-4 text-gray-900">Monthly Revenue Overview</h2>
        <div className="h-[400px] w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="total" fill="var(--forest-deep)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
