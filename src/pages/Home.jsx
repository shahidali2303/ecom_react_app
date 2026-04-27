import { useQuery } from "@tanstack/react-query";
import useStore from "../store/useStore";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const LIMIT = 12;

const fetchProducts = async (page) => {
  const offset = (page - 1) * LIMIT;
  const url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${offset}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");

  const data = await res.json();
  // Return the array specifically so 'products' in your component is an array
  return data.products;
};

const Home = () => {
  // Pull persistent page state from Zustand
  const { currentPage, setCurrentPage, addToCart } = useStore();

  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["products", currentPage], // Syncs with Store
    queryFn: () => fetchProducts(currentPage),
    keepPreviousData: true, // Prevents layout jump when changing pages
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Products</h1>
      </div>

      {/* Show Skeletons during initial load or background refresh */}
      {isLoading ? (
        <div style={styles.grid}>
          {[...Array(LIMIT)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div style={styles.status}>
          <h2>Something went wrong.</h2>
          <p>Please check your connection and try again.</p>
        </div>
      ) : (
        <div className="fade-in">
          <ProductCard products={products} addToCart={addToCart} />

          {/* Pagination Controls */}
          {products?.length > 0 && (
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  ...styles.pageBtn,
                  opacity: currentPage === 1 ? 0.3 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              <div style={styles.pageIndicator}>
                <span style={styles.pageLabel}>PAGE</span>
                <span style={styles.pageNumber}>{currentPage}</span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={products?.length < LIMIT}
                style={{
                  ...styles.pageBtn,
                  opacity: products?.length < LIMIT ? 0.3 : 1,
                  cursor: products?.length < LIMIT ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    marginTop: "20px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: "-1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
  },
  status: { textAlign: "center", padding: "100px", color: "#666" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    marginTop: "60px",
    paddingBottom: "80px",
  },
  pageIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "60px",
  },
  pageLabel: {
    fontSize: "0.65rem",
    fontWeight: "800",
    color: "#999",
    letterSpacing: "1px",
  },
  pageNumber: { fontSize: "1.2rem", fontWeight: "800", color: "#000" },
  pageBtn: {
    padding: "12px 30px",
    borderRadius: "12px",
    border: "1px solid #eee",
    background: "#fff",
    color: "#000",
    fontWeight: "700",
    fontSize: "0.9rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Home;
