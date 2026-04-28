import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";

const useStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      cart: [],
      wishlist: [],
      user: null,
      isAuthenticated: false,
      currentPage: 1,
      profile: null, // NEW: Store the custom profile data
      isLoading: false, // NEW: track loading state for auth checks

      setCurrentPage: (page) => set({ currentPage: page }),

      // --- AUTH ACTIONS ---

      // Used by App.jsx to sync Supabase session changes
      // Fetches the extra profile data (is_admin, etc.)
      fetchProfile: async (userId) => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (error) throw error;
          set({ profile: data });
          return data;
        } catch (err) {
          console.error("Profile fetch error:", err);
          return null;
        }
      },

      setUser: async (supabaseUser) => {
        set({ isLoading: true });
        if (supabaseUser) {
          // Fetch Profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();

          // Fetch Cart
          const { data: dbCart } = await supabase
            .from("cart_items")
            .select("product_data, quantity")
            .eq("user_id", supabaseUser.id);

          // NEW: Fetch Wishlist
          const { data: dbWishlist } = await supabase
            .from("wishlist_items")
            .select("product_data")
            .eq("user_id", supabaseUser.id);

          set({
            user: supabaseUser,
            profile: profile,
            // Format and sync Cart
            cart:
              dbCart?.map((i) => ({
                ...i.product_data,
                quantity: i.quantity,
              })) || [],
            // Format and sync Wishlist
            wishlist: dbWishlist?.map((i) => i.product_data) || [],
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            cart: [],
            wishlist: [],
          });
        }
      },

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch the profile immediately after login to check is_admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        set({ user: data.user, profile: profile, isAuthenticated: true });

        const displayName = profile?.full_name || data.user.email;
        toast.success(`Welcome back, ${displayName}!`, {
          icon: "👋",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });

        return data.user;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, isAuthenticated: false, cart: [] });
        toast("Logged out successfully", { icon: "🔒" });
      },

      // cart actions with database sync

      clearCart: async () => {
        const { isAuthenticated, user } = get();

        // 1. Local Update
        set({ cart: [] });
        toast.success("Cart cleared");

        // 2. Database Sync
        if (isAuthenticated && user) {
          await supabase.from("cart_items").delete().eq("user_id", user.id);
        }
      },

      addToCart: async (product) => {
        const { cart, isAuthenticated, user } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        toast.success(`${product.title} added to cart!`, {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
          icon: "🛒",
        });

        // 1. Local Update Logic
        if (existingItem) {
          const newCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
          set({ cart: newCart });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }

        // 2. Database Sync Logic
        if (isAuthenticated && user) {
          if (existingItem) {
            await supabase
              .from("cart_items")
              .update({ quantity: existingItem.quantity + 1 })
              .eq("user_id", user.id)
              .eq("product_id", product.id);
          } else {
            await supabase.from("cart_items").insert({
              user_id: user.id,
              product_id: product.id,
              product_data: product, // Stores title, price, image as JSON
              quantity: 1,
            });
          }
        }
      },

      decreaseQuantity: async (productId) => {
        const { cart, isAuthenticated, user } = get();
        const item = cart.find((i) => i.id === productId);
        if (!item) return;

        if (item.quantity === 1) {
          toast.error("Item removed from cart");
        }

        // 1. Local Update
        const newCart = cart
          .map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
          )
          .filter((i) => i.quantity > 0);

        set({ cart: newCart });

        // 2. Database Sync
        if (isAuthenticated && user) {
          if (item.quantity > 1) {
            await supabase
              .from("cart_items")
              .update({ quantity: item.quantity - 1 })
              .eq("user_id", user.id)
              .eq("product_id", productId);
          } else {
            await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", productId);
          }
        }
      },

      removeFromCart: async (productId) => {
        const { cart, isAuthenticated, user } = get();

        // 1. Local Update
        set({ cart: cart.filter((item) => item.id !== productId) });
        toast.error("Item removed from cart");

        // 2. Database Sync
        if (isAuthenticated && user) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);
        }
      },

      // --- WISHLIST ACTIONS ---
      // toggleWishlist: (product) =>
      //   set((state) => {
      //     const isExist = state.wishlist.find((item) => item.id === product.id);

      //     if (isExist) {
      //       toast("Removed from wishlist", { icon: "💔" });
      //       return {
      //         wishlist: state.wishlist.filter((item) => item.id !== product.id),
      //       };
      //     }

      //     toast.success("Added to wishlist!", {
      //       icon: "❤️",
      //       style: { borderRadius: "10px", background: "#333", color: "#fff" },
      //     });
      //     return { wishlist: [...state.wishlist, product] };
      //   }),
      toggleWishlist: async (product) => {
        const { wishlist, isAuthenticated, user } = get();
        const isExist = wishlist.find((item) => item.id === product.id);

        if (isExist) {
          // --- REMOVE LOGIC ---
          // 1. Local Update
          set({
            wishlist: wishlist.filter((item) => item.id !== product.id),
          });
          toast("Removed from wishlist", { icon: "💔" });

          // 2. Database Sync
          if (isAuthenticated && user) {
            await supabase
              .from("wishlist_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", product.id);
          }
        } else {
          // --- ADD LOGIC ---
          // 1. Local Update
          set({ wishlist: [...wishlist, product] });
          toast.success("Added to wishlist!", {
            icon: "❤️",
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
          });

          // 2. Database Sync
          if (isAuthenticated && user) {
            await supabase.from("wishlist_items").insert({
              user_id: user.id,
              product_id: product.id,
              product_data: product, // This saves the object into your JSONB column
            });
          }
        }
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "shop-storage",
    },
  ),
);

export default useStore;
