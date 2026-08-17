import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile({ name, email });
      updateUser(response.data);
      setIsEditing(false);
      toast.success(t("save") + "!");
    } catch (error) {
      toast.error("Failed");
    }
  };

  return React.createElement("div", { style: { maxWidth: "600px", margin: "0 auto" } },
    React.createElement("div", { style: { background: "white", padding: "24px", borderRadius: "12px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" } },
      React.createElement("div", { style: { width: "80px", height: "80px", borderRadius: "50%", background: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "32px", fontWeight: "bold" } },
        user?.name?.charAt(0)?.toUpperCase() || "U"
      ),
      React.createElement("div", null,
        React.createElement("h2", null, user?.name),
        React.createElement("p", { style: { color: "#64748b" } }, user?.email)
      )
    ),
    React.createElement("div", { style: { background: "white", padding: "24px", borderRadius: "12px" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "20px" } },
        React.createElement("h3", null, t("profile")),
        React.createElement("button", { onClick: () => setIsEditing(!isEditing), style: { padding: "8px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" } },
          isEditing ? t("cancel") : t("edit")
        )
      ),
      isEditing ?
        React.createElement("form", { onSubmit: handleUpdate },
          React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), style: { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "6px" }, placeholder: t("name") }),
          React.createElement("input", { value: email, onChange: (e) => setEmail(e.target.value), style: { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "6px" }, placeholder: t("email") }),
          React.createElement("button", { type: "submit", style: { padding: "10px 20px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" } }, t("save"))
        )
      :
        React.createElement("div", null,
          React.createElement("p", null, React.createElement("strong", null, t("name") + ": "), user?.name),
          React.createElement("p", null, React.createElement("strong", null, t("email") + ": "), user?.email)
        )
    )
  );
};

export default Profile;
