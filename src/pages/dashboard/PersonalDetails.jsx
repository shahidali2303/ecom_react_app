import { useProfile } from "../../hooks/useProfile"; // Using the hook we made
import useStore from "../../store/useStore";

const PersonalDetails = () => {
  const { user } = useStore();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <p>Loading your details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Account Settings</h2>
      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputBox}>{profile?.full_name || "Not set"}</div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputBox}>{user?.email}</div>
        </div>
        <button style={styles.btn}>Edit Profile</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  title: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "25px" },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "500px",
  },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.85rem", fontWeight: "700", color: "#555" },
  inputBox: {
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "10px",
    border: "1px solid #eee",
    fontSize: "1rem",
  },
  btn: {
    padding: "15px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    width: "fit-content",
    marginTop: "10px",
  },
};

export default PersonalDetails;
