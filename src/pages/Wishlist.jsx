import useStore from "../store/useStore";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <h2>Your wishlist is empty</h2>
        <Link to="/" style={styles.link}>
          Go discover products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>My Wishlist ({wishlist.length})</h1>

      <ProductCard products={wishlist} addToCart={addToCart} />
      {/* fix  */}
    </div>
  );
};

const styles = {
  link: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
  },
};

export default Wishlist;
