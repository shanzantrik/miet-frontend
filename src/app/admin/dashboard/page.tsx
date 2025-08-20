"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getApiUrl } from "@/utils/api";

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

interface Consultant {
  id?: number;
  user_id?: number;
  username?: string;
  password?: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  description?: string;
  tagline?: string;
  location_lat?: string;
  location_lng?: string;
  address?: string;
  speciality?: string;
  id_proof_type?: string;
  id_proof_url?: string;
  aadhar?: string;
  bank_account?: string;
  bank_ifsc?: string;
  status?: 'online' | 'offline';
  featured?: boolean;
  category_ids?: number[] | string[];
  subcategory_ids?: number[] | string[];
  slots?: string[];
  city?: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  status?: string;
  created_at?: string;
}

// Extend the form state to allow confirmPassword (not persisted to backend)
type ConsultantForm = Partial<Consultant> & { confirmPassword?: string; category_ids: string[]; subcategory_ids: string[] };

interface ServiceType {
  id?: number;
  name: string;
  description: string;
  delivery_mode: string;
  service_type: string;
  appointment_type?: string;
  event_type?: string;
  test_type?: string;
  revenue_type?: string;
  price?: string;
  renewal_date?: string;
  center?: string;
  test_redirect_url?: string;
  consultant_ids?: string[];
  category_ids?: string[];
  subcategory_ids?: string[];
  suggestions?: { title: string; description: string; redirect_url: string }[];
  subscription_start?: string;
  subscription_end?: string;
  discount?: string;
  monthly_price?: string;
  yearly_price?: string;
  center_address?: string;
  center_lat?: string;
  center_lng?: string;
  event_start?: string;
  event_end?: string;
  event_image?: string;
  event_meet_link?: string;
  created_at?: string;
}

// Product types and state (moved outside component for linter)
export type ProductType = 'Course' | 'E-book' | 'App' | 'Gadget';
export interface Product {
  id?: number;
  type: ProductType;
  product_type?: string; // Backend field name
  title?: string;
  name?: string;
  description: string;
  price?: string;
  thumbnail?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  video_url?: string;
  pdf_url?: string;
  icon_url?: string;
  product_image?: string;
  thumbnailFile?: File;
  pdfFile?: File;
  iconFile?: File;
  productImageFile?: File;
  // Additional fields used in forms/UI (optional)
  author?: string;
  download_link?: string;
  purchase_link?: string;
  subtitle?: string;
  duration?: string;
  total_lectures?: number;
  language?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  learning_objectives?: string[];
  requirements?: string[];
  course_content?: { section: string; lectures: number; duration: string; items: string[] }[];
  instructor_name?: string;
  instructor_title?: string;
  instructor_bio?: string;
  instructor_image?: string;
  instructorImageFile?: File;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  pdf_file?: string; // filename helper when uploading PDFs
  icon?: string; // preview URL for icon
}

interface Blog {
  id?: number;
  title: string;
  description: string;
  category: 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology';
  thumbnail: string;
  author: string;
  status: 'active' | 'inactive' | 'published' | 'draft' | 'pending' | 'archived' | 'live' | 'scheduled' | 'private' | 'public' | 'review' | 'approved' | 'rejected' | 'trash' | 'deleted';
  created_at?: string;
  updated_at?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState<number | "">("");
  const [catEditId, setCatEditId] = useState<number | null>(null);
  const [subEditId, setSubEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ailmentsExpanded, setAilmentsExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'categories' | 'subcategories' | 'consultants' | 'users' | 'services' | 'products' | 'blogs'>('dashboard');
  // Consultant state
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [consultantForm, setConsultantForm] = useState<ConsultantForm>({ category_ids: [], subcategory_ids: [] });
  const [consultantEditId, setConsultantEditId] = useState<number | null>(null);
  const [consultantProfile, setConsultantProfile] = useState<Consultant | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false); // for superadmin
  const [showConsultantProfileModal, setShowConsultantProfileModal] = useState(false); // for consultant details
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  const [consultantSlots, setConsultantSlots] = useState<{ date: string; time: string; endTime?: string }[]>([]);
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [userForm, setUserForm] = useState<{ id?: number; username: string; password?: string; role: string }>({ username: '', password: '', role: 'consultant' });
  const [userEditId, setUserEditId] = useState<number | null>(null);
  // Services state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    delivery_mode: 'online',
    service_type: 'appointment',
    appointment_type: '',
    event_type: '',
    test_type: '',
    revenue_type: 'paid',
    price: '',
    renewal_date: '',
    center: '',
    test_redirect_url: '',
    consultant_ids: [],
    category_ids: [],
    subcategory_ids: [],
    suggestions: [{ title: '', description: '', redirect_url: '' }],
    subscription_start: '',
    subscription_end: '',
    discount: '',
    monthly_price: '',
    yearly_price: '',
    center_address: '',
    center_lat: '',
    center_lng: '',
    event_start: '',
    event_end: '',
    event_image: null as File | null,
    event_meet_link: '',
  });
  const [serviceEditId, setServiceEditId] = useState<number | null>(null);
  const [selectedConsultantIds, setSelectedConsultantIds] = useState<number[]>([]);
  const [consultantAvailability, setConsultantAvailability] = useState<Record<number, string[]>>({}); // consultantId -> array of slots
  const [consultationDate, setConsultationDate] = useState('');
  // Track if consultant form has been loaded for editing
  const [consultantFormLoaded, setConsultantFormLoaded] = useState(false);
  // Services state for list and modal
  const [services, setServices] = useState<ServiceType[]>([]);
  const [serviceProfile, setServiceProfile] = useState<ServiceType | null>(null);
  const [showServiceProfileModal, setShowServiceProfileModal] = useState(false);
  // Add state for name and email
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  // Add these states at the top of your component
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  // Add these states at the top of your component
  const [serviceFormLoading, setServiceFormLoading] = useState(false);
  const [serviceFormMessage, setServiceFormMessage] = useState('');
  // Product types and state
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<Partial<Product>>({ type: 'Course', status: 'active', featured: false });
  const [productEditId, setProductEditId] = useState<number | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductProfileModal, setShowProductProfileModal] = useState(false);
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConsultantId, setDeleteConsultantId] = useState<number | null>(null);
  const [deleteConsultantName, setDeleteConsultantName] = useState<string>('');
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteProductName, setDeleteProductName] = useState<string>('');

  // Real-time dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Table states for all CRUD operations
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal states for all CRUD operations
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showConsultantModal, setShowConsultantModal] = useState(false);

  // Blog state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    title: '',
    description: '',
    category: 'Therapy',
    thumbnail: '',
    author: '',
    status: 'active'
  });
  const [blogEditId, setBlogEditId] = useState<number | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<number | null>(null);
  const [deleteBlogName, setDeleteBlogName] = useState<string>('');

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

  useEffect(() => {
    if (activeMenu === 'consultants') fetchConsultants();
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu === 'services') fetchConsultants();
  }, [activeMenu]);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/categories"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      setCategories(await res.json());
    } catch {
      // setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }
  async function fetchSubcategories() {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/subcategories"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      setSubcategories(await res.json());
    } catch {
      // setError("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  }

  async function fetchConsultants() {
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl("api/consultants"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const consultants = await res.json();
      // For each consultant, fetch their slots from the backend
      const consultantsWithSlots = await Promise.all(
        consultants.map(async (c: Consultant) => {
          const slotRes = await fetch(getApiUrl(`api/consultants/${c.id}/availability`), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (slotRes.ok) {
            const slots = await slotRes.json();
            return {
              ...c,
              slots: slots.map((slot: { date: string; start_time: string; end_time: string; id: number }) => `${slot.date} ${slot.start_time}${slot.end_time ? '-' + slot.end_time : ''}`),
            };
          } else {
            return { ...c, slots: [] };
          }
        })
      );
      setConsultants(consultantsWithSlots);
    }
  }

  // Fetch users
  async function fetchUsers() {
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl("api/users"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  }
  useEffect(() => {
    if (activeMenu === 'users') fetchUsers();
  }, [activeMenu]);

  // Fetch services
  async function fetchServices() {
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(getApiUrl("api/services"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setServices(await res.json());
    }
  }
  useEffect(() => {
    if (activeMenu === 'services') fetchServices();
  }, [activeMenu]);

  // Fetch products
  async function fetchProducts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        console.log('Initial products fetch:', data);

        // Extract products array from response
        const productsArray = data.products || data;
        console.log('Initial products array:', productsArray);
        setProducts(productsArray);
      } else {
        console.error('Failed to fetch products:', res.status);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  }

  useEffect(() => {
    if (activeMenu === 'products') fetchProducts();
  }, [activeMenu]);

  // Debug: Log products state changes
  useEffect(() => {
    console.log('Products state changed:', products);
    console.log('Products is array:', Array.isArray(products));
    if (Array.isArray(products)) {
      console.log('Products count:', products.length);
      console.log('First product:', products[0]);
    }
  }, [products]);

  // Category CRUD
  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = catEditId ? "PUT" : "POST";
      const url = catEditId ? getApiUrl(`api/categories/${catEditId}`) : getApiUrl("api/categories");
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
      setShowCategoryModal(false);
      fetchCategories();
    } catch {
      // setError("Failed to save category");
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
    try {
      const res = await fetch(getApiUrl(`api/categories/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      // setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  // Subcategory CRUD
  async function handleSubSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = subEditId ? "PUT" : "POST";
      const url = subEditId ? getApiUrl(`api/subcategories/${subEditId}`) : getApiUrl("api/subcategories");
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
      setShowSubcategoryModal(false);
      fetchSubcategories();
    } catch {
      // setError("Failed to save subcategory");
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
    try {
      const res = await fetch(getApiUrl(`api/subcategories/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchSubcategories();
    } catch {
      // setError("Failed to delete subcategory");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_jwt");
    router.replace("/admin/login");
  }

  // Sidebar menu items
  const menu = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaThLarge size={20} /> },
    {
      key: 'ailments',
      label: 'Ailments',
      icon: <FaTags size={20} />,
      children: [
        { key: 'categories', label: 'Categories', icon: <FaTags size={18} /> },
        { key: 'subcategories', label: 'Subcategories', icon: <FaList size={18} /> },
      ],
    },
    { key: 'consultants', label: 'Consultants', icon: <FaUserMd size={20} /> },
    { key: 'users', label: 'Users', icon: <FaUserCircle size={20} /> },
    { key: 'services', label: 'Services', icon: <FaTags size={20} /> },
    { key: 'products', label: 'Products', icon: <FaList size={20} /> },
    { key: 'blogs', label: 'Blogs & Media', icon: <FaList size={20} /> },
  ];

  // Helper to save slots to backend
  async function saveConsultantSlots(consultantId: number, slots: { date: string; time: string; endTime?: string }[]) {
    // First, fetch existing slots and delete them all (for update)
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl(`api/consultants/${consultantId}/availability`), { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const existing = await res.json();
      for (const slot of existing) {
        await fetch(getApiUrl(`api/consultants/${consultantId}/availability/${slot.id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      }
    }
    // Add new slots
    for (const slot of slots) {
      if (slot.date && slot.time) {
        await fetch(getApiUrl(`api/consultants/${consultantId}/availability`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ date: slot.date, start_time: slot.time, end_time: slot.endTime || '' })
        });
      }
    }
  }

  // Consultant CRUD
  async function handleConsultantSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    try {
      const token = localStorage.getItem("admin_jwt");
      const method = consultantEditId ? "PUT" : "POST";
      const url = consultantEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${consultantEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants`;

      // Convert category_ids and subcategory_ids to number[] before submitting
      const payload = {
        ...consultantForm,
        category_ids: Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(Number) : [],
        subcategory_ids: Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(Number) : [],
      };

      console.log('Submitting consultant:', { method, url, payload });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        let consultantId = consultantEditId;
        if (!consultantEditId) {
          const data = await res.json();
          consultantId = data.id;
        }
        if (consultantId) {
          await saveConsultantSlots(consultantId, consultantSlots);
        }
        setConsultantForm({ category_ids: [], subcategory_ids: [] });
        setConsultantEditId(null);
        setConsultantSlots([]);
        setConsultantFormLoaded(false);
        setShowConsultantModal(false);
        fetchConsultants();
        console.log('Consultant saved successfully');
      } else {
        const errorData = await res.text();
        console.error('Failed to save consultant:', res.status, errorData);
        alert(`Failed to save consultant: ${res.status} ${errorData}`);
      }
    } catch (error) {
      console.error('Error saving consultant:', error);
      alert('Error saving consultant. Please try again.');
    }
  }
  async function handleConsultantEdit(c: Consultant) {
    if (typeof c.id === 'number') {
      setConsultantEditId(c.id);
      setConsultantForm({
        ...c,
        category_ids: Array.isArray(c.category_ids) ? c.category_ids.map(id => String(id)) : [],
        subcategory_ids: Array.isArray(c.subcategory_ids) ? c.subcategory_ids.map(id => String(id)) : [],
      });
      // Fetch slots from backend
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${c.id}/availability`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const slots = await res.json();
        setConsultantSlots(slots.map((slot: { date: string; start_time: string; end_time: string; id: number }) => ({ date: slot.date, time: slot.start_time, endTime: slot.end_time })));
      } else {
        setConsultantSlots([]);
      }
      setConsultantFormLoaded(true);
    }
  }
  // Show delete confirmation modal
  function showDeleteConsultantModal(id: number, name: string) {
    setDeleteConsultantId(id);
    setDeleteConsultantName(name);
    setShowDeleteModal(true);
  }
  // Refactor delete handlers to use modal
  async function handleConsultantDelete() {
    if (!deleteConsultantId) return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${deleteConsultantId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchConsultants();
      setShowDeleteModal(false);
      setDeleteConsultantId(null);
      setDeleteConsultantName('');
    }
  }
  async function handleConsultantProfile(id?: number) {
    if (typeof id !== 'number') return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setConsultantProfile(await res.json());
  }
  const handleConsultantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setConsultantForm({ ...consultantForm, [e.target.name]: e.target.value });
  }
  const handleConsultantFormCancel = () => {
    setConsultantEditId(null);
    setConsultantForm({ category_ids: [], subcategory_ids: [] });
    setConsultantSlots([]);
    setConsultantFormLoaded(false);
  };

  // File upload placeholder
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'id_proof_url') {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      // Use the URL as-is
      setConsultantForm(f => ({ ...f, [field]: data.url }));
    } catch {
      alert('Image upload failed.');
    }
  }

  // Multi-select handlers
  const handleConsultantMultiSelect = (field: string, values: string[] | number[]) => {
    setConsultantForm(f => ({ ...f, [field]: values }));
  };
  // // Availability handlers
  // function handleAddAvailability() {
  //   if (availDate && availTime && availEndTime) {
  //     setAvailability(prev => [...prev, { date: availDate, time: availTime, endTime: availEndTime }]);
  //     setAvailDate('');
  //     setAvailTime('');
  //     setAvailEndTime('');
  //   }
  // }
  // Use My Location
  function handleUseMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setConsultantForm(f => ({ ...f, location_lat: String(pos.coords.latitude), location_lng: String(pos.coords.longitude) }));
      });
    } else {
      alert('Geolocation not supported.');
    }
  }

  function handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      setConsultantForm(f => ({
        ...f,
        location_lat: String(event.latLng!.lat()),
        location_lng: String(event.latLng!.lng())
      }));
    }
  }

  const defaultMapCenter = { lat: 28.6139, lng: 77.2090 };

  async function handleToggleConsultantStatus(c: Consultant) {
    const token = localStorage.getItem("admin_jwt");
    const newStatus = c.status === 'online' ? 'offline' : 'online';
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${c.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchConsultants();
  }

  // Users CRUD
  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_jwt");
    const method = userEditId ? "PUT" : "POST";
    const url = userEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`;
    const body = userEditId ? { username: userForm.username, role: userForm.role } : userForm;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setUserForm({ username: '', password: '', role: 'consultant' });
      setUserEditId(null);
      setShowUserModal(false);
      fetchUsers();
    }
  }
  async function handleUserEdit(u: User) {
    setUserEditId(u.id);
    setUserForm({ id: u.id, username: u.username, role: u.role });
  }
  async function handleUserDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchUsers();
  }
  function handleUserFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }
  function handleUserFormCancel() {
    setUserForm({ username: '', password: '', role: 'consultant' });
    setUserEditId(null);
  }

  async function handleToggleUserStatus(u: User) {
    const token = localStorage.getItem("admin_jwt");
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${u.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchUsers();
  }

  // Service CRUD
  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServiceFormLoading(true);
    setServiceFormMessage('');
    const token = localStorage.getItem('admin_jwt');
    const method = serviceEditId ? 'PUT' : 'POST';
    const url = serviceEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services/${serviceEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(serviceForm),
      });
      if (res.ok) {
        setServiceForm({
          name: '',
          description: '',
          delivery_mode: 'online',
          service_type: 'appointment',
          appointment_type: '',
          event_type: '',
          test_type: '',
          revenue_type: 'paid',
          price: '',
          renewal_date: '',
          center: '',
          test_redirect_url: '',
          consultant_ids: [],
          category_ids: [],
          subcategory_ids: [],
          suggestions: [{ title: '', description: '', redirect_url: '' }],
          subscription_start: '',
          subscription_end: '',
          discount: '',
          monthly_price: '',
          yearly_price: '',
          center_address: '',
          center_lat: '',
          center_lng: '',
          event_start: '',
          event_end: '',
          event_image: null as File | null,
          event_meet_link: '',
        });
        setServiceEditId(null);
        setShowServiceModal(false);
        fetchServices();
        setServiceFormMessage('Service submitted successfully!');
      } else {
        setServiceFormMessage('Error submitting service.');
      }
    } catch (err) {
      setServiceFormMessage('Error submitting service.');
      console.error('Error submitting service:', err);
    } finally {
      setServiceFormLoading(false);
    }
  }
  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      setServiceForm(f => ({ ...f, [name]: Array.from(options, opt => opt.value) }));
    } else {
      setServiceForm(f => ({ ...f, [name]: value }));
    }
  }
  function handleAddSuggestion() {
    setServiceForm(f => ({ ...f, suggestions: [...f.suggestions, { title: '', description: '', redirect_url: '' }] }));
  }
  function handleRemoveSuggestion(idx: number) {
    setServiceForm(f => ({ ...f, suggestions: f.suggestions.filter((_, i) => i !== idx) }));
  }
  function handleSuggestionChange(idx: number, field: string, value: string) {
    setServiceForm(f => ({ ...f, suggestions: f.suggestions.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  }

  // When consultant_ids changes in serviceForm, update selectedConsultantIds and fetch/simulate availability
  useEffect(() => {
    const ids = (serviceForm.consultant_ids || []).map(Number).filter(Boolean);
    setSelectedConsultantIds(ids);
    // Fetch actual slots from the consultants array
    const avail: Record<number, string[]> = {};
    for (const id of ids) {
      const consultant = consultants.find(c => c.id === id);
      if (consultant && Array.isArray(consultant.slots)) {
        avail[id] = (consultant.slots as (string | { date: string; time: string; endTime?: string })[]).map(slot => {
          if (typeof slot === 'string') {
            return slot;
          } else if (typeof slot === 'object' && 'date' in slot && 'time' in slot) {
            return `${slot.date} ${slot.time}${slot.endTime ? '-' + slot.endTime : ''}`;
          }
          return '';
        }).filter(Boolean);
      } else {
        avail[id] = [];
      }
    }
    setConsultantAvailability(avail);
  }, [serviceForm.consultant_ids, consultants]);

  // Helper: get all available dates for selected consultants
  const getAvailableDates = () => {
    const allSlots = selectedConsultantIds.flatMap(cid => consultantAvailability[cid] || []);
    // Extract unique dates from slots (format: 'YYYY-MM-DD HH:MM-HH:MM')
    const dates = Array.from(new Set(allSlots.map(slot => slot.split(' ')[0])));
    return dates;
  };

  // Helper: get all blocked dates (dates with no available slots for any selected consultant)
  const getBlockedDates = () => {
    // Get all dates in the next 90 days
    const today = new Date();
    const blocked: string[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      if (!getAvailableDates().includes(dateStr)) {
        blocked.push(dateStr);
      }
    }
    return blocked;
  };

  // Helper: format date as DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Helper: format time as HH:MMAM/PM
  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${m}${ampm}`;
  };

  // Helper: get available time slots for a given date, formatted
  const getTimeSlotsForDate = (date: string) => {
    return selectedConsultantIds.flatMap(cid =>
      (consultantAvailability[cid] || [])
        .filter(slot => slot.startsWith(date))
        .map(slot => {
          const time = slot.split(' ')[1];
          if (!time) return '';
          const [start, end] = time.split('-');
          if (end) {
            return `${formatTime(start)} - ${formatTime(end)}`;
          } else {
            return formatTime(start);
          }
        })
    );
  };

  // Add, edit, and remove slot handlers
  const handleAddSlot = () => {
    setConsultantSlots(slots => [...slots, { date: '', time: '', endTime: '' }]);
  };
  const handleSlotChange = (idx: number, field: string, value: string) => {
    setConsultantSlots(slots => slots.map((slot, i) => i === idx ? { ...slot, [field]: value } : slot));
  };
  const handleRemoveSlot = (idx: number) => {
    setConsultantSlots(slots => slots.filter((_, i) => i !== idx));
  };

  // Ensure form fields are hydrated after consultantForm is loaded for editing
  useEffect(() => {
    if (consultantEditId && consultantFormLoaded) {
      // Ensure category_ids and subcategory_ids are strings for select value
      setConsultantForm(f => ({
        ...f,
        category_ids: Array.isArray(f.category_ids) ? f.category_ids.map(id => String(id)) : [],
        subcategory_ids: Array.isArray(f.subcategory_ids) ? f.subcategory_ids.map(id => String(id)) : [],
      }));
    }
  }, [consultantEditId, consultantFormLoaded]);

  // Event image change handler
  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setServiceForm(prev => ({ ...prev, event_image: file }));
    }
  };

  // Generate Google Meet link
  const generateMeetLink = () => {
    // This is a placeholder and should be replaced with actual implementation
    return `https://meet.google.com/new?authuser=0&hs=177&authuser=0`;
  };

  // View service details
  async function handleServiceProfile(id: number) {
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setServiceProfile(await res.json());
      setShowServiceProfileModal(true);
    }
  }

  // Edit service
  async function handleServiceEdit(s: ServiceType) {
    setServiceEditId(s.id ?? null);
    setServiceForm({ ...s, event_image: null as File | null, appointment_type: '', event_type: '', test_type: '', revenue_type: 'paid', price: '', renewal_date: '', center: '', test_redirect_url: '', consultant_ids: [], category_ids: [], subcategory_ids: [], suggestions: [{ title: '', description: '', redirect_url: '' }], subscription_start: '', subscription_end: '', discount: '', monthly_price: '', yearly_price: '', center_address: '', center_lat: '', center_lng: '', event_start: '', event_end: '', event_meet_link: '' });
  }

  // Delete service
  async function handleServiceDelete(id: number) {
    if (!confirm('Delete this service?')) return;
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchServices();
  }

  // Form submit handler for name and email
  const handleSimpleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage('');
    const data = { name: formName, email: formEmail };
    console.log('Form data to submit:', data);
    try {
      const res = await fetch('http://localhost:4000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setFormMessage('Form submitted successfully!');
      console.log('Server response:', result);
    } catch (err) {
      setFormMessage('Error submitting form.');
      console.error('Error submitting form:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Fetch products on mount and after adding
  useEffect(() => {
    if (activeMenu === 'products') fetchProducts();
  }, [activeMenu]);

  // Fetch blogs on mount and after adding
  useEffect(() => {
    if (activeMenu === 'blogs') fetchBlogs();
  }, [activeMenu]);

  // Auto-select first child when ailments is expanded
  useEffect(() => {
    if (ailmentsExpanded && activeMenu !== 'categories' && activeMenu !== 'subcategories') {
      setActiveMenu('categories');
    }
  }, [ailmentsExpanded]);

  // Auto-expand ailments when categories or subcategories are active
  useEffect(() => {
    if (activeMenu === 'categories' || activeMenu === 'subcategories') {
      setAilmentsExpanded(true);
    }
  }, [activeMenu]);

  // Table utility functions
  const filterAndSortData = (data: any[], searchTerm: string, sortField: string, sortDirection: 'asc' | 'desc') => {
    let filteredData = data;

    // Filter by search term
    if (searchTerm) {
      filteredData = data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort data
    if (sortField) {
      filteredData.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  };

  const paginateData = (data: any[], currentPage: number, itemsPerPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number, itemsPerPage: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Blog CRUD
  async function fetchBlogs() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        console.log('Blogs fetched:', data);
        const blogsArray = data.blogs || data;
        setBlogs(blogsArray);
      } else {
        console.error('Failed to fetch blogs:', res.status);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    }
  }

  async function handleBlogSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    try {
      const token = localStorage.getItem("admin_jwt");
      const method = blogEditId ? "PUT" : "POST";
      const url = blogEditId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${blogEditId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(blogForm),
      });

      if (res.ok) {
        setBlogForm({ title: '', description: '', category: 'Therapy', thumbnail: '', author: '', status: 'active' });
        setBlogEditId(null);
        setShowBlogModal(false);
        fetchBlogs();
        alert(blogEditId ? 'Blog updated successfully!' : 'Blog added successfully!');
      } else {
        const errorData = await res.text();
        alert(`Failed to save blog: ${res.status} ${errorData}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog. Please try again.');
    }
  }

  async function handleBlogEdit(blog: Blog) {
    setBlogEditId(blog.id ?? null);
    setBlogForm(blog);
    setShowBlogModal(true);
  }

  async function handleBlogDelete() {
    if (!deleteBlogId) return;

    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${deleteBlogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== deleteBlogId));
        setDeleteBlogId(null);
        setDeleteBlogName('');
        setShowDeleteModal(false);
        alert('Blog deleted successfully!');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    }
  }

  // Reusable Table Component
  const DataTable = ({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    searchPlaceholder = "Search...",
    title = "Data Table"
  }: {
    data: any[];
    columns: { key: string; label: string; sortable?: boolean; render?: (value: any, row: any) => React.ReactNode }[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onView?: (item: any) => void;
    searchPlaceholder?: string;
    title?: string;
  }) => {
    const filteredData = filterAndSortData(data, searchTerm, sortField, sortDirection);
    const paginatedData = paginateData(filteredData, currentPage, itemsPerPage);
    const totalPages = getTotalPages(filteredData.length, itemsPerPage);

    return (
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h3 style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: 700,
              color: '#667eea',
              margin: 0
            }}>{title}</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px'
                }} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    padding: '12px 16px 12px 40px',
                    borderRadius: '8px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    minWidth: '250px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={column.sortable ? (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)' : undefined}
                    onMouseLeave={column.sortable ? (e) => e.currentTarget.style.background = 'transparent' : undefined}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {column.label}
                      {column.sortable && (
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                          {sortField === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={row.id || index} style={{
                  background: index % 2 === 0 ? '#f8fafc' : '#fff',
                  transition: 'all 0.2s ease'
                }}>
                  {columns.map((column) => (
                    <td key={column.key} style={{
                      padding: '16px 20px',
                      fontSize: '16px',
                      color: '#374151'
                    }}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              border: '2px solid rgba(102, 126, 234, 0.3)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                          >
                            <FaEye size={14} /> View
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              border: '2px solid rgba(102, 126, 234, 0.3)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                          >
                            <FaEdit size={14} /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            style={{
                              background: 'rgba(220, 38, 38, 0.1)',
                              color: '#dc2626',
                              border: '2px solid rgba(220, 38, 38, 0.3)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                          >
                            <FaTrash size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  background: currentPage === 1 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                  color: currentPage === 1 ? '#9ca3af' : '#667eea',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: currentPage === page ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.1)',
                    color: currentPage === page ? '#fff' : '#667eea',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => currentPage !== page && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)')}
                  onMouseLeave={(e) => currentPage !== page && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)')}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  background: currentPage === totalPages ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                  color: currentPage === totalPages ? '#9ca3af' : '#667eea',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', display: 'flex', flexDirection: 'column' }}>
      <style jsx>{`
        @media (max-width: 768px) {
          .admin-header {
            padding: 0 16px !important;
          }
          .admin-sidebar {
            width: 70px !important;
          }
          .admin-main {
            padding: 24px 16px !important;
          }
          .admin-modal {
            min-width: 95vw !important;
            max-width: 95vw !important;
            padding: 24px !important;
          }
          .admin-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .admin-header {
            height: 60px !important;
          }
          .admin-sidebar {
            width: 60px !important;
          }
          .admin-main {
            padding: 20px 12px !important;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chart-bar {
          transition: all 0.3s ease;
        }

        .chart-bar:hover {
          transform: scaleY(1.1);
        }

        .order-card {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
      {/* Header */}
      <div style={{
        height: 70,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
              marginRight: 8,
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            aria-label="Toggle sidebar"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>MIET Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FaUserCircle size={24} color="#fff" /> Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(220, 38, 38, 0.9)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.32)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false); }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px rgba(90,103,216,0.13)', position: 'relative' }}>
            <button onClick={() => setShowProfileModal(false)} aria-label="Close profile modal" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#5a67d8', cursor: 'pointer' }}>×</button>
            <h2 style={{ color: '#22543d', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Superadmin Profile</h2>
            <div style={{ color: '#5a67d8', fontWeight: 600, marginBottom: 8 }}>Username: admin</div>
            <div style={{ color: '#22543d', fontWeight: 500, marginBottom: 8 }}>Role: Superadmin</div>
            <div style={{ color: '#a0aec0', fontSize: 15 }}>You are logged in as the superadmin.</div>
          </div>
        </div>
      )}
      {/* Main layout: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 240 : 70,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarOpen ? 'flex-start' : 'center',
          padding: sidebarOpen ? '32px 0 0 0' : '32px 0 0 0',
          minHeight: 'calc(100vh - 70px)',
          boxShadow: '4px 0 20px rgba(102, 126, 234, 0.15)',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 32,
            padding: '0 16px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: 12,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Image src="/miet-main.webp" alt="MieT Logo" width={48} height={48} style={{ borderRadius: 12, background: '#fff' }} priority />
            </div>
            {sidebarOpen && (
              <span style={{
                fontFamily: 'Righteous, cursive',
                fontSize: 24,
                color: '#fff',
                fontWeight: 700,
                marginBottom: 8,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>MieT</span>
            )}
          </div>
          <nav style={{ width: '100%' }}>
            {menu.map((item) => (
              'children' in item && Array.isArray(item.children) ? (
                <div key={item.key} style={{ width: '100%' }}>
                  <button
                    onClick={() => {
                      // Toggle the ailments expansion
                      if (item.key === 'ailments') {
                        setAilmentsExpanded(!ailmentsExpanded);
                        // If expanding and no child is active, set the first child as active
                        if (!ailmentsExpanded && item.children && item.children.length > 0) {
                          setActiveMenu(item.children[0].key as typeof activeMenu);
                        }
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sidebarOpen ? 16 : 0,
                      width: '100%',
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu) ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                      padding: sidebarOpen ? '16px 28px' : '16px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      transition: 'all 0.2s ease',
                      margin: '4px 0',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    aria-label={item.label}
                    onMouseEnter={(e) => {
                      if (!((item.key === 'ailments' && ailmentsExpanded) || (item.children && item.children.some((c) => c.key === activeMenu)))) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!((item.key === 'ailments' && ailmentsExpanded) || (item.children && item.children.some((c) => c.key === activeMenu)))) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu) ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}>
                    {React.cloneElement(item.icon, { color: '#fff' })}
                    </div>
                    {sidebarOpen && <span style={{ marginLeft: 8 }}>{item.label}</span>}
                    {sidebarOpen && (
                      (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu)
                        ? <FaChevronDown style={{ marginLeft: 'auto', opacity: 0.8 }} />
                        : <FaChevronRight style={{ marginLeft: 'auto', opacity: 0.6 }} />
                    )}
                  </button>
                  {sidebarOpen && item.children && ((item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu)) && (
                    <div style={{ marginLeft: 24 }}>
                      {item.children!.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => setActiveMenu(child.key as typeof activeMenu)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            width: '100%',
                            background: activeMenu === child.key ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0 8px 8px 0',
                            padding: '12px 24px',
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: 'pointer',
                            justifyContent: 'flex-start',
                            transition: 'all 0.2s ease',
                            margin: '2px 0',
                            position: 'relative'
                          }}
                          aria-label={child.label}
                          onMouseEnter={(e) => {
                            if (activeMenu !== child.key) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeMenu !== child.key) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            background: activeMenu === child.key ? 'rgba(102, 126, 234, 0.8)' : 'rgba(102, 126, 234, 0.4)',
                            borderRadius: '6px',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}>
                          {React.cloneElement(child.icon, { color: '#fff' })}
                          </div>
                          <span style={{ marginLeft: 8 }}>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key as typeof activeMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarOpen ? 16 : 0,
                    width: '100%',
                    background: activeMenu === item.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                    padding: sidebarOpen ? '16px 28px' : '16px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    transition: 'all 0.2s ease',
                    margin: '4px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  aria-label={item.label}
                  onMouseEnter={(e) => {
                    if (activeMenu !== item.key) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== item.key) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    background: activeMenu === item.key ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                  {React.cloneElement(item.icon, { color: '#fff' })}
                  </div>
                  {sidebarOpen && <span style={{ marginLeft: 8 }}>{item.label}</span>}
                </button>
              )
            ))}
          </nav>
        </aside>
        {/* Main content */}
        <main style={{
          flex: 1,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          padding: '32px 24px',
          minHeight: 'calc(100vh - 70px)',
          overflow: 'auto'
        }}>
          {/* Dashboard view with charts/tables */}
          {activeMenu === 'dashboard' && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 700,
                color: '#667eea',
                marginBottom: 24,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Dashboard Overview</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                marginBottom: 32
              }}>
                {/* Ailments Overview Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Ailments</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{categories.length + subcategories.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {categories.length} Categories • {subcategories.length} Subcategories
                </div>
                </div>

                {/* Consultants Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(118, 75, 162, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Consultants</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{consultants.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {consultants.filter(c => c.status === 'online').length} Online • {consultants.filter(c => c.status === 'offline').length} Offline
              </div>
                </div>

                {/* Services Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Services</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{services.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {services.filter(s => s.service_type === 'appointment').length} Appointments • {services.filter(s => s.service_type === 'subscription').length} Subscriptions
                  </div>
                </div>

                {/* Products Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(118, 75, 162, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Products</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{products.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {products.filter(p => p.type === 'Course').length} Courses • {products.filter(p => p.type === 'E-book').length} E-books
                  </div>
                </div>
              </div>

              {/* Real-time Charts Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 24,
                marginBottom: 32
              }}>
                {/* Activity Chart */}
                <div style={{
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                  padding: 32,
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Monthly Activity</h3>
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'space-around',
                    gap: '8px'
                  }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
                      const height = Math.floor(Math.random() * 80) + 20;
                      return (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '24px',
                            height: `${height}px`,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px 12px 0 0',
                            marginBottom: '8px'
                          }} />
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Distribution Chart */}
                <div style={{
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                  padding: 32,
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Category Distribution</h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {categories.slice(0, 5).map((cat, index) => {
                      const percentage = Math.floor((cat.id || 1) / categories.length * 100);
                      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
                      return (
                        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: colors[index % colors.length]
                          }} />
                          <div style={{ flex: 1, fontSize: '14px', color: '#374151' }}>{cat.name}</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real-time Orders Section */}
              <div style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                padding: 32,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                marginBottom: 32
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea'
                  }}>Recent Orders</h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Live Updates</span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Sample Orders - Replace with real data */}
                  {[
                    { id: 1, customer: 'John Doe', service: 'Therapy Session', amount: '$150', status: 'completed', time: '2 min ago' },
                    { id: 2, customer: 'Jane Smith', service: 'Consultation', amount: '$80', status: 'pending', time: '5 min ago' },
                    { id: 3, customer: 'Mike Johnson', service: 'Course Purchase', amount: '$299', status: 'processing', time: '8 min ago' },
                    { id: 4, customer: 'Sarah Wilson', service: 'Subscription', amount: '$99/month', status: 'active', time: '12 min ago' }
                  ].map(order => (
                    <div key={order.id} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{order.customer}</div>
                        <div style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: order.status === 'completed' ? '#d1fae5' :
                                   order.status === 'pending' ? '#fef3c7' :
                                   order.status === 'processing' ? '#dbeafe' : '#e0e7ff',
                          color: order.status === 'completed' ? '#065f46' :
                                 order.status === 'pending' ? '#92400e' :
                                 order.status === 'processing' ? '#1e40af' : '#3730a3'
                        }}>
                          {order.status}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{order.service}</div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>{order.amount}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3b8' }}>{order.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Categories CRUD */}
          {activeMenu === 'categories' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Categories</h2>
                <button
                  onClick={() => {
                    setCatEditId(null);
                    setCatName("");
                    setShowCategoryModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus size={16} /> Add Category
                </button>
              </div>

              <DataTable
                data={categories}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value) => new Date(value).toLocaleString()
                  }
                ]}
                onEdit={(cat) => {
                  setCatEditId(cat.id);
                  setCatName(cat.name);
                  setShowCategoryModal(true);
                }}
                onDelete={(cat) => handleCatDelete(cat.id)}
                searchPlaceholder="Search categories..."
                title="Categories"
              />
            </section>
          )}
          {/* Subcategories CRUD */}
          {activeMenu === 'subcategories' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Subcategories</h2>
                <button
                  onClick={() => {
                    setSubEditId(null);
                    setSubName("");
                    setSubCatId("");
                    setShowSubcategoryModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus size={16} /> Add Subcategory
                </button>
              </div>

              <DataTable
                data={subcategories}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  {
                    key: 'category_id',
                    label: 'Category',
                    sortable: true,
                    render: (value) => categories.find(c => c.id === value)?.name || "-"
                  },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value) => new Date(value).toLocaleString()
                  }
                ]}
                onEdit={(sub) => {
                  setSubEditId(sub.id);
                  setSubName(sub.name);
                  setSubCatId(sub.category_id);
                  setShowSubcategoryModal(true);
                }}
                onDelete={(sub) => handleSubDelete(sub.id)}
                searchPlaceholder="Search subcategories..."
                title="Subcategories"
              />
            </section>
          )}
          {/* Consultants CRUD */}
          {activeMenu === 'consultants' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Consultants</h2>
                <button
                  onClick={() => {
                    setConsultantEditId(null);
                    setConsultantForm({
                      username: '',
                      password: '',
                      confirmPassword: '',
                      name: '',
                      email: '',
                      phone: '',
                      tagline: '',
                      speciality: '',
                      city: '',
                      address: '',
                      description: '',
                      aadhar: '',
                      bank_account: '',
                      bank_ifsc: '',
                      status: 'offline',
                      featured: false,
                      category_ids: [],
                      subcategory_ids: [],
                      location_lat: '',
                      location_lng: '',
                      image: undefined,
                      id_proof_url: undefined
                    });
                    setConsultantSlots([]);
                    setShowConsultantModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus size={16} /> Add Consultant
                </button>
              </div>

              <DataTable
                data={consultants}
                columns={[
                  {
                    key: 'image',
                    label: 'Image',
                    sortable: false,
                    render: (value, row) => (
                      value ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${value}`}
                          alt={row.name}
                          width={44}
                          height={44}
                          style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          unoptimized
                        />
                        ) : (
                          <span style={{ display: 'inline-block', width: 44, height: 44, borderRadius: 8, background: '#e2e8f0' }} />
                      )
                    )
                  },
                  { key: 'username', label: 'Username', sortable: true },
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                    render: (value, row) => (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                          checked={value === 'online'}
                          onChange={() => handleToggleConsultantStatus(row)}
                            style={{ width: 32, height: 18 }}
                          />
                        <span style={{ color: value === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                          {value === 'online' ? 'Online' : 'Offline'}
                        </span>
                        </label>
                    )
                  }
                ]}
                onView={(consultant) => {
                  handleConsultantProfile(consultant.id);
                  setShowConsultantProfileModal(true);
                }}
                onEdit={(consultant) => {
                  handleConsultantEdit(consultant);
                  setShowConsultantModal(true);
                }}
                onDelete={(consultant) => showDeleteConsultantModal(consultant.id!, consultant.name)}
                searchPlaceholder="Search consultants..."
                title="Consultants"
              />
            </section>
          )}

          {/* Consultant Modal */}
          {showConsultantModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={e => { if (e.target === e.currentTarget) setShowConsultantModal(false); }}>
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '32px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                width: '100%',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowConsultantModal(false)}
                  aria-label="Close consultant modal"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  ×
                </button>

                <h2 style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 700,
                  color: '#667eea',
                  marginBottom: '32px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{consultantEditId ? 'Edit' : 'Add'} Consultant</h2>

                <form id="consultant-form" onSubmit={handleConsultantSubmit} style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '32px',
                  alignItems: 'flex-start'
                }}>
                  {/* Left Column */}
                  <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Username</label>
                        <input
                          name="username"
                          value={consultantForm.username || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Username"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          readOnly={!!consultantEditId}
                          onFocus={(e) => !consultantEditId && (e.target.style.borderColor = '#667eea')}
                          onBlur={(e) => !consultantEditId && (e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)')}
                        />
                  </div>
                      {!consultantEditId && (
                        <div style={{ flex: '1', minWidth: '200px' }}>
                          <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Password</label>
                          <input
                            name="password"
                            type="password"
                            value={consultantForm.password || ''}
                            onChange={handleConsultantFormChange}
                            placeholder="Password"
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                </div>
                      )}
              </div>

                  {!consultantEditId && (
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                          <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Confirm Password</label>
                          <input
                            name="confirmPassword"
                            type="password"
                            value={consultantForm.confirmPassword || ''}
                            onChange={handleConsultantFormChange}
                            placeholder="Confirm Password"
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                      </div>
                    </div>
                  )}

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Name</label>
                        <input
                          name="name"
                          value={consultantForm.name || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Name"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Email</label>
                        <input
                          name="email"
                          value={consultantForm.email || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Email"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                  </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Phone</label>
                        <input
                          name="phone"
                          value={consultantForm.phone || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Phone"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Tagline</label>
                        <input
                          name="tagline"
                          value={consultantForm.tagline || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Tagline"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                  </div>

                  <div>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Speciality</label>
                      <input
                        name="speciality"
                        value={consultantForm.speciality || ''}
                        onChange={handleConsultantFormChange}
                        placeholder="Speciality"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          fontSize: '16px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                  </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>City</label>
                      <input
                        name="city"
                        value={consultantForm.city || ''}
                        onChange={handleConsultantFormChange}
                        placeholder="City (e.g., Delhi)"
                        required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Address</label>
                        <input
                          name="address"
                          value={consultantForm.address || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Full Address (e.g., 123 Main St, Delhi, 110001)"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                  </div>

                  <div>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Description</label>
                      <textarea
                        name="description"
                        value={consultantForm.description || ''}
                        onChange={handleConsultantFormChange}
                        placeholder="Description"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          minHeight: '80px',
                          fontSize: '16px',
                          resize: 'vertical',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                  </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Aadhar</label>
                        <input
                          name="aadhar"
                          value={consultantForm.aadhar || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Aadhar"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Bank Account</label>
                        <input
                          name="bank_account"
                          value={consultantForm.bank_account || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Bank Account"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Bank IFSC</label>
                        <input
                          name="bank_ifsc"
                          value={consultantForm.bank_ifsc || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Bank IFSC"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                    </div>
                  </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Status</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="status"
                          checked={consultantForm.status === 'online'}
                          onChange={e => setConsultantForm(f => ({ ...f, status: e.target.checked ? 'online' : 'offline' }))}
                            style={{ width: '32px', height: '18px' }}
                        />
                          <span style={{ color: consultantForm.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                            {consultantForm.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                      </label>
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Featured</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={consultantForm.featured || false}
                          onChange={e => setConsultantForm(f => ({ ...f, featured: e.target.checked }))}
                            style={{ width: '32px', height: '18px' }}
                        />
                          <span style={{ color: consultantForm.featured ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                            {consultantForm.featured ? 'Featured' : 'Not Featured'}
                          </span>
                      </label>
                    </div>
                  </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Categories</label>
                      <select
                        multiple
                        value={Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(id => String(id)) : []}
                        onChange={e => handleConsultantMultiSelect('category_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            minHeight: '80px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Subcategories</label>
                      <select
                        multiple
                        value={Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(id => String(id)) : []}
                        onChange={e => handleConsultantMultiSelect('subcategory_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            minHeight: '80px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      >
                        {subcategories
                          .filter(s => {
                            if (!Array.isArray(consultantForm.category_ids)) return false;
                            return consultantForm.category_ids.map(Number).includes(Number(s.category_id));
                          })
                          .map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Appointment Calendar Section */}
                    <div>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>Appointment Calendar</label>
                      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Available Time Slots</label>
                          {consultantSlots.length === 0 && <div style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No slots added yet.</div>}
                        {consultantSlots.map((slot, idx) => (
                            <div key={idx} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '12px',
                              padding: '16px',
                              background: '#fff',
                              borderRadius: '8px',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              flexWrap: 'wrap'
                            }}>
                            <input
                              type="date"
                              value={slot.date}
                              onChange={e => handleSlotChange(idx, 'date', e.target.value)}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(102, 126, 234, 0.2)',
                                  fontSize: '14px',
                                  minWidth: '140px'
                                }}
                            />
                            <input
                              type="time"
                              value={slot.time}
                              onChange={e => handleSlotChange(idx, 'time', e.target.value)}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(102, 126, 234, 0.2)',
                                  fontSize: '14px',
                                  minWidth: '120px'
                                }}
                            />
                            <input
                              type="time"
                              value={slot.endTime || ''}
                              onChange={e => handleSlotChange(idx, 'endTime', e.target.value)}
                              placeholder="End time (optional)"
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(102, 126, 234, 0.2)',
                                  fontSize: '14px',
                                  minWidth: '120px'
                                }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(idx)}
                                style={{
                                  background: '#e53e3e',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '8px 16px',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddSlot}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '12px 20px',
                              fontWeight: 700,
                              fontSize: '14px',
                              cursor: 'pointer',
                              marginTop: '8px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Add Time Slot
                        </button>
                      </div>
                        <div style={{ fontSize: '13px', color: '#667eea', textAlign: 'center' }}>
                        Add available time slots for appointments. You can set start and end times for each date.
                      </div>
                    </div>
                  </div>

                    {/* Map Section */}
                  <div>
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: '14px',
                          marginBottom: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Use My Location
                      </button>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Location (select on map)</label>
                      <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        marginBottom: '12px'
                      }}>
                      {isLoaded && (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={{
                            lat: consultantForm.location_lat ? parseFloat(consultantForm.location_lat) : defaultMapCenter.lat,
                            lng: consultantForm.location_lng ? parseFloat(consultantForm.location_lng) : defaultMapCenter.lng,
                          }}
                          zoom={consultantForm.location_lat && consultantForm.location_lng ? 13 : 5}
                          onClick={handleMapClick}
                        >
                          {consultantForm.location_lat && consultantForm.location_lng && (
                            <Marker
                              position={{ lat: parseFloat(consultantForm.location_lat), lng: parseFloat(consultantForm.location_lng) }}
                              icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                            />
                          )}
                        </GoogleMap>
                      )}
                    </div>
                      <div style={{ fontSize: '14px', color: '#667eea', textAlign: 'center' }}>
                      Lat: {consultantForm.location_lat || '-'}<br />Lng: {consultantForm.location_lng || '-'}
                    </div>
                  </div>

                    {/* File Uploads */}
                  <div>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>Consultant Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'image')}
                        style={{
                          marginBottom: '12px',
                          padding: '8px',
                          border: '1px dashed rgba(102, 126, 234, 0.3)',
                          borderRadius: '8px',
                          width: '100%'
                        }}
                      />
                    {consultantForm.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.image}`}
                        alt="Consultant"
                        width={80}
                        height={80}
                          style={{ borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(102, 126, 234, 0.2)' }}
                        unoptimized
                      />
                    )}
                  </div>

                  <div>
                      <label style={{ fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>ID Proof (upload)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => handleFileUpload(e, 'id_proof_url')}
                        style={{
                          marginBottom: '8px',
                          padding: '8px',
                          border: '1px dashed rgba(102, 126, 234, 0.3)',
                          borderRadius: '8px',
                          width: '100%'
                        }}
                      />
                    {consultantForm.id_proof_url && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.id_proof_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#667eea',
                            textDecoration: 'underline',
                            fontSize: '14px',
                            display: 'block',
                            textAlign: 'center'
                          }}
                        >
                          View Uploaded Document
                      </a>
                    )}
                  </div>
                </div>
              </form>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '32px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    onClick={() => handleConsultantSubmit()}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {consultantEditId ? 'Update' : 'Add'} Consultant
                  </button>
                                    {consultantEditId && (
                    <button
                      type="button"
                      onClick={handleConsultantFormCancel}
                      style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px 24px',
                        fontWeight: 700,
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                    >
                      Cancel
                    </button>
                  )}
              </div>
              </div>
            </div>
          )}

          {/* Users CRUD */}
          {activeMenu === 'users' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Users</h2>
                <button
                  onClick={() => {
                    setUserEditId(null);
                    setUserForm({ username: '', password: '', role: 'consultant' });
                    setShowUserModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus size={16} /> Add User
                </button>
              </div>

              <DataTable
                data={users}
                columns={[
                  { key: 'username', label: 'Username', sortable: true },
                  { key: 'role', label: 'Role', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                    render: (value, row) => (
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={value !== 'inactive'}
                          onChange={() => handleToggleUserStatus(row)}
                          style={{ width: 32, height: 18 }}
                        />
                        <span style={{ color: value !== 'inactive' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                          {value !== 'inactive' ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    )
                  },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value) => value ? new Date(value).toLocaleString() : ''
                  }
                ]}
                onEdit={(user) => {
                  setUserEditId(user.id);
                  setUserForm({ id: user.id, username: user.username, role: user.role });
                  setShowUserModal(true);
                }}
                onDelete={(user) => handleUserDelete(user.id)}
                searchPlaceholder="Search users..."
                title="Users"
              />
            </section>
          )}
          {/* Services CRUD */}
          {activeMenu === 'services' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Services</h2>
                <button
                  onClick={() => {
                    setServiceForm({
                      name: '',
                      description: '',
                      delivery_mode: 'online',
                      service_type: 'appointment',
                      appointment_type: '',
                      consultant_ids: [],
                      subscription_start: '',
                      subscription_end: '',
                      discount: '',
                      monthly_price: '',
                      yearly_price: '',
                      center: '',
                      center_address: '',
                      event_start: '',
                      event_end: '',
                      event_image: null,
                      event_meet_link: '',
                      test_type: '',
                      test_redirect_url: '',
                      price: '',
                      category_ids: [],
                      subcategory_ids: [],
                      suggestions: [{ title: '', description: '', redirect_url: '' }],
                      event_type: '',
                      revenue_type: '',
                      renewal_date: '',
                      center_lat: '',
                      center_lng: ''
                    });
                    setServiceEditId(null);
                    setShowServiceModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus size={16} /> Add Service
                </button>
              </div>

              <DataTable
                data={services}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'service_type', label: 'Type', sortable: true },
                  { key: 'delivery_mode', label: 'Delivery', sortable: true },
                  {
                    key: 'price',
                    label: 'Price',
                    sortable: true,
                    render: (value) => value ? `$${value}` : '-'
                  },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value) => value ? value.split('T')[0] : '-'
                  }
                ]}
                onView={(service) => {
                  if (service.id !== undefined) {
                    handleServiceProfile(service.id);
                  }
                }}
                onEdit={(service) => {
                  handleServiceEdit(service);
                  setShowServiceModal(true);
                }}
                onDelete={(service) => {
                  if (service.id !== undefined) {
                    handleServiceDelete(service.id);
                  }
                }}
                searchPlaceholder="Search services..."
                title="Services"
              />

              {/* Service Profile Modal */}
              {showServiceProfileModal && serviceProfile && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.35)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 2px 12px #e2e8f0', position: 'relative' }}>
                    <button onClick={() => setShowServiceProfileModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: '#e2e8f0', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                    <h2 style={{ fontWeight: 700, color: '#22543d', marginBottom: 12 }}>{serviceProfile.name}</h2>
                    <div style={{ marginBottom: 8 }}><b>Type:</b> {serviceProfile.service_type}</div>
                    <div style={{ marginBottom: 8 }}><b>Delivery:</b> {serviceProfile.delivery_mode}</div>
                    <div style={{ marginBottom: 8 }}><b>Description:</b> {serviceProfile.description}</div>
                    <div style={{ marginBottom: 8 }}><b>Price:</b> {serviceProfile.price}</div>
                    <div style={{ marginBottom: 8 }}><b>Revenue Type:</b> {serviceProfile.revenue_type}</div>
                    {serviceProfile.service_type === 'subscription' && (
                      <>
                        <div style={{ marginBottom: 8 }}><b>Subscription Start:</b> {serviceProfile.subscription_start}</div>
                        <div style={{ marginBottom: 8 }}><b>Subscription End:</b> {serviceProfile.subscription_end}</div>
                        <div style={{ marginBottom: 8 }}><b>Discount:</b> {serviceProfile.discount}</div>
                        <div style={{ marginBottom: 8 }}><b>Monthly Price:</b> {serviceProfile.monthly_price}</div>
                        <div style={{ marginBottom: 8 }}><b>Yearly Price:</b> {serviceProfile.yearly_price}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Name:</b> {serviceProfile.center}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Address:</b> {serviceProfile.center_address}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Location:</b> {serviceProfile.center_lat}, {serviceProfile.center_lng}</div>
                      </>
                    )}
                    {serviceProfile.service_type === 'event' && (
                      <>
                        <div style={{ marginBottom: 8 }}><b>Event Type:</b> {serviceProfile.event_type}</div>
                        <div style={{ marginBottom: 8 }}><b>Event Start:</b> {serviceProfile.event_start}</div>
                        <div style={{ marginBottom: 8 }}><b>Event End:</b> {serviceProfile.event_end}</div>
                        <div style={{ marginBottom: 8 }}><b>Event Image:</b> {serviceProfile.event_image && (<img src={serviceProfile.event_image} alt="Event" style={{ maxWidth: 180, maxHeight: 120, display: 'block', marginTop: 6 }} />)}</div>
                        <div style={{ marginBottom: 8 }}><b>Google Meet Link:</b> {serviceProfile.event_meet_link}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Name:</b> {serviceProfile.center}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Address:</b> {serviceProfile.center_address}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Location:</b> {serviceProfile.center_lat}, {serviceProfile.center_lng}</div>
                        </>
                      )}
                    <div style={{ marginBottom: 8 }}><b>Created:</b> {serviceProfile.created_at ? new Date(serviceProfile.created_at).toLocaleString() : ''}</div>
                  </div>
                </div>
              )}

              {/* Service Modal */}
              {showServiceModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowServiceModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    position: 'relative'
                  }}>
                    <button onClick={() => setShowServiceModal(false)} aria-label="Close service modal" style={{
                      position: 'absolute',
                      top: '16px',
                      right: '20px',
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>×</button>

                    <h2 style={{
                      fontSize: 'clamp(20px, 3vw, 28px)',
                      fontWeight: 700,
                      color: '#667eea',
                      marginBottom: '32px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{serviceEditId ? 'Edit' : 'Add'} Service</h2>

                    <form onSubmit={handleServiceSubmit} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px'
                    }}>
                      {/* Basic Information */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Name *</label>
                          <input
                            name="name"
                            value={serviceForm.name}
                            onChange={handleServiceFormChange}
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Delivery Mode</label>
                          <select
                            name="delivery_mode"
                            value={serviceForm.delivery_mode}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Service Type</label>
                          <select
                            name="service_type"
                            value={serviceForm.service_type}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                    <option value="appointment">Appointment</option>
                    <option value="subscription">Subscription</option>
                    <option value="event">Event</option>
                    <option value="test">Test</option>
                  </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Price</label>
                          <input
                            name="price"
                            type="number"
                            value={serviceForm.price}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>Description</label>
                        <textarea
                          name="description"
                          value={serviceForm.description}
                          onChange={handleServiceFormChange}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            resize: 'vertical'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>

                      {/* Service Type Specific Fields */}
                  {serviceForm.service_type === 'appointment' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Appointment Type</label>
                            <select
                              name="appointment_type"
                              value={serviceForm.appointment_type}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                        <option value="">Select</option>
                        <option value="consultation">Consultation</option>
                        <option value="therapy">Therapy</option>
                      </select>
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Consultants</label>
                            <select
                              name="consultant_ids"
                              multiple
                              value={serviceForm.consultant_ids?.map(String) || []}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                minHeight: '120px'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                        {consultants.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                        ))}
                      </select>
                          </div>
                        </div>
                  )}

                  {serviceForm.service_type === 'subscription' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Subscription Start Date</label>
                            <input
                              type="date"
                              name="subscription_start"
                              value={serviceForm.subscription_start || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Subscription End Date</label>
                            <input
                              type="date"
                              name="subscription_end"
                              value={serviceForm.subscription_end || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Discount (%)</label>
                            <input
                              type="number"
                              name="discount"
                              value={serviceForm.discount || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              max={100}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Monthly Price</label>
                            <input
                              type="number"
                              name="monthly_price"
                              value={serviceForm.monthly_price || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Yearly Price</label>
                            <input
                              type="number"
                              name="yearly_price"
                              value={serviceForm.yearly_price || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Name</label>
                            <input
                              type="text"
                              name="center"
                              value={serviceForm.center || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Address</label>
                            <input
                              type="text"
                              name="center_address"
                              value={serviceForm.center_address || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>
                        </div>
                      )}

                  {serviceForm.service_type === 'event' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event Start Date & Time</label>
                            <input
                              type="datetime-local"
                              name="event_start"
                              value={serviceForm.event_start || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event End Date & Time</label>
                            <input
                              type="datetime-local"
                              name="event_end"
                              value={serviceForm.event_end || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event Image</label>
                            <input
                              type="file"
                              name="event_image"
                              accept="image/*"
                              onChange={handleEventImageChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Name</label>
                            <input
                              type="text"
                              name="center"
                              value={serviceForm.center || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Address</label>
                            <input
                              type="text"
                              name="center_address"
                              value={serviceForm.center_address || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                      {serviceForm.delivery_mode === 'online' && (
                            <div>
                              <label style={{
                                display: 'block',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '8px',
                                fontSize: '14px'
                              }}>Google Meet Link</label>
                              <input
                                type="text"
                                name="event_meet_link"
                                value={generateMeetLink()}
                                readOnly
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  background: '#f9fafb',
                                  color: '#6b7280'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                  {serviceForm.service_type === 'test' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Test Type</label>
                            <select
                              name="test_type"
                              value={serviceForm.test_type}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                        <option value="">Select</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                          </div>

                      {serviceForm.test_type === 'online' && (
                            <div>
                              <label style={{
                                display: 'block',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '8px',
                                fontSize: '14px'
                              }}>Test Redirect URL</label>
                              <input
                                name="test_redirect_url"
                                value={serviceForm.test_redirect_url || ''}
                                onChange={handleServiceFormChange}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                            </div>
                          )}

                      {serviceForm.test_type === 'offline' && (
                        <>
                              <div>
                                <label style={{
                                  display: 'block',
                                  fontWeight: 600,
                                  color: '#374151',
                                  marginBottom: '8px',
                                  fontSize: '14px'
                                }}>Center Name</label>
                                <input
                                  type="text"
                                  name="center"
                                  value={serviceForm.center || ''}
                                  onChange={handleServiceFormChange}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                              </div>

                              <div>
                                <label style={{
                                  display: 'block',
                                  fontWeight: 600,
                                  color: '#374151',
                                  marginBottom: '8px',
                                  fontSize: '14px'
                                }}>Center Address</label>
                                <input
                                  type="text"
                                  name="center_address"
                                  value={serviceForm.center_address || ''}
                                  onChange={handleServiceFormChange}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                              </div>
                        </>
                      )}
                        </div>
                      )}

                      {/* Categories and Subcategories */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Categories</label>
                          <select
                            name="category_ids"
                            multiple
                            value={serviceForm.category_ids?.map(String) || []}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              minHeight: '120px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Subcategories</label>
                          <select
                            name="subcategory_ids"
                            multiple
                            value={serviceForm.subcategory_ids?.map(String) || []}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              minHeight: '120px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                    {subcategories
                      .filter(s => Array.isArray(serviceForm.category_ids) ? serviceForm.category_ids.map(Number).includes(Number(s.category_id)) : true)
                      .map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                  </select>
                </div>
                      </div>

                      {/* Call to Action Suggestions */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '16px',
                          fontSize: '14px'
                        }}>Call to Action Suggestions (max 5)</label>
                        {serviceForm.suggestions.map((s, idx) => (
                          <div key={idx} style={{
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                              gap: '16px',
                              marginBottom: '16px'
                            }}>
                              <input
                                placeholder="Title"
                                value={s.title}
                                onChange={e => handleSuggestionChange(idx, 'title', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                              <input
                                placeholder="Redirect URL"
                                value={s.redirect_url}
                                onChange={e => handleSuggestionChange(idx, 'redirect_url', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                            </div>
                            <textarea
                              placeholder="Description"
                              value={s.description}
                              onChange={e => handleSuggestionChange(idx, 'description', e.target.value)}
                              rows={3}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                resize: 'vertical'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                            {serviceForm.suggestions.length > 1 && (
                <button
                                type="button"
                                onClick={() => handleRemoveSuggestion(idx)}
                  style={{
                                  background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                                  borderRadius: '8px',
                                  padding: '8px 16px',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  marginTop: '12px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                              >
                                Remove Suggestion
                </button>
                            )}
                  </div>
                ))}
                        {serviceForm.suggestions.length < 5 && (
                          <button
                            type="button"
                            onClick={() => handleAddSuggestion()}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '12px 24px',
                              fontWeight: 600,
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            + Add Suggestion
                          </button>
                        )}
                      </div>
                    </form>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                      gap: '16px',
                      marginTop: '32px',
                      paddingTop: '24px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button
                        type="button"
                        onClick={() => handleServiceSubmit({} as React.FormEvent<HTMLFormElement>)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 32px',
                          fontWeight: 700,
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          minWidth: '140px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {serviceEditId ? 'Update' : 'Add'} Service
                      </button>
                      {serviceEditId && (
                        <button
                          type="button"
                          onClick={() => {
                            setServiceForm({
                              name: '',
                              description: '',
                              delivery_mode: 'online',
                              service_type: 'appointment',
                              appointment_type: '',
                              consultant_ids: [],
                              subscription_start: '',
                              subscription_end: '',
                              discount: '',
                              monthly_price: '',
                              yearly_price: '',
                              center: '',
                              center_address: '',
                              event_start: '',
                              event_end: '',
                              event_image: null,
                              event_meet_link: '',
                              test_type: '',
                              test_redirect_url: '',
                              price: '',
                              category_ids: [],
                              subcategory_ids: [],
                              suggestions: [{ title: '', description: '', redirect_url: '' }],
                              event_type: '',
                              revenue_type: '',
                              renewal_date: '',
                              center_lat: '',
                              center_lng: ''
                            });
                            setServiceEditId(null);
                            setShowServiceModal(false);
                          }}
                          style={{
                            background: '#6b7280',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 32px',
                            fontWeight: 600,
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '140px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
          {/* Products CRUD */}
          {activeMenu === 'products' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Products</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={productForm.type}
                  onChange={e => setProductForm(f => ({ ...f, type: e.target.value as ProductType }))}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      minWidth: '140px',
                      fontSize: '14px',
                      background: '#fff'
                    }}
                >
                  <option value="Course">Course</option>
                  <option value="E-book">E-book</option>
                  <option value="App">App</option>
                  <option value="Gadget">Gadget</option>
                </select>
                <button
                    onClick={() => {
                      setProductForm({ type: 'Course', status: 'active', featured: false });
                      setProductEditId(null);
                      setShowProductModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 24px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaPlus size={16} /> Add Product
                </button>
              </div>
              </div>

              <DataTable
                data={Array.isArray(products) ? products.filter(p =>
                  !productForm.type ||
                  p.type?.toLowerCase() === productForm.type.toLowerCase() ||
                  p.product_type?.toLowerCase() === productForm.type.toLowerCase()
                ) : []}
                columns={[
                  {
                    key: 'thumbnail',
                    label: 'Thumbnail',
                    sortable: false,
                    render: (value, row) => (
                      value ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${value}`}
                              alt="Thumbnail"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                            borderRadius: 8,
                                border: '1px solid #e2e8f0'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: 50,
                              height: 50,
                              background: '#f1f5f9',
                          borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#94a3b8',
                              fontSize: 12
                            }}>
                              No Image
                            </div>
                      )
                    )
                  },
                  {
                    key: 'type',
                    label: 'Type',
                    sortable: true,
                    render: (value, row) => row.type || row.product_type || '-'
                  },
                  {
                    key: 'title',
                    label: 'Title/Name',
                    sortable: true,
                    render: (value, row) => row.title || row.name || '-'
                  },
                  {
                    key: 'description',
                    label: 'Description',
                    sortable: true,
                    render: (value, row) => (
                      <div style={{
                        maxWidth: 220,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {value || '-'}
                      </div>
                    )
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                    render: (value, row) => (
                      <span style={{
                        color: value === 'active' ? '#38a169' : '#e53e3e',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: value === 'active' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)'
                      }}>
                        {value || '-'}
                      </span>
                    )
                  }
                ]}
                onEdit={(product) => {
                            setProductForm({
                    ...product,
                    type: product.type || product.product_type as ProductType,
                              thumbnailFile: undefined,
                              pdfFile: undefined,
                              iconFile: undefined,
                              productImageFile: undefined
                            });
                  setProductEditId(product.id ?? null);
                            setShowProductModal(true);
                }}
                onDelete={(product) => {
                  setDeleteProductId(product.id ?? null);
                  setDeleteProductName(product.title || product.name || 'this product');
                            setShowDeleteModal(true);
                }}
                searchPlaceholder="Search products..."
                title="Products"
              />
              {/* Product Modal */}
              {showProductModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(34,37,77,0.32)',
                  zIndex: 3000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowProductModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '40px',
                    minWidth: '90vw',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowProductModal(false)}
                      aria-label="Close product modal"
                      style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: 'none',
                        fontSize: 24,
                        color: '#667eea',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                    >
                      ×
                    </button>
                    <h2 style={{
                      color: '#667eea',
                      fontWeight: 700,
                      marginBottom: 32,
                      fontSize: 'clamp(24px, 4vw, 32px)',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{productEditId ? 'Edit' : 'Add'} Product</h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const formData = new FormData();
                          // Common fields
                          formData.append('type', productForm.type || 'Course');
                          formData.append('product_type', productForm.type || 'Course'); // Try alternative field name
                          formData.append('status', productForm.status || 'active');
                          formData.append('featured', productForm.featured ? 'true' : 'false');
                          // Dynamic fields by type
                          if (productForm.type === 'Course') {
                            if (!productForm.title?.trim()) {
                              alert('Title is required for Course products');
                              return;
                            }
                            if (!productForm.description?.trim()) {
                              alert('Description is required for Course products');
                              return;
                            }
                            if (!productForm.price?.trim()) {
                              alert('Price is required for Course products');
                              return;
                            }
                            if (!productForm.video_url?.trim()) {
                              alert('Video URL is required for Course products');
                              return;
                            }
                            if (!productForm.thumbnailFile) {
                              alert('Thumbnail is required for Course products');
                              return;
                            }

                            formData.append('title', productForm.title.trim());
                            formData.append('description', productForm.description.trim());
                            formData.append('price', productForm.price.trim());
                            formData.append('video_url', productForm.video_url.trim());
                            formData.append('thumbnail', productForm.thumbnailFile);
                          } else if (productForm.type === 'E-book') {
                            formData.append('title', productForm.title || '');
                            formData.append('description', productForm.description || '');
                            formData.append('author', productForm.author || '');
                            if (productForm.pdfFile) formData.append('pdf_file', productForm.pdfFile);
                            if (productForm.thumbnailFile) formData.append('thumbnail', productForm.thumbnailFile);
                          } else if (productForm.type === 'App') {
                            formData.append('name', productForm.name || '');
                            formData.append('description', productForm.description || '');
                            formData.append('download_link', productForm.download_link || '');
                            if (productForm.iconFile) formData.append('icon', productForm.iconFile);
                          } else if (productForm.type === 'Gadget') {
                            formData.append('name', productForm.name || '');
                            formData.append('description', productForm.description || '');
                            formData.append('price', productForm.price || '');
                            if (productForm.productImageFile) formData.append('product_image', productForm.productImageFile);
                            formData.append('purchase_link', productForm.purchase_link || '');
                            formData.append('download_link', productForm.download_link || '');
                            if (productForm.iconFile) formData.append('icon', productForm.iconFile);
                          }
                          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                          console.log('Backend URL:', backendUrl);
                          console.log('FormData contents:', Array.from(formData.entries()));
                          console.log('Product form state:', productForm);

                          // Try both FormData and JSON to see which works
                          const url = productEditId
                            ? `${backendUrl}/api/products/${productEditId}`
                            : `${backendUrl}/api/products`;
                          const method = productEditId ? 'PUT' : 'POST';

                          const response = await fetch(url, {
                            method: method,
                            body: formData,
                          });
                          if (!response.ok) {
                            const error = await response.json();
                            console.log('Backend error response:', error);
                            alert(error.message || 'Failed to add product');
                            return;
                          }
                          // Show success popup
                          setSuccessMessage(productEditId ? 'Product updated successfully!' : 'Product added successfully!');
                          setShowSuccessPopup(true);
                          // Re-fetch products after successful add
                          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
                          const data = await res.json();
                          console.log('Fetched products data:', data);
                          console.log('Products data type:', typeof data);
                          console.log('Is array?', Array.isArray(data));

                          // Extract products array from response
                          const productsArray = data.products || data;
                          console.log('Products array to set:', productsArray);
                          setProducts(productsArray);
                          console.log('Products state after setProducts:', productsArray);
                          setProductForm({
                            type: 'Course',
                            status: 'active',
                            featured: false,
                            title: '',
                            name: '',
                            description: '',
                            price: '',
                            video_url: '',
                            thumbnail: '',
                            thumbnailFile: undefined,
                            author: '',
                            pdf_file: '',
                            pdfFile: undefined,
                            download_link: '',
                            icon: '',
                            iconFile: undefined,
                            product_image: '',
                            productImageFile: undefined,
                            purchase_link: ''
                          });
                          setProductEditId(null);
                          setShowProductModal(false);
                        } catch (error) {
                          console.error('Error submitting product:', error);
                          alert('Error: Failed to submit product. Please try again.');
                        }
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 24,
                        maxWidth: '100%'
                      }}
                    >
                                              <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Product Type</label>
                      <select
                        value={productForm.type}
                        onChange={e => setProductForm(f => ({ ...f, type: e.target.value as ProductType }))}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        required
                      >
                        <option value="Course">Course</option>
                        <option value="E-book">E-book</option>
                        <option value="App">App</option>
                        <option value="Gadget">Gadget</option>
                      </select>
                        </div>
                      {/* Dynamic fields by type */}
                      {productForm.type === 'Course' && (
                        <div style={{
                          maxHeight: '50vh',
                          overflowY: 'auto',
                          padding: '1rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Course Title *</label>
                              <input type="text" value={productForm.title || ''} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., A Mini Course on Time Management" />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Price</label>
                              <input type="text" value={productForm.price || ''} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., Free, $49.99" />
                            </div>
                          </div>

                          <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Course Subtitle *</label>
                          <input type="text" value={productForm.subtitle || ''} onChange={e => setProductForm(f => ({ ...f, subtitle: e.target.value }))} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px', marginBottom: '1rem' }} placeholder="e.g., 7 steps you can use immediately to become more productive and master time management" />

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Duration</label>
                              <input type="text" value={productForm.duration || ''} onChange={e => setProductForm(f => ({ ...f, duration: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., 37min of on-demand video" />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Total Lectures</label>
                              <input type="number" value={productForm.total_lectures || ''} onChange={e => setProductForm(f => ({ ...f, total_lectures: parseInt(e.target.value) || 0 }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., 11" />
                            </div>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Language</label>
                              <input type="text" value={productForm.language || ''} onChange={e => setProductForm(f => ({ ...f, language: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., English, Arabic" />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Level</label>
                              <select value={productForm.level || 'Beginner'} onChange={e => setProductForm(f => ({ ...f, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                          </div>

                          <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Course Description *</label>
                          <textarea value={productForm.description || ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60, width: '100%', fontSize: '13px', marginBottom: '1rem' }} placeholder="Detailed description of what the course covers..." />

                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.5rem', display: 'block', fontSize: '14px' }}>Learning Objectives *</label>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem', backgroundColor: 'white' }}>
                              {(productForm.learning_objectives || ['']).map((objective, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={objective}
                                    onChange={e => {
                                      const newObjectives = [...(productForm.learning_objectives || [''])];
                                      newObjectives[index] = e.target.value;
                                      setProductForm(f => ({ ...f, learning_objectives: newObjectives }));
                                    }}
                                    placeholder="e.g., Master the 7-step time management system"
                                    style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newObjectives = (productForm.learning_objectives || ['']).filter((_, i) => i !== index);
                                      setProductForm(f => ({ ...f, learning_objectives: newObjectives }));
                                    }}
                                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px', fontWeight: '500' }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newObjectives = [...(productForm.learning_objectives || ['']), ''];
                                  setProductForm(f => ({ ...f, learning_objectives: newObjectives }));
                                }}
                                style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                              >
                                + Add Learning Objective
                              </button>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.5rem', display: 'block', fontSize: '14px' }}>Requirements</label>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem', backgroundColor: 'white' }}>
                              {(productForm.requirements || ['']).map((requirement, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={requirement}
                                    onChange={e => {
                                      const newRequirements = [...(productForm.requirements || [''])];
                                      newRequirements[index] = e.target.value;
                                      setProductForm(f => ({ ...f, requirements: newRequirements }));
                                    }}
                                    placeholder="e.g., A willingness to take action on what we cover in this mini course"
                                    style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newRequirements = (productForm.requirements || ['']).filter((_, i) => i !== index);
                                      setProductForm(f => ({ ...f, requirements: newRequirements }));
                                    }}
                                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px', fontWeight: '500' }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newRequirements = [...(productForm.requirements || ['']), ''];
                                  setProductForm(f => ({ ...f, requirements: newRequirements }));
                                }}
                                style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                              >
                                + Add Requirement
                              </button>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.5rem', display: 'block', fontSize: '14px' }}>Course Content</label>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem', backgroundColor: 'white', maxHeight: '200px', overflowY: 'auto' }}>
                              {(productForm.course_content || [{ section: '', lectures: 0, duration: '', items: [''] }]).map((section, sectionIndex) => (
                                <div key={sectionIndex} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '1rem', marginBottom: '1rem', backgroundColor: '#f9fafb' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <input
                                      type="text"
                                      value={section.section}
                                      onChange={e => {
                                        const newContent = [...(productForm.course_content || [])];
                                        newContent[sectionIndex] = { ...section, section: e.target.value };
                                        setProductForm(f => ({ ...f, course_content: newContent }));
                                      }}
                                      placeholder="Section name (e.g., Introduction)"
                                      style={{ padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                    <input
                                      type="number"
                                      value={section.lectures}
                                      onChange={e => {
                                        const newContent = [...(productForm.course_content || [])];
                                        newContent[sectionIndex] = { ...section, lectures: parseInt(e.target.value) || 0 };
                                        setProductForm(f => ({ ...f, course_content: newContent }));
                                      }}
                                      placeholder="Number of lectures"
                                      style={{ padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                    <input
                                      type="text"
                                      value={section.duration}
                                      onChange={e => {
                                        const newContent = [...(productForm.course_content || [])];
                                        newContent[sectionIndex] = { ...section, duration: e.target.value };
                                        setProductForm(f => ({ ...f, course_content: newContent }));
                                      }}
                                      placeholder="Duration (e.g., 5 min)"
                                      style={{ padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem', display: 'block' }}>Lecture Items:</label>
                                    {section.items.map((item, itemIndex) => (
                                      <div key={itemIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                        <input
                                          type="text"
                                          value={item}
                                          onChange={e => {
                                            const newContent = [...(productForm.course_content || [])];
                                            const newItems = [...section.items];
                                            newItems[itemIndex] = e.target.value;
                                            newContent[sectionIndex] = { ...section, items: newItems };
                                            setProductForm(f => ({ ...f, course_content: newContent }));
                                          }}
                                          placeholder="Lecture title (e.g., Welcome to the course)"
                                          style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '12px' }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newContent = [...(productForm.course_content || [])];
                                            const newItems = section.items.filter((_, i) => i !== itemIndex);
                                            newContent[sectionIndex] = { ...section, items: newItems };
                                            setProductForm(f => ({ ...f, course_content: newContent }));
                                          }}
                                          style={{ padding: '3px 6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '10px', fontWeight: '500' }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newContent = [...(productForm.course_content || [])];
                                        const newItems = [...section.items, ''];
                                        newContent[sectionIndex] = { ...section, items: newItems };
                                        setProductForm(f => ({ ...f, course_content: newContent }));
                                      }}
                                      style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px', fontWeight: '500' }}
                                    >
                                      + Add Lecture
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newContent = (productForm.course_content || []).filter((_, i) => i !== sectionIndex);
                                      setProductForm(f => ({ ...f, course_content: newContent }));
                                    }}
                                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px', fontWeight: '500' }}
                                  >
                                    Remove Section
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newContent = [...(productForm.course_content || []), { section: '', lectures: 0, duration: '', items: [''] }];
                                  setProductForm(f => ({ ...f, course_content: newContent }));
                                }}
                                style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                              >
                                + Add Course Section
                              </button>
                            </div>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Instructor Name</label>
                              <input type="text" value={productForm.instructor_name || ''} onChange={e => setProductForm(f => ({ ...f, instructor_name: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., Brandon Hakim" />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Instructor Title</label>
                              <input type="text" value={productForm.instructor_title || ''} onChange={e => setProductForm(f => ({ ...f, instructor_title: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., Productivity Expert & Time Management Coach" />
                            </div>
                          </div>

                          <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Instructor Bio</label>
                          <textarea value={productForm.instructor_bio || ''} onChange={e => setProductForm(f => ({ ...f, instructor_bio: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 50, width: '100%', fontSize: '13px', marginBottom: '1rem' }} placeholder="Brief description of the instructor's background and expertise..." />

                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Instructor Image</label>
                            <input type="file" accept="image/*" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) setProductForm(f => ({ ...f, instructor_image: URL.createObjectURL(file), instructorImageFile: file }));
                            }} style={{ padding: 6, border: '1px solid #e2e8f0', borderRadius: 4, width: '100%' }} />
                            {productForm.instructor_image && <img src={productForm.instructor_image} alt="Instructor" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, marginTop: 4 }} />}
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Rating</label>
                              <input type="number" step="0.1" min="0" max="5" value={productForm.rating || ''} onChange={e => setProductForm(f => ({ ...f, rating: parseFloat(e.target.value) || 0 }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., 4.4" />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Total Ratings</label>
                              <input type="number" value={productForm.total_ratings || ''} onChange={e => setProductForm(f => ({ ...f, total_ratings: parseInt(e.target.value) || 0 }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px' }} placeholder="e.g., 47803" />
                            </div>
                          </div>

                          <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Enrolled Students</label>
                          <input type="number" value={productForm.enrolled_students || ''} onChange={e => setProductForm(f => ({ ...f, enrolled_students: parseInt(e.target.value) || 0 }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px', marginBottom: '1rem' }} placeholder="e.g., 439950" />

                          <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Video URL</label>
                          <input type="text" value={productForm.video_url || ''} onChange={e => setProductForm(f => ({ ...f, video_url: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', width: '100%', fontSize: '13px', marginBottom: '1rem' }} placeholder="URL to course preview video" />

                          <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, color: '#22543d', marginBottom: '0.25rem', display: 'block', fontSize: '13px' }}>Course Thumbnail</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, thumbnail: URL.createObjectURL(file), thumbnailFile: file }));
                            }} style={{ padding: 6, border: '1px solid #e2e8f0', borderRadius: 4, width: '100%' }} />
                            {productForm.thumbnail && <img src={productForm.thumbnail} alt="Thumbnail" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, marginTop: 4 }} />}
                          </div>
                        </div>
                      )}
                      {productForm.type === 'E-book' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Title</label>
                          <input type="text" value={productForm.title || ''} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Description</label>
                          <textarea value={productForm.description || ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Author</label>
                          <input type="text" value={productForm.author || ''} onChange={e => setProductForm(f => ({ ...f, author: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>PDF File</label>
                          <input type="file" accept="application/pdf" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, pdf_file: file.name, pdfFile: file }));
                          }} />
                          {productForm.pdf_file && <span style={{ color: '#5a67d8', fontWeight: 600 }}>{productForm.pdf_file}</span>}
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Thumbnail</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, thumbnail: URL.createObjectURL(file), thumbnailFile: file }));
                          }} />
                          {productForm.thumbnail && <img src={productForm.thumbnail} alt="Thumbnail" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                        </>
                      )}
                      {productForm.type === 'App' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Name</label>
                          <input type="text" value={productForm.name || ''} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Description</label>
                          <textarea value={productForm.description || ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Download Link</label>
                          <input type="text" value={productForm.download_link || ''} onChange={e => setProductForm(f => ({ ...f, download_link: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Icon</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, icon: URL.createObjectURL(file), iconFile: file }));
                          }} />
                          {productForm.icon && <img src={productForm.icon} alt="Icon" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                        </>
                      )}
                      {productForm.type === 'Gadget' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Name</label>
                          <input type="text" value={productForm.name || ''} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Description</label>
                          <textarea value={productForm.description || ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Price</label>
                          <input type="number" value={productForm.price || ''} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Product Image</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, product_image: URL.createObjectURL(file), productImageFile: file }));
                          }} />
                          {productForm.product_image && <img src={productForm.product_image} alt="Product" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Purchase Link</label>
                          <input type="text" value={productForm.purchase_link || ''} onChange={e => setProductForm(f => ({ ...f, purchase_link: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Download Link</label>
                          <input type="text" value={productForm.download_link || ''} onChange={e => setProductForm(f => ({ ...f, download_link: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Icon</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setProductForm(f => ({ ...f, icon: URL.createObjectURL(file), iconFile: file }));
                          }} />
                          {productForm.icon && <img src={productForm.icon} alt="Icon" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                        </>
                      )}
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Status</label>
                      <select value={productForm.status} onChange={e => setProductForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          id="featured"
                          checked={productForm.featured || false}
                          onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))}
                          style={{ width: 16, height: 16 }}
                        />
                        <label htmlFor="featured" style={{ fontWeight: 600, color: productForm.featured ? '#22c55e' : '#ef4444', cursor: 'pointer' }}>
                          {productForm.featured ? 'Featured' : 'Not Featured'}
                        </label>
                      </div>
                      <button
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 40px',
                          fontWeight: 700,
                          fontSize: '18px',
                          cursor: 'pointer',
                          marginTop: 24,
                          gridColumn: '1 / -1',
                          justifySelf: 'center',
                          minWidth: '200px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {productEditId ? 'Update' : 'Add'} Product
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          {/* Blogs CRUD */}
          {activeMenu === 'blogs' && (
            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 700,
                  color: '#667eea',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Manage Blogs</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={blogForm.category}
                  onChange={e => setBlogForm(f => ({ ...f, category: e.target.value as 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' }))}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      minWidth: '140px',
                      fontSize: '14px',
                      background: '#fff'
                    }}
                >
                  <option value="Therapy">Therapy</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Education">Education</option>
                  <option value="Support">Support</option>
                  <option value="Technology">Technology</option>
                </select>
                <button
                    onClick={() => {
                      setBlogForm({ title: '', description: '', category: 'Therapy', thumbnail: '', author: '', status: 'active' });
                      setBlogEditId(null);
                      setShowBlogModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 24px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaPlus size={16} /> Add Blog
                </button>
              </div>
              </div>

              <DataTable
                data={blogs}
                columns={[
                  {
                    key: 'thumbnail',
                    label: 'Thumbnail',
                    sortable: false,
                    render: (value) => (
                      value ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${value}`}
                            alt="Thumbnail"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            borderRadius: 8,
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: 50,
                            height: 50,
                            background: '#f1f5f9',
                          borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8',
                            fontSize: 12
                          }}>
                            No Image
                          </div>
                      )
                    )
                  },
                  { key: 'category', label: 'Category', sortable: true },
                  { key: 'title', label: 'Title', sortable: true },
                  { key: 'author', label: 'Author', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value) => value ? value.split('T')[0] : '-'
                  }
                ]}
                onView={(blog) => {
                  // Handle blog view if needed
                }}
                onEdit={(blog) => {
                          setBlogForm(blog);
                          setBlogEditId(blog.id ?? null);
                          setShowBlogModal(true);
                }}
                onDelete={(blog) => {
                          setDeleteBlogId(blog.id ?? null);
                          setDeleteBlogName(blog.title || 'this blog');
                          setShowDeleteModal(true);
                }}
                searchPlaceholder="Search blogs..."
                title="Blogs"
              />
              {/* Blog Modal */}
              {showBlogModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(34,37,77,0.32)',
                  zIndex: 3000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowBlogModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '40px',
                    minWidth: '90vw',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowBlogModal(false)}
                      aria-label="Close blog modal"
                      style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: 'none',
                        fontSize: 24,
                        color: '#667eea',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                    >
                      ×
                    </button>
                    <h2 style={{
                      color: '#667eea',
                      fontWeight: 700,
                      marginBottom: 32,
                      fontSize: 'clamp(24px, 4vw, 32px)',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{blogEditId ? 'Edit' : 'Add'} Blog</h2>
                    <form
                      onSubmit={handleBlogSubmit}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 24,
                        maxWidth: '100%'
                      }}
                    >
                                              <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Category</label>
                      <select
                        value={blogForm.category}
                        onChange={e => setBlogForm(f => ({ ...f, category: e.target.value as 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' }))}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        required
                      >
                        <option value="Therapy">Therapy</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Education">Education</option>
                        <option value="Support">Support</option>
                        <option value="Technology">Technology</option>
                      </select>
                        </div>
                        <div>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Title</label>
                          <input
                            type="text"
                            value={blogForm.title || ''}
                            onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                            required
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Description</label>
                          <textarea
                            value={blogForm.description || ''}
                            onChange={e => setBlogForm(f => ({ ...f, description: e.target.value }))}
                            required
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none',
                              minHeight: 80,
                              resize: 'vertical'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                        </div>
                        <div>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Author</label>
                          <input
                            type="text"
                            value={blogForm.author || ''}
                            onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                        </div>
                        <div>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Thumbnail</label>
                      <input
                        type="text"
                        value={blogForm.thumbnail || ''}
                        onChange={e => setBlogForm(f => ({ ...f, thumbnail: e.target.value }))}
                        placeholder="Enter thumbnail URL"
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                      {blogForm.thumbnail && (
                        <img
                          src={blogForm.thumbnail}
                          alt="Thumbnail"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginTop: 8,
                                border: '2px solid rgba(102, 126, 234, 0.2)'
                              }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                        </div>
                        <div>
                          <label style={{
                            fontWeight: 600,
                            color: '#667eea',
                            fontSize: '16px',
                            marginBottom: '8px',
                            display: 'block'
                          }}>Status</label>
                          <select
                            value={blogForm.status}
                            onChange={e => setBlogForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' | 'published' | 'draft' | 'pending' | 'archived' | 'live' | 'scheduled' | 'private' | 'public' | 'review' | 'approved' | 'rejected' | 'trash' | 'deleted' }))}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px',
                              width: '100%',
                              background: '#fff',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 234, 0.2)'}
                          >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="archived">Archived</option>
                        <option value="live">Live</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="review">Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="trash">Trash</option>
                        <option value="deleted">Deleted</option>
                      </select>
                        </div>
                                              <button
                          type="submit"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 40px',
                            fontWeight: 700,
                            fontSize: '18px',
                            cursor: 'pointer',
                            marginTop: 24,
                            gridColumn: '1 / -1',
                            justifySelf: 'center',
                            minWidth: '200px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          {blogEditId ? 'Update' : 'Add'} Blog
                        </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
      {/* Category Modal */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowCategoryModal(false); }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            minWidth: '90vw',
            maxWidth: '600px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            position: 'relative',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowCategoryModal(false)}
              aria-label="Close category modal"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                fontSize: 24,
                color: '#667eea',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 style={{
              color: '#667eea',
              fontWeight: 700,
              marginBottom: 32,
              fontSize: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{catEditId ? 'Edit' : 'Add'} Category</h2>

            <form onSubmit={handleCatSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24
            }}>
              <div>
                <label style={{
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '16px',
                  marginBottom: '8px',
                  display: 'block'
                }}>Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                marginTop: 16
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Saving...' : (catEditId ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowSubcategoryModal(false); }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            minWidth: '90vw',
            maxWidth: '600px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            position: 'relative',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowSubcategoryModal(false)}
              aria-label="Close subcategory modal"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                fontSize: 24,
                color: '#667eea',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 style={{
              color: '#667eea',
              fontWeight: 700,
              marginBottom: 32,
              fontSize: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{subEditId ? 'Edit' : 'Add'} Subcategory</h2>

            <form onSubmit={handleSubSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24
            }}>
              <div>
                <label style={{
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '16px',
                  marginBottom: '8px',
                  display: 'block'
                }}>Subcategory Name</label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="Enter subcategory name"
                  required
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>

              <div>
                <label style={{
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '16px',
                  marginBottom: '8px',
                  display: 'block'
                }}>Category</label>
                <select
                  value={subCatId}
                  onChange={e => setSubCatId(Number(e.target.value))}
                  required
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                marginTop: 16
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Saving...' : (subEditId ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubcategoryModal(false)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowUserModal(false); }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            minWidth: '90vw',
            maxWidth: '600px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            position: 'relative',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowUserModal(false)}
              aria-label="Close user modal"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                fontSize: 24,
                color: '#667eea',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 style={{
              color: '#667eea',
              fontWeight: 700,
              marginBottom: 32,
              fontSize: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{userEditId ? 'Edit' : 'Add'} User</h2>

            <form onSubmit={handleUserSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24
            }}>
              <div>
                <label style={{
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '16px',
                  marginBottom: '8px',
                  display: 'block'
                }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={userForm.username}
                  onChange={handleUserFormChange}
                  placeholder="Enter username"
                  required
                  readOnly={!!userEditId}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: userEditId ? '#f8fafc' : '#fff'
                  }}
                  onFocus={(e) => !userEditId && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !userEditId && (e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)')}
                />
              </div>

              {!userEditId && (
                <div>
                  <label style={{
                    fontWeight: 600,
                    color: '#667eea',
                    fontSize: '16px',
                    marginBottom: '8px',
                    display: 'block'
                  }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userForm.password || ''}
                    onChange={handleUserFormChange}
                    placeholder="Enter password"
                    required
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      fontSize: '16px',
                      width: '100%',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
              )}

              <div>
                <label style={{
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '16px',
                  marginBottom: '8px',
                  display: 'block'
                }}>Role</label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                >
                  <option value="consultant">Consultant</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                marginTop: 16
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Saving...' : (userEditId ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 5000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span>{successMessage}</span>
            <button
              onClick={() => setShowSuccessPopup(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '12px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '20px' }}>
              Delete {deleteBlogId ? 'Blog' : 'Product'}
            </h3>
            <p style={{ marginBottom: '24px', color: '#374151' }}>
              Are you sure you want to delete <strong>{deleteBlogId ? deleteBlogName : deleteProductName}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteBlogId) {
                    // Handle blog deletion
                    await handleBlogDelete();
                  } else if (deleteProductId) {
                    // Handle product deletion
                    try {
                      // Try backend delete first
                      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${deleteProductId}`, {
                        method: 'DELETE'
                      });

                      if (response.ok) {
                        // Backend delete successful
                        setProducts(products.filter(p => p.id !== deleteProductId));
                        setSuccessMessage('Product deleted successfully!');
                        setShowSuccessPopup(true);
                      } else {
                        // Backend delete failed, do frontend-only deletion
                        console.log('Backend delete failed, doing frontend-only deletion');
                        setProducts(products.filter(p => p.id !== deleteProductId));
                        setSuccessMessage('Product removed from view (backend delete not implemented)');
                        setShowSuccessPopup(true);
                      }
                    } catch (error) {
                      // Network error, do frontend-only deletion
                      console.log('Network error, doing frontend-only deletion');
                      setProducts(products.filter(p => p.id !== deleteProductId));
                      setSuccessMessage('Product removed from view (backend delete not implemented)');
                      setShowSuccessPopup(true);
                    }
                  }
                  setShowDeleteModal(false);
                }}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {/* <ConfirmModal
        open={confirmModal.open}
        title={`Delete ${confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)}`}
        message={`Are you sure you want to delete ${confirmModal.name || confirmModal.type}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ open: false, type: '', id: null, name: '' })}
      /> */}
    </div>
  );
}
