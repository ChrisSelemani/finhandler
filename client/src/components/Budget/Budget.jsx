import React, { useEffect, useState } from "react";
import { budgetAPI } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

const CATEGORIES = ["food", "transport", "utilities", "entertainment", "healthcare", "education", "shopping", "rent", "insurance", "gifts", "other"];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: "food", limit: "" });
  const { t, language } = useLanguage();

  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetAPI.getStatus();
      setBudgets(response.data);
    } catch (error) {
      toast.error(t("noBudgets"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await budgetAPI.create({ ...formData, limit: parseFloat(formData.limit) });
      toast.success(t("addBudget") + "!");
      setShowModal(false);
      setFormData({ category: "food", limit: "" });
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || t("noBudgets"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetAPI.delete(id);
      toast.success(t("delete") + "!");
      fetchBudgets();
    } catch (error) {
      toast.error(t("delete"));
    }
  };

  const getStatusColor = (status) => {
    if (status === "exceeded") return "#ef4444";
    if (status === "warning") return "#f59e0b";
    return "#10b981";
  };

  return React.createElement("div", { className: "animate-fade-in" },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" } },
      React.createElement("h2", null, "💰 " + t("budgetAlerts")),
      React.createElement("button", { onClick: () => setShowModal(true), className: "btn-primary", style: { padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" } },
        "+ " + t("addBudget")
      )
    ),
    loading ? React.createElement("p", null, "Loading...") :
    budgets.length > 0 ?
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" } },
        budgets.map(budget =>
          React.createElement("div", { key: budget._id, className: "stat-card", style: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" } },
              React.createElement("h3", { style: { textTransform: "capitalize" } }, budget.category),
              React.createElement("button", { onClick: () => handleDelete(budget._id), style: { background: "none", border: "none", cursor: "pointer", fontSize: "18px" } }, "🗑️")
            ),
            React.createElement("p", { style: { color: "#64748b", fontSize: "14px", marginBottom: "8px" } },
              "$" + budget.spent.toLocaleString() + " " + t("of") + " $" + budget.limit.toLocaleString()
            ),
            React.createElement("div", { style: { width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" } },
              React.createElement("div", { style: { width: Math.min(budget.percentage, 100) + "%", height: "100%", background: getStatusColor(budget.status), transition: "width 0.5s ease" } })
            ),
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } },
              React.createElement("span", { style: { color: getStatusColor(budget.status), fontWeight: "600", fontSize: "14px" } },
                budget.status === "exceeded" ? "❌ " + t("exceeded") : budget.status === "warning" ? "⚠️ " + t("warning") : "✅ " + t("onTrack")
              ),
              React.createElement("span", { style: { color: "#64748b", fontSize: "13px" } },
                "$" + (budget.remaining > 0 ? budget.remaining.toLocaleString() : "0") + " " + t("remaining")
              )
            )
          )
        )
      )
    : React.createElement("p", { style: { color: "#64748b", padding: "20px", background: "white", borderRadius: "12px", textAlign: "center" } },
        t("noBudgets") + " 📊"
      ),
    showModal && React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }, onClick: (e) => e.target === e.currentTarget && setShowModal(false) },
      React.createElement("div", { className: "modal-content", style: { background: "white", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "400px" } },
        React.createElement("h3", { style: { marginBottom: "20px" } }, t("addBudget")),
        React.createElement("form", { onSubmit: handleSubmit },
          React.createElement("label", { style: { display: "block", marginBottom: "6px", fontWeight: "600" } }, t("category")),
          React.createElement("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), style: { width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "16px" } },
            CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c.charAt(0).toUpperCase() + c.slice(1)))
          ),
          React.createElement("label", { style: { display: "block", marginBottom: "6px", fontWeight: "600" } }, t("monthlyLimit")),
          React.createElement("input", { type: "number", placeholder: "0.00", value: formData.limit, onChange: (e) => setFormData({ ...formData, limit: e.target.value }), required: true, style: { width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "16px" } }),
          React.createElement("div", { style: { display: "flex", gap: "8px" } },
            React.createElement("button", { type: "submit", className: "btn-primary", style: { padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", flex: 1 } }, t("add")),
            React.createElement("button", { type: "button", onClick: () => setShowModal(false), style: { padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer" } }, t("cancel"))
          )
        )
      )
    )
  );
};

export default Budget;
