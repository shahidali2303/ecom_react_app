import { Link, Outlet, useLocation } from "react-router-dom";
import useStore from "../store/useStore";

const DashboardLayout = () => {
  const { logout } = useStore();
  const location = useLocation();

  const menuItems = [
    { name: "Personal Details", path: "/dashboard/details", icon: "👤" },
    { name: "Order History", path: "/dashboard/orders", icon: "📦" },
    { name: "Wishlist", path: "../wishlist", icon: "❤️" },
  ];

  return (
    <div style={styles.dashboardPage}>
      <div style={styles.container}>
        {/* LEFT SIDEBAR */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>My Account</h2>
          <nav style={styles.nav}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navLink,
                  background:
                    location.pathname === item.path ? "#f0f0f0" : "transparent",
                  fontWeight: location.pathname === item.path ? "700" : "400",
                }}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            ))}
            <button onClick={logout} style={styles.logoutBtn}>
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main style={styles.content}>
          <Outlet /> {/* This renders the specific sub-page */}
        </main>
      </div>
    </div>
  );
};

const styles = {
  dashboardPage: {
    background: "#fafafa",
    minHeight: "100vh",
    padding: "40px 10px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    gap: "30px",
  },
  sidebar: {
    width: "280px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    height: "fit-content",
    border: "1px solid #eee",
  },
  sidebarTitle: { fontSize: "1.2rem", marginBottom: "25px", fontWeight: "800" },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  navLink: {
    textDecoration: "none",
    color: "#333",
    padding: "12px 15px",
    borderRadius: "8px",
    display: "flex",
    gap: "12px",
    transition: "0.2s",
  },
  content: {
    flex: 1,
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #eee",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "12px",
    background: "none",
    border: "1px solid #fee2e2",
    color: "#ef4444",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default DashboardLayout;
