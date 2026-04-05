import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { cart, wishlist, isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 1. Handle Responsive resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Live Search Logic (Debounced)
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://api.escuelajs.co/api/v1/products/?title=${searchTerm}&offset=0&limit=5`,
        );
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 3. Click Outside Search to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (id) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav style={styles.navWrapper}>
      <div style={styles.navContainer}>
        {/* LEFT: LOGO */}
        <Link to="/" style={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>
            LUXE<span style={{ fontWeight: "300" }}>STORE</span>
          </span>
        </Link>

        {/* CENTER: SEARCH (Desktop) */}
        {!isMobile && (
          <div style={styles.searchWrapper} ref={searchRef}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {/* SEARCH DROPDOWN */}
            {(searchResults.length > 0 || isSearching) && (
              <div style={styles.dropdown}>
                {isSearching ? (
                  <div style={styles.statusText}>Searching...</div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      style={styles.resultItem}
                      className="search-hover"
                    >
                      <img
                        src={product.images[0]?.replace(/[\[\]"]/g, "")}
                        alt=""
                        style={styles.resultImg}
                      />
                      <div style={styles.resultInfo}>
                        <p style={styles.resultTitle}>{product.title}</p>
                        <p style={styles.resultPrice}>${product.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* RIGHT: ACTIONS */}
        <div style={styles.actionGroup}>
          {!isMobile && (
            <div style={styles.desktopNav}>
              <Link to="/wishlist" style={styles.navItem}>
                Wishlist{" "}
                {wishlist.length > 0 && <span style={styles.dot}></span>}
              </Link>
            </div>
          )}

          <Link
            to="/cart"
            style={styles.iconLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>🛒</span>
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {!isMobile && (
            <div style={styles.desktopAuth}>
              {isAuthenticated ? (
                <div style={styles.userSection}>
                  <div style={styles.avatar}>{user?.name?.charAt(0)}</div>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" style={styles.loginBtn}>
                  Sign In
                </Link>
              )}
            </div>
          )}

          {isMobile && (
            <button
              style={styles.menuToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {isMenuOpen && isMobile && (
        <div style={styles.mobileMenu}>
          {/* 1. Mobile Search Section */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />

            {/* MOBILE SEARCH RESULTS DROPDOWN */}
            {(searchResults.length > 0 || isSearching) && (
              <div style={styles.mobileDropdown}>
                {isSearching ? (
                  <div style={styles.statusText}>Searching...</div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleSelectProduct(product.id);
                        setIsMenuOpen(false);
                      }}
                      style={styles.resultItem}
                      className="search-hover"
                    >
                      <img
                        src={product.images[0]?.replace(/[\[\]"]/g, "")}
                        alt=""
                        style={styles.resultImg}
                      />
                      <div style={styles.resultInfo}>
                        <p style={styles.resultTitle}>{product.title}</p>
                        <p style={styles.resultPrice}>${product.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 2. Navigation Links */}
          <Link
            to="/"
            style={styles.mobileItem}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/wishlist"
            style={styles.mobileItem}
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist ({wishlist.length})
          </Link>

          <hr style={styles.divider} />

          {/* 3. AUTH SECTION (The Missing Part) */}
          <div style={styles.mobileAuthContainer}>
            {isAuthenticated ? (
              <>
                <div style={styles.mobileUserCard}>
                  <div style={styles.avatar}>
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div style={styles.mobileTextGroup}>
                    <span style={styles.mobileWelcome}>Welcome back,</span>
                    <span style={styles.mobileUserName}>
                      {user?.name || "User"}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                  Log Out of Account
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={styles.mobileLoginBtn}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In to LuxeStore
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navWrapper: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(15px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    height: "75px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "#000",
  },
  logoIcon: { fontSize: "1.4rem" },
  logoText: { fontSize: "1.1rem", fontWeight: "800", letterSpacing: "1px" },

  // Search Styles
  searchWrapper: {
    position: "relative",
    flex: 1,
    maxWidth: "400px",
    margin: "0 20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 20px",
    borderRadius: "20px",
    border: "1px solid #eee",
    background: "#f8f9fa",
    outline: "none",
    fontSize: "0.9rem",
  },
  dropdown: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    zIndex: 2000,
    overflow: "hidden",
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #f9f9f9",
  },
  resultImg: {
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    objectFit: "cover",
  },
  resultInfo: { display: "flex", flexDirection: "column" },
  resultTitle: { fontSize: "0.85rem", fontWeight: "600", margin: 0 },
  resultPrice: { fontSize: "0.8rem", color: "#007bff", margin: 0 },
  statusText: { padding: "15px", textAlign: "center", color: "#888" },

  desktopNav: { display: "flex", gap: "30px" },
  navItem: {
    textDecoration: "none",
    color: "#444",
    fontWeight: "500",
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: "-2px",
    right: "-8px",
    width: "5px",
    height: "5px",
    background: "#ff4d4d",
    borderRadius: "50%",
  },
  actionGroup: { display: "flex", alignItems: "center", gap: "15px" },
  iconLink: {
    position: "relative",
    textDecoration: "none",
    fontSize: "1.3rem",
  },
  cartBadge: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "#000",
    color: "#fff",
    fontSize: "0.65rem",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  desktopAuth: { display: "flex", alignItems: "center" },
  userSection: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "30px",
    height: "30px",
    background: "#eee",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  loginBtn: {
    background: "#000",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
  menuToggle: {
    display: "block",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },

  mobileMenu: {
    position: "absolute",
    top: "75px",
    left: 0,
    width: "100%",
    background: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
    borderTop: "1px solid #eee",
  },
  mobileItem: {
    textDecoration: "none",
    color: "#333",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  divider: { border: "none", borderTop: "1px solid #eee" },
  mobileUser: { fontSize: "0.9rem", color: "#666" },
  mobileLogout: {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
  },
  mobileLogin: {
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
  },
  mobileDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    zIndex: 3000,
    marginTop: "5px",
    maxHeight: "250px", // Limit height so it doesn't take over the whole screen
    overflowY: "auto",
  },
  mobileAuthContainer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  mobileUserCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #eee",
  },
  mobileTextGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  mobileWelcome: {
    fontSize: "0.75rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  mobileUserName: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#000",
  },
  mobileLogoutBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#fff",
    color: "#ff4d4d",
    border: "1px solid #ff4d4d",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  mobileLoginBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1rem",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
  },
  // Ensure avatar looks consistent
  avatar: {
    width: "40px",
    height: "40px",
    background: "#000",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
  },
};

export default Navbar;
