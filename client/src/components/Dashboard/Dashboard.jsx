import React, { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { useLanguage } from "../../context/LanguageContext";

const Dashboard = () => {
  const { stats, fetchStats, transactions, fetchTransactions } = useTransactions();
  const { t, language } = useLanguage();
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
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", fontSize: "14px",
    boxShadow: period === p ? "0 8px 16px rgba(99, 102, 241, 0.4)" : "0 1px 3px rgba(0,0,0,0.1)"
  });

  const periodLabels = { daily: t("daily"), weekly: t("weekly"), monthly: t("monthly"), annually: t("annual") };
  const historyTitle = { daily: t("todaysHistory"), weekly: t("weeksHistory"), monthly: t("monthsHistory"), annually: t("yearsHistory") };

  return React.createElement("div", { className: "animate-fade-in" },
    React.createElement("div", { className: "period-buttons", style: { display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" } },
      Object.keys(periodLabels).map(p =>
        React.createElement("button", { key: p, className: "period-btn", style: periodBtn(p), onClick: () => setPeriod(p) }, periodLabels[p])
      )
    ),
    React.createElement("div", { className: "stats-grid", style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" } },
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "24px", borderRadius: "12px", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "💳"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("balance")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + balance.toLocaleString())
      ),
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "24px", borderRadius: "12px", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "📈"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("income")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + totalIncome.toLocaleString())
      ),
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", padding: "24px", borderRadius: "12px", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "📉"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("expenses")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + totalExpenses.toLocaleString())
      )
    ),
    React.createElement("h3", { style: { marginBottom: "16px", fontWeight: "600" } }, historyTitle[period]),
    React.createElement("div", { className: "table-wrapper" },
      history.length > 0 ?
        React.createElement("table", { style: { width: "100%", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
          React.createElement("thead", null,
            React.createElement("tr", { style: { background: "#f8fafc" } },
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("date")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("description")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("category")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: "#64748b", fontSize: "13px" } }, t("amount"))
            )
          ),
          React.createElement("tbody", null,
            history.map(tx =>
              React.createElement("tr", { key: tx._id, className: "table-row", style: { borderBottom: "1px solid #e2e8f0" } },
                React.createElement("td", { style: { padding: "14px 16px" } }, new Date(tx.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")),
                React.createElement("td", { style: { padding: "14px 16px", fontWeight: "500" } }, tx.description),
                React.createElement("td", { style: { padding: "14px 16px" } }, tx.category),
                React.createElement("td", { style: { padding: "14px 16px", color: tx.type === "income" ? "#10b981" : "#ef4444", fontWeight: "bold" } },
                  (tx.type === "income" ? "↑ +" : "↓ -") + "$" + tx.amount.toLocaleString()
                )
              )
            )
          )
        )
      : React.createElement("p", { style: { color: "#64748b", padding: "20px", background: "white", borderRadius: "12px", textAlign: "center" } }, t("noTransactions") + " 🚀")
    )
  );
};

export default Dashboard;
