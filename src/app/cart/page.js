"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function CartContent() {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getCart() {
    try {
      const { data } = await api.get("/cart", { headers: { token } });
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  async function updateCount(id, count) {
    try {
      await api.put(`/cart/${id}`, { count }, { headers: { token } });
      getCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  async function removeItem(id) {
    try {
      await api.delete(`/cart/${id}`, { headers: { token } });
      toast.success("Removed from cart");
      getCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  if (loading) return <p className="text-center p-10">Loading...</p>;

  const products = cart?.data?.products || [];
  if (products.length === 0) {
    return <p className="text-center p-10">Your cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Cart</h2>
      {products.map((item) => (
        <div key={item.product.id} className="flex items-center gap-4 border rounded-lg p-3">
          <img src={item.product.imageCover} alt={item.product.title} className="w-24 h-24 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-semibold">{item.product.title}</h3>
            <p>{item.price} EGP</p>
            <button onClick={() => removeItem(item.product.id)} className="text-red-600 text-sm">
              Remove
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={item.count === 1}
              onClick={() => updateCount(item.product.id, item.count - 1)}
              className="border px-3 rounded disabled:opacity-40"
            >
              -
            </button>
            <span>{item.count}</span>
            <button onClick={() => updateCount(item.product.id, item.count + 1)} className="border px-3 rounded">
              +
            </button>
          </div>
        </div>
      ))}
      <p className="text-xl font-bold">Total: {cart.data.totalCartPrice} EGP</p>
      <Link href="/checkout" className="inline-block bg-green-600 text-white px-6 py-2 rounded">
        Checkout
      </Link>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}