import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Package, Heart, Settings, LogOut, ArrowLeft, Image as ImageIcon, MapPin, ReceiptText, User, Phone, Printer } from "lucide-react";
import { parseOrderCustomerAddress } from "@/lib/orderUtils";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { items: cartItems, removeItem } = useCartStore();

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<
    { id: string; total_amount: number; status: string; created_at: string; address: string; payment_id: string; latitude?: number; longitude?: number; order_items?: { id: string; quantity: number; price: number; product?: { title: string, image_url: string } }[] }[]
  >([]);
  const [wishlist, setWishlist] = useState<{ id: string; product?: { title: string; price: number; image_url: string; category: string } }[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    setUser(session.user);
    fetchProfile(session.user.id);
    fetchOrders(session.user.id);
    fetchWishlist(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    }
    setLoading(false);
  };

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, product:products(title, image_url))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const fetchWishlist = async (userId: string) => {
    const { data, error } = await supabase
      .from("liked_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setWishlist(data);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });
    if (error) alert(error.message);
    else alert("Profile updated successfully!");
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error: Error | unknown) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50/50"><Loader2 className="h-8 w-8 animate-spin text-[var(--forest-deep)]" /></div>;
  }

  const invoiceCustomerInfo = selectedInvoiceOrder
    ? parseOrderCustomerAddress(selectedInvoiceOrder.address, { full_name: fullName })
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Banner Header */}
      <div className="relative h-64 w-full overflow-hidden bg-[var(--forest-deep)]">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80" 
          alt="Farm landscape banner" 
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </div>
        <div className="absolute top-6 right-6 z-10">
          <Button variant="outline" className="rounded-full border-white/20 bg-black/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-md border" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative">
        {/* Profile Info Overlapping Banner */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left z-10">
            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 bg-white">
                  <span className="font-display text-5xl text-[var(--forest-deep)]">{fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="md:mb-2">
              <h1 className="text-3xl font-display font-bold text-gray-900">{fullName || "Farm Member"}</h1>
              <p className="text-gray-500 font-medium mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-[var(--forest-deep)] text-white shadow-lg shadow-forest-deep/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
          >
            <Package className="h-4 w-4" /> My Orders
          </button>
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'wishlist' ? 'bg-[var(--forest-deep)] text-white shadow-lg shadow-forest-deep/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
          >
            <Heart className="h-4 w-4" /> Liked Items
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-[var(--forest-deep)] text-white shadow-lg shadow-forest-deep/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
          >
            <Settings className="h-4 w-4" /> Profile Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Order History</h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ReceiptText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-1">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't made a purchase from our farm yet.</p>
                  <Button onClick={() => navigate({ to: "/" })} className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const customerInfo = parseOrderCustomerAddress(order.address, { full_name: fullName });

                    return (
                      <div key={order.id} className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gray-50/80 p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Order Placed</p>
                              <p className="font-medium text-gray-900 text-sm">
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
                              <p className="font-bold text-[var(--forest-deep)] text-sm">
                                ₹{order.total_amount ? order.total_amount.toLocaleString('en-IN') : (order.order_items?.reduce((sum, item) => sum + (item.price || 0) * 500 * item.quantity, 0) || 0).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Order ID</p>
                              <p className="font-mono text-xs text-gray-700">{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full bg-[var(--fresh)]/20 px-3 py-1 text-xs font-semibold text-[var(--forest-deep)]">
                              {order.status}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl h-8 text-xs font-medium border-gray-200 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedInvoiceOrder(order);
                                setTimeout(() => window.print(), 150);
                              }}
                            >
                              <Printer className="h-3.5 w-3.5 mr-1 text-[var(--forest-deep)]" /> Print Invoice
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Ordered Items</h4>
                              <div className="space-y-4">
                                {order.order_items?.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                                      {item.product?.image_url ? (
                                        <img src={item.product.image_url} className="h-full w-full object-cover" alt={item.product.title} />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-5 w-5 text-gray-400"/></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900">{item.product?.title || "Product"}</h5>
                                      <p className="text-xs text-gray-600 font-medium mt-0.5">
                                        ₹{item.price} / kg × 500 kg ({item.quantity} batch{item.quantity > 1 ? "es" : ""}) = <span className="font-bold text-gray-900">₹{(item.price * 500 * item.quantity).toLocaleString('en-IN')}</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6 space-y-4">
                              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2">
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-[var(--forest-deep)]" /> Customer Info
                                  </h4>
                                  <p className="text-sm font-semibold text-gray-900">{customerInfo.name}</p>
                                  {customerInfo.phone && customerInfo.phone !== "Not Provided" && (
                                    <p className="text-xs text-gray-600 font-mono mt-0.5 flex items-center gap-1">
                                      <Phone className="h-3 w-3 text-gray-400" /> {customerInfo.phone}
                                    </p>
                                  )}
                                </div>

                                <div className="border-t border-gray-200/60 pt-2">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-[var(--forest-deep)]" /> Delivery Address
                                  </h4>
                                  <p className="text-xs text-gray-700 leading-relaxed">{customerInfo.formattedAddress}</p>
                                </div>

                                <div className="border-t border-gray-200/60 pt-2">
                                  <p className="text-[11px] text-gray-400 font-mono">Ref: {order.payment_id}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Liked Items</h2>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-6">Save items you love to view them later.</p>
                  <Button onClick={() => navigate({ to: "/" })} className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl">
                    Discover Farm Fresh
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-forest-deep/5 transition-all">
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                        {item.product_image ? (
                          <img src={item.product_image} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" alt="" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300"><ImageIcon className="h-8 w-8" /></div>
                        )}
                        <button 
                          onClick={async () => {
                            await supabase.from('liked_items').delete().eq('id', item.id);
                            setWishlist(wishlist.filter(w => w.id !== item.id));
                            toast.success("Removed from liked items");
                          }}
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md text-red-500 hover:scale-110 transition-transform"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="mb-1 w-fit rounded-full bg-[var(--fresh)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--forest-deep)]">
                          Saved
                        </span>
                        <h3 className="font-medium text-gray-900">{item.product_title}</h3>
                        {item.product_price > 0 && (
                          <p className="mt-0.5 text-sm font-semibold text-gray-900">₹{item.product_price} / kg</p>
                        )}
                        <p className="mt-1 text-xs font-semibold text-[var(--forest-deep)] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">Min Order: 500 kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 max-w-2xl">
                <form onSubmit={updateProfile} className="space-y-8">
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0 relative group">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ImageIcon className="h-6 w-6 text-white" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadAvatar}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Upload a new photo</p>
                        <p className="text-xs text-gray-500 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
                        <label className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 cursor-pointer transition">
                          {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</> : "Choose file"}
                          <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8 space-y-5">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address (Read Only)</label>
                      <Input value={user?.email} disabled className="bg-gray-50/50 rounded-xl border-gray-200 text-gray-500 h-11" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)] h-11"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl h-11 px-8">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Printable Invoice for Customer (Hidden on screen, visible on print via CSS) */}
      {selectedInvoiceOrder && invoiceCustomerInfo && (
        <div id="printable-invoice" className="hidden print:block p-8 bg-white text-black font-sans w-full absolute top-0 left-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Marinovate Farms Logo" className="h-20 w-20 object-contain" />
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-1 uppercase tracking-wider">
                  Marinovate Farms
                </h1>
                <p className="text-xs text-gray-600 font-medium">Premium Agro & Fishery Bulk Produce</p>
                <p className="text-xs text-gray-500 max-w-md mt-0.5">
                  2nd Floor, Flat No. 201, Door No. 1-95/40, Sai Prabha Apartment, Rajiv Nagar, Uppal, Hyderabad - 500039, Telangana
                </p>
                <p className="text-xs text-gray-500">Email: support@marinovate.com | Web: www.marinovatefarms.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">TAX INVOICE</h2>
              <div className="text-xs text-gray-700 space-y-1 mt-2">
                <p><span className="font-semibold">Invoice No:</span> INV-{selectedInvoiceOrder.id.slice(0, 8).toUpperCase()}</p>
                <p><span className="font-semibold">Date:</span> {new Date(selectedInvoiceOrder.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                <p><span className="font-semibold">Status:</span> {selectedInvoiceOrder.status}</p>
                <p><span className="font-semibold">Payment Ref:</span> {selectedInvoiceOrder.payment_id}</p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Box */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-300 mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 border-b border-gray-300 pb-1">
                Billed To & Customer Details
              </h3>
              <p className="text-base font-bold text-gray-900">{invoiceCustomerInfo.name}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                <span className="font-semibold">Phone:</span> {invoiceCustomerInfo.phone}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 border-b border-gray-300 pb-1">
                Delivery Location
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {invoiceCustomerInfo.formattedAddress}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-6 border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-800 text-xs">
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider border-r border-gray-300">#</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider border-r border-gray-300">Item Description</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center border-r border-gray-300">Qty (Batches)</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center border-r border-gray-300">Total Quantity</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right border-r border-gray-300">Rate (₹/kg)</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoiceOrder.order_items?.map((item: any, idx: number) => {
                const batches = item.quantity;
                const kgPerBatch = 500;
                const totalKg = batches * kgPerBatch;
                const ratePerKg = item.price;
                const lineTotal = totalKg * ratePerKg;
                return (
                  <tr key={item.id} className="border-b border-gray-300 text-sm">
                    <td className="py-2.5 px-3 text-gray-600 border-r border-gray-300">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-900 border-r border-gray-300">
                      {item.product?.title || "Farm Produce"}
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-gray-300">{batches}</td>
                    <td className="py-2.5 px-3 text-center font-semibold border-r border-gray-300">
                      {totalKg.toLocaleString("en-IN")} kg
                    </td>
                    <td className="py-2.5 px-3 text-right border-r border-gray-300">₹{ratePerKg.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 font-bold text-right">₹{lineTotal.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary / Total Section */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2 border border-gray-300 rounded p-4 bg-gray-50 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal:</span>
                <span>₹{selectedInvoiceOrder.total_amount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery / Logistics:</span>
                <span className="font-semibold text-emerald-700">Free Express Shipping</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold border-t-2 border-gray-900 text-gray-900">
                <span>Grand Total:</span>
                <span>₹{selectedInvoiceOrder.total_amount?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-300 pt-6 space-y-1">
            <p className="font-semibold text-gray-800">Thank you for your bulk order with Marinovate Farms!</p>
            <p>This is a computer-generated invoice. For order queries or support, contact support@marinovate.com or +91-9876543210.</p>
          </div>
        </div>
      )}
    </div>
  );
}

