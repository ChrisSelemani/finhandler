import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div className="animate-scale-in" style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px", animation: "float 3s ease-in-out infinite" }}>💰</div>
          <h1 className="gradient-text" style={{ fontSize: "32px", fontWeight: "bold" }}>FinHandler</h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "16px" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#64748b" }}>
          Don't have an account? <Link to="/register" style={{ color: "#667eea", fontWeight: "600" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
