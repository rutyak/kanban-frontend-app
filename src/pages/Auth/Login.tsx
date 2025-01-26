import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { success } = await login({ email, password });

      if (success) {
        alert("Logged in successfully!");
        navigate("/");
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to Kanban Board</h1>
        <p>Sign In to Get Started.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            id="email"
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="password"
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Loging In..." : "Login"}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>

        <p className="disclaimer">
          We never share your information with anyone; we only collect
          information to suggest relevant content.
        </p>
      </div>
    </div>
  );
};

export default Login;
