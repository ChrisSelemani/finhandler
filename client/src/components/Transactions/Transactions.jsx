import React, { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { useLanguage } from "../../context/LanguageContext";

const CATEGORIES = {
  income: ["salary", "freelance", "investment", "business", "gifts", "other"],
  expense: ["food", "transport", "utilities", "entertainment", "healthcare", "education", "shopping", "rent", "insurance", "gifts", "other"]
};

const Transactions = () => {
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction, fetchTransactions } = useTransactions();
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    type: "expense", amount: "", category: "other", description: "",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateTransaction(editingId, { ...formData, amount: parseFloat(formData.amount) });
    } else {
      await addTransaction({ ...formData, amount: parseFloat(formData.amount) });
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ type: "expense", amount: "", category: "other", description: "", date: new Date().toISOString().split("T")[0] });
  };

  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setFormData({ type: tx.type, amount: tx.amount, category: tx.category, description: tx.description, date: tx.date.split("T")[0] });
    setShowModal(true);
  };

  const filtered = transactions?.filter(tx => {
    const matchType = filterType ? tx.type === filterType : true;
    const matchSearch = searchTerm ? tx.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchType && matchSearch;
  });

  const totalIncome = filtered?.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpenses = filtered?.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0;

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px", marginBottom: "12px" };
  const labelStyle = { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#374151" };

  return React.createElement("div", null,
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" } },
      React.createElement("h2", null, t("transactions")),
      React.createElement("button", { onClick: () => { setEditingId(null); setShowModal(true); }, style: { padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" } },
        "+ " + t("addTransaction")
      )
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" } },
      React.createElement("div", { style: { background: "white", padding: "16px", borderRadius: "8px" } },
        React.createElement("p", { style: { color: "#64748b", fontSize: "13px" } }, t("filteredIncome")),
        React.createElement("h3", { style: { color: "#10b981" } }, "$" + totalIncome.toLocaleString())
      ),
      React.createElement("div", { style: { background: "white", padding: "16px", borderRadius: "8px" } },
        React.createElement("p", { style: { color: "#64748b", fontSize: "13px" } }, t("filteredExpenses")),
        React.createElement("h3", { style: { color: "#ef4444" } }, "$" + totalExpenses.toLocaleString())
      )
    ),
    React.createElement("div", { style: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" } },
      React.createElement("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), style: { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px" } },
        React.createElement("option", { value: "" }, t("allTypes")),
        React.createElement("option", { value: "income" }, t("income")),
        React.createElement("option", { value: "expense" }, t("expenses"))
      ),
      React.createElement("input", { type: "text", placeholder: t("search"), value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px", flex: 1, minWidth: "200px" } })
    ),
    loading ? React.createElement("p", null, "Loading...") :
    filtered && filtered.length > 0 ?
      React.createElement("table", { style: { width: "100%", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
        React.createElement("thead", null,
          React.createElement("tr", { style: { background: "#f8fafc" } },
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("date")),
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("type")),
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("category")),
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("description")),
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("amount")),
            React.createElement("th", { style: { padding: "12px 16px", textAlign: "right", color: "#64748b", fontSize: "13px" } }, "Actions")
          )
        ),
        React.createElement("tbody", null,
          filtered.map(tx =>
            React.createElement("tr", { key: tx._id, style: { borderBottom: "1px solid #e2e8f0" } },
              React.createElement("td", { style: { padding: "12px 16px" } }, new Date(tx.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")),
              React.createElement("td", { style: { padding: "12px 16px" } },
                React.createElement("span", { style: { padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", background: tx.type === "income" ? "#d1fae5" : "#fee2e2", color: tx.type === "income" ? "#059669" : "#dc2626" } },
                  tx.type === "income" ? t("income") : t("expenses")
                )
              ),
              React.createElement("td", { style: { padding: "12px 16px" } }, tx.category),
              React.createElement("td", { style: { padding: "12px 16px" } }, tx.description),
              React.createElement("td", { style: { padding: "12px 16px", color: tx.type === "income" ? "#10b981" : "#ef4444", fontWeight: "600" } },
                (tx.type === "income" ? "+" : "-") + "$" + tx.amount.toLocaleString()
              ),
              React.createElement("td", { style: { padding: "12px 16px", textAlign: "right" } },
                React.createElement("button", { onClick: () => handleEdit(tx), style: { background: "#3b82f6", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", marginRight: "6px", fontSize: "12px" } }, t("edit")),
                React.createElement("button", { onClick: () => deleteTransaction(tx._id), style: { background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" } }, t("delete"))
              )
            )
          )
        )
      )
    : React.createElement("p", { style: { color: "#64748b", padding: "20px", background: "white", borderRadius: "8px" } }, t("noTransactions")),
    showModal && React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }, onClick: (e) => e.target === e.currentTarget && setShowModal(false) },
      React.createElement("div", { style: { background: "white", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "500px" } },
        React.createElement("h3", { style: { marginBottom: "20px" } }, editingId ? t("editTransaction") : t("addTransaction")),
        React.createElement("form", { onSubmit: handleSubmit },
          React.createElement("label", { style: labelStyle }, t("type")),
          React.createElement("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), style: inputStyle },
            React.createElement("option", { value: "expense" }, t("expenses")),
            React.createElement("option", { value: "income" }, t("income"))
          ),
          React.createElement("label", { style: labelStyle }, t("amount")),
          React.createElement("input", { type: "number", placeholder: "0.00", value: formData.amount, onChange: (e) => setFormData({ ...formData, amount: e.target.value }), required: true, style: inputStyle }),
          React.createElement("label", { style: labelStyle }, t("category")),
          React.createElement("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), style: inputStyle },
            CATEGORIES[formData.type].map(c => React.createElement("option", { key: c, value: c }, c.charAt(0).toUpperCase() + c.slice(1)))
          ),
          React.createElement("label", { style: labelStyle }, t("description")),
          React.createElement("input", { type: "text", placeholder: t("search"), value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), required: true, style: inputStyle }),
          React.createElement("label", { style: labelStyle }, t("date")),
          React.createElement("input", { type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), required: true, style: inputStyle }),
          React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "8px" } },
            React.createElement("button", { type: "submit", style: { padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", flex: 1 } }, editingId ? t("save") : t("add")),
            React.createElement("button", { type: "button", onClick: () => setShowModal(false), style: { padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer" } }, t("cancel"))
          )
        )
      )
    )
  );
};

export default Transactions;
