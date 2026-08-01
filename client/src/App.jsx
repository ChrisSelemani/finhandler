import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import Layout from "./components/Common/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import Profile from "./components/Profile/Profile";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <TransactionProvider>
                <Layout />
              </TransactionProvider>
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
