import { useState } from "react";
import API from "../../api/api";
import { useAuth } from "../../auth/useAuth";

export default function AccountSettings({ currentEmail }) {
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState(currentEmail || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailUpdate = async () => {
    try {
      await API.put("/users/email", { email });
      await refreshUser();
      alert("Email updated successfully");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail ?? "Failed to update email";
      alert(typeof msg === "string" ? msg : "Failed to update email");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await API.put("/users/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail ?? "Failed to update password";
      alert(typeof msg === "string" ? msg : "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await API.delete("/users");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="settings-card">
      <h2>Account Settings</h2>

      {/* EMAIL */}
      <div className="settings-row">
        <input
          className="settings-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleEmailUpdate}>
          Update
        </button>
      </div>

      {/* PASSWORD */}
      <div className="settings-row">
        <input
          type="password"
          className="settings-input"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          className="settings-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-outline" onClick={handlePasswordUpdate}>
        Update Password
      </button>

      {/* DANGER ZONE */}
      <div className="danger-zone">
        <p><strong>Danger Zone</strong></p>
        <p className="settings-subtext">
          Once deleted, your account cannot be recovered.
        </p>
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
