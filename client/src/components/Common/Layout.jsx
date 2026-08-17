import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  const navStyle = (path) => ({
    padding: "12px 16px",
    color: location.pathname === path ? "#818cf8" : "#cbd5e1",
    background: location.pathname === path ? "#334155" : "transparent",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400"
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div className="sidebar" style={{ width: "250px", background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", color: "white", padding: "20px", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, height: "100vh" }}>
        <div className="logo-text" style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "40px", animation: "float 3s ease-in-out infinite" }}>
          <span className="gradient-text">💰 FinHandler</span>
        </div>
        <Link to="/" className="sidebar-link" style={navStyle("/")}>
          <span className="nav-icon" style={{ display: "none", fontSize: "20px" }}>📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>
        <Link to="/transactions" className="sidebar-link" style={navStyle("/transactions")}>
          <span className="nav-icon" style={{ display: "none", fontSize: "20px" }}>💸</span>
          <span className="nav-text">Transactions</span>
        </Link>
        <Link to="/profile" className="sidebar-link" style={navStyle("/profile")}>
          <span className="nav-icon" style={{ display: "none", fontSize: "20px" }}>👤</span>
          <span className="nav-text">Profile</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link" style={{ ...navStyle(""), color: "#ef4444", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", marginTop: "auto" }}>
          <span className="nav-icon" style={{ display: "none", fontSize: "20px" }}>🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
      <div className="main-content" style={{ flex: 1, padding: "30px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", minHeight: "100vh", marginLeft: "250px" }}>
        <div className="welcome-text" style={{ marginBottom: "30px", animation: "slideIn 0.5s ease-out" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
            Welcome, <span className="gradient-text">{user?.name || "User"}</span> 👋
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
