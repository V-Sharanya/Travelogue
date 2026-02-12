import API from "../../api/api";
import ToggleSwitch from "./ToggleSwitch";

export default function PrivacySettings({ settings, setSettings }) {

  const updateSetting = async (key, value) => {
    try {
      const res = await API.put("/settings", { [key]: value });
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-card">
      <h2>Privacy Settings</h2>

      <SettingRow
        title="Public Profile"
        value={settings.public_profile}
        onChange={(val) => updateSetting("public_profile", val)}
      />

      <SettingRow
        title="Show Activity Status"
        value={settings.show_activity_status}
        onChange={(val) => updateSetting("show_activity_status", val)}
      />

      <SettingRow
        title="Show Saved Posts"
        value={settings.show_saved_posts}
        onChange={(val) => updateSetting("show_saved_posts", val)}
      />
    </div>
  );
}

function SettingRow({ title, value, onChange }) {
  return (
    <div className="settings-row">
      <p>{title}</p>
      <ToggleSwitch enabled={value} onChange={onChange} />
    </div>
  );
}
