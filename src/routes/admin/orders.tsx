import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, User, Phone, MapPin, Printer, CreditCard, Calendar, Eye } from "lucide-react";
import { fetchAllOrders } from "./-admin.server";
import { parseOrderCustomerAddress } from "@/lib/orderUtils";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: { title: string };
};

type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  payment_id: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  profile?: { full_name?: string } | null;
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Uses a server function with the secret key — bypasses RLS to see ALL orders
      const data = await fetchAllOrders();
      setOrders(data as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-[var(--forest-deep)] h-8 w-8" />
      </div>
    );
  }

  const selectedOrderCustomer = selectedOrder
    ? parseOrderCustomerAddress(selectedOrder.address, selectedOrder.profile)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Invoices & Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bulk orders, track deliveries, and print invoices</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-semibold text-gray-900">Order ID</TableHead>
              <TableHead className="font-semibold text-gray-900">Customer Details</TableHead>
              <TableHead className="font-semibold text-gray-900">Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Total</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const customerInfo = parseOrderCustomerAddress(order.address, order.profile);

                return (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono text-xs font-medium text-gray-800">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                          <User className="h-3.5 w-3.5 text-[var(--forest-deep)] flex-shrink-0" />
                          <span>{customerInfo.name}</span>
                        </div>
                        {customerInfo.phone && customerInfo.phone !== "Not Provided" && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span>{customerInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-bold text-[var(--forest-deep)]">
                      ₹{order.total_amount ? order.total_amount.toLocaleString("en-IN") : "0"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-[var(--fresh)]/20 px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase text-[var(--forest-deep)]">
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-8 text-xs font-medium"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-lg h-8 text-xs font-medium bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white"
                        onClick={() => {
                          setSelectedOrder(order);
                          setTimeout(() => window.print(), 150);
                        }}
                      >
                        <Printer className="h-3.5 w-3.5 mr-1" /> Print Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl print:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[var(--forest-deep)] flex justify-between items-center pr-8">
              <span>Order Details</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 border-gray-300"
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && selectedOrderCustomer && (
            <div className="space-y-6 mt-4">
              
              {/* Customer & Payment Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Info Card */}
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200/60 pb-2">
                    <User className="h-4 w-4 text-[var(--forest-deep)]" />
                    <h3 className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Customer Details</h3>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-bold text-gray-900">{selectedOrderCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact / Mobile</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-medium text-gray-900 font-mono">{selectedOrderCustomer.phone}</p>
                      {selectedOrderCustomer.phone !== "Not Provided" && (
                        <a
                          href={`tel:${selectedOrderCustomer.phone}`}
                          className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded"
                        >
                          <Phone className="h-3 w-3" /> Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery & Payment Card */}
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200/60 pb-2">
                    <MapPin className="h-4 w-4 text-[var(--forest-deep)]" />
                    <h3 className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Delivery & Payment</h3>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-sm text-gray-900 leading-snug">{selectedOrderCustomer.formattedAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Reference</p>
                    <p className="text-xs font-mono font-medium text-gray-700">{selectedOrder.payment_id}</p>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="font-display font-semibold mb-3 text-gray-900 text-lg">Order Items</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty (Batches)</TableHead>
                        <TableHead className="text-center">Total Weight</TableHead>
                        <TableHead>Rate (₹/kg)</TableHead>
                        <TableHead className="text-right">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.order_items?.map((item) => {
                        const batches = item.quantity;
                        const totalKg = batches * 500;
                        const lineTotal = totalKg * item.price;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium text-gray-900">
                              {item.product?.title || "Product"}
                            </TableCell>
                            <TableCell className="text-center">{batches}</TableCell>
                            <TableCell className="text-center font-semibold text-gray-900">
                              {totalKg.toLocaleString("en-IN")} kg
                            </TableCell>
                            <TableCell>₹{item.price.toLocaleString("en-IN")}/kg</TableCell>
                            <TableCell className="text-right font-bold text-[var(--forest-deep)]">
                              ₹{lineTotal.toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Live Location Map */}
              {selectedOrder.latitude && selectedOrder.longitude && (
                <div>
                  <h3 className="font-display font-semibold mb-3 text-gray-900 text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--forest-deep)]" /> Captured Delivery Location
                  </h3>
                  <div className="h-[280px] rounded-xl overflow-hidden border border-gray-100 relative z-0 shadow-sm">
                    <MapContainer
                      center={[selectedOrder.latitude, selectedOrder.longitude]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[selectedOrder.latitude, selectedOrder.longitude]}>
                        <Popup>
                          <div className="text-xs">
                            <p className="font-bold text-gray-900">{selectedOrderCustomer.name}</p>
                            <p className="text-gray-600">{selectedOrderCustomer.phone}</p>
                            <p className="text-gray-500 mt-1">{selectedOrderCustomer.formattedAddress}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Printable Invoice View (Hidden on screen, visible on print via CSS) */}
      {selectedOrder && selectedOrderCustomer && (
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
                <p><span className="font-semibold">Invoice No:</span> INV-{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                <p><span className="font-semibold">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                <p><span className="font-semibold">Status:</span> {selectedOrder.status}</p>
                <p><span className="font-semibold">Payment Ref:</span> {selectedOrder.payment_id}</p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Box */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-300 mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 border-b border-gray-300 pb-1">
                Billed To & Customer Details
              </h3>
              <p className="text-base font-bold text-gray-900">{selectedOrderCustomer.name}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                <span className="font-semibold">Phone:</span> {selectedOrderCustomer.phone}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 border-b border-gray-300 pb-1">
                Delivery Location
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedOrderCustomer.formattedAddress}
              </p>
              {selectedOrder.latitude && selectedOrder.longitude && (
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  GPS: {selectedOrder.latitude.toFixed(5)}, {selectedOrder.longitude.toFixed(5)}
                </p>
              )}
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
              {selectedOrder.order_items?.map((item, idx) => {
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
                <span>₹{selectedOrder.total_amount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery / Logistics:</span>
                <span className="font-semibold text-emerald-700">Free Express Shipping</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold border-t-2 border-gray-900 text-gray-900">
                <span>Grand Total:</span>
                <span>₹{selectedOrder.total_amount?.toLocaleString("en-IN")}</span>
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

