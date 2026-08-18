import { useSettings } from "../../context/SettingsContext";
import "./Settings.css";

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const ACCENT_PRESETS = {
  violet: { primary: "#7c3aed", light: "#9061f9", bg: "#221b37" },
  blue: { primary: "#3b82f6", light: "#60a5fa", bg: "#1e293b" },
  rose: { primary: "#e11d48", light: "#fb7185", bg: "#3f1725" },
  emerald: { primary: "#10b981", light: "#34d399", bg: "#132e28" },
  amber: { primary: "#f59e0b", light: "#fbbf24", bg: "#3a2a0f" },
} as const;

type AccentName = keyof typeof ACCENT_PRESETS;

export default function Settings() {
  const {
    theme,
    accentColor,
    defaultCalendarView,
    defaultPriority,
    setTheme,
    setAccentColor,
    setDefaultCalendarView,
    setDefaultPriority,
    resetSettings,
  } = useSettings();

  const colorIsValid = HEX_COLOR.test(accentColor);

  return (
    <div className="main-wrapper">
      <div className="page-desc">
        <h1>Settings</h1>
        <p className="intro">Customize how Task Planner looks and behaves.</p>
      </div>

      <section className="settings-section">
        <h2>Appearance</h2>

        <div className="settings-row">
          <div>
            <label>Theme</label>
            <p className="settings-hint">Switch between light and dark mode.</p>
          </div>
          <div className="theme-toggle">
            <button
              type="button"
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? "active" : ""}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <label>Accent color</label>
            <p className="settings-hint">
              Used for buttons, highlights, and selected states.
            </p>
          </div>
          <div className="accent-picker">
            {Object.entries(ACCENT_PRESETS).map(([name, colors]) => (
              <button
                type="button"
                key={name}
                className={`swatch ${accentColor === name ? "selected" : ""}`}
                style={{
                  backgroundColor: colors.primary,
                  width: "50px",
                  height: "50px",
                }}
                onClick={() => setAccentColor(name as AccentName)}
                aria-label={`Set accent to ${name}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Defaults</h2>

        <div className="settings-row">
          <div>
            <label htmlFor="defaultCalendarView">Default calendar view</label>
            <p className="settings-hint">
              Which view the Calendar page opens in.
            </p>
          </div>
          <select
            id="defaultCalendarView"
            value={defaultCalendarView}
            onChange={(e) =>
              setDefaultCalendarView(
                e.target.value as typeof defaultCalendarView,
              )
            }
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>

        <div className="settings-row">
          <div>
            <label htmlFor="defaultPriority">Default task priority</label>
            <p className="settings-hint">
              Pre-selected priority when creating a new task.
            </p>
          </div>
          <select
            id="defaultPriority"
            value={defaultPriority}
            onChange={(e) =>
              setDefaultPriority(e.target.value as typeof defaultPriority)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </section>

      <div className="settings-actions">
        <button type="button" className="btn-secondary" onClick={resetSettings}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
