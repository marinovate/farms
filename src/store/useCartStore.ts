import { create } from "zustand";
import { persist } from "zustand/middleware";

export const parseNumericPrice = (val: any): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) || 0 : 0;
  }
  return 0;
};

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const cleanPrice = parseNumericPrice(item.price);
        const cleanQty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
        
        set((state) => {
          const items = state.items || [];
          const existingItem = items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: items.map((i) =>
                i.id === item.id ? { ...i, price: cleanPrice, quantity: i.quantity + cleanQty } : i
              ),
            };
          }
          return { items: [...items, { ...item, price: cleanPrice, quantity: cleanQty }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: (state.items || []).filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: (state.items || []).map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalAmount: () => {
        const items = get().items || [];
        return items.reduce((total, item) => {
          const price = parseNumericPrice(item.price);
          const qty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
          return total + price * 500 * qty;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
