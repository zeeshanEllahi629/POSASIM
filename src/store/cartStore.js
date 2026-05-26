import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isSidebarOpen: false,

      // Sidebar actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // Add item to cart
      addToCart: (item) => {
        set((state) => {
          // Match by id and variation_id
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.id === item.id && i.variation_id === item.variation_id
          );
          
          if (existingItemIndex > -1) {
            // Item exists, increment quantity
            const updatedItems = [...state.cartItems];
            updatedItems[existingItemIndex].quantity += (item.quantity || 1);
            return { cartItems: updatedItems, isSidebarOpen: true };
          } else {
            // New item, add to array
            return { cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }], isSidebarOpen: true };
          }
        });
      },

      // Update quantity
      updateQuantity: (id, variation_id, delta) => {
        set((state) => {
          const updatedItems = state.cartItems.map((item) => {
            if (item.id === id && item.variation_id === variation_id) {
              const newQuantity = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          return { cartItems: updatedItems };
        });
      },

      // Remove item
      removeItem: (id, variation_id) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => !(item.id === id && item.variation_id === variation_id))
        }));
      },

      // Clear cart
      clearCart: () => set({ cartItems: [] }),

      // Calculated Totals
      getSubtotal: () => {
        const items = get().cartItems;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        const items = get().cartItems;
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'foodefy-cart-storage', // unique name for localStorage
    }
  )
);
