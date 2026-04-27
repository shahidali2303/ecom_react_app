import { useState, useEffect } from "react"; // Added useState, useEffect
import {
  Link,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useStore from "../../store/useStore";

const AdminLayout = () => {
  const { profile, logout, isLoading } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) return <div style={styles.loading}>Verifying...</div>;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.adminPage}>
      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isMobile
            ? isMobileMenuOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          zIndex: isMobile ? 2000 : 1,
        }}
      >
        <div style={styles.sidebarTop}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>💎</span>
            <h2 style={styles.sidebarTitle}>LuxeAdmin</h2>
          </div>

          <nav style={styles.nav}>
            <Link
              to="/admin/orders"
              style={{
                ...styles.navLink,
                ...(isActive("/admin/orders") ? styles.activeLink : {}),
              }}
            >
              <span style={styles.icon}>📦</span> Orders
            </Link>
            <Link
              to="/admin/products"
              style={{
                ...styles.navLink,
                ...(isActive("/admin/products") ? styles.activeLink : {}),
              }}
            >
              <span style={styles.icon}>🛍️</span> Products
            </Link>
            <div style={styles.divider} />
            <Link to="/" style={styles.navLink}>
              <span style={styles.icon}>🏠</span> Live Store
            </Link>
          </nav>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={styles.icon}>🚪</span> Logout
        </button>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div
        style={{
          ...styles.mainWrapper,
          marginLeft: isMobile ? "0" : "280px",
        }}
      >
        <header style={styles.topHeader}>
          <div style={styles.headerLeft}>
            {/* MOBILE MENU TOGGLE */}
            {isMobile && (
              <button
                style={styles.menuToggle}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                ☰
              </button>
            )}
            <div style={styles.breadcrumb}>
              Admin /{" "}
              <span style={{ color: "#1a1a1a", fontWeight: "600" }}>
                {location.pathname.split("/").pop()}
              </span>
            </div>
          </div>

          <div style={styles.adminUser}>
            {!isMobile && (
              <span style={styles.userName}>
                {profile?.full_name || "Admin"}
              </span>
            )}
            <div style={styles.userAvatar}>
              {profile?.full_name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main
          style={{
            ...styles.content,
            padding: isMobile ? "20px" : "40px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  adminPage: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8F9FA",
    fontFamily: "'Inter', sans-serif",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1500,
  },
  sidebar: {
    width: "280px",
    background: "#1a1a1a",
    color: "#fff",
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "fixed",
    height: "100vh",
    transition: "transform 0.3s ease-in-out",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "48px",
    paddingLeft: "12px",
  },
  logoIcon: { fontSize: "1.5rem" },
  sidebarTitle: {
    fontSize: "1.25rem",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navLink: {
    color: "#94A3B8",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500",
    padding: "12px 16px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
  activeLink: { background: "rgba(255, 255, 255, 0.1)", color: "#fff" },
  icon: { marginRight: "12px", fontSize: "1.1rem" },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    margin: "16px 0",
  },
  logoutBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#F87171",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: "margin 0.3s ease-in-out",
  },
  topHeader: {
    height: "70px",
    background: "#fff",
    borderBottom: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "15px" },
  menuToggle: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "5px",
  },
  breadcrumb: {
    color: "#64748B",
    fontSize: "0.9rem",
    textTransform: "capitalize",
  },
  adminUser: { display: "flex", alignItems: "center", gap: "12px" },
  userAvatar: {
    width: "35px",
    height: "35px",
    background: "#4F46E5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  userName: { fontWeight: "600", color: "#1E293B", fontSize: "0.9rem" },
  content: { flex: 1 },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#64748B",
  },
};

export default AdminLayout;
