import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle Responsive Resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const cleanImageUrl = (url) => url?.replace(/[\[\]"]/g, "") || "";
  const sanitize = (text) => text?.replace(/<[^>]*>?/gm, "") || "";

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          style={{ ...styles.checkoutBtn, maxWidth: "200px", margin: "0 auto" }}
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ ...styles.pageWrapper, padding: isMobile ? "20px" : "40px" }}>
      <h1
        style={{ marginBottom: "30px", fontSize: isMobile ? "1.5rem" : "2rem" }}
      >
        Shopping Cart ({cart.length})
      </h1>

      <div
        style={{
          ...styles.cartLayout,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT: Product List */}
        <div style={styles.itemsSection}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.cartItem,
                flexDirection: isMobile ? "row" : "row", // Keep row but allow wrapping
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <img
                src={cleanImageUrl(item.images?.[0])}
                alt={item.title}
                style={{
                  ...styles.itemImage,
                  width: isMobile ? "80px" : "100px",
                  height: isMobile ? "80px" : "100px",
                }}
              />

              <div style={styles.itemInfo}>
                <h3
                  style={{
                    fontSize: isMobile ? "0.95rem" : "1.1rem",
                    margin: "0 0 5px 0",
                  }}
                >
                  {sanitize(item.title)}
                </h3>
                <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
                  {item.category?.name}
                </p>

                {/* Mobile Quantity & Price Row */}
                {isMobile && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={styles.quantityControl}>
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        style={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: "bold" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>

              {/* Desktop Quantity & Price */}
              {!isMobile && (
                <>
                  <div style={styles.quantityControl}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                  <div style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div
          style={{
            ...styles.summarySection,
            marginTop: isMobile ? "20px" : "0",
          }}
        >
          <div style={styles.summaryCard}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <hr style={{ margin: "15px 0", border: "0.5px solid #eee" }} />
            <div
              style={{
                ...styles.summaryRow,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" style={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#888",
                marginTop: "15px",
              }}
            >
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" },
  cartLayout: { display: "flex", gap: "30px" },
  itemsSection: { flex: 2 },
  summarySection: { flex: 1 },
  cartItem: {
    display: "flex",
    gap: "15px",
    padding: "20px 0",
    borderBottom: "1px solid #eee",
  },
  itemImage: {
    borderRadius: "12px",
    objectFit: "cover",
    backgroundColor: "#f5f5f7",
  },
  itemInfo: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  qtyBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  itemPrice: {
    minWidth: "100px",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ff4d4d",
    cursor: "pointer",
    fontSize: "0.8rem",
    padding: "0",
    marginTop: "10px",
    textAlign: "left",
    width: "fit-content",
  },
  summaryCard: {
    padding: "25px",
    background: "#f9f9fb",
    borderRadius: "16px",
    position: "sticky",
    top: "100px", // Adjust based on your Navbar height
    border: "1px solid #f0f0f0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "12px 0",
  },
  checkoutBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    transition: "background 0.3s ease",
  },
  emptyContainer: { textAlign: "center", padding: "100px 20px" },
};

export default Cart;
