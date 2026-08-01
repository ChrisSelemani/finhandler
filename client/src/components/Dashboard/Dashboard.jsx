import { useEffect } from "react";
import { useTransactions } from "../../context/TransactionContext";

const Dashboard = () => {
  const { stats, fetchStats, transactions, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchStats("monthly");
    fetchTransactions();
  }, []);

  const totalIncome = stats?.summary?.find(s => s._id === "income")?.total || 0;
  const totalExpenses = stats?.summary?.find(s => s._id === "expense")?.total || 0;
  const balance = totalIncome - totalExpenses;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Balance</p>
          <h2 style={{ color: balance >= 0 ? "#10b981" : "#ef4444" }}>${balance.toLocaleString()}</h2>
        </div>
        <div style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Income</p>
          <h2 style={{ color: "#10b981" }}>${totalIncome.toLocaleString()}</h2>
        </div>
        <div style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Expenses</p>
          <h2 style={{ color: "#ef4444" }}>${totalExpenses.toLocaleString()}</h2>
        </div>
      </div>
      <h3>Recent Transactions</h3>
      {transactions?.length > 0 ? (
        <table style={{ width: "100%", background: "white", borderRadius: "12px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Description</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map(tx => (
              <tr key={tx._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: "12px" }}>{tx.description}</td>
                <td style={{ padding: "12px", color: tx.type === "income" ? "#10b981" : "#ef4444" }}>
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p style={{ color: "#64748b" }}>No transactions yet.</p>}
    </div>
  );
};

export default Dashboard;
