export default function AccountSettings() {
  return (
    <div className="settings-card">
      <h2>Account Settings</h2>

      <div className="settings-row">
        <input
          className="settings-input"
          value="alex@example.com"
          readOnly
        />
        <button className="btn btn-primary">Update</button>
      </div>

      <div className="settings-row">
        <input className="settings-input" placeholder="Current Password" />
        <input className="settings-input" placeholder="New Password" />
      </div>

      <button className="btn btn-outline">Update Password</button>

      <div className="danger-zone">
        <p><strong>Danger Zone</strong></p>
        <p className="settings-subtext">
          Once deleted, your account cannot be recovered.
        </p>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  );
}
