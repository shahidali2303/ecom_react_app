import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // 1. Fetch Paginated Orders
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: async () => {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Get count and data in one go
      const { data, error, count } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { orders: data, totalCount: count };
    },
    keepPreviousData: true,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      toast.success("Status updated");
    },
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return { bg: "#ecfdf5", color: "#059669" };
      case "shipped":
        return { bg: "#eff6ff", color: "#2563eb" };
      case "paid":
        return { bg: "#fff7ed", color: "#ea580c" };
      default:
        return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  if (isLoading) return <div style={styles.loading}>Fetching orders...</div>;

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h1 style={styles.title}>Order Management</h1>
          <p style={styles.subtitle}>
            Showing {data?.orders?.length} of {data?.totalCount} orders
          </p>
        </div>
        <div style={styles.statsCard}>
          <span style={styles.statsLabel}>Total Revenue</span>
          <span style={styles.statsValue}>
            $
            {data?.orders
              ?.reduce((acc, curr) => acc + curr.total_amount, 0)
              .toFixed(2)}
          </span>
        </div>
      </header>

      {/* TABLE WRAPPER WITH HORIZONTAL SCROLL FOR MOBILE */}
      <div style={styles.tableScroll}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((order) => {
                const statusStyle = getStatusStyle(order.status);
                return (
                  <tr key={order.id} style={styles.row}>
                    <td style={styles.td}>
                      <span style={styles.orderId}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>{order.email}</td>
                    <td style={styles.td}>
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td style={{ ...styles.td, fontWeight: "700" }}>
                      ${order.total_amount}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        style={styles.select}
                      >
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div style={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ ...styles.pageBtn, opacity: page === 1 ? 0.5 : 1 }}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.5 : 1 }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px 0" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },
  titleArea: { flex: "1 1 300px" },
  title: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: { color: "#666", marginTop: "5px" },
  statsCard: {
    background: "#000",
    color: "#fff",
    padding: "15px 25px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: "180px",
  },
  statsLabel: { fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.8 },
  statsValue: { fontSize: "1.4rem", fontWeight: "700" },
  tableScroll: {
    overflowX: "auto", // Crucial for responsiveness
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  tableWrapper: {
    background: "#fff",
    minWidth: "800px", // Ensures table doesn't squash on small screens
    border: "1px solid #eee",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "15px 20px",
    background: "#fafafa",
    textAlign: "left",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "18px 20px",
    fontSize: "0.9rem",
    color: "#333",
    borderBottom: "1px solid #f9f9f9",
  },
  orderId: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#007bff",
    background: "#f0f7ff",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "700",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
  },
  pageBtn: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  pageInfo: { fontWeight: "600", color: "#666", fontSize: "0.9rem" },
  loading: { textAlign: "center", padding: "100px", color: "#888" },
};

export default AdminOrders;
