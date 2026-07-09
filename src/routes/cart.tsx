import { createFileRoute } from "@tanstack/react-router";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, totalAmount, removeItem } = useCartStore();

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500">
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </div>
          ))}
          <div className="text-xl font-bold text-right pt-4">
            Total: ₹{totalAmount().toFixed(2)}
          </div>
          <div className="flex justify-end pt-4">
            <Link to="/checkout">
              <Button size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
