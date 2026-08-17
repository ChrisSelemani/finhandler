import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    dashboard: "Dashboard", transactions: "Transactions", budgetAlerts: "Budget Alerts",
    profile: "Profile", logout: "Logout", balance: "Balance", income: "Income",
    expenses: "Expenses", daily: "Daily", weekly: "Weekly", monthly: "Monthly",
    annual: "Annual", date: "Date", description: "Description", category: "Category",
    amount: "Amount", noTransactions: "No transactions for this period.",
    addTransaction: "Add Transaction", delete: "Delete", add: "Add", cancel: "Cancel",
    addBudget: "Add Budget", monthlyLimit: "Monthly Limit",
    noBudgets: "No budgets set.", onTrack: "On Track", warning: "Warning", exceeded: "Exceeded",
    remaining: "remaining", todaysHistory: "Today's History", weeksHistory: "Last 7 Days History",
    monthsHistory: "This Month's History", yearsHistory: "This Year's History",
    selectLanguage: "Select Language"
  },
  fr: {
    dashboard: "Tableau de bord", transactions: "Transactions", budgetAlerts: "Alertes budget",
    profile: "Profil", logout: "Déconnexion", balance: "Solde", income: "Revenus",
    expenses: "Dépenses", daily: "Quotidien", weekly: "Hebdomadaire", monthly: "Mensuel",
    annual: "Annuel", date: "Date", description: "Description", category: "Catégorie",
    amount: "Montant", noTransactions: "Aucune transaction pour cette période.",
    addTransaction: "Ajouter une transaction", delete: "Supprimer", add: "Ajouter", cancel: "Annuler",
    addBudget: "Ajouter un budget", monthlyLimit: "Limite mensuelle",
    noBudgets: "Aucun budget défini.", onTrack: "Sur la bonne voie", warning: "Attention", exceeded: "Dépassé",
    remaining: "restant", todaysHistory: "Historique du jour", weeksHistory: "Historique des 7 jours",
    monthsHistory: "Historique du mois", yearsHistory: "Historique de l'année",
    selectLanguage: "Choisir la langue"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const setAppLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => translations[language][key] || key;

  return React.createElement(LanguageContext.Provider, { value: { language, setAppLanguage, t } }, children);
};
