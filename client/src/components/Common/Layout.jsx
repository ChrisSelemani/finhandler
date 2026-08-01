import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navStyle = (path) => ({
    padding: "12px 16px", color: location.pathname === path ? "#818cf8" : "#cbd5e1",
    background: location.pathname === path ? "#334155" : "transparent",
    textDecoration: "none", borderRadius: "8px", marginBottom: "8px", display: "block"
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", background: "#1e293b", color: "white", padding: "20px" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "40px", color: "#818cf8" }}>FinHandler</div>
        <Link to="/" style={navStyle("/")}>Dashboard</Link>
        <Link to="/transactions" style={navStyle("/transactions")}>Transactions</Link>
        <Link to="/profile" style={navStyle("/profile")}>Profile</Link>
        <button onClick={handleLogout} style={{ ...navStyle(""), color: "#ef4444", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", marginTop: "auto" }}>Logout</button>
      </div>
      <div style={{ flex: 1, padding: "30px", background: "#f1f5f9" }}>
        <div style={{ marginBottom: "30px" }}>
          <h2>Welcome, {user?.name || "User"}</h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
