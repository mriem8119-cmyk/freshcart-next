
"use client";

import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function WishlistContent() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getWishlist() {
    try {
      const { data } = await api.get("/wishlist", { headers: { token } });
      setItems(data.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getWishlist();
  }, []);

  async function removeItem(id) {
    try {
      await api.delete(`/wishlist/${id}`, { headers: { token } });
      toast.success("Removed from wishlist");
      getWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  async function addToCart(id) {
    try {
      await api.post("/cart", { productId: id }, { headers: { token } });
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (items.length === 0) return <p className="text-center p-10">Your wishlist is empty</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Wishlist</h2>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border rounded-lg p-3">
          <img src={item.imageCover} alt={item.title} className="w-24 h-24 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p>{item.price} EGP</p>
            <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm">
              Remove
            </button>
          </div>
          <button onClick={() => addToCart(item.id)} className="bg-green-600 text-white px-4 py-2 rounded">
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}