import { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";

const Transactions = () => {
  const { transactions, loading, addTransaction, deleteTransaction, fetchTransactions } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addTransaction({ type, amount: parseFloat(amount), description, date, category: "other" });
    if (success) {
      setShowModal(false);
      setAmount("");
      setDescription("");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Transactions</h2>
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>+ Add</button>
      </div>
      {loading ? <p>Loading...</p> : transactions?.length > 0 ? (
        <table style={{ width: "100%", background: "white", borderRadius: "12px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Description</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: "12px", color: tx.type === "income" ? "#10b981" : "#ef4444" }}>{tx.type}</td>
                <td style={{ padding: "12px" }}>{tx.description}</td>
                <td style={{ padding: "12px", color: tx.type === "income" ? "#10b981" : "#ef4444" }}>
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => deleteTransaction(tx._id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No transactions found.</p>}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "white", padding: "30px", borderRadius: "12px", width: "400px" }}>
            <h3>Add Transaction</h3>
            <form onSubmit={handleSubmit}>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px" }}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />
              <button type="submit" style={{ padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", marginRight: "8px" }}>Add</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: "6px" }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
