import ToggleSwitch from "./ToggleSwitch";

export default function PrivacySettings() {
  return (
    <div className="settings-card">
      <h2>Privacy Settings</h2>

      <SettingRow
        title="Public Profile"
        desc="Allow anyone to view your profile"
      />

      <SettingRow
        title="Show Activity Status"
        desc="Let others see when you're active"
      />

      <SettingRow
        title="Show Saved Posts"
        desc="Allow others to see your saved posts"
      />
    </div>
  );
}

function SettingRow({ title, desc }) {
  return (
    <div className="settings-row">
      <div>
        <p><strong>{title}</strong></p>
        <p className="settings-subtext">{desc}</p>
      </div>
      <ToggleSwitch />
    </div>
  );
}
