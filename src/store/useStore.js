import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

const useStore = create(
  persist(
    (set) => ({
      // --- STATE ---
      cart: [],
      wishlist: [],
      user: null,
      isAuthenticated: false,
      currentPage: 1,

      setCurrentPage: (page) => set({ currentPage: page }),
      // --- AUTH ACTIONS ---
      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
        // Personalize the welcome message
        toast.success(`Welcome back, ${userData.name}!`, {
          icon: "👋",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, cart: [] });
        toast("Logged out successfully", { icon: "🔒" });
      },

      // --- CART ACTIONS ---
      clearCart: () => {
        set({ cart: [] });
        toast.success("Cart cleared");
      },

      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.id === product.id,
          );

          toast.success(`${product.title} added to cart!`, {
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
            icon: "🛒",
          });

          if (existingIndex !== -1) {
            const newCart = [...state.cart];
            newCart[existingIndex].quantity += 1;
            return { cart: newCart };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      decreaseQuantity: (productId) =>
        set((state) => {
          const item = state.cart.find((i) => i.id === productId);

          // If quantity is about to be 0, show a removal toast
          if (item?.quantity === 1) {
            toast.error("Item removed from cart");
          }

          const newCart = state.cart
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0);
          return { cart: newCart };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          toast.error("Item removed from cart");
          return {
            cart: state.cart.filter((item) => item.id !== productId),
          };
        }),

      // --- WISHLIST ACTIONS ---
      toggleWishlist: (product) =>
        set((state) => {
          const isExist = state.wishlist.find((item) => item.id === product.id);

          if (isExist) {
            toast("Removed from wishlist", { icon: "💔" });
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id),
            };
          }

          toast.success("Added to wishlist!", {
            icon: "❤️",
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
          });
          return { wishlist: [...state.wishlist, product] };
        }),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "shop-storage",
    },
  ),
);

export default useStore;
