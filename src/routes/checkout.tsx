import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore, parseNumericPrice } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import { MapPin, ArrowLeft, Loader2, Info } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items = [], totalAmount, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [addressDetails, setAddressDetails] = useState({
    street: "",
    cityVillage: "",
    state: "",
    zipCode: "",
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState("");

  const [appliedCoupon] = useState<{ code: string; discount_amount: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading checkout...</div>
      </div>
    );
  }

  const safeTotal = typeof totalAmount === "function" ? parseNumericPrice(totalAmount()) : 0;
  const discountAmount = appliedCoupon ? parseNumericPrice(appliedCoupon.discount_amount) : 0;
  const finalTotal = Math.max(0, safeTotal - discountAmount);

  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        setAddressDetails((prev) => ({
          ...prev,
          cityVillage: data.address.village || data.address.town || data.address.city || prev.cityVillage,
          state: data.address.state || prev.state,
          zipCode: data.address.postcode || prev.zipCode,
        }));
        setLocationMsg("Location successfully captured and address pre-filled!");
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      setLocationMsg("Location captured. Please fill in the details manually.");
    }
  };

  const getLocation = () => {
    setIsLocating(true);
    setLocationMsg("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          handleReverseGeocode(lat, lng);
          setIsLocating(false);
        },
        (err) => {
          setIsLocating(false);
          alert(`Error accessing location: ${err.message}. Please fill the address manually.`);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    if (!addressDetails.street || !addressDetails.cityVillage || !addressDetails.state || !addressDetails.zipCode) {
      alert("Please fill out all address fields (Street Address, Village/City, State, Zip Code).");
      return;
    }

    if (!location) {
      alert("Please click the 'Get Live Location' button above to confirm your delivery location.");
      return;
    }

    const fullAddress = `${addressDetails.street}, ${addressDetails.cityVillage}, ${addressDetails.state}, ${addressDetails.zipCode}`;

    // Check that Razorpay script has loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      alert("Payment gateway is loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(finalTotal * 100), // amount in paise
      currency: "INR",
      name: "Marinovate Farms",
      description: `Bulk Order - ${items.length} product(s)`,
      image: "/logo.png",
      handler: async (response: { razorpay_payment_id: string }) => {
        // Payment successful — now save the order to Supabase
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const userId = user?.id || "anonymous_user";

          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([
              {
                user_id: userId,
                total_amount: finalTotal,
                payment_id: response.razorpay_payment_id,
                address: fullAddress,
                latitude: location.lat,
                longitude: location.lng,
                status: "Order Confirmed",
              },
            ])
            .select()
            .single();

          if (orderError) throw orderError;

          const orderItemsData = items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: parseNumericPrice(item.price),
          }));

          const { error: itemsError } = await supabase.from("order_items").insert(orderItemsData);
          if (itemsError) throw itemsError;

          clearCart();
          alert(`Payment Successful! Order Placed.\nPayment ID: ${response.razorpay_payment_id}\nTotal: ₹${finalTotal.toLocaleString("en-IN")}`);
          navigate({ to: "/profile" });
        } catch (error: any) {
          console.error("Error saving order after payment:", error);
          alert("Payment was successful but there was an error saving your order. Please contact support with your payment ID: " + response.razorpay_payment_id);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        address: fullAddress,
        latitude: location.lat,
        longitude: location.lng,
      },
      theme: {
        color: "#1a5c38",
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on("payment.failed", (response: { error: { description: string } }) => {
        setIsProcessing(false);
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Razorpay error:", error);
      alert("Could not open payment gateway. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Banner Header */}
      <div className="relative h-64 w-full overflow-hidden bg-[var(--forest-deep)]">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
          alt="Checkout banner"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition bg-black/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative -mt-16 z-10">
        <h1 className="text-4xl font-display font-bold text-white drop-shadow-md mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">Delivery Address</h2>
                <Button
                  onClick={getLocation}
                  disabled={isLocating}
                  variant={location ? "outline" : "default"}
                  className={
                    location
                      ? "border-[var(--forest-deep)] text-[var(--forest-deep)]"
                      : "bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white"
                  }
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {location ? "Update Location" : "Get Live Location"}
                </Button>
              </div>

              {locationMsg && (
                <div className="mb-6 flex items-start gap-3 bg-[var(--fresh)]/20 p-4 rounded-xl border border-[var(--fresh)]/30 text-[var(--forest-deep)] text-sm">
                  <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{locationMsg}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Street Address
                  </label>
                  <Input
                    value={addressDetails.street}
                    onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                    placeholder="House No, Building, Street Area..."
                    className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Village / City
                    </label>
                    <Input
                      value={addressDetails.cityVillage}
                      onChange={(e) => setAddressDetails({ ...addressDetails, cityVillage: e.target.value })}
                      className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                      State
                    </label>
                    <Input
                      value={addressDetails.state}
                      onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                      className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Zip Code
                  </label>
                  <Input
                    value={addressDetails.zipCode}
                    onChange={(e) => setAddressDetails({ ...addressDetails, zipCode: e.target.value })}
                    className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const p = parseNumericPrice(item.price);
                  const q = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
                  const itemTotal = p * 500 * q;

                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-gray-500 text-xs">
                            ₹{p} / kg × 500 kg × {q}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gray-900">₹{itemTotal.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6 space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Batch Minimum</span>
                  <span className="font-semibold text-gray-900">500 kg per item</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free Express Shipping</span>
                </div>
                <div className="flex justify-between items-center font-display font-bold text-lg text-gray-900 border-t border-gray-100 pt-4">
                  <span>Total Amount</span>
                  <span className="text-[var(--forest-deep)] font-display text-2xl">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                className="w-full min-h-[56px] py-4 px-6 text-base font-bold bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl shadow-lg shadow-forest-deep/20 transition-all active:scale-[0.98] cursor-pointer mt-4"
                onClick={handlePayment}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  `Place Order · ₹${finalTotal.toLocaleString("en-IN")}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
