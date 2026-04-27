import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useStore from "../../store/useStore";

const OrderHistory = () => {
  const { user } = useStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading)
    return <div style={styles.loading}>Loading your orders...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order History</h2>
      {orders?.length === 0 ? (
        <p style={styles.empty}>You haven't placed any orders yet.</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.label}>ORDER PLACED</p>
                  <p style={styles.value}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={styles.label}>TOTAL</p>
                  <p style={styles.value}>${order.total_amount.toFixed(2)}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <p style={styles.label}>STATUS</p>
                  <span style={styles.statusBadge}>{order.status}</span>
                </div>
              </div>
              <div style={styles.orderBody}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.productRow}>
                    <img
                      src={item.images?.[0]?.replace(/[\[\]"]/g, "")}
                      alt=""
                      style={styles.prodImg}
                    />
                    <div>
                      <p style={styles.prodTitle}>{item.title}</p>
                      <p style={styles.prodQty}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  title: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "25px" },
  orderCard: {
    border: "1px solid #eee",
    borderRadius: "12px",
    marginBottom: "20px",
    overflow: "hidden",
  },
  orderHeader: {
    background: "#f8f9fa",
    padding: "15px 20px",
    display: "flex",
    gap: "40px",
    borderBottom: "1px solid #eee",
  },
  label: { fontSize: "0.65rem", color: "#888", margin: 0, fontWeight: "700" },
  value: {
    fontSize: "0.9rem",
    color: "#333",
    margin: "2px 0 0 0",
    fontWeight: "600",
  },
  statusBadge: {
    background: "#000",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    textTransform: "uppercase",
  },
  orderBody: { padding: "20px" },
  productRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "10px",
  },
  prodImg: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  prodTitle: { fontSize: "0.9rem", fontWeight: "600", margin: 0 },
  prodQty: { fontSize: "0.8rem", color: "#666", margin: 0 },
};

export default OrderHistory;
