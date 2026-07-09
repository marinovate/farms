import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface LikeStore {
  likedIds: string[];
  initialized: boolean;
  fetchLikedItems: () => Promise<void>;
  toggleLike: (product: any, navigate: any) => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedIds: [],
  initialized: false,
  fetchLikedItems: async () => {
    if (get().initialized) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      set({ initialized: true });
      return;
    }
    const { data } = await supabase.from('liked_items')
      .select('product_id')
      .eq('user_id', session.user.id);
    if (data) {
      set({ likedIds: data.map(d => d.product_id), initialized: true });
    } else {
      set({ initialized: true });
    }
  },
  toggleLike: async (product, navigate) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    const isLiked = get().likedIds.includes(product.id);
    const prevLiked = get().likedIds;
    
    // Optimistic UI update
    if (isLiked) {
      set({ likedIds: prevLiked.filter(id => id !== product.id) });
    } else {
      set({ likedIds: [...prevLiked, product.id] });
    }
    
    try {
      if (isLiked) {
        await supabase.from('liked_items').delete().eq('product_id', product.id).eq('user_id', session.user.id);
        toast.success("Removed from liked items");
      } else {
        const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        await supabase.from('liked_items').insert({
          user_id: session.user.id,
          product_id: product.id,
          product_title: product.name,
          product_price: priceNum,
          product_image: product.image
        });
        toast.success("Added to liked items!");
      }
    } catch (e) {
      // Revert on failure
      set({ likedIds: prevLiked });
      console.error(e);
      toast.error("Failed to update liked items");
    }
  }
}));
