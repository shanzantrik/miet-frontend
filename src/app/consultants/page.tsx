"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import Footer from "../../components/Footer";
import Image from "next/image";

const PAGE_SIZE = 4;

type Consultant = {
  id: number;
  name: string;
  email?: string;
  city?: string;
  address?: string;
  location_lat?: string;
  location_lng?: string;
  expertise?: string;
  speciality?: string;
  mode?: string;
  image?: string;
  status?: string;
};

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [allConsultants, setAllConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  // Filter states
  const [city, setCity] = useState("");
  const [expertise, setExpertise] = useState("");
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch all consultants once on component mount
  const fetchAllConsultants = async () => {
    setLoading(true);
    setError("");
    
    try {
      const url = "http://localhost:4000/api/consultants/public";
      console.log('Fetching all consultants with URL:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch consultants");
      const data = await res.json();
      console.log('API response for consultants:', data); // Debug backend data
      console.log('Total consultants from API:', data.length);
      
      // Check for duplicates in the raw data
      const duplicateIds = data.reduce((acc: number[], consultant: Consultant, index: number) => {
        const firstIndex = data.findIndex((c: Consultant) => c.id === consultant.id);
        if (firstIndex !== index) {
          acc.push(consultant.id);
        }
        return acc;
      }, []);
      
      if (duplicateIds.length > 0) {
        console.log('Found duplicate IDs in API response:', duplicateIds);
      }
      
      // Remove duplicates by ID (keep only the first occurrence)
      const uniqueConsultants = Array.from(
        new Map(data.map((c: Consultant) => [c.id, c])).values()
      ) as Consultant[];
      
      console.log('Unique consultants after deduplication:', uniqueConsultants.length);
      console.log('Removed duplicates:', data.length - uniqueConsultants.length);
      
      setAllConsultants(uniqueConsultants);
      setConsultants(uniqueConsultants);
    } catch (err) {
      console.error('Error fetching consultants:', err);
      setError("Could not load consultants.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to the allConsultants data
  const applyFilters = () => {
    setIsFiltering(true);
    
    let filteredConsultants = allConsultants;
    
    if (city) {
      filteredConsultants = filteredConsultants.filter(
        c => c.city && c.city.trim().toLowerCase() === city.toLowerCase()
      );
    }
    
    if (expertise) {
      filteredConsultants = filteredConsultants.filter((c) => {
        const consultantCategory = c.expertise || c.speciality;
        return consultantCategory && consultantCategory.toLowerCase().includes(expertise.toLowerCase());
      });
    }
    
    if (mode) {
      filteredConsultants = filteredConsultants.filter((c) => {
        // Check if the consultant matches the selected mode
        const consultantMode = c.mode && c.mode.trim();
        const consultantStatus = c.status && c.status.trim();
        
        // For Online/Offline filtering, check both mode and status fields
        if (mode === 'Online') {
          return consultantMode?.toLowerCase().includes('online') || 
                 consultantStatus?.toLowerCase().includes('online') ||
                 consultantMode?.toLowerCase().includes('live') ||
                 consultantStatus?.toLowerCase().includes('live');
        }
        
        if (mode === 'Offline') {
          return consultantMode?.toLowerCase().includes('offline') || 
                 consultantStatus?.toLowerCase().includes('offline') ||
                 consultantMode?.toLowerCase().includes('in-person') ||
                 consultantStatus?.toLowerCase().includes('in-person');
        }
        
        // For other modes, use the original logic
        return consultantMode && consultantMode.toLowerCase().includes(mode.toLowerCase());
      });
    }
    
    if (search) {
      filteredConsultants = filteredConsultants.filter((c) => 
        c.name && c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    console.log('Filtered consultants:', filteredConsultants.length);
    setConsultants(filteredConsultants);
    setIsFiltering(false);
  };

  // Fetch all consultants on component mount
  useEffect(() => {
    fetchAllConsultants();
  }, []);

  // Apply filters when filter values change
  useEffect(() => {
    if (allConsultants.length > 0) {
      applyFilters();
    }
  }, [city, expertise, mode, search, allConsultants]);

  // Generate filter options from actual data
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    allConsultants.forEach((c: Consultant) => {
      if (c.city && typeof c.city === 'string' && c.city.trim() && c.city.trim().toLowerCase() !== 'null' && c.city.trim().toLowerCase() !== 'undefined') {
        citySet.add(c.city.trim());
      }
    });
    return Array.from(citySet).sort();
  }, [allConsultants]);

  const categories = useMemo(() => {
    console.log('All consultants for categories:', allConsultants.map(c => ({ name: c.name, expertise: c.expertise, speciality: c.speciality })));
    const categorySet = new Set(allConsultants.map(c => c.expertise || c.speciality).filter(Boolean));
    return Array.from(categorySet).sort();
  }, [allConsultants]);

  const modes = useMemo(() => {
    console.log('All consultants for modes:', allConsultants.map(c => ({ name: c.name, mode: c.mode, status: c.status })));
    
    // Create a set with explicit Online/Offline options plus any other modes from data
    const modeSet = new Set<string>();
    
    // Add explicit Online/Offline options (only these capitalized versions)
    modeSet.add('Online');
    modeSet.add('Offline');
    
    // Add any other modes from the data (excluding online/offline variations)
    allConsultants.forEach(c => {
      if (c.mode && c.mode.trim()) {
        const modeValue = c.mode.trim();
        // Only add if it's not an online/offline variation
        if (!modeValue.toLowerCase().includes('online') && 
            !modeValue.toLowerCase().includes('offline') &&
            !modeValue.toLowerCase().includes('live') &&
            !modeValue.toLowerCase().includes('in-person')) {
          modeSet.add(modeValue);
        }
      }
      // Also check status field for other modes (excluding online/offline variations)
      if (c.status && c.status.trim()) {
        const statusValue = c.status.trim();
        // Only add if it's not an online/offline variation
        if (!statusValue.toLowerCase().includes('online') && 
            !statusValue.toLowerCase().includes('offline') &&
            !statusValue.toLowerCase().includes('live') &&
            !statusValue.toLowerCase().includes('in-person')) {
          modeSet.add(statusValue);
        }
      }
    });
    
    return Array.from(modeSet).sort();
  }, [allConsultants]);

  // Pagination
  const totalPages = Math.ceil(consultants.length / PAGE_SIZE);
  const paginated = consultants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [city, expertise, mode, search]);

  return (
    <>
      <TopBar />
      <section
        style={{
          background: "var(--card)",
          padding: "2.5rem 0",
          textAlign: "center",
        }}
        aria-label="All Consultants"
      >
        <h2
          style={{
            fontFamily: "Righteous, cursive",
            color: "#5a67d8",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          All Consultants
        </h2>
        {/* Filters and Search */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "140px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5a67d8";
              e.target.style.boxShadow = "0 0 0 3px rgba(90, 103, 216, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <option value="" style={{ color: "#6b7280" }}>All Cities</option>
            {cities.length === 0 && <option value="" disabled>No cities found</option>}
            {cities.map((c) => (
              <option key={c} value={c} style={{ color: "#374151" }}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "160px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5a67d8";
              e.target.style.boxShadow = "0 0 0 3px rgba(90, 103, 216, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <option value="" style={{ color: "#6b7280" }}>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} style={{ color: "#374151" }}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "140px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5a67d8";
              e.target.style.boxShadow = "0 0 0 3px rgba(90, 103, 216, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <option value="" style={{ color: "#6b7280" }}>All Modes</option>
            {modes.map((m) => (
              <option key={m} value={m} style={{ color: "#374151" }}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "200px",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#5a67d8";
              e.target.style.boxShadow = "0 0 0 3px rgba(90, 103, 216, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          />
          <button
            onClick={() => fetchAllConsultants()}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #5a67d8 0%, #667eea 100%)",
              color: "white",
              border: "none",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(90, 103, 216, 0.2)",
              minWidth: "100px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(90, 103, 216, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(90, 103, 216, 0.2)";
            }}
          >
            🔄 Refresh
          </button>
        </div>
        {/* Consultant Cards */}
        {loading ? (
          <div style={{ color: "#5a67d8", fontWeight: 600, fontSize: 18 }}>
            {isFiltering ? "Applying filters..." : "Loading consultants..."}
          </div>
        ) : error ? (
          <div style={{ color: "#e53e3e", fontWeight: 600, fontSize: 18 }}>{error}</div>
        ) : (
          <>
            <div style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              marginBottom: "16px",
              textAlign: "center"
            }}>
              Found {consultants.length} consultant{consultants.length !== 1 ? 's' : ''}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 220px))",
                gap: 16,
                width: "100%",
                margin: "24px 0",
                padding: "0 3px",
                alignItems: "start",
                boxSizing: "border-box",
                maxWidth: "1200px",
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
              }}
            >
            {paginated.map((consultant, index) => {
              console.log('Consultant image:', consultant.image);
              return (
                <Link
                  key={`${consultant.id}-${consultant.name}-${index}`}
                  href={`/consultants/${consultant.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--muted)",
                    borderRadius: 8,
                    boxShadow: "0 1px 4px #e2e8f0",
                    border: "1px solid #e2e8f0",
                    padding: "14px 10px",
                    minWidth: 0,
                    fontSize: 15,
                    width: "100%",
                    aspectRatio: "1 / 1",
                    maxWidth: "220px",
                    minHeight: "220px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 4px #e2e8f0";
                  }}
                >
                  {consultant.image && consultant.image.trim() !== ""
                    ? (
                      <img
                        src={
                          consultant.image.startsWith('/')
                            ? `http://localhost:4000${consultant.image}`
                            : `http://localhost:4000/uploads/${consultant.image}`
                        }
                        alt={consultant.name}
                        width={60}
                        height={60}
                        style={{
                          borderRadius: "6px",
                          objectFit: "cover",
                          border: "1.5px solid #5a67d8",
                          marginBottom: 10,
                        }}
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "6px",
                          border: "1.5px solid #5a67d8",
                          marginBottom: 10,
                          background: "#f3f3f3",
                        }}
                      />
                    )}
                  <div style={{ fontWeight: 700, color: "#22543d", textAlign: "center", fontSize: 16, marginBottom: 4 }}>{consultant.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    {consultant.city || "Not specified"} &middot; <span style={{ color: consultant.mode === 'Online' ? '#5a67d8' : '#374151', fontWeight: 600 }}>{consultant.mode}</span>
                  </div>
                  <div style={{ color: "#5a67d8", fontSize: 12, textAlign: "center", marginBottom: 2, fontWeight: 600 }}>🏥 {consultant.expertise || consultant.speciality || 'Category not specified'}</div>
                  <div style={{ color: "#666", fontSize: 12, textAlign: "center", marginBottom: 4 }}>💻 {consultant.mode || 'Mode not specified'}</div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "#f0fdf4",
                    borderRadius: 5,
                    padding: "2px 8px",
                    fontWeight: 600,
                    fontSize: 12,
                    color: consultant.status === "online" ? "#15803d" : "#b91c1c",
                    border: consultant.status === "online" ? "1px solid #39e639" : "1px solid #e53e3e",
                    marginTop: 2,
                    width: "fit-content"
                  }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "2.5px",
                        background: consultant.status === "online" ? "#39e639" : "#e53e3e",
                        marginRight: 2,
                        border: "1px solid #fff",
                      }}
                    />
                    {consultant.status === "online" ? "Online" : "Offline"}
                  </div>
                </Link>
              );
            })}
          </div>
          </>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: "var(--muted)",
                color: "var(--text-secondary)",
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 16,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  background: page === i + 1 ? "var(--accent)" : "var(--muted)",
                  color: page === i + 1 ? "var(--text-on-accent)" : "var(--text-secondary)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: "var(--muted)",
                color: "var(--text-secondary)",
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 16,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
