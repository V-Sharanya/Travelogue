import { useEffect, useState } from "react";
import API from "../../api/api";
import { useAuth } from "../../auth/useAuth";
import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import AppearanceSettings from "./AppearanceSettings";
import "./settings.css";

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    API.get("/settings")
      .then((res) => setSettings(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <AccountSettings key={user?.email} currentEmail={user?.email} />
      <PrivacySettings settings={settings} setSettings={setSettings} />
      <AppearanceSettings settings={settings} setSettings={setSettings} />
    </div>
  );
}
