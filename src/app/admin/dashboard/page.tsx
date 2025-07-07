"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown } from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

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
  category_ids?: number[] | string[];
  subcategory_ids?: number[] | string[];
  slots?: string[];
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
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'categories' | 'subcategories' | 'consultants' | 'users' | 'services'>('dashboard');
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories`, {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const consultants = await res.json();
      // For each consultant, fetch their slots from the backend
      const consultantsWithSlots = await Promise.all(
        consultants.map(async (c: Consultant) => {
          const slotRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${c.id}/availability`, {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setServices(await res.json());
    }
  }
  useEffect(() => {
    if (activeMenu === 'services') fetchServices();
  }, [activeMenu]);

  // Category CRUD
  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = catEditId ? "PUT" : "POST";
      const url = catEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${catEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`, {
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
      const url = subEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${subEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories`;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${id}`, {
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
  ];

  // Helper to save slots to backend
  async function saveConsultantSlots(consultantId: number, slots: { date: string; time: string; endTime?: string }[]) {
    // First, fetch existing slots and delete them all (for update)
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${consultantId}/availability`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const existing = await res.json();
      for (const slot of existing) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${consultantId}/availability/${slot.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      }
    }
    // Add new slots
    for (const slot of slots) {
      if (slot.date && slot.time) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${consultantId}/availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ date: slot.date, start_time: slot.time, end_time: slot.endTime || '' })
        });
      }
    }
  }

  // Consultant CRUD
  async function handleConsultantSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_jwt");
    const method = consultantEditId ? "PUT" : "POST";
    const url = consultantEditId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${consultantEditId}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants`;
    // Convert category_ids and subcategory_ids to number[] before submitting
    const payload = {
      ...consultantForm,
      category_ids: Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(Number) : [],
      subcategory_ids: Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(Number) : [],
    };
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
      fetchConsultants();
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
  async function handleConsultantDelete(id?: number) {
    if (typeof id !== 'number') return;
    if (!confirm("Delete this consultant?")) return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchConsultants();
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

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#22543d', fontSize: 24, cursor: 'pointer', marginRight: 8 }} aria-label="Toggle sidebar">
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#22543d', letterSpacing: 1 }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => setShowProfileModal(true)} style={{ background: 'none', border: 'none', color: '#22543d', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaUserCircle size={26} color="#22543d" /> Profile
          </button>
          <button onClick={handleLogout} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
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
        <aside style={{ width: sidebarOpen ? 220 : 64, background: '#22543d', color: '#fff', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', alignItems: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '32px 0 0 0' : '32px 0 0 0', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <Image src="/miet-main.webp" alt="MieT Logo" width={48} height={48} style={{ borderRadius: 12, background: '#fff', marginBottom: 8 }} priority />
            {sidebarOpen && <span style={{ fontFamily: 'Righteous, cursive', fontSize: 22, color: '#5a67d8', fontWeight: 700, marginBottom: 8 }}>MieT</span>}
          </div>
          <nav style={{ width: '100%' }}>
            {menu.map((item) => (
              'children' in item && Array.isArray(item.children) ? (
                <div key={item.key} style={{ width: '100%' }}>
                  <button
                    onClick={() => setActiveMenu(item.key as typeof activeMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sidebarOpen ? 16 : 0,
                      width: '100%',
                      background: activeMenu === item.key || item.children.some((c) => c.key === activeMenu) ? '#5a67d8' : 'none',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 0,
                      padding: sidebarOpen ? '14px 28px' : '14px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: 'pointer',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      transition: 'background 0.15s',
                    }}
                    aria-label={item.label}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.label}</span>}
                    {sidebarOpen && (
                      (activeMenu === item.key || item.children.some((c) => c.key === activeMenu))
                        ? <FaChevronDown style={{ marginLeft: 'auto' }} />
                        : <FaChevronRight style={{ marginLeft: 'auto' }} />
                    )}
                  </button>
                  {sidebarOpen && (activeMenu === item.key || item.children.some((c) => c.key === activeMenu)) && (
                    <div style={{ marginLeft: 24 }}>
                      {item.children.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => setActiveMenu(child.key as typeof activeMenu)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            width: '100%',
                            background: activeMenu === child.key ? '#5a67d8' : 'none',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 0,
                            padding: '10px 18px',
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: 'pointer',
                            justifyContent: 'flex-start',
                            transition: 'background 0.15s',
                          }}
                          aria-label={child.label}
                        >
                          {child.icon}
                          <span>{child.label}</span>
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
                    background: activeMenu === item.key ? '#5a67d8' : 'none',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 0,
                    padding: sidebarOpen ? '14px 28px' : '14px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    transition: 'background 0.15s',
                  }}
                  aria-label={item.label}
                >
                  {item.icon}
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              )
            ))}
          </nav>
        </aside>
        {/* Main content */}
        <main style={{ flex: 1, background: '#f7fafc', padding: '32px 24px', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          {/* Dashboard view with charts/tables */}
          {activeMenu === 'dashboard' && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Dashboard Overview</h2>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
                {/* Example stat cards */}
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e2e8f0', padding: 24, minWidth: 220, flex: 1 }}>
                  <div style={{ fontSize: 18, color: '#5a67d8', fontWeight: 600, marginBottom: 8 }}>Categories</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#22543d' }}>{categories.length}</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e2e8f0', padding: 24, minWidth: 220, flex: 1 }}>
                  <div style={{ fontSize: 18, color: '#5a67d8', fontWeight: 600, marginBottom: 8 }}>Subcategories</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#22543d' }}>{subcategories.length}</div>
                </div>
              </div>
              {/* Placeholder for charts */}
              <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e2e8f0', padding: 32, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', fontSize: 22, fontWeight: 600 }}>
                [Charts and analytics coming soon]
              </div>
            </div>
          )}
          {/* Categories CRUD */}
          {activeMenu === 'categories' && (
            <section>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Manage Categories</h2>
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
            </section>
          )}
          {/* Subcategories CRUD */}
          {activeMenu === 'subcategories' && (
            <section>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Manage Subcategories</h2>
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
            </section>
          )}
          {/* Consultants CRUD */}
          {activeMenu === 'consultants' && (
            <section>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Manage Consultants</h2>
              {/* Consultant Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', marginBottom: 24 }}>
                <thead>
                  <tr style={{ background: '#e2e8f0' }}>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Image</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Username</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Name</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Email</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Status</th>
                    <th style={{ padding: 10 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {consultants.map(c => (
                    <tr key={c.id}>
                      <td style={{ padding: 10 }}>
                        {c.image ? (
                          <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${c.image}`} alt={c.name} width={44} height={44} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} unoptimized />
                        ) : (
                          <span style={{ display: 'inline-block', width: 44, height: 44, borderRadius: 8, background: '#e2e8f0' }} />
                        )}
                      </td>
                      <td style={{ padding: 10 }}>{c.username}</td>
                      <td style={{ padding: 10 }}>{c.name}</td>
                      <td style={{ padding: 10 }}>{c.email}</td>
                      <td style={{ padding: 10 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={c.status === 'online'}
                            onChange={() => handleToggleConsultantStatus(c)}
                            style={{ width: 32, height: 18 }}
                          />
                          <span style={{ color: c.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>{c.status === 'online' ? 'Online' : 'Offline'}</span>
                        </label>
                      </td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => { handleConsultantProfile(c.id); setShowConsultantProfileModal(true); }} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>View</button>
                        <button onClick={() => handleConsultantEdit(c)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleConsultantDelete(c.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Create Consultant Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, width: '100%' }}>
                <button type="button" onClick={() => { setConsultantForm({ category_ids: [], subcategory_ids: [] }); setConsultantEditId(null); setConsultantSlots([]); }} style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Create Consultant</button>
              </div>
              {/* Booking Slots List (create & edit mode, only show once, above submit/cancel buttons) */}
              <div style={{ margin: '18px 0', width: '100%' }}>
                <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4, display: 'block' }}>Consultation Booking Slots</label>
                {consultantSlots.length === 0 && <div style={{ color: '#a0aec0' }}>No slots added.</div>}
                {consultantSlots.map((slot, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input type="date" value={slot.date} onChange={e => handleSlotChange(idx, 'date', e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    <input type="time" value={slot.time} onChange={e => handleSlotChange(idx, 'time', e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    <input type="time" value={slot.endTime || ''} onChange={e => handleSlotChange(idx, 'endTime', e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    <button type="button" onClick={() => handleRemoveSlot(idx)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddSlot} style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>Add Slot</button>
                <div style={{ fontSize: 13, color: '#5a67d8', marginTop: 6 }}>
                  Add, edit, or remove available consultation slots for this consultant.
                </div>
              </div>
              {/* Consultant Form */}
              <form onSubmit={handleConsultantSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e2e8f0', padding: 32, marginBottom: 32, alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 320px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Username</label>
                      <input name="username" value={consultantForm.username || ''} onChange={handleConsultantFormChange} placeholder="Username" required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} readOnly={!!consultantEditId} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Password</label>
                      <input name="password" type="password" value={consultantForm.password || ''} onChange={handleConsultantFormChange} placeholder="Password" required={!consultantEditId} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>
                  {!consultantEditId && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Confirm Password</label>
                        <input name="confirmPassword" type="password" value={consultantForm.confirmPassword || ''} onChange={handleConsultantFormChange} placeholder="Confirm Password" required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Name</label>
                      <input name="name" value={consultantForm.name || ''} onChange={handleConsultantFormChange} placeholder="Name" required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Email</label>
                      <input name="email" value={consultantForm.email || ''} onChange={handleConsultantFormChange} placeholder="Email" required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Phone</label>
                      <input name="phone" value={consultantForm.phone || ''} onChange={handleConsultantFormChange} placeholder="Phone" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Tagline</label>
                      <input name="tagline" value={consultantForm.tagline || ''} onChange={handleConsultantFormChange} placeholder="Tagline" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Speciality</label>
                    <input name="speciality" value={consultantForm.speciality || ''} onChange={handleConsultantFormChange} placeholder="Speciality" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Description</label>
                    <textarea name="description" value={consultantForm.description || ''} onChange={handleConsultantFormChange} placeholder="Description" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Aadhar</label>
                      <input name="aadhar" value={consultantForm.aadhar || ''} onChange={handleConsultantFormChange} placeholder="Aadhar" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Bank Account</label>
                      <input name="bank_account" value={consultantForm.bank_account || ''} onChange={handleConsultantFormChange} placeholder="Bank Account" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Bank IFSC</label>
                      <input name="bank_ifsc" value={consultantForm.bank_ifsc || ''} onChange={handleConsultantFormChange} placeholder="Bank IFSC" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Status</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="status"
                          checked={consultantForm.status === 'online'}
                          onChange={e => setConsultantForm(f => ({ ...f, status: e.target.checked ? 'online' : 'offline' }))}
                          style={{ width: 32, height: 18 }}
                        />
                        <span style={{ color: consultantForm.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>{consultantForm.status === 'online' ? 'Online' : 'Offline'}</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Categories</label>
                      <select
                        multiple
                        value={Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(id => String(id)) : []}
                        onChange={e => handleConsultantMultiSelect('category_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4 }}>Subcategories</label>
                      <select
                        multiple
                        value={Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(id => String(id)) : []}
                        onChange={e => handleConsultantMultiSelect('subcategory_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }}
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
                {/* Map and File Uploads */}
                <div style={{ flex: '1 1 320px', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <button type="button" onClick={handleUseMyLocation} style={{ background: '#5a67d8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 15, marginBottom: 8, cursor: 'pointer' }}>Use My Location</button>
                    <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4, display: 'block' }}>Location (select on map)</label>
                    <div style={{ width: '100%', height: 220, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
                      {isLoaded && (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={{
                            lat: consultantForm.location_lat ? parseFloat(consultantForm.location_lat) : defaultMapCenter.lat,
                            lng: consultantForm.location_lng ? parseFloat(consultantForm.location_lng) : defaultMapCenter.lng,
                          }}
                          zoom={consultantForm.location_lat && consultantForm.location_lng ? 13 : 5}
                          onClick={e => {
                            setConsultantForm(f => ({ ...f, location_lat: String(e.latLng?.lat() ?? ''), location_lng: String(e.latLng?.lng() ?? '') }));
                          }}
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
                    <div style={{ fontSize: 14, color: '#5a67d8' }}>
                      Lat: {consultantForm.location_lat || '-'}<br />Lng: {consultantForm.location_lng || '-'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4, display: 'block' }}>Consultant Image</label>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} style={{ marginBottom: 8 }} />
                    {consultantForm.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.image}`}
                        alt="Consultant"
                        width={80}
                        height={80}
                        style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        unoptimized
                      />
                    )}
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#22543d', marginBottom: 4, display: 'block' }}>ID Proof (upload)</label>
                    <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'id_proof_url')} style={{ marginBottom: 8 }} />
                    {consultantForm.id_proof_url && (
                      <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.id_proof_url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a67d8', textDecoration: 'underline', fontSize: 15 }}>
                        View Uploaded
                      </a>
                    )}
                  </div>
                </div>
              </form>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" form="consultant-form" style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>{consultantEditId ? 'Update' : 'Add'} Consultant</button>
                {consultantEditId && <button type="button" onClick={handleConsultantFormCancel} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>Cancel</button>}
              </div>
              {/* Consultant Profile View */}
              {showConsultantProfileModal && consultantProfile && (
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
                  <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e2e8f0', padding: 32, minWidth: 340, maxWidth: 480, width: '100%', position: 'relative' }}>
                    <button onClick={() => { setShowConsultantProfileModal(false); setConsultantProfile(null); }} style={{ position: 'absolute', top: 16, right: 16, background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Close</button>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#22543d', marginBottom: 12 }}>{consultantProfile.name}</h3>
                    {consultantProfile.image && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantProfile.image}`} alt={consultantProfile.name} width={100} height={100} style={{ borderRadius: 12, objectFit: 'cover', border: '1.5px solid #e2e8f0' }} unoptimized />
                      </div>
                    )}
                    <div style={{ color: '#5a67d8', fontWeight: 600, marginBottom: 8 }}>{consultantProfile.tagline}</div>
                    <div style={{ marginBottom: 8 }}><b>Email:</b> {consultantProfile.email}</div>
                    <div style={{ marginBottom: 8 }}><b>Phone:</b> {consultantProfile.phone}</div>
                    <div style={{ marginBottom: 8 }}><b>Status:</b> {consultantProfile.status}</div>
                    <div style={{ marginBottom: 8 }}><b>Speciality:</b> {consultantProfile.speciality}</div>
                    <div style={{ marginBottom: 8 }}><b>Description:</b> {consultantProfile.description}</div>
                    <div style={{ marginBottom: 8 }}><b>Address:</b> {consultantProfile.address}</div>
                    <div style={{ marginBottom: 8 }}>
                      <b>ID Proof:</b> {consultantProfile.id_proof_type}
                      {consultantProfile.id_proof_url && (
                        <>
                          {' '}
                          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantProfile.id_proof_url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a67d8', textDecoration: 'underline', fontWeight: 600 }}>
                            View Document
                          </a>
                        </>
                      )}
                    </div>
                    <div style={{ marginBottom: 8 }}><b>Aadhar:</b> {consultantProfile.aadhar}</div>
                    <div style={{ marginBottom: 8 }}><b>Bank:</b> {consultantProfile.bank_account} / {consultantProfile.bank_ifsc}</div>
                  </div>
                </div>
              )}
            </section>
          )}
          {/* Users CRUD */}
          {activeMenu === 'users' && (
            <section>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Manage Users</h2>
              <form onSubmit={handleUserSubmit} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                <input type="text" name="username" value={userForm.username} onChange={handleUserFormChange} placeholder="Username" required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} readOnly={!!userEditId} />
                {!userEditId && (
                  <input type="password" name="password" value={userForm.password || ''} onChange={handleUserFormChange} placeholder="Password" required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                )}
                <select name="role" value={userForm.role} onChange={handleUserFormChange} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <option value="consultant">Consultant</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                <button type="submit" style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{userEditId ? 'Update' : 'Add'}</button>
                {userEditId && <button type="button" onClick={handleUserFormCancel} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>}
              </form>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f7fafc' }}>
                <thead>
                  <tr style={{ background: '#e2e8f0' }}>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Username</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Role</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Status</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Created</th>
                    <th style={{ padding: 10 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ padding: 10 }}>{u.username}</td>
                      <td style={{ padding: 10 }}>{u.role}</td>
                      <td style={{ padding: 10 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={u.status !== 'inactive'}
                            onChange={() => handleToggleUserStatus(u)}
                            style={{ width: 32, height: 18 }}
                          />
                          <span style={{ color: u.status !== 'inactive' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>{u.status !== 'inactive' ? 'Active' : 'Inactive'}</span>
                        </label>
                      </td>
                      <td style={{ padding: 10 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => handleUserEdit(u)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleUserDelete(u.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {/* Services CRUD */}
          {activeMenu === 'services' && (
            <section>
              {/* Service Form (restored conditional logic) */}
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22543d', marginBottom: 18 }}>Manage Services</h2>
              <form onSubmit={handleServiceSubmit} style={{ width: 600, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e2e8f0', padding: 16, marginBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Always show these fields */}
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Name</label>
                  <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Description</label>
                  <textarea name="description" value={serviceForm.description} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 40 }} />
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Delivery Mode</label>
                  <select name="delivery_mode" value={serviceForm.delivery_mode} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Service Type</label>
                  <select name="service_type" value={serviceForm.service_type} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <option value="appointment">Appointment</option>
                    <option value="subscription">Subscription</option>
                    <option value="event">Event</option>
                    <option value="test">Test</option>
                  </select>

                  {/* Appointment-specific fields */}
                  {serviceForm.service_type === 'appointment' && (
                    <>
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Appointment Type</label>
                      <select name="appointment_type" value={serviceForm.appointment_type} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <option value="">Select</option>
                        <option value="consultation">Consultation</option>
                        <option value="therapy">Therapy</option>
                      </select>
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Consultants</label>
                      <select name="consultant_ids" multiple value={serviceForm.consultant_ids?.map(String) || []} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }}>
                        {consultants.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                        ))}
                      </select>
                    </>
                  )}

                  {/* Subscription-specific fields */}
                  {serviceForm.service_type === 'subscription' && (
                    <>
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Subscription Start Date</label>
                      <input type="date" name="subscription_start" value={serviceForm.subscription_start || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Subscription End Date</label>
                      <input type="date" name="subscription_end" value={serviceForm.subscription_end || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Discount (%)</label>
                      <input type="number" name="discount" value={serviceForm.discount || ''} onChange={handleServiceFormChange} min={0} max={100} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Monthly Price</label>
                      <input type="number" name="monthly_price" value={serviceForm.monthly_price || ''} onChange={handleServiceFormChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Yearly Price</label>
                      <input type="number" name="yearly_price" value={serviceForm.yearly_price || ''} onChange={handleServiceFormChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Center Name</label>
                      <input type="text" name="center" value={serviceForm.center || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Center Address</label>
                      <input type="text" name="center_address" value={serviceForm.center_address || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    </>
                  )}

                  {/* Event-specific fields */}
                  {serviceForm.service_type === 'event' && (
                    <>
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Event Start Date & Time</label>
                      <input type="datetime-local" name="event_start" value={serviceForm.event_start || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Event End Date & Time</label>
                      <input type="datetime-local" name="event_end" value={serviceForm.event_end || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Event Image</label>
                      <input type="file" name="event_image" accept="image/*" onChange={handleEventImageChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Center Name</label>
                      <input type="text" name="center" value={serviceForm.center || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Center Address</label>
                      <input type="text" name="center_address" value={serviceForm.center_address || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      {serviceForm.delivery_mode === 'online' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Google Meet Link</label>
                          <input type="text" name="event_meet_link" value={generateMeetLink()} readOnly style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f7fafc' }} />
                        </>
                      )}
                    </>
                  )}

                  {/* Test-specific fields */}
                  {serviceForm.service_type === 'test' && (
                    <>
                      <label style={{ fontWeight: 600, color: '#22543d' }}>Test Type</label>
                      <select name="test_type" value={serviceForm.test_type} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <option value="">Select</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                      {serviceForm.test_type === 'online' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Test Redirect URL</label>
                          <input name="test_redirect_url" value={serviceForm.test_redirect_url || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                        </>
                      )}
                      {serviceForm.test_type === 'offline' && (
                        <>
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Center Name</label>
                          <input type="text" name="center" value={serviceForm.center || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                          <label style={{ fontWeight: 600, color: '#22543d' }}>Center Address</label>
                          <input type="text" name="center_address" value={serviceForm.center_address || ''} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                        </>
                      )}
                    </>
                  )}

                  {/* Always show these fields */}
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Price</label>
                  <input name="price" type="number" value={serviceForm.price} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Categories</label>
                  <select name="category_ids" multiple value={serviceForm.category_ids?.map(String) || []} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <label style={{ fontWeight: 600, color: '#22543d' }}>Subcategories</label>
                  <select name="subcategory_ids" multiple value={serviceForm.subcategory_ids?.map(String) || []} onChange={handleServiceFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 60 }}>
                    {subcategories
                      .filter(s => Array.isArray(serviceForm.category_ids) ? serviceForm.category_ids.map(Number).includes(Number(s.category_id)) : true)
                      .map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                  </select>
                </div>
              </form>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 0, marginBottom: 32 }}>
                <button
                  type="submit"
                  form="service-form"
                  disabled={serviceFormLoading}
                  style={{
                    background: '#22543d',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '12px 32px',
                    fontWeight: 700,
                    fontSize: 18,
                    border: 'none',
                    cursor: serviceFormLoading ? 'not-allowed' : 'pointer',
                    minWidth: 160
                  }}
                >
                  {serviceFormLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 18, margin: '0 auto', padding: 8 }}>
                <label style={{ fontWeight: 600, color: '#22543d' }}>Call to Action Suggestions (max 5)</label>
                {serviceForm.suggestions.map((s, idx) => (
                  <div key={idx} style={{ background: '#f7fafc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <input placeholder="Title" value={s.title} onChange={e => handleSuggestionChange(idx, 'title', e.target.value)} style={{ width: '100%', marginBottom: 6, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    <textarea placeholder="Description" value={s.description} onChange={e => handleSuggestionChange(idx, 'description', e.target.value)} style={{ width: '100%', marginBottom: 6, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 40 }} />
                    <input placeholder="Redirect URL" value={s.redirect_url} onChange={e => handleSuggestionChange(idx, 'redirect_url', e.target.value)} style={{ width: '100%', marginBottom: 6, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    {serviceForm.suggestions.length > 1 && <button type="button" onClick={() => handleRemoveSuggestion(idx)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 4 }}>Remove</button>}
                  </div>
                ))}
                {serviceForm.suggestions.length < 5 && <button type="button" onClick={() => handleAddSuggestion()} style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8, marginBottom: 24, width: 120, alignSelf: 'center', paddingLeft: 12, paddingRight: 12 }}>Add Suggestion</button>}
              </div>
              {serviceFormMessage && (
                <div style={{ marginTop: 12, color: serviceFormMessage.includes('success') ? 'green' : 'red', textAlign: 'center', width: '100%' }}>
                  {serviceFormMessage}
                </div>
              )}
              {/* Services List Table */}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#22543d', marginBottom: 10 }}>All Services</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                  <tr style={{ background: '#f7fafc' }}>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Name</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Type</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Delivery</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Price</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Created</th>
                    <th style={{ padding: 10, textAlign: 'left', color: '#22543d' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: 10 }}>{s.name}</td>
                      <td style={{ padding: 10 }}>{s.service_type}</td>
                      <td style={{ padding: 10 }}>{s.delivery_mode}</td>
                      <td style={{ padding: 10 }}>{s.price}</td>
                      <td style={{ padding: 10 }}>{s.created_at ? s.created_at.split('T')[0] : ''}</td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => s.id !== undefined && handleServiceProfile(s.id)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>View</button>
                        <button onClick={() => s.id !== undefined && handleServiceEdit(s)} style={{ background: '#e2e8f0', color: '#22543d', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => s.id !== undefined && handleServiceDelete(s.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            </section>
          )}
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
