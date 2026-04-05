// src/pages/Cart.jsx
import useStore from "../store/useStore";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useStore();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const cleanImageUrl = (url) => url?.replace(/[\[\]"]/g, "") || "";

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2>Your cart is empty</h2>
        <Link to="/" style={styles.checkoutBtn}>
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <h1 style={{ marginBottom: "30px" }}>Shopping Cart</h1>

      <div style={styles.cartLayout}>
        {/* LEFT: Product List */}
        <div style={styles.itemsSection}>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <img
                src={cleanImageUrl(item.images?.[0])}
                alt={item.title}
                style={styles.itemImage}
              />

              <div style={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p style={{ color: "#888" }}>{item.category?.name}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>

              <div style={styles.quantityControl}>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  style={styles.qtyBtn}
                >
                  -
                </button>
                <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                <button onClick={() => addToCart(item)} style={styles.qtyBtn}>
                  +
                </button>
              </div>

              <div style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h3>Order Summary</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
  cartLayout: { display: "flex", gap: "30px", flexWrap: "wrap" },
  itemsSection: { flex: 2, minWidth: "350px" },
  summarySection: { flex: 1, minWidth: "300px" },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px 0",
    borderBottom: "1px solid #eee",
  },
  itemImage: {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  itemInfo: { flex: 2 },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  itemPrice: {
    flex: 1,
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
  },
  summaryCard: {
    padding: "25px",
    background: "#f9f9f9",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },
  checkoutBtn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
  },
  emptyContainer: { textAlign: "center", padding: "100px" },
};

export default Cart;
