"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/utils/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("admin_jwt", data.token);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafc" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 16px #e2e8f0", minWidth: 320 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#22543d", marginBottom: 24 }}>Admin Login</h2>
        <label style={{ fontWeight: 600, color: "#22543d" }} htmlFor="username">Username</label>
        <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e2e8f0", marginBottom: 16, marginTop: 4 }} />
        <label style={{ fontWeight: 600, color: "#22543d" }} htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e2e8f0", marginBottom: 24, marginTop: 4 }} />
        {error && <div style={{ color: "#e53e3e", marginBottom: 16 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", background: "#22543d", color: "#fff", border: "none", borderRadius: 6, padding: "12px 0", fontWeight: 700, fontSize: 18, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
