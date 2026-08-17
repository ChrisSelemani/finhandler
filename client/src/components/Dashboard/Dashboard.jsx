import { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";

const Dashboard = () => {
  const { stats, fetchStats, transactions, fetchTransactions } = useTransactions();
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    fetchStats(period);
    fetchTransactions();
  }, [period]);

  const totalIncome = stats?.summary?.find(s => s._id === "income")?.total || 0;
  const totalExpenses = stats?.summary?.find(s => s._id === "expense")?.total || 0;
  const balance = totalIncome - totalExpenses;
  const history = stats?.history || [];

  const periodBtn = (p) => ({
    padding: "10px 20px",
    background: period === p ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
    color: period === p ? "white" : "#64748b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: period === p ? "0 8px 16px rgba(99, 102, 241, 0.4)" : "0 1px 3px rgba(0,0,0,0.1)"
  });

  return (
    <div className="animate-fade-in">
      <div className="period-buttons" style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["daily", "weekly", "monthly", "annually"].map(p => (
          <button key={p} className="period-btn" style={periodBtn(p)} onClick={() => setPeriod(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💳</div>
          <p style={{ opacity: 0.9, fontSize: "14px", marginBottom: "8px" }}>Balance</p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>${balance.toLocaleString()}</h2>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📈</div>
          <p style={{ opacity: 0.9, fontSize: "14px", marginBottom: "8px" }}>Income</p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>${totalIncome.toLocaleString()}</h2>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📉</div>
          <p style={{ opacity: 0.9, fontSize: "14px", marginBottom: "8px" }}>Expenses</p>
          <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>${totalExpenses.toLocaleString()}</h2>
        </div>
      </div>

      <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>
        {period === "daily" ? "📅 Today's" : period === "weekly" ? "📊 Last 7 Days" : period === "monthly" ? "📆 This Month's" : "🗓️ This Year's"} History
      </h3>

      <div className="table-wrapper">
        {history.length > 0 ? (
          <table style={{ width: "100%", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Date</th>
                <th style={{ padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Description</th>
                <th style={{ padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Category</th>
                <th style={{ padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map(tx => (
                <tr key={tx._id} className="table-row" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "14px 16px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px", fontWeight: "500" }}>{tx.description}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", background: "#f1f5f9", color: "#64748b" }}>{tx.category}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: tx.type === "income" ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
                    {tx.type === "income" ? "↑ +" : "↓ -"}${tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="animate-fade-in" style={{ color: "#64748b", padding: "20px", background: "white", borderRadius: "12px", textAlign: "center" }}>
            No transactions for this period. 🚀
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
