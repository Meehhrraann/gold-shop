"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button"; // Assuming you have shadcn/ui or similar
import { FaSpinner } from "react-icons/fa";

interface CartControlProps {
  product: any; // Or your IProduct interface
  compact?: boolean; // Option for smaller views
}

const CartControl = ({ product, compact = false }: CartControlProps) => {
  const { cartItems, addItem, decreaseItem, removeItem } = useCart();

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem?.quantity || 0;

  if (quantity === 0) {
    return (
      <Button
        // CHANGE HERE: Pass the full 'product' object, not just ID
        onClick={() => addItem(product)}
        className="bg-primary hover:bg-primary/90 text-foreground min-w-[140px] cursor-pointer p-1"
      >
        افزودن به سبد
      </Button>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gray-100 ${compact ? "p-1" : "gap-3 p-2 px-4"}`}
    >
      {/* Increase Button */}
      <button
        // CHANGE HERE: Pass full product
        onClick={() => addItem(product)}
        className="rounded-full bg-white p-1 text-green-600 transition-all hover:shadow-md"
      >
        <FaPlus size={12} />
      </button>

      {/* Quantity Display */}
      <span className="w-6 text-center font-bold text-gray-800 select-none">
        {quantity}
      </span>

      {/* Decrease/Remove Buttons (Pass ID is fine for removal) */}
      {quantity === 1 ? (
        <button
          onClick={() => removeItem(product._id)}
          className="rounded-full bg-white p-2 text-red-500 transition-all hover:shadow-md"
        >
          <FaTrash size={9} />
        </button>
      ) : (
        <button
          onClick={() => decreaseItem(product._id)}
          className="rounded-full bg-white p-1 text-gray-600 transition-all hover:shadow-md"
        >
          <FaMinus size={12} />
        </button>
      )}
    </div>
  );
};
export default CartControl;
