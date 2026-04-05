// src/pages/Checkout.jsx
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const Checkout = () => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 15.0;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    alert("🎉 Order Successful! Your items are on the way.");
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT SIDE: Forms */}
        <div style={styles.leftColumn}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            <input
              type="email"
              placeholder="Email Address"
              required
              style={styles.inputFull}
            />

            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            <div style={styles.row}>
              <input
                type="text"
                placeholder="First Name"
                required
                style={styles.inputHalf}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                style={styles.inputHalf}
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              required
              style={styles.inputFull}
            />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              style={styles.inputFull}
            />
            <div style={styles.row}>
              <input
                type="text"
                placeholder="City"
                required
                style={styles.inputThird}
              />
              <input
                type="text"
                placeholder="State"
                required
                style={styles.inputThird}
              />
              <input
                type="text"
                placeholder="ZIP code"
                required
                style={styles.inputThird}
              />
            </div>

            <h2 style={styles.sectionTitle}>Payment</h2>
            <div style={styles.paymentBox}>
              <div style={styles.paymentHeader}>
                <span>Credit Card</span>
                <div style={styles.cardsIcon}>💳</div>
              </div>
              <div style={styles.paymentBody}>
                <input
                  type="text"
                  placeholder="Card Number"
                  style={styles.inputFull}
                />
                <div style={styles.row}>
                  <input
                    type="text"
                    placeholder="Expiration (MM/YY)"
                    style={styles.inputHalf}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    style={styles.inputHalf}
                  />
                </div>
              </div>
            </div>

            <button type="submit" style={styles.submitBtn}>
              Pay Now — ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Summary Card */}
        <div style={styles.rightColumn}>
          <div style={styles.summaryCard}>
            <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.summaryItem}>
                  <div style={styles.imgWrapper}>
                    <img
                      src={item.images?.[0]?.replace(/[\[\]"]/g, "")}
                      alt=""
                      style={styles.summaryImg}
                    />
                    <span style={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <span style={styles.itemTitle}>{item.title}</span>
                  <span style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={styles.calcRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.calcRow}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Total</span>
              <span style={styles.totalAmount}>
                <small style={{ fontSize: "0.8rem", color: "#888" }}>
                  USD{" "}
                </small>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: "#fff", minHeight: "100vh", color: "#333" },
  container: {
    display: "flex",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "60px 20px",
    gap: "60px",
    flexWrap: "wrap",
  },
  leftColumn: { flex: 1.2, minWidth: "350px" },
  rightColumn: { flex: 0.8, minWidth: "350px" },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: "30px 0 15px 0",
  },
  inputFull: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  row: { display: "flex", gap: "12px", marginBottom: "12px" },
  inputHalf: {
    flex: 1,
    padding: "12px",
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
  },
  inputThird: {
    flex: 1,
    padding: "12px",
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
  },
  paymentBox: {
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "10px",
  },
  paymentHeader: {
    background: "#f8f8f8",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #dcdcdc",
  },
  paymentBody: { padding: "20px" },
  submitBtn: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "30px",
  },

  summaryCard: {
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
    border: "1px solid #eee",
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  imgWrapper: { position: "relative" },
  summaryImg: {
    width: "64px",
    height: "64px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    objectFit: "cover",
    background: "#fff",
  },
  qtyBadge: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "#666",
    color: "#fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "0.7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { flex: 1, fontSize: "0.9rem", color: "#444" },
  itemPrice: { fontWeight: "500" },
  calcRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#666",
    margin: "10px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #ddd",
    fontWeight: "600",
  },
  totalAmount: { fontSize: "1.4rem" },
  empty: { textAlign: "center", padding: "100px" },
  backBtn: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    cursor: "pointer",
  },
};

export default Checkout;
