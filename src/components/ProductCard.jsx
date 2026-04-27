import { Link } from "react-router-dom";
import useStore from "../store/useStore";

const ProductCard = ({ products }) => {
  const { cart, wishlist, toggleWishlist, addToCart } = useStore();

  const cleanImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    // Cleans up Platzi API's double-quoted or bracketed image strings
    return url.replace(/[\[\]"]/g, "").replace(/["']/g, "");
  };

  const sanitize = (text) =>
    text?.replace(/<[^>]*>?/gm, "") || "Untitled Product";

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {products?.map((product) => {
          const isWishlisted = wishlist.some((item) => item.id === product.id);
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          const rating = product.rating ? product.rating.toFixed(1) : "N/A";

          // NEW: Calculate real original price using discountPercentage
          const originalPrice = (
            product.price /
            (1 - product.discountPercentage / 100)
          ).toFixed(2);

          return (
            <div key={product.id} style={styles.card} className="modern-card">
              {/* IMAGE SECTION */}
              <div style={styles.imageWrapper}>
                <div style={styles.discountBadge}>SALE</div>

                <Link
                  to={`/product/${product.id}`}
                  style={{ display: "block", height: "100%" }}
                >
                  <img
                    src={cleanImageUrl(product.thumbnail)}
                    alt={product.title}
                    style={styles.image}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400";
                    }}
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={styles.wishlistBtn}
                  className="wishlist-hover"
                  aria-label="Toggle Wishlist"
                >
                  <span style={{ fontSize: "1.1rem" }}>
                    {isWishlisted ? "❤️" : "🤍"}
                  </span>
                </button>

                {/* Quick Add Overlay */}

                <div
                  className="quick-actions-overlay"
                  style={styles.overlayContainer}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    style={styles.quickAdd}
                    className="quick-add-btn"
                  >
                    {quantity > 0 ? `In Cart (${quantity})` : "+ Add to Cart"}
                  </button>
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div style={styles.content}>
                <div style={styles.metaRow}>
                  <p style={styles.category}>
                    {product.category || "Uncategorized"}
                  </p>

                  <div style={styles.rating}>⭐ {rating}</div>
                </div>

                <Link to={`/product/${product.id}`} style={styles.link}>
                  <h3 style={styles.title}>{sanitize(product.title)}</h3>
                </Link>

                <div style={styles.priceRow}>
                  <span style={styles.currentPrice}>${product.price}</span>
                  <span style={styles.oldPrice}>${originalPrice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "35px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
    border: "1px solid #f2f2f2",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "1/1",
    overflow: "hidden",
    backgroundColor: "#f9f9fb",
  },
  discountBadge: {
    position: "absolute",
    top: "15px",
    left: "15px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "800",
    zIndex: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.6s ease",
  },
  wishlistBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    zIndex: 10,
  },
  overlayContainer: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    padding: "20px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.08))",
    transform: "translateY(100%)",
    transition: "transform 0.3s ease",
    display: "flex",
    justifyContent: "center",
  },
  quickAdd: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
  content: {
    padding: "20px 18px",
    textAlign: "left",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  category: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "#aaa",
    letterSpacing: "1.2px",
    fontWeight: "700",
    margin: 0,
  },
  rating: {
    fontSize: "0.8rem",
    color: "#444",
    fontWeight: "600",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 12px 0",
    color: "#111",
    lineHeight: "1.4",
    height: "2.8em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  currentPrice: {
    fontWeight: "800",
    color: "#000",
    fontSize: "1.25rem",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#ccc",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  link: { textDecoration: "none", color: "inherit" },
};

export default ProductCard;
