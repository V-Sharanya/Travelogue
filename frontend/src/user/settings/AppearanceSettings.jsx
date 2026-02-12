import { useEffect } from "react";
import API from "../../api/api";
import ToggleSwitch from "./ToggleSwitch";

function getEffectiveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme || "light";
}

function applyThemeToDocument(theme) {
  const effective = getEffectiveTheme(theme);
  document.documentElement.setAttribute("data-theme", effective);
}

export default function AppearanceSettings({ settings, setSettings }) {
  const theme = settings?.theme ?? "light";

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeToDocument("system");
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, [theme]);

  const updateSetting = async (key, value) => {
    try {
      const res = await API.put("/settings", { [key]: value });
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleThemeChange = async (t) => {
    try {
      const res = await API.put("/settings", { theme: t });
      setSettings(res.data);
      applyThemeToDocument(t);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-card">
      <h2>Appearance</h2>

      <div className="theme-options">
        {["light", "dark", "system"].map((t) => (
          <button
            key={t}
            type="button"
            className={`theme-btn ${theme === t ? "active" : ""}`}
            onClick={() => handleThemeChange(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <SettingRow
        title="Reduce Motion"
        desc="Minimize animations throughout the app"
        value={settings?.reduce_motion ?? false}
        onChange={(val) => updateSetting("reduce_motion", val)}
      />

      <SettingRow
        title="Compact Mode"
        desc="Show more content with reduced spacing"
        value={settings?.compact_mode ?? false}
        onChange={(val) => updateSetting("compact_mode", val)}
      />
    </div>
  );
}

function SettingRow({ title, desc, value, onChange }) {
  return (
    <div className="settings-row">
      <div>
        <p><strong>{title}</strong></p>
        <p className="settings-subtext">{desc}</p>
      </div>
      <ToggleSwitch enabled={value} onChange={onChange} />
    </div>
  );
}

