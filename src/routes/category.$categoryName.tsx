import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard, Product, CartItem } from "@/components/marinovate/MarinovateHome";
import { ArrowLeft, Loader2, ShoppingCart, Plus, Minus, X, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";


export const Route = createFileRoute("/category/$categoryName")({
  component: CategoryPage,
});

/* ------------------------------------------------------------------ */
/* Nav (Simplified)                                                    */
/* ------------------------------------------------------------------ */
function Nav({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <nav
        className={`flex items-center gap-2 rounded-full border transition-all duration-500 ${
          scrolled
            ? "border-white/60 bg-white/70 shadow-[0_10px_40px_-15px_rgba(30,86,49,0.35)] backdrop-blur-xl"
            : "border-gray-200 bg-white/80 backdrop-blur-md"
        } px-3 py-2`}
      >
        <Link to="/" className="flex items-center gap-3 pl-1 pr-4 py-1">
          <img src="/logo.png" alt="Marinovate Farms" className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-xl bg-white shadow-sm" />
          <span className="font-display text-[18px] font-bold tracking-tight uppercase mt-1 text-gray-900">
            Marinovate Farms
          </span>
        </Link>
        <div className="mx-2 hidden h-6 w-px bg-black/10 md:block" />
        <Link to="/" className="hidden md:block rounded-full px-4 py-1.5 text-sm transition text-gray-700 hover:bg-black/5 hover:text-gray-900">
          Back to Home
        </Link>
        
        <div className="ml-1 flex items-center gap-2">
          <Link
            to="/profile"
            className="grid h-10 w-10 place-items-center rounded-full border border-black/5 bg-black/5 text-gray-700 transition hover:bg-black/10 hover:text-gray-900"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            onClick={onOpenCart}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--forest-deep)] text-[var(--cream)] transition hover:bg-[var(--forest)]"
          >
            <ShoppingCart className="h-4 w-4" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-[10px] font-bold text-gray-900"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Cart Sidebar                                                        */
/* ------------------------------------------------------------------ */
function CartSidebar({
  isOpen,
  onClose,
  cart,
  updateQuantity,
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
}) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="font-display text-2xl text-[var(--forest-deep)]">Your Cart</h2>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 transition hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="grid h-7 w-7 place-items-center rounded-md border border-gray-200 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="grid h-7 w-7 place-items-center rounded-md border border-gray-200 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <button
                  onClick={() => {
                    onClose();
                    navigate({ to: '/checkout' });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest-deep)] py-4 text-sm font-medium text-white transition hover:bg-[var(--forest)]"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Page Component                                                       */
/* ------------------------------------------------------------------ */
function CategoryPage() {
  const { categoryName } = Route.useParams();
  const navigate = useNavigate();
  const cartStore = useCartStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cart = cartStore.items.map(i => ({ 
    id: i.id, 
    name: i.title, 
    category: 'Vegetables' as const, 
    price: `₹${i.price}`, 
    image: i.imageUrl || '', 
    quantity: i.quantity 
  }));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = async (product: Product) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: '/login' });
      return;
    }
    
    cartStore.addItem({
      id: product.id,
      title: product.name,
      price: parseFloat(product.price.replace(/[^\d.-]/g, '')),
      quantity: 1,
      imageUrl: product.image
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = cartStore.items.find(i => i.id === id);
    if (item) {
      if (item.quantity + delta <= 0) {
        cartStore.removeItem(id);
      } else {
        cartStore.updateQuantity(id, item.quantity + delta);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName);
        
      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.title,
          category: p.category || categoryName,
          price: `₹${p.price} / kg`,
          original_price: p.original_price ? `₹${p.original_price} / kg` : undefined,
          image: p.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80'
        } as Product)));
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div className="bg-[var(--cream)] min-h-screen selection:bg-[var(--forest-deep)] selection:text-white pt-32 pb-24">
      <Nav cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
      />
      
      <main className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">{categoryName}</h1>
            <p className="mt-2 text-gray-600">Explore our premium selection of {categoryName.toLowerCase()}</p>
          </div>
          <div className="mt-4 md:mt-0 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            {products.length} products found
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-[var(--forest-deep)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-gray-200 bg-white/50 text-center">
            <span className="text-4xl mb-4">🌱</span>
            <h3 className="font-display text-xl font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2">Check back later for fresh stock in this category!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} addToCart={addToCart} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
