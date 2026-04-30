"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      setToken(data.token);
      router.replace("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--muted)] bg-white p-8 shadow-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/logoimg.jpeg"
            alt="Logo"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-[var(--primary)]">
          Admin Login
        </h1>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--muted)] px-4 py-3 outline-none focus:border-[var(--primary)]"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--muted)] px-4 py-3 outline-none focus:border-[var(--primary)]"
          />

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-3 font-medium text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}