"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  created_at: string;
}
interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'categories' | 'subcategories'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState<number | "">("");
  const [catEditId, setCatEditId] = useState<number | null>(null);
  const [subEditId, setSubEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Fetch categories/subcategories
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      setCategories(await res.json());
    } catch {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }
  async function fetchSubcategories() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/subcategories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      setSubcategories(await res.json());
    } catch {
      setError("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  }

  // Category CRUD
  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = catEditId ? "PUT" : "POST";
      const url = catEditId ? `http://localhost:4000/api/categories/${catEditId}` : "http://localhost:4000/api/categories";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_jwt")}`,
        },
        body: JSON.stringify({ name: catName }),
      });
      if (!res.ok) throw new Error("Failed to save category");
      setCatName("");
      setCatEditId(null);
      fetchCategories();
    } catch {
      setError("Failed to save category");
    } finally {
      setLoading(false);
    }
  }
  async function handleCatEdit(cat: Category) {
    setCatEditId(cat.id);
    setCatName(cat.name);
  }
  async function handleCatDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  // Subcategory CRUD
  async function handleSubSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = subEditId ? "PUT" : "POST";
      const url = subEditId ? `http://localhost:4000/api/subcategories/${subEditId}` : "http://localhost:4000/api/subcategories";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_jwt")}`,
        },
        body: JSON.stringify({ name: subName, category_id: subCatId }),
      });
      if (!res.ok) throw new Error("Failed to save subcategory");
      setSubName("");
      setSubCatId("");
      setSubEditId(null);
      fetchSubcategories();
    } catch {
      setError("Failed to save subcategory");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubEdit(sub: Subcategory) {
    setSubEditId(sub.id);
    setSubName(sub.name);
    setSubCatId(sub.category_id);
  }
  async function handleSubDelete(id: number) {
    if (!confirm("Delete this subcategory?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/subcategories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchSubcategories();
    } catch {
      setError("Failed to delete subcategory");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_jwt");
    router.replace("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", padding: 0 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 16px #e2e8f0", minWidth: 320, maxWidth: 700, margin: "40px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#22543d" }}>Admin Dashboard</h2>
          <button onClick={handleLogout} style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: 6, padding: "10px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Logout</button>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <button onClick={() => setTab('categories')} style={{ background: tab === 'categories' ? '#22543d' : '#e2e8f0', color: tab === 'categories' ? '#fff' : '#22543d', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Categories</button>
          <button onClick={() => setTab('subcategories')} style={{ background: tab === 'subcategories' ? '#22543d' : '#e2e8f0', color: tab === 'subcategories' ? '#fff' : '#22543d', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Subcategories</button>
        </div>
        {error && <div style={{ color: "#e53e3e", marginBottom: 16 }}>{error}</div>}
        {tab === 'categories' && (
          <>
            <form onSubmit={handleCatSubmit} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category name" required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
              <button type="submit" disabled={loading} style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}>{catEditId ? 'Update' : 'Add'}</button>
              {catEditId && <button type="button" onClick={() => { setCatEditId(null); setCatName(""); }} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>}
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f7fafc' }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Name</th>
                  <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Created</th>
                  <th style={{ padding: 10 }}></th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ padding: 10 }}>{cat.name}</td>
                    <td style={{ padding: 10 }}>{new Date(cat.created_at).toLocaleString()}</td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => handleCatEdit(cat)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleCatDelete(cat.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {tab === 'subcategories' && (
          <>
            <form onSubmit={handleSubSubmit} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <input type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="Subcategory name" required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
              <select value={subCatId} onChange={e => setSubCatId(Number(e.target.value))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="submit" disabled={loading} style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}>{subEditId ? 'Update' : 'Add'}</button>
              {subEditId && <button type="button" onClick={() => { setSubEditId(null); setSubName(""); setSubCatId(""); }} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>}
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f7fafc' }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Name</th>
                  <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Category</th>
                  <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Created</th>
                  <th style={{ padding: 10 }}></th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ padding: 10 }}>{sub.name}</td>
                    <td style={{ padding: 10 }}>{categories.find(c => c.id === sub.category_id)?.name || "-"}</td>
                    <td style={{ padding: 10 }}>{new Date(sub.created_at).toLocaleString()}</td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => handleSubEdit(sub)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleSubDelete(sub.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
