import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { useMutation } from "@tanstack/react-query"; // Add this
import { supabase } from "../lib/supabase"; // Add this
import { toast } from "react-hot-toast"; // Add this

const Checkout = () => {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle Responsive Resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- ORDER MUTATION ---
  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Order Placed Successfully!");
      clearCart();
      navigate("/"); // Or redirect to a "My Orders" page
    },
    onError: (error) => {
      toast.error(`Order failed: ${error.message}`);
    },
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 15.0;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // 1. Gather form data
    const formData = new FormData(e.target);
    const shippingDetails = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
    };

    // 2. Prepare order object
    const orderData = {
      user_id: user?.id || null, // Optional if guest checkout is allowed
      email: formData.get("email"),
      total_amount: total,
      items: cart, // JSONB field saves the whole array
      shipping_address: shippingDetails,
      status: "paid",
    };

    // 3. Trigger Supabase Insert
    orderMutation.mutate(orderData);
  };

  const sanitize = (text) => text?.replace(/<[^>]*>?/gm, "") || "";

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
      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column-reverse" : "row", // Summary shows first on mobile for some checkouts, or reverse to keep form first. Let's keep form first:
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "20px" : "60px 20px",
        }}
      >
        {/* LEFT SIDE: Forms */}
        <div
          style={{
            ...styles.leftColumn,
            minWidth: isMobile ? "100%" : "350px",
          }}
        >
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            {/* CONTACT INFORMATION */}

            <input
              name="email" // CRITICAL: Matches column in Supabase
              type="email"
              placeholder="Email Address"
              defaultValue={user?.email || ""}
              required
              readOnly={!!user?.email} // If user is logged in, prevent editing email
              style={styles.inputFull}
            />

            {/* SHIPPING ADDRESS */}
            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            <div
              style={{
                ...styles.row,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "0" : "12px",
              }}
            >
              <input
                name="firstName" // Matches shipping_address JSON key
                type="text"
                placeholder="First Name"
                required
                style={isMobile ? styles.inputFull : styles.inputHalf}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                style={isMobile ? styles.inputFull : styles.inputHalf}
              />
            </div>

            <input
              name="address"
              type="text"
              placeholder="Address"
              required
              style={styles.inputFull}
            />
            <input
              name="apartment"
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              style={styles.inputFull}
            />

            <div
              style={{
                ...styles.row,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "0" : "12px",
              }}
            >
              <input
                name="city"
                type="text"
                placeholder="City"
                required
                style={isMobile ? styles.inputFull : styles.inputThird}
              />
              <input
                name="state"
                type="text"
                placeholder="State"
                required
                style={isMobile ? styles.inputFull : styles.inputHalf}
              />
              <input
                name="zip"
                type="text"
                placeholder="ZIP code"
                required
                style={isMobile ? styles.inputFull : styles.inputHalf}
              />
            </div>

            {/* PAYMENT SECTION */}
            <h2 style={styles.sectionTitle}>Payment</h2>
            <div style={styles.paymentBox}>
              <div style={styles.paymentHeader}>
                <span>Credit Card</span>
                <div style={styles.cardsIcon}>💳</div>
              </div>
              <div style={styles.paymentBody}>
                <input
                  name="cardNumber"
                  type="text"
                  placeholder="Card Number"
                  style={styles.inputFull}
                />
                <div
                  style={{
                    ...styles.row,
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "0" : "12px",
                  }}
                >
                  <input
                    name="expDate"
                    type="text"
                    placeholder="Expiration (MM/YY)"
                    style={isMobile ? styles.inputFull : styles.inputHalf}
                  />
                  <input
                    name="cvv"
                    type="text"
                    placeholder="CVV"
                    style={isMobile ? styles.inputFull : styles.inputHalf}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: orderMutation.isPending ? 0.7 : 1,
                cursor: orderMutation.isPending ? "not-allowed" : "pointer",
              }}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending
                ? "Processing..."
                : `Complete Purchase — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Summary Card */}
        <div
          style={{
            ...styles.rightColumn,
            minWidth: isMobile ? "100%" : "350px",
            marginBottom: isMobile ? "40px" : "0",
          }}
        >
          <div
            style={{
              ...styles.summaryCard,
              position: isMobile ? "static" : "sticky",
            }}
          >
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
                  <span style={styles.itemTitle}>{sanitize(item.title)}</span>
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
    gap: "60px",
  },
  leftColumn: { flex: 1.2 },
  rightColumn: { flex: 0.8 },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "30px 0 15px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputFull: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  row: { display: "flex", marginBottom: "0" },
  inputHalf: {
    flex: 1,
    padding: "14px",
    marginBottom: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  inputThird: {
    flex: 1,
    padding: "14px",
    marginBottom: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box", // CRITICAL: ensures padding doesn't add to width
    minWidth: "0", // Prevents inputs from pushing past their flex container
  },
  paymentBox: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px",
  },
  paymentHeader: {
    background: "#fbfbfb",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e0e0e0",
    fontWeight: "600",
  },
  paymentBody: { padding: "20px 20px 8px 20px" },
  submitBtn: {
    width: "100%",
    padding: "20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "30px",
    transition: "background 0.3s",
  },
  summaryCard: {
    background: "#f6f6f6",
    padding: "30px",
    borderRadius: "16px",
    top: "100px",
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  imgWrapper: { position: "relative" },
  summaryImg: {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    border: "1px solid #eee",
    objectFit: "cover",
    background: "#fff",
  },
  qtyBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  itemTitle: { flex: 1, fontSize: "0.9rem", color: "#111", fontWeight: "500" },
  itemPrice: { fontWeight: "600" },
  calcRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#555",
    margin: "12px 0",
    fontSize: "0.95rem",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px solid #e0e0e0",
    fontWeight: "700",
  },
  totalAmount: { fontSize: "1.5rem" },
  empty: { textAlign: "center", padding: "100px" },
  backBtn: {
    padding: "12px 25px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Checkout;
