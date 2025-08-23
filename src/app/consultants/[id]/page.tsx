"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "../../../components/TopBar";
import Footer from "../../../components/Footer";

type Consultant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  expertise: string;
  bio: string;
  city: string;
  mode: string;
  image?: string;
  status?: string;
  tagline?: string;
  highlights?: string;
  location?: string;
};

export default function ConsultantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsultant = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        // Fetch all consultants and find the one we need
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/public`);

        if (!res.ok) {
          throw new Error("Failed to fetch consultants");
        }

        const allConsultants = await res.json();
        const consultant = allConsultants.find((c: any) => c.id === parseInt(id));

        if (!consultant) {
          throw new Error("Consultant not found");
        }

        setConsultant(consultant);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load consultant details.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();
  }, [id]);

  if (loading) {
    return (
      <>
        <TopBar />
        <div style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--card)"
        }}>
          <div style={{
            color: "#5a67d8",
            fontWeight: 600,
            fontSize: 18,
            textAlign: "center"
          }}>
            Loading consultant details...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !consultant) {
    return (
      <>
        <TopBar />
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--card)",
          padding: "2rem"
        }}>
          <div style={{
            color: "#e53e3e",
            fontWeight: 600,
            fontSize: 18,
            textAlign: "center",
            marginBottom: "1rem"
          }}>
            {error || "Consultant not found"}
          </div>
          <Link href="/consultants" style={{
            padding: "10px 20px",
            background: "#5a67d8",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: 600
          }}>
            Back to Consultants
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div style={{
        background: "var(--card)",
        minHeight: "80vh",
        padding: "2rem 0"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem"
        }}>
          {/* Breadcrumb */}
          <nav style={{
            marginBottom: "2rem",
            fontSize: "14px",
            color: "var(--text-secondary)"
          }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            {" > "}
            <Link href="/consultants" style={{ color: "inherit", textDecoration: "none" }}>
              Consultants
            </Link>
            {" > "}
            <span style={{ color: "var(--text-primary)" }}>{consultant.name}</span>
          </nav>

          {/* Main Content */}
          <div className="consultant-layout" style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "3rem",
            alignItems: "start"
          }}>
            {/* Left Column - Image and Basic Info */}
            <div className="consultant-profile" style={{
              background: "var(--muted)",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              border: "1px solid var(--border)"
            }}>
              {/* Consultant Image */}
              <div style={{ marginBottom: "1.5rem" }}>
                {consultant.image && consultant.image.trim() !== "" ? (
                  <img
                    src={
                      consultant.image.startsWith('/')
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${consultant.image}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${consultant.image}`
                    }
                    alt={consultant.name}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid #5a67d8",
                      margin: "0 auto"
                    }}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "#f3f3f3",
                    border: "4px solid #5a67d8",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "#5a67d8"
                  }}>
                    {consultant.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name and Expertise */}
              <h1 style={{
                fontFamily: "Righteous, cursive",
                color: "#5a67d8",
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "0.5rem"
              }}>
                {consultant.name}
              </h1>

              <div style={{
                background: "#f0fdf4",
                color: "#15803d",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "14px",
                marginBottom: "1rem",
                display: "inline-block"
              }}>
                {consultant.expertise}
              </div>

              {/* Status */}
              {consultant.status && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: consultant.status === "online" ? "#f0fdf4" : "#fef2f2",
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: consultant.status === "online" ? "#15803d" : "#dc2626",
                  border: consultant.status === "online" ? "1px solid #22c55e" : "1px solid #ef4444",
                  marginBottom: "1rem"
                }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: consultant.status === "online" ? "#22c55e" : "#ef4444"
                  }} />
                  {consultant.status === "online" ? "Online" : "Offline"}
                </div>
              )}

              {/* Mode */}
              <div style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginBottom: "1.5rem"
              }}>
                Mode: {consultant.mode}
              </div>

              {/* Contact Buttons */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}>
                <a
                  href={`mailto:${consultant.email}`}
                  style={{
                    background: "#5a67d8",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    textAlign: "center"
                  }}
                >
                  Send Email
                </a>
                <a
                  href={`tel:${consultant.phone}`}
                  style={{
                    background: "var(--muted)",
                    color: "var(--text-primary)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    textAlign: "center",
                    border: "1px solid var(--border)"
                  }}
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="consultant-details">
              {/* Tagline */}
              {consultant.tagline && (
                <div style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                  fontSize: "18px",
                  fontWeight: 500,
                  textAlign: "center"
                }}>
                  "{consultant.tagline}"
                </div>
              )}

              {/* Highlights */}
              {consultant.highlights && (
                <div style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  fontSize: "14px",
                  fontWeight: 600
                }}>
                  ✨ {consultant.highlights}
                </div>
              )}

              {/* Bio/Description */}
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                  color: "var(--text-primary)",
                  fontSize: "20px",
                  fontWeight: 600,
                  marginBottom: "1rem"
                }}>
                  About {consultant.name}
                </h2>
                <p style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  fontSize: "16px"
                }}>
                  {consultant.bio}
                </p>
              </div>

              {/* Contact Information */}
              <div style={{
                background: "var(--muted)",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "1rem"
                }}>
                  Contact Information
                </h3>

                <div style={{
                  display: "grid",
                  gap: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <span style={{
                      color: "#5a67d8",
                      fontSize: "18px"
                    }}>📧</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Email</div>
                      <a
                        href={`mailto:${consultant.email}`}
                        style={{
                          color: "#5a67d8",
                          textDecoration: "none",
                          fontSize: "14px"
                        }}
                      >
                        {consultant.email}
                      </a>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <span style={{
                      color: "#5a67d8",
                      fontSize: "18px"
                    }}>📞</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Phone</div>
                      <a
                        href={`tel:${consultant.phone}`}
                        style={{
                          color: "#5a67d8",
                          textDecoration: "none",
                          fontSize: "14px"
                        }}
                      >
                        {consultant.phone}
                      </a>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <span style={{
                      color: "#5a67d8",
                      fontSize: "18px"
                    }}>📍</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Address</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                        {consultant.address}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <span style={{
                      color: "#5a67d8",
                      fontSize: "18px"
                    }}>🏙️</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>City</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                        {consultant.city}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div style={{
            marginTop: "3rem",
            textAlign: "center"
          }}>
            <Link href="/consultants" style={{
              padding: "12px 24px",
              background: "var(--muted)",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
              border: "1px solid var(--border)",
              display: "inline-block"
            }}>
              ← Back to All Consultants
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Mobile styles for consultant layout */
          @media (max-width: 768px) {
            .consultant-layout {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }

            /* Reorder columns on mobile */
            .consultant-profile {
              order: 1 !important;
            }

            .consultant-details {
              order: 2 !important;
            }

            /* Adjust padding for mobile */
            .consultant-profile {
              padding: 1.5rem !important;
            }

            .consultant-details > div {
              padding: 1.25rem !important;
            }
          }

          @media (max-width: 480px) {
            .consultant-layout {
              gap: 1.5rem !important;
            }

            .consultant-profile {
              padding: 1.25rem !important;
            }

            .consultant-details > div {
              padding: 1rem !important;
            }
          }
        `
      }} />

      <Footer />
    </>
  );
}
