// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulation: In a real app, you'd fetch() to an API here
    if (email === "test@gmail.com" && password === "12345") {
      login({ email, name: "John Doe", role: "Customer" });
      navigate("/");
    } else {
      alert("Invalid credentials! (Try test@gmail.com / 12345)");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.btn}>
          Sign In
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "100px" },
  card: {
    padding: "40px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: { padding: "12px", borderRadius: "5px", border: "1px solid #ccc" },
  btn: {
    padding: "12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;
