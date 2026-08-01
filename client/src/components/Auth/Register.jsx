import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h1 style={{ textAlign: "center", color: "#1e293b", marginBottom: "8px" }}>FinHandler</h1>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "32px" }}>Create your account</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
            style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "16px", marginBottom: "16px" }} />
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b" }}>
          Already have an account? <Link to="/login" style={{ color: "#667eea", fontWeight: "600" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
