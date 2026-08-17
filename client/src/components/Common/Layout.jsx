import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const { language, setAppLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate("/login"); };
  const navStyle = (path) => ({
    padding: "12px 16px", color: location.pathname === path ? "#818cf8" : "#cbd5e1",
    background: location.pathname === path ? "#334155" : "transparent",
    textDecoration: "none", borderRadius: "8px", marginBottom: "8px",
    display: "flex", alignItems: "center", gap: "10px", fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400"
  });

  return React.createElement("div", { style: { display: "flex", minHeight: "100vh" } },
    React.createElement("div", { className: "sidebar", style: { width: "250px", background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", color: "white", padding: "20px", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, height: "100vh" } },
      React.createElement("div", { className: "logo-text", style: { fontSize: "24px", fontWeight: "bold", marginBottom: "40px" } },
        React.createElement("span", { className: "gradient-text" }, "💰 FinHandler")
      ),
      React.createElement(Link, { to: "/", className: "sidebar-link", style: navStyle("/") }, t("dashboard")),
      React.createElement(Link, { to: "/transactions", className: "sidebar-link", style: navStyle("/transactions") }, t("transactions")),
      React.createElement(Link, { to: "/budget", className: "sidebar-link", style: navStyle("/budget") }, t("budgetAlerts")),
      React.createElement(Link, { to: "/profile", className: "sidebar-link", style: navStyle("/profile") }, t("profile")),
      React.createElement("div", { style: { marginTop: "20px", marginBottom: "8px" } },
        React.createElement("label", { style: { fontSize: "12px", color: "#64748b", marginBottom: "4px", display: "block" } }, "🌐 " + t("selectLanguage")),
        React.createElement("select", { value: language, onChange: (e) => setAppLanguage(e.target.value), style: { width: "100%", padding: "8px 12px", background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", borderRadius: "6px", fontSize: "14px", cursor: "pointer" } },
          React.createElement("option", { value: "en" }, "🇬🇧 English"),
          React.createElement("option", { value: "fr" }, "🇫🇷 Français")
        )
      ),
      React.createElement("button", { onClick: handleLogout, className: "sidebar-link", style: { ...navStyle(""), color: "#ef4444", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", marginTop: "auto" } }, t("logout"))
    ),
    React.createElement("div", { className: "main-content", style: { flex: 1, padding: "30px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", minHeight: "100vh", marginLeft: "250px" } },
      React.createElement(Outlet)
    )
  );
};

export default Layout;
