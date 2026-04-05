// src/components/SkeletonProductDetails.jsx

const SkeletonProductDetails = () => {
  return (
    <div style={styles.page}>
      {/* Breadcrumb Skeleton */}
      <div
        className="skeleton"
        style={{ width: "30%", height: "20px", marginBottom: "30px" }}
      ></div>

      <div style={styles.container}>
        {/* Image Section Skeleton */}
        <div style={styles.imageSection}>
          <div
            className="skeleton"
            style={{ ...styles.image, height: "500px" }}
          ></div>
        </div>

        {/* Info Section Skeleton */}
        <div style={styles.infoSection}>
          <div
            className="skeleton"
            style={{ width: "20%", height: "15px", marginBottom: "15px" }}
          ></div>
          <div
            className="skeleton"
            style={{ width: "80%", height: "40px", marginBottom: "20px" }}
          ></div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <div
              className="skeleton"
              style={{ width: "30%", height: "35px" }}
            ></div>
          </div>

          <div
            className="skeleton"
            style={{ width: "100%", height: "100px", marginBottom: "30px" }}
          ></div>

          <hr style={styles.divider} />

          <div style={styles.actions}>
            <div
              className="skeleton"
              style={{ ...styles.cartButton, border: "none" }}
            ></div>
            <div
              className="skeleton"
              style={{ ...styles.wishButton, border: "none" }}
            ></div>
          </div>

          <div
            className="skeleton"
            style={{ ...styles.buyButton, height: "55px", border: "none" }}
          ></div>

          <div
            className="skeleton"
            style={{ ...styles.trustBox, height: "80px", border: "none" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Use the exact same styles as your ProductDetails page for perfect alignment
const styles = {
  page: { padding: "20px 40px", maxWidth: "1200px", margin: "0 auto" },
  container: { display: "flex", gap: "60px", flexWrap: "wrap" },
  imageSection: { flex: 1.2, minWidth: "350px" },
  image: { width: "100%", borderRadius: "20px" },
  infoSection: { flex: 1, minWidth: "350px" },
  divider: { border: "none", borderTop: "1px solid #eee", margin: "30px 0" },
  actions: { display: "flex", gap: "15px", marginBottom: "15px" },
  cartButton: { flex: 2, padding: "18px", borderRadius: "12px" },
  wishButton: { flex: 1, padding: "18px", borderRadius: "12px" },
  buyButton: { width: "100%", borderRadius: "12px" },
  trustBox: { marginTop: "30px", borderRadius: "12px" },
};

export default SkeletonProductDetails;
