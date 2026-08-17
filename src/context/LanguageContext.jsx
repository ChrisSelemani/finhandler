import { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    dashboard: "Dashboard",
    transactions: "Transactions",
    budgetAlerts: "Budget Alerts",
    profile: "Profile",
    logout: "Logout",
    welcome: "Welcome",
    balance: "Balance",
    income: "Income",
    expenses: "Expenses",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    annual: "Annual",
    history: "History",
    date: "Date",
    description: "Description",
    category: "Category",
    amount: "Amount",
    noTransactions: "No transactions for this period.",
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    delete: "Delete",
    edit: "Edit",
    search: "Search description...",
    allTypes: "All Types",
    type: "Type",
    expense: "Expense",
    add: "Add",
    cancel: "Cancel",
    save: "Save",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Create Account",
    signingIn: "Signing in...",
    creating: "Creating...",
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    language: "Language",
    english: "English",
    french: "Français",
    addBudget: "Add Budget",
    monthlyLimit: "Monthly Limit",
    noBudgets: "No budgets set. Add a budget to start tracking!",
    onTrack: "On Track",
    warning: "Warning",
    exceeded: "Exceeded",
    remaining: "remaining",
    of: "of",
    todaysHistory: "Today's History",
    weeksHistory: "Last 7 Days History",
    monthsHistory: "This Month's History",
    yearsHistory: "This Year's History",
  },
  fr: {
    dashboard: "Tableau de bord",
    transactions: "Transactions",
    budgetAlerts: "Alertes budget",
    profile: "Profil",
    logout: "Déconnexion",
    welcome: "Bienvenue",
    balance: "Solde",
    income: "Revenus",
    expenses: "Dépenses",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    annual: "Annuel",
    history: "Historique",
    date: "Date",
    description: "Description",
    category: "Catégorie",
    amount: "Montant",
    noTransactions: "Aucune transaction pour cette période.",
    addTransaction: "Ajouter une transaction",
    editTransaction: "Modifier la transaction",
    delete: "Supprimer",
    edit: "Modifier",
    search: "Rechercher la description...",
    allTypes: "Tous les types",
    type: "Type",
    expense: "Dépense",
    add: "Ajouter",
    cancel: "Annuler",
    save: "Enregistrer",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    fullName: "Nom complet",
    confirmPassword: "Confirmer le mot de passe",
    noAccount: "Pas de compte ?",
    haveAccount: "Déjà un compte ?",
    createAccount: "Créer un compte",
    signingIn: "Connexion...",
    creating: "Création...",
    myProfile: "Mon profil",
    editProfile: "Modifier le profil",
    language: "Langue",
    english: "English",
    french: "Français",
    addBudget: "Ajouter un budget",
    monthlyLimit: "Limite mensuelle",
    noBudgets: "Aucun budget défini. Ajoutez un budget pour commencer !",
    onTrack: "Sur la bonne voie",
    warning: "Attention",
    exceeded: "Dépassé",
    remaining: "restant",
    of: "sur",
    todaysHistory: "Historique du jour",
    weeksHistory: "Historique des 7 derniers jours",
    monthsHistory: "Historique du mois",
    yearsHistory: "Historique de l'année",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const toggleLanguage = () => {
    const newLang = language === "en" ? "fr" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
