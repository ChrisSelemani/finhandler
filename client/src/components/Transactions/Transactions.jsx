import { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";

const CATEGORIES = {
  income: ["salary", "freelance", "investment", "business", "gifts", "other"],
  expense: ["food", "transport", "utilities", "entertainment", "healthcare", "education", "shopping", "rent", "insurance", "gifts", "other"]
};

const Transactions = () => {
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction, fetchTransactions } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "other",
    description: "",
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Transactions</h2>
        <button onClick={() => { setEditingId(null); setShowModal(true); }} style={{ padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
          + Add Transaction
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
          <p style={{ color: "#64748b", fontSize: "13px" }}>Filtered Income</p>
          <h3 style={{ color: "#10b981" }}>${totalIncome.toLocaleString()}</h3>
        </div>
        <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
          <p style={{ color: "#64748b", fontSize: "13px" }}>Filtered Expenses</p>
          <h3 style={{ color: "#ef4444" }}>${totalExpenses.toLocaleString()}</h3>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px" }}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" placeholder="Search description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px", flex: 1, minWidth: "200px" }} />
      </div>

      {loading ? <p>Loading...</p> : filtered && filtered.length > 0 ? (
        <table style={{ width: "100%", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Type</th>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Description</th>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Amount</th>
              <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontSize: "13px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx._id} style={{ borderBottom: "1px solid #e2e8f0", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                <td style={{ padding: "12px 16px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", background: tx.type === "income" ? "#d1fae5" : "#fee2e2", color: tx.type === "income" ? "#059669" : "#dc2626" }}>{tx.type}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>{tx.category}</td>
                <td style={{ padding: "12px 16px" }}>{tx.description}</td>
                <td style={{ padding: "12px 16px", color: tx.type === "income" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button onClick={() => handleEdit(tx)} style={{ background: "#3b82f6", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", marginRight: "6px", fontSize: "12px" }}>Edit</button>
                  <button onClick={() => deleteTransaction(tx._id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p style={{ color: "#64748b", padding: "20px", background: "white", borderRadius: "8px" }}>No transactions found.</p>}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "white", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto" }}>
            <h3 style={{ marginBottom: "20px" }}>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <label style={labelStyle}>Amount</label>
              <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required style={inputStyle} />
              <label style={labelStyle}>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                {CATEGORIES[formData.type].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <label style={labelStyle}>Description</label>
              <input type="text" placeholder="What was this for?" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required style={inputStyle} />
              <label style={labelStyle}>Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required style={inputStyle} />
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" style={{ padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", flex: 1 }}>{editingId ? "Update" : "Add"}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
