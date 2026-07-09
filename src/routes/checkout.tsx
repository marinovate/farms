import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import { MapPin, ArrowLeft, Loader2, Info, Tag, X } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();

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

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount_amount: number} | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = Math.max(0, totalAmount() - discountAmount);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    const fullAddress = `${addressDetails.street}, ${addressDetails.cityVillage}, ${addressDetails.state}, ${addressDetails.zipCode}`;
    if (!addressDetails.street || !addressDetails.cityVillage || !addressDetails.state || !addressDetails.zipCode) {
      alert("Please fill out all address fields.");
      return;
    }

    if (!location) {
      alert("Please get your live location for precise delivery.");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: finalTotal * 100,
      currency: "INR",
      name: "Marinovate Farms",
      description: "Farm Fresh Order",
      handler: async function (response: { razorpay_payment_id: string }) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id || "anonymous_user";

          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([{
              user_id: userId,
              total_amount: finalTotal,
              payment_id: response.razorpay_payment_id,
              address: fullAddress,
              latitude: location.lat,
              longitude: location.lng,
              status: "Paid",
            }])
            .select()
            .single();

          if (orderError) throw orderError;

          const orderItemsData = items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase.from("order_items").insert(orderItemsData);
          if (itemsError) throw itemsError;

          clearCart();
          alert(`Payment Successful! Order Confirmed.`);
          navigate({ to: "/profile" });
        } catch (error) {
          console.error("Error saving order details:", error);
          alert("Payment succeeded but error saving order. Check console.");
        }
      },
      prefill: {
        name: "Customer",
      },
      theme: {
        color: "#18453B", // var(--forest-deep)
      },
    };

    // @ts-expect-error Razorpay is added dynamically via script tag
    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response: { error: { description: string } }) {
      alert(`Payment Failed: ${response.error.description}`);
    });
    rzp1.open();
    setIsProcessing(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponInput.trim().toUpperCase())
        .single();

      if (error || !data) {
        setCouponError("Invalid coupon code");
        return;
      }

      if (!data.is_active) {
        setCouponError("This coupon is no longer active");
        return;
      }

      setAppliedCoupon({
        code: data.code,
        discount_amount: data.discount_amount
      });
      setCouponInput("");
    } catch (err) {
      console.error(err);
      setCouponError("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
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
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
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
                  className={location ? "border-[var(--forest-deep)] text-[var(--forest-deep)]" : "bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white"}
                >
                  {isLocating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Street Address</label>
                  <Input 
                    value={addressDetails.street} 
                    onChange={e => setAddressDetails({...addressDetails, street: e.target.value})}
                    placeholder="House No, Building, Street Area..."
                    className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Village / City</label>
                    <Input 
                      value={addressDetails.cityVillage} 
                      onChange={e => setAddressDetails({...addressDetails, cityVillage: e.target.value})}
                      className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">State</label>
                    <Input 
                      value={addressDetails.state} 
                      onChange={e => setAddressDetails({...addressDetails, state: e.target.value})}
                      className="rounded-xl h-11 border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Zip Code</label>
                  <Input 
                    value={addressDetails.zipCode} 
                    onChange={e => setAddressDetails({...addressDetails, zipCode: e.target.value})}
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
                {items.map((item) => (
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
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">
                
                {/* Coupon Section */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {appliedCoupon.code} applied (-₹{appliedCoupon.discount_amount})
                        </span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="p-1 rounded-full hover:bg-green-100 text-green-700 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Coupon Code" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="uppercase rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)] h-11"
                        />
                        <Button 
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim() || isApplyingCoupon}
                          variant="outline"
                          className="rounded-xl h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-xs mt-2 ml-1">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-2 text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center font-display font-bold text-lg text-gray-900 border-t border-gray-100 pt-4">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full h-14 text-base font-medium bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl shadow-lg shadow-forest-deep/20 transition-all active:scale-[0.98]"
                onClick={handlePayment}
                disabled={isProcessing || !addressDetails.street || !addressDetails.cityVillage || !location || items.length === 0}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pay ₹${finalTotal.toFixed(2)}`}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
