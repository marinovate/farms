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
import { supabase } from "@/lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

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
      const { data, error } = await supabase.from("orders").select(`
          *,
          order_items (
            *,
            product:products(title)
          )
        `).order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setOrders(data as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--forest-deep)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-gray-900">Invoice & Orders</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-semibold text-gray-900">Order ID</TableHead>
              <TableHead className="font-semibold text-gray-900">Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Total</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-semibold text-[var(--forest-deep)]">₹{order.total_amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-[var(--fresh)]/20 px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase text-[var(--forest-deep)]">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="rounded-lg bg-[var(--forest-deep)] hover:bg-[var(--forest)]" 
                      onClick={() => {
                        setSelectedOrder(order);
                        setTimeout(() => window.print(), 100);
                      }}
                    >
                      Print Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl print:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[var(--forest-deep)] flex justify-between items-center pr-8">
              Order Details
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="hidden sm:flex"
              >
                Print Invoice
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-1">Payment ID</h3>
                  <p className="text-gray-900 font-mono text-sm">{selectedOrder.payment_id}</p>
                </div>
                <div>
                  <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-1">Delivery Address</h3>
                  <p className="text-gray-900 text-sm">{selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold mb-3 text-gray-900 text-lg">Order Items</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.order_items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product?.title || "Unknown"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{item.quantity * item.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold mb-3 text-gray-900 text-lg">Live Location</h3>
                <div className="h-[300px] rounded-xl overflow-hidden border border-gray-100 relative z-0">
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
                      <Popup>Delivery Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Printable Invoice View (Hidden on screen, visible on print via CSS) */}
      {selectedOrder && (
        <div id="printable-invoice" className="hidden print:block p-8 bg-white text-black font-sans w-full absolute top-0 left-0">
          <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Marinovate Farms Logo" className="h-20 w-20 object-contain" />
              <div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-1 uppercase tracking-wider">Marinovate Farms</h1>
                <p className="text-sm text-gray-600">Premium Organic Produce</p>
                <p className="text-sm text-gray-600">123 Farmville Road, Agri District</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">INVOICE</h2>
              <p className="text-sm font-semibold mt-2">Order ID: {selectedOrder.id}</p>
              <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              <p className="text-sm">Status: {selectedOrder.status}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Billed To / Delivery</h3>
            <p className="text-base text-gray-900 max-w-sm whitespace-pre-wrap">{selectedOrder.address}</p>
            <p className="text-sm text-gray-600 mt-2">Payment Ref: {selectedOrder.payment_id}</p>
          </div>

          <table className="w-full text-left border-collapse mb-10">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="py-3 text-sm font-bold uppercase tracking-wider">Item Description</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-center">Qty</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-right">Price</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.order_items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4 text-sm font-medium">{item.product?.title || "Unknown Product"}</td>
                  <td className="py-4 text-sm text-center">{item.quantity}</td>
                  <td className="py-4 text-sm text-right">₹{item.price}</td>
                  <td className="py-4 text-sm font-bold text-right">₹{item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-800">
                <span>Total Amount:</span>
                <span>₹{selectedOrder.total_amount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
            <p>Thank you for shopping with Marinovate Farms!</p>
            <p>For support, contact support@marinovate.com</p>
          </div>
        </div>
      )}
    </div>
  );
}
