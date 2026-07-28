import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCartStore, parseNumericPrice } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items = [], totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading cart...</div>
      </div>
    );
  }

  const safeTotal = parseNumericPrice(totalAmount());

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-28">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-500">Bulk Fresh Farm Wholesale Supply (Minimum 500kg / item)</p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 text-[var(--forest-deep)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Explore our bulk farm-fresh produce and add items to get instant wholesale pricing calculations.
            </p>
            <Link to="/">
              <Button className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl px-8 py-6 text-base">
                Start Bulk Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => {
                const numericPrice = parseNumericPrice(item.price);
                const qty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
                const subtotal = numericPrice * 500 * qty;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex items-center gap-4 transition hover:shadow-md"
                  >
                    <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-[var(--forest-deep)] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          ₹{numericPrice} / kg
                        </span>
                        <span className="text-xs text-gray-500">× 500 kg batch</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-2">
                        Subtotal: <span className="text-[var(--forest-deep)]">₹{subtotal.toLocaleString("en-IN")}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, qty - 1)}
                          className="h-6 w-6 grid place-items-center rounded text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-1">{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, qty + 1)}
                          className="h-6 w-6 grid place-items-center rounded text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm sticky top-28 space-y-5">
                <h2 className="text-xl font-display font-bold text-gray-900">Summary</h2>

                <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Minimum Batch Size</span>
                    <span className="font-semibold text-gray-900">500 kg per item</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span className="font-semibold text-gray-900">{items.length} product(s)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-green-600">FREE Wholesale Delivery</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-2xl font-display text-[var(--forest-deep)]">
                    ₹{safeTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link to="/checkout" className="block">
                  <Button className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl py-6 text-base font-medium flex items-center justify-center gap-2 shadow-lg shadow-forest-deep/20 transition-all">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
