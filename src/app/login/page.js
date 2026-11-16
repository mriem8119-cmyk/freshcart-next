

"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/signin", form);
      login(data.token);
      toast.success("Welcome back");
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 mt-10 space-y-3 border border-gray-100 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold">Login</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
        {loading ? "Loading..." : "Login"}
      </button>
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="text-green-600">
          Forgot password?
        </Link>
        <span>
          No account? <Link href="/register" className="text-green-600">Register</Link>
        </span>
      </div>
    </form>
  );
}