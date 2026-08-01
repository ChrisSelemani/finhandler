import { createContext, useState, useContext, useCallback } from "react";
import { transactionAPI } from "../services/api";
import toast from "react-hot-toast";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    type: "", category: "", search: "", startDate: "", endDate: "",
    sort: "-date", page: 1, limit: 10
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll(filters);
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = async (period = "monthly") => {
    try {
      const response = await transactionAPI.getStats({ period });
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTransaction = async (data) => {
    try {
      await transactionAPI.create(data);
      toast.success("Transaction added!");
      fetchTransactions();
      fetchStats();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
      return false;
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      await transactionAPI.update(id, data);
      toast.success("Updated!");
      fetchTransactions();
      return true;
    } catch (error) {
      toast.error("Failed to update");
      return false;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      toast.success("Deleted!");
      fetchTransactions();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, stats, loading, pagination, filters, setFilters,
      addTransaction, updateTransaction, deleteTransaction, fetchTransactions, fetchStats
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
