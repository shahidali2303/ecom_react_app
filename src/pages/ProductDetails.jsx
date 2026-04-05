import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useStore from "../store/useStore";
import SkeletonProductDetails from "../components/SkeletonProductDetails";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- FETCH FUNCTIONS ---
const fetchSingleProduct = async (id) => {
  const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

const fetchRelatedProducts = async (categoryId) => {
  const res = await fetch(
    `https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}&offset=0&limit=10`,
  );
  if (!res.ok) throw new Error("Could not fetch related products");
  return res.json();
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();
  const sanitize = (text) => {
    if (!text) return "";
    // Removes all HTML tags
    return text.replace(/<[^>]*>?/gm, "");
  };

  // Reset scroll position on ID change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 1. Fetch Main Product - Using Number(id) to ensure correct type
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchSingleProduct(id),
    enabled: !!id,
    retry: 1, // Don't spam the API if product doesn't exist
  });

  // 2. Fetch Related Products
  const { data: relatedItems } = useQuery({
    queryKey: ["related", product?.category?.id],
    queryFn: () => fetchRelatedProducts(product?.category?.id),
    enabled: !!product?.category?.id,
  });

  if (isLoading) return <SkeletonProductDetails />;

  // ERROR STATE: Show a clear "Back to Home" button
  if (isError || !product) {
    return (
      <div style={styles.errorContainer}>
        <h2>Oops! Product not found.</h2>
        <p>
          The item you are looking for might have been removed or the ID is
          invalid.
        </p>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          Back to Shopping
        </button>
      </div>
    );
  }

  const cleanImageUrl = (url) => url?.replace(/[\[\]"]/g, "") || "";
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  // Filter out the current product from recommendations
  const filteredRelated = relatedItems?.filter(
    (item) => item.id !== product.id,
  );

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="fade-in" style={styles.page}>
      {/* Replace your Breadcrumb <nav> content with this */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={{ textDecoration: "none", color: "#888" }}>
          Home
        </Link>{" "}
        /
        <span>
          {product.category?.name?.replace(/<[^>]*>?/gm, "") || "Category"}
        </span>{" "}
        /{product.title?.replace(/<[^>]*>?/gm, "")}
      </nav>

      <div style={styles.container}>
        {/* Image Section */}
        <div style={styles.imageSection}>
          <div style={styles.badge}>New Arrival</div>
          <img
            src={cleanImageUrl(product.images?.[0])}
            alt={product.title}
            style={styles.image}
            onError={(e) => (e.target.src = "https://via.placeholder.com/600")}
          />
        </div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <p style={styles.categoryTag}>{product.category?.name}</p>
          {/* Inside your infoSection */}
          <h1 style={styles.title}>
            {product.title?.replace(/<[^>]*>?/gm, "")}
          </h1>

          <div style={styles.priceRow}>
            <h2 style={styles.price}>${product.price}</h2>
            <span style={styles.taxNote}>Free Shipping Included</span>
          </div>

          <p style={styles.description}>{product.description}</p>

          <hr style={styles.divider} />

          <div style={styles.actions}>
            <button
              onClick={() => addToCart(product)}
              style={styles.cartButton}
            >
              Add to Cart {currentQty > 0 && `(${currentQty})`}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                ...styles.wishButton,
                color: isWishlisted ? "#ff4d4d" : "#333",
              }}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          <button onClick={handleBuyNow} style={styles.buyButton}>
            Buy It Now
          </button>

          <div style={styles.trustBox}>
            <p>✅ Secure Checkout</p>
            <p>🛡️ 30-Day Easy Returns</p>
          </div>
        </div>
      </div>

      {/* --- Related Products SLIDER --- */}
      {filteredRelated && filteredRelated.length > 0 && (
        <div style={styles.relatedSection}>
          <h2 style={styles.relatedTitle}>You May Also Like</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            loop={true} // Add this
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            style={styles.swiperContainer}
          >
            {filteredRelated.map((item) => (
              <SwiperSlide key={item.id}>
                {/* Replace the content inside SwiperSlide with this */}
                <div style={styles.miniCard} className="product-hover-card">
                  <Link
                    to={`/product/${item.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={styles.miniImageWrapper}>
                      <img
                        src={cleanImageUrl(item.images?.[0])}
                        style={styles.miniImage}
                        className="zoom-image"
                        alt={item.title}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/300")
                        }
                      />
                    </div>
                    <div style={styles.miniInfo}>
                      <h4 style={styles.miniTitle}>{item.title}</h4>
                      <p style={styles.miniPrice}>${item.price}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(item)}
                    style={styles.miniAddBtn}
                  >
                    <span>+</span> Quick Add
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
  breadcrumb: { marginBottom: "30px", fontSize: "0.9rem", color: "#888" },
  container: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  imageSection: { flex: 1.2, minWidth: "350px", position: "relative" },
  image: {
    width: "100%",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  badge: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "#000",
    color: "#fff",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    zIndex: 1,
  },
  infoSection: { flex: 1, minWidth: "350px" },
  categoryTag: {
    color: "#007bff",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "0.75rem",
    letterSpacing: "1px",
  },
  title: { fontSize: "2.4rem", margin: "10px 0", fontWeight: "800" },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    marginBottom: "20px",
  },
  price: { fontSize: "1.8rem", color: "#333", fontWeight: "700" },
  taxNote: { color: "#999", fontSize: "0.85rem" },
  description: { color: "#666", lineHeight: "1.7", marginBottom: "30px" },
  divider: { border: "none", borderTop: "1px solid #eee", margin: "25px 0" },
  actions: { display: "flex", gap: "15px", marginBottom: "15px" },
  cartButton: {
    flex: 2,
    padding: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  wishButton: {
    flex: 0.5,
    padding: "16px",
    backgroundColor: "#f8f8f8",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  buyButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  trustBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#f9f9fb",
    borderRadius: "12px",
    color: "#777",
    fontSize: "0.85rem",
  },

  // Slider Styles
  relatedSection: {
    marginTop: "100px",
    paddingTop: "50px",
    borderTop: "1px solid #f0f0f0",
    paddingBottom: "80px",
  },
  relatedTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "40px",
    textAlign: "center",
    letterSpacing: "-0.5px",
  },

  // MODERN SWIPER STYLES
  swiperContainer: {
    padding: "20px 10px 60px 10px", // Extra bottom padding for pagination
  },
  miniCard: {
    padding: "20px",
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #f5f5f5",
    textAlign: "left", // Modern stores often align left
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    // On hover logic (add this to your CSS file for the best effect)
  },
  miniImageWrapper: {
    width: "100%",
    height: "220px",
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
  },
  miniImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  miniInfo: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  miniTitle: {
    fontSize: "1rem",
    color: "#1a1a1a",
    fontWeight: "600",
    margin: "0 0 8px 0",
    lineHeight: "1.4",
    height: "2.8em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  miniPrice: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#007bff",
    margin: "0 0 15px 0",
  },
  miniAddBtn: {
    width: "100%",
    padding: "12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s ease",
  },
  loader: { padding: "100px", textAlign: "center" },
};

export default ProductDetails;
