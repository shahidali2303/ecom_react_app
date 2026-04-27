import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // --- TANSTACK MUTATION ---
  const mutation = useMutation({
    mutationFn: async ({ email, password, fullName }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName,
          },
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Account created! You can now sign in.", {
        duration: 5000,
        icon: "🎉",
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join the LuxeStore community today</p>
        </div>

        {mutation.isError && (
          <div style={styles.errorBanner}>{mutation.error.message}</div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Shahid Ali"
            onChange={handleChange}
            style={styles.input}
            required
            disabled={mutation.isPending}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="shahid@example.com"
            onChange={handleChange}
            style={styles.input}
            required
            disabled={mutation.isPending}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            style={styles.input}
            required
            disabled={mutation.isPending}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.btn,
            opacity: mutation.isPending ? 0.7 : 1,
            cursor: mutation.isPending ? "not-allowed" : "pointer",
          }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating Account..." : "Create Account"}
        </button>

        <p style={styles.footerText}>
          Already part of LuxeStore?{" "}
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    background: "#fff",
  },
  card: {
    padding: "40px",
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  },
  header: { textAlign: "center", marginBottom: "10px" },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#1a1a1a", margin: 0 },
  subtitle: { fontSize: "0.9rem", color: "#666", marginTop: "5px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#444" },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
  },
  errorBanner: {
    padding: "12px",
    background: "#fff5f5",
    color: "#e53e3e",
    borderRadius: "10px",
    fontSize: "0.85rem",
    textAlign: "center",
    border: "1px solid #fed7d7",
  },
  btn: {
    padding: "16px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1rem",
    marginTop: "15px",
  },
  footerText: { textAlign: "center", fontSize: "0.9rem", color: "#666" },
  link: { color: "#000", fontWeight: "700", textDecoration: "none" },
};

export default Register;
