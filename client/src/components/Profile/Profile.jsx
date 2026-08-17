import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const cardStyle = { background: darkMode ? "#1e293b" : "white", color: darkMode ? "#e2e8f0" : "#1e293b" };
  const inputStyle = { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid " + (darkMode ? "#334155" : "#e2e8f0"), borderRadius: "6px", background: darkMode ? "#0f172a" : "white", color: darkMode ? "#e2e8f0" : "#1e293b" };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const response = await userAPI.uploadPhoto(fd);
      console.log("Upload response:", response.data);
      updateUser(response.data.user);
      toast.success("Photo updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    }
  };

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

  const hasCustomPhoto = user?.profilePicture && user.profilePicture !== "default-avatar.png";

  const getPhotoUrl = () => {
    if (!hasCustomPhoto) return null;
    const pic = user.profilePicture;
    if (pic.startsWith("http")) return pic;
    if (pic.startsWith("/uploads/")) return "http://localhost:5000" + pic;
    return "http://localhost:5000/uploads/" + pic;
  };

  const photoUrl = getPhotoUrl();
  console.log("Photo URL:", photoUrl);
  console.log("User object:", user);

  return React.createElement("div", { style: { maxWidth: "600px", margin: "0 auto" } },
    React.createElement("div", { style: { ...cardStyle, padding: "40px", borderRadius: "16px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" } },
      React.createElement("div", { 
        onClick: () => fileInputRef.current.click(), 
        style: { 
          width: "120px", 
          height: "120px", 
          borderRadius: "50%", 
          background: photoUrl ? "transparent" : "#818cf8", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "white", 
          fontSize: "48px", 
          fontWeight: "bold", 
          cursor: "pointer", 
          overflow: "hidden", 
          border: "4px solid #818cf8",
          position: "relative",
          marginBottom: "16px",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          flexShrink: 0
        } 
      },
        photoUrl ?
          React.createElement("img", { 
            src: photoUrl, 
            alt: "Profile", 
            style: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
            onError: () => console.log("Image failed to load:", photoUrl)
          })
        : React.createElement("span", null, user?.name?.charAt(0)?.toUpperCase() || "U"),
        React.createElement("div", { 
          style: { 
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0, 
            background: "rgba(0,0,0,0.6)", 
            fontSize: "11px", 
            padding: "4px", 
            color: "white" 
          } 
        }, "📷")
      ),
      React.createElement("input", { type: "file", ref: fileInputRef, onChange: handlePhotoUpload, accept: "image/*", style: { display: "none" } }),
      React.createElement("h2", { style: { marginBottom: "4px" } }, user?.name),
      React.createElement("p", { style: { color: darkMode ? "#94a3b8" : "#64748b", marginBottom: "8px" } }, user?.email),
      React.createElement("p", { style: { color: darkMode ? "#94a3b8" : "#64748b", fontSize: "13px" } }, "🖱️ Click photo to change")
    ),
    React.createElement("div", { style: { ...cardStyle, padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
        React.createElement("h3", null, t("profile")),
        React.createElement("button", { onClick: () => setIsEditing(!isEditing), style: { padding: "8px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" } },
          isEditing ? t("cancel") : t("edit")
        )
      ),
      isEditing ?
        React.createElement("form", { onSubmit: handleUpdate },
          React.createElement("label", { style: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" } }, t("name") || "Name"),
          React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), style: inputStyle, placeholder: t("name") || "Name" }),
          React.createElement("label", { style: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" } }, t("email") || "Email"),
          React.createElement("input", { value: email, onChange: (e) => setEmail(e.target.value), style: inputStyle, placeholder: t("email") || "Email" }),
          React.createElement("button", { type: "submit", style: { padding: "10px 20px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" } }, t("save"))
        )
      :
        React.createElement("div", null,
          React.createElement("p", { style: { marginBottom: "12px" } },
            React.createElement("strong", null, (t("name") || "Name") + ": "), user?.name
          ),
          React.createElement("p", null,
            React.createElement("strong", null, (t("email") || "Email") + ": "), user?.email
          )
        )
    )
  );
};

export default Profile;
