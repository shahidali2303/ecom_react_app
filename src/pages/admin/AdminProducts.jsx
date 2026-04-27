import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const AdminProducts = () => {
  const [page, setPage] = useState(1);

  // 1. Fetch Paginated Products from DummyJSON
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: async () => {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const res = await fetch(
        `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${skip}`,
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json(); // Returns { products: [], total: 100, ... }
    },
    keepPreviousData: true,
  });

  if (isLoading) return <div style={styles.loading}>Loading inventory...</div>;

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h1 style={styles.title}>Product Inventory</h1>
          <p style={styles.subtitle}>
            Manage your catalog ({data?.total} total products)
          </p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => toast.error("Database is read-only")}
        >
          + Add Product
        </button>
      </header>

      {/* RESPONSIVE TABLE WRAPPER */}
      <div style={styles.tableScroll}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((product) => (
                <tr key={product.id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <img
                        src={product.thumbnail}
                        alt=""
                        style={styles.thumb}
                      />
                      <span style={styles.productTitle}>{product.title}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{product.category}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "700" }}>
                    ${product.price}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        color: product.stock < 10 ? "#ef4444" : "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td style={styles.td}>⭐ {product.rating}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn}>Edit</button>
                  </td>
                </tr>
              ))}
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
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },
  titleArea: { flex: 1 },
  title: { fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", margin: 0 },
  subtitle: { color: "#666", marginTop: "5px" },
  addBtn: {
    padding: "12px 24px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableScroll: {
    overflowX: "auto",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  tableWrapper: {
    background: "#fff",
    minWidth: "900px",
    border: "1px solid #eee",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "18px 20px",
    background: "#fafafa",
    textAlign: "left",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "15px 20px",
    fontSize: "0.9rem",
    color: "#333",
    borderBottom: "1px solid #f9f9f9",
  },
  productCell: { display: "flex", alignItems: "center", gap: "12px" },
  thumb: {
    width: "45px",
    height: "45px",
    borderRadius: "8px",
    objectFit: "cover",
    background: "#f0f0f0",
  },
  productTitle: { fontWeight: "600", color: "#111" },
  categoryBadge: {
    padding: "4px 10px",
    background: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "0.75rem",
    color: "#475569",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  editBtn: {
    background: "none",
    border: "1px solid #eee",
    padding: "6px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "40px",
  },
  pageBtn: {
    padding: "10px 25px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  pageInfo: { fontWeight: "600", color: "#666" },
  loading: { textAlign: "center", padding: "100px", color: "#888" },
};

export default AdminProducts;
