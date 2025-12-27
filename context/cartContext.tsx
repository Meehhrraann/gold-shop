"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  addToCart,
  decreaseFromCart,
  getCart,
  removeFromCart,
  syncLocalCart,
} from "@/lib/actions/cart.actions";
import { toast } from "sonner";

// --- TYPE DEFINITIONS ---
// Define a shape for your product to avoid 'any'
interface Product {
  _id: string;
  title: string;
  price: number;
  image?: string;
  [key: string]: any; // Allows for other flexible fields
}

type CartItem = {
  product: Product;
  quantity: number;
  _id?: string;
};

type CartContextType = {
  cartItems: CartItem[]; // Change 'cart' to 'cartItems'
  loading: boolean;
  itemCount: number;
  cartTotal: number;
  addItem: (product: Product) => void;
  decreaseItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void; // Add this if you use it in CheckoutSummary
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const currentUser = useCurrentUser();

  // ------------------------------------------------------------------
  // 1. THE SYNC & FETCH LOGIC
  // ------------------------------------------------------------------
  useEffect(() => {
    const handleCartSync = async () => {
      setLoading(true);

      try {
        // --- SCENARIO A: USER IS LOGGED IN ---
        if (currentUser?.id) {
          const localData = localStorage.getItem("shopping-cart");
          const localCart: CartItem[] = localData ? JSON.parse(localData) : [];

          if (localCart.length > 0) {
            toast.info("Synching cart...");

            // OPTIMIZATION: Send only IDs and Quantities, not full product objects
            const itemsToSync = localCart.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
            }));

            await syncLocalCart(currentUser.id, itemsToSync);

            // Clear local storage immediately after sync
            localStorage.removeItem("shopping-cart");
            toast.success("سبد به روز شد");
          }

          // Fetch the final merged cart from Database
          const dbCart = await getCart(currentUser.id);
          setCart(dbCart);
        }

        // --- SCENARIO B: GUEST USER ---
        else {
          const localData = localStorage.getItem("shopping-cart");
          if (localData) {
            setCart(JSON.parse(localData));
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Cart sync error:", error);
      } finally {
        setLoading(false);
      }
    };

    handleCartSync();
  }, [currentUser?.id]);

  // ------------------------------------------------------------------
  // 2. HELPER: SAVE TO LOCAL STORAGE
  // ------------------------------------------------------------------
  const saveToLocal = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("shopping-cart", JSON.stringify(newCart));
  };

  // ------------------------------------------------------------------
  // 3. ACTION: ADD ITEM
  // ------------------------------------------------------------------
  const addItem = (product: Product) => {
    const productId = product._id;

    // A. GUEST: Update Local Storage
    if (!currentUser?.id) {
      const existingIndex = cart.findIndex(
        (item) => item.product._id === productId,
      );
      let newCart = [...cart];

      if (existingIndex > -1) {
        newCart[existingIndex].quantity += 1;
      } else {
        newCart.push({ product: product, quantity: 1 });
      }
      saveToLocal(newCart);
      toast.success("به سبد اضافه شد");
      return;
    }

    // B. USER: Optimistic Update + Server Action
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    startTransition(async () => {
      const res = await addToCart({ userId: currentUser.id, productId });
      if (res?.error) toast.error(res.error);
    });
  };

  // ------------------------------------------------------------------
  // 4. ACTION: DECREASE ITEM
  // ------------------------------------------------------------------
  const decreaseItem = (productId: string) => {
    // A. GUEST
    if (!currentUser?.id) {
      const existingIndex = cart.findIndex(
        (item) => item.product._id === productId,
      );
      if (existingIndex === -1) return;

      let newCart = [...cart];
      if (newCart[existingIndex].quantity > 1) {
        newCart[existingIndex].quantity -= 1;
      } else {
        newCart.splice(existingIndex, 1);
      }
      saveToLocal(newCart);
      return;
    }

    // B. USER
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prev.filter((item) => item.product._id !== productId);
    });

    startTransition(async () => {
      await decreaseFromCart({ userId: currentUser.id, productId });
    });
  };

  // ------------------------------------------------------------------
  // 5. ACTION: REMOVE ITEM
  // ------------------------------------------------------------------
  const removeItem = (productId: string) => {
    // A. GUEST
    if (!currentUser?.id) {
      const newCart = cart.filter((item) => item.product._id !== productId);
      saveToLocal(newCart);
      toast.success("سبد حذف شد");
      return;
    }

    // B. USER
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
    startTransition(async () => {
      await removeFromCart({ userId: currentUser.id, productId });
      toast.success("سبد حذف شد");
    });
  };

  // ------------------------------------------------------------------
  // 6. CALCULATIONS
  // ------------------------------------------------------------------
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: cart, // Map the 'cart' state to the 'cartItems' key
        loading,
        itemCount,
        cartTotal,
        addItem,
        decreaseItem,
        removeItem,
        clearCart: () => saveToLocal([]), // Example implementation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
