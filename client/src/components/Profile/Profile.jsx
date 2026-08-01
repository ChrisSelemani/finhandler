import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile({ name, email });
      updateUser(response.data);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "32px", fontWeight: "bold" }}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div><h2>{user?.name}</h2><p style={{ color: "#64748b" }}>{user?.email}</p></div>
      </div>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3>Profile</h3>
          <button onClick={() => setIsEditing(!isEditing)} style={{ padding: "8px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>{isEditing ? "Cancel" : "Edit"}</button>
        </div>
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
            <button type="submit" style={{ padding: "10px 20px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
