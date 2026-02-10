import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="settings-card">
      <h2>Appearance</h2>

      <div className="theme-options">
        {["light", "dark", "system"].map(t => (
          <button
            key={t}
            className={`theme-btn ${theme === t ? "active" : ""}`}
            onClick={() => setTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <SettingRow
        title="Reduce Motion"
        desc="Minimize animations throughout the app"
      />

      <SettingRow
        title="Compact Mode"
        desc="Show more content with reduced spacing"
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
