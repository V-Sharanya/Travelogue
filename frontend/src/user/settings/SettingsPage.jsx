import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import AppearanceSettings from "./AppearanceSettings";
import "./settings.css";

export default function SettingsPage() {
  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <AccountSettings />
        <PrivacySettings />
        <AppearanceSettings />
      </div>
    </div>
  );
}
