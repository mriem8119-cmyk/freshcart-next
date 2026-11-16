"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTruck,
  FaGift,
  FaPhone,
  FaRegEnvelope,
  FaRegUser,
  FaUserPlus,
  FaSearch,
  FaChevronDown,
  FaHeadset,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data);
      } catch {
        setCategories([]);
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    async function getCount() {
      if (!token) {
        setCount(0);
        return;
      }
      try {
        const { data } = await api.get("/cart", { headers: { token } });
        setCount(data.numOfCartItems ?? 0);
      } catch {
        setCount(0);
      }
    }
    getCount();
    window.addEventListener("cart-updated", getCount);
    return () => window.removeEventListener("cart-updated", getCount);
  }, [token]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(search)}`);
  }

  function linkClass(href) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return active ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600";
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="border-b border-gray-100 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaTruck className="text-green-600" /> Free Shipping on Orders 500 EGP
            </span>
            <span className="hidden md:flex items-center gap-2">
              <FaGift className="text-green-600" /> New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden lg:flex items-center gap-2">
              <FaPhone className="text-green-600" /> +1 (800) 123-4567
            </span>
            <span className="hidden lg:flex items-center gap-2">
              <FaRegEnvelope className="text-green-600" /> support@freshcart.com
            </span>
            {token ? (
              <>
                <Link href="/orders" className="hover:text-green-600">
                  My Orders
                </Link>
                <Link href="/change-password" className="hover:text-green-600">
                  Change Password
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1 hover:text-green-600">
                  <FaRegUser /> Sign In
                </Link>
                <Link href="/register" className="flex items-center gap-1 hover:text-green-600">
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <FaShoppingCart className="text-green-600" /> FreshCart
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 items-center bg-gray-50 border border-gray-100 rounded-full pl-5 pr-1 py-1"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
            <FaSearch />
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/products" className={linkClass("/products")}>
            Shop
          </Link>

          <div className="relative group">
            <Link href="/categories" className={linkClass("/categories")}>
              <span className="flex items-center gap-1">
                Categories <FaChevronDown className="text-xs" />
              </span>
            </Link>
            <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-56">
                <Link href="/categories" className="block px-5 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category._id}`}
                    className="block px-5 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/brands" className={linkClass("/brands")}>
            Brands
          </Link>
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <div className="hidden xl:flex items-center gap-2 text-sm">
            <FaHeadset className="text-green-600 text-xl" />
            <div className="leading-tight">
              <p className="text-gray-400 text-xs">Support</p>
              <p className="font-semibold">24/7 Help</p>
            </div>
          </div>
          <Link href="/wishlist" className="text-xl text-gray-700 hover:text-green-600">
            <FaRegHeart />
          </Link>
          <Link href="/cart" className="relative text-xl text-gray-700 hover:text-green-600">
            <FaShoppingCart />
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-green-600 text-white rounded-full px-5 py-2 text-sm font-semibold"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-green-600 text-white rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
            >
              <FaRegUser /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}