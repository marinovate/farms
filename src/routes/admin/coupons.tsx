import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

type Coupon = {
  id: string;
  code: string;
  discount_amount: number;
  is_active: boolean;
  created_at: string;
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    discount_amount: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        if (error.code === "42P01") {
          toast.error("Coupons table not found. Please run the SQL command.");
        } else {
          throw error;
        }
      }
      
      if (data) setCoupons(data);
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.discount_amount);
    if (!formData.code.trim() || isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("coupons").insert([
        { 
          code: formData.code.trim().toUpperCase(),
          discount_amount: amount,
          is_active: true
        },
      ]);
      
      if (error) {
        if (error.code === '23505') {
          toast.error("Coupon code already exists!");
        } else {
          throw error;
        }
      } else {
        toast.success("Coupon created successfully");
        setIsOpen(false);
        setFormData({ code: "", discount_amount: "" });
        fetchCoupons();
      }
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      toast.success(currentStatus ? "Coupon deactivated" : "Coupon activated");
      fetchCoupons();
    } catch (error: any) {
      console.error("Error toggling coupon status:", error);
      toast.error("Failed to update coupon status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--forest-deep)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">Coupons</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[var(--forest-deep)]">New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Coupon Code</label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE50"
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)] uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Discount Amount (₹)</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  placeholder="e.g. 50"
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting || !formData.code.trim() || !formData.discount_amount} className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl py-6 mt-4">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Coupon"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-semibold text-gray-900">Code</TableHead>
              <TableHead className="font-semibold text-gray-900">Discount</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Created On</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900">No coupons found</p>
                    <p className="text-sm">Click "Create Coupon" to add your first one.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-gray-900 text-base font-mono bg-gray-100 px-2 py-1 rounded inline-block border border-gray-200">
                      {coupon.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-green-600">
                      ₹{coupon.discount_amount} Off
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(coupon.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg mr-2"
                      title={coupon.is_active ? "Deactivate" : "Activate"}
                      onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                    >
                      {coupon.is_active ? <PowerOff className="h-4 w-4 text-orange-500" /> : <Power className="h-4 w-4 text-green-500" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
