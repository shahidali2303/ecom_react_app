// src/components/SkeletonCard.jsx
const SkeletonCard = () => {
  return (
    <div style={styles.card}>
      {/* Image Placeholder */}
      <div className="skeleton" style={styles.image}></div>

      {/* Title Placeholder */}
      <div className="skeleton" style={styles.title}></div>
      <div className="skeleton" style={{ ...styles.title, width: "60%" }}></div>

      {/* Price Placeholder */}
      <div className="skeleton" style={styles.price}></div>

      {/* Buttons Placeholder */}
      <div style={styles.buttonGroup}>
        <div className="skeleton" style={styles.btn}></div>
        <div className="skeleton" style={styles.btn}></div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #eee",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  image: { width: "100%", height: "200px", marginBottom: "15px" },
  title: {
    height: "15px",
    marginBottom: "10px",
    width: "90%",
    margin: "10px auto",
  },
  price: { height: "20px", width: "40%", margin: "15px auto" },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  btn: { width: "80px", height: "35px", borderRadius: "6px" },
};

export default SkeletonCard;
