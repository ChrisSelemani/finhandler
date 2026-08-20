import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Common/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import Budget from "./components/Budget/Budget";
import Profile from "./components/Profile/Profile";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return React.createElement("div", null, "Loading...");
  return user ? children : React.createElement(Navigate, { to: "/login" });
};

function App() {
  return React.createElement(Router, { future: { v7_startTransition: true, v7_relativeSplatPath: true } },
    React.createElement(AuthProvider, null,
      React.createElement(ThemeProvider, null,
        React.createElement(LanguageProvider, null,
          React.createElement(Toaster, { position: "top-right" }),
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/login", element: React.createElement(Login) }),
            React.createElement(Route, { path: "/register", element: React.createElement(Register) }),
            React.createElement(Route, { path: "/", element: React.createElement(PrivateRoute, null, React.createElement(TransactionProvider, null, React.createElement(Layout))) },
              React.createElement(Route, { index: true, element: React.createElement(Dashboard) }),
              React.createElement(Route, { path: "transactions", element: React.createElement(Transactions) }),
              React.createElement(Route, { path: "budget", element: React.createElement(Budget) }),
              React.createElement(Route, { path: "profile", element: React.createElement(Profile) })
            )
          )
        )
      )
    )
  );
}

export default App;
