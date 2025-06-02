import SignOutButton from "../components/SignOutButton";

export default function HomePage() {
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    navbar: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      position: "sticky" as const,
      top: 0,
      zIndex: 50,
    },
    navContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    signOutBtn: {
      padding: "8px 24px",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "9999px",
      color: "#374151",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
    },
    main: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "64px 24px",
    },
    heroSection: {
      textAlign: "center" as const,
      marginBottom: "64px",
    },
    heroTitle: {
      fontSize: "60px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "24px",
      lineHeight: "1.1",
    },
    heroGradientText: {
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    heroSubtitle: {
      fontSize: "20px",
      color: "#4b5563",
      marginBottom: "32px",
      maxWidth: "672px",
      margin: "0 auto 32px auto",
    },
    ctaButton: {
      padding: "16px 32px",
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      color: "white",
      borderRadius: "9999px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "16px",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "32px",
      marginBottom: "64px",
    },
    card: {
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(4px)",
      borderRadius: "16px",
      padding: "32px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    iconContainer: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "12px",
    },
    cardText: {
      color: "#4b5563",
      lineHeight: "1.6",
    },
    statsSection: {
      background: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(4px)",
      borderRadius: "24px",
      padding: "48px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "32px",
      textAlign: "center" as const,
    },
    statNumber: {
      fontSize: "30px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "8px",
    },
    statLabel: {
      color: "#4b5563",
    },
    footer: {
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(4px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      marginTop: "64px",
    },
    footerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "16px",
    },
    footerLinks: {
      display: "flex",
      gap: "24px",
    },
    footerLink: {
      color: "#4b5563",
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>NUSphere</div>
          <SignOutButton />
        </div>
      </nav>

      {/* Hero Section */}
      <main style={styles.main}>
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Welcome to <span style={styles.heroGradientText}>NUSphere</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Your gateway to the NUS community. Connect, collaborate, and thrive
            in Singapore's premier university ecosystem.
          </p>
          <button
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Get Started
          </button>
        </div>

        {/* Feature Cards */}
        <div style={styles.cardsGrid}>
          <div
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ ...styles.iconContainer, background: "#dbeafe" }}>
              <svg
                style={{ width: "24px", height: "24px", color: "#2563eb" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Connect</h3>
            <p style={styles.cardText}>
              Build meaningful relationships with fellow students, faculty, and
              alumni across all faculties.
            </p>
          </div>

          <div
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ ...styles.iconContainer, background: "#e0e7ff" }}>
              <svg
                style={{ width: "24px", height: "24px", color: "#4f46e5" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Collaborate</h3>
            <p style={styles.cardText}>
              Work together on projects, research, and initiatives that shape
              the future of education.
            </p>
          </div>

          <div
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ ...styles.iconContainer, background: "#f3e8ff" }}>
              <svg
                style={{ width: "24px", height: "24px", color: "#9333ea" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Thrive</h3>
            <p style={styles.cardText}>
              Access resources, opportunities, and support to excel in your
              academic and personal journey.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Active Students</div>
            </div>
            <div>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Faculties</div>
            </div>
            <div>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Student Organizations</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a
              href="#"
              style={styles.footerLink}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              Privacy
            </a>
            <a
              href="#"
              style={styles.footerLink}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              Terms
            </a>
            <a
              href="#"
              style={styles.footerLink}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
  //test
  );
}
