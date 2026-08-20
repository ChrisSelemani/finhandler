import React, { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4"];

const PieChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const cx = 150, cy = 100, r = 80;
    return { color: COLORS[i % COLORS.length], cx, cy, r, largeArc, x1: cx + r * Math.cos(startRad), y1: cy + r * Math.sin(startRad), x2: cx + r * Math.cos(endRad), y2: cy + r * Math.sin(endRad) };
  });
  return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "center" } },
    React.createElement("svg", { width: "300", height: "200", viewBox: "0 0 300 200", style: { animation: "scaleIn 0.6s ease-out" } },
      slices.map((s, i) => React.createElement("path", { key: i, d: "M " + s.cx + " " + s.cy + " L " + s.x1 + " " + s.y1 + " A " + s.r + " " + s.r + " 0 " + s.largeArc + " 1 " + s.x2 + " " + s.y2 + " Z", fill: s.color, opacity: 0.85, stroke: "white", strokeWidth: "2", style: { transition: "opacity 0.3s ease", cursor: "pointer" } }))
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px", animation: "fadeIn 0.8s ease-out" } },
      data.map((d, i) => React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", transition: "transform 0.2s ease", cursor: "pointer" }, onMouseEnter: (e) => e.currentTarget.style.transform = "translateX(5px)", onMouseLeave: (e) => e.currentTarget.style.transform = "translateX(0)" },
        React.createElement("span", { style: { width: "12px", height: "12px", borderRadius: "3px", background: COLORS[i % COLORS.length], display: "inline-block" } }),
        React.createElement("span", { style: { textTransform: "capitalize" } }, d.name),
        React.createElement("span", { style: { fontWeight: "600", marginLeft: "auto" } }, "$" + d.value.toLocaleString())
      ))
    )
  );
};

const BarChartCustom = ({ data }) => {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expenses)), 1);
  return React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", justifyContent: "center", paddingTop: "20px", animation: "fadeIn 0.8s ease-out" } },
    data.slice(-10).map((d, i) => React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", transition: "transform 0.2s ease", cursor: "pointer" }, onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-5px)", onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)" },
      React.createElement("div", { style: { display: "flex", gap: "3px", alignItems: "flex-end", height: "150px" } },
        React.createElement("div", { title: "Income: $" + d.income, style: { width: "18px", height: (d.income / max) * 150, background: "#10b981", borderRadius: "3px 3px 0 0", transition: "height 0.5s ease" } }),
        React.createElement("div", { title: "Expenses: $" + d.expenses, style: { width: "18px", height: (d.expenses / max) * 150, background: "#ef4444", borderRadius: "3px 3px 0 0", transition: "height 0.5s ease" } })
      ),
      React.createElement("span", { style: { fontSize: "10px", color: "#64748b" } }, d._id ? d._id.slice(5) : "")
    ))
  );
};

const Dashboard = () => {
  const { stats, fetchStats, fetchTransactions } = useTransactions();
  const { t, language } = useLanguage();
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState("monthly");

  useEffect(() => { fetchStats(period); fetchTransactions(); }, [period]);

  const totalIncome = stats?.summary?.find(s => s._id === "income")?.total || 0;
  const totalExpenses = stats?.summary?.find(s => s._id === "expense")?.total || 0;
  const balance = totalIncome - totalExpenses;
  const history = stats?.history || [];
  const pieData = (stats?.categoryBreakdown || []).map(c => ({ name: c._id, value: c.total }));
  const dailyTotals = stats?.dailyTotals || [];

  const periodBtn = (p) => ({
    padding: "10px 20px", background: period === p ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : darkMode ? "#1e293b" : "white",
    color: period === p ? "white" : darkMode ? "#cbd5e1" : "#64748b", border: "none", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", boxShadow: period === p ? "0 8px 16px rgba(99, 102, 241, 0.4)" : "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease"
  });

  const periodLabels = { daily: t("daily"), weekly: t("weekly"), monthly: t("monthly"), annually: t("annual") };
  const historyTitle = { daily: t("todaysHistory"), weekly: t("weeksHistory"), monthly: t("monthsHistory"), annually: t("yearsHistory") };
  const cardStyle = { background: darkMode ? "#1e293b" : "white", color: darkMode ? "#e2e8f0" : "#1e293b" };

  return React.createElement("div", { className: "animate-fade-in" },
    React.createElement("div", { className: "period-buttons", style: { display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" } },
      Object.keys(periodLabels).map(p => React.createElement("button", { key: p, className: "period-btn", style: periodBtn(p), onClick: () => setPeriod(p) }, periodLabels[p]))
    ),
    React.createElement("div", { className: "stats-grid", style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" } },
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "💳"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("balance")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + balance.toLocaleString())
      ),
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "📈"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("income")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + totalIncome.toLocaleString())
      ),
      React.createElement("div", { className: "stat-card", style: { background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", color: "white" } },
        React.createElement("div", { style: { fontSize: "32px", marginBottom: "12px" } }, "📉"),
        React.createElement("p", { style: { opacity: 0.9, fontSize: "14px", marginBottom: "8px" } }, t("expenses")),
        React.createElement("h2", { style: { fontSize: "28px", fontWeight: "bold" } }, "$" + totalExpenses.toLocaleString())
      )
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px", marginBottom: "30px" } },
      React.createElement("div", { className: "stat-card", style: { ...cardStyle, padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
        React.createElement("h3", { style: { marginBottom: "16px", textAlign: "center", fontWeight: "600" } }, "📊 " + t("expenses") + " " + (t("by") || "by") + " " + t("category")),
        pieData.length > 0 ? React.createElement(PieChart, { data: pieData }) : React.createElement("p", { style: { textAlign: "center", color: "#64748b" } }, t("noTransactions"))
      ),
      React.createElement("div", { className: "stat-card", style: { ...cardStyle, padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
        React.createElement("h3", { style: { marginBottom: "16px", textAlign: "center", fontWeight: "600" } }, "📈 " + t("income") + " vs " + t("expenses")),
        dailyTotals.length > 0 ? React.createElement(BarChartCustom, { data: dailyTotals }) : React.createElement("p", { style: { textAlign: "center", color: "#64748b" } }, t("noTransactions"))
      )
    ),
    React.createElement("h3", { style: { marginBottom: "16px", fontWeight: "600" } }, historyTitle[period]),
    React.createElement("div", { className: "table-wrapper" },
      history.length > 0 ?
        React.createElement("table", { style: { width: "100%", background: darkMode ? "#1e293b" : "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
          React.createElement("thead", null,
            React.createElement("tr", { style: { background: darkMode ? "#0f172a" : "#f8fafc" } },
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: darkMode ? "#94a3b8" : "#64748b", fontSize: "13px" } }, t("date")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: darkMode ? "#94a3b8" : "#64748b", fontSize: "13px" } }, t("description")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: darkMode ? "#94a3b8" : "#64748b", fontSize: "13px" } }, t("category")),
              React.createElement("th", { style: { padding: "14px 16px", textAlign: "left", color: darkMode ? "#94a3b8" : "#64748b", fontSize: "13px" } }, t("amount"))
            )
          ),
          React.createElement("tbody", null,
            history.map(tx => React.createElement("tr", { key: tx._id, className: "table-row", style: { borderBottom: "1px solid " + (darkMode ? "#334155" : "#e2e8f0") } },
              React.createElement("td", { style: { padding: "14px 16px", color: darkMode ? "#e2e8f0" : "#1e293b" } }, new Date(tx.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")),
              React.createElement("td", { style: { padding: "14px 16px", fontWeight: "500", color: darkMode ? "#e2e8f0" : "#1e293b" } }, tx.description),
              React.createElement("td", { style: { padding: "14px 16px", color: darkMode ? "#e2e8f0" : "#1e293b" } }, tx.category),
              React.createElement("td", { style: { padding: "14px 16px", color: tx.type === "income" ? "#10b981" : "#ef4444", fontWeight: "bold" } }, (tx.type === "income" ? "↑ +" : "↓ -") + "$" + tx.amount.toLocaleString())
            ))
          )
        )
      : React.createElement("p", { className: "animate-fade-in", style: { color: darkMode ? "#94a3b8" : "#64748b", padding: "20px", background: darkMode ? "#1e293b" : "white", borderRadius: "12px", textAlign: "center" } }, t("noTransactions") + " 🚀")
    )
  );
};

export default Dashboard;
