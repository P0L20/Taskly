import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type CalendarView = "month" | "week" | "agenda";
type Priority = "low" | "medium" | "high";

const ACCENT_PRESETS = {
  violet: { primary: "#7c3aed", light: "#9061f9", bg: "#221b37" },
  blue: { primary: "#3b82f6", light: "#60a5fa", bg: "#1e293b" },
  rose: { primary: "#e11d48", light: "#fb7185", bg: "#3f1725" },
  emerald: { primary: "#10b981", light: "#34d399", bg: "#132e28" },
  amber: { primary: "#f59e0b", light: "#fbbf24", bg: "#3a2a0f" },
} as const;

type AccentColor = keyof typeof ACCENT_PRESETS;

interface Settings {
  theme: Theme;
  accentColor: AccentColor;
  defaultCalendarView: CalendarView;
  defaultPriority: Priority;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  accentColor: "violet",
  defaultCalendarView: "month",
  defaultPriority: "medium",
};

const STORAGE_KEY = "task-planner-settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // malformed storage — fall through to defaults
  }
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;
  return { ...DEFAULT_SETTINGS, theme: prefersDark ? "dark" : "light" };
}

interface SettingsContextValue extends Settings {
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setDefaultCalendarView: (view: CalendarView) => void;
  setDefaultPriority: (priority: Priority) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute("data-theme", settings.theme);

    console.log(settings);

    const { primary, light, bg } = ACCENT_PRESETS[settings.accentColor];
    document.documentElement.style.setProperty("--color-primary", primary);
    document.documentElement.style.setProperty("--color-primary-light", light);
    document.documentElement.style.setProperty("--color-primary-bg", bg);
  }, [settings]);

  const value: SettingsContextValue = {
    ...settings,
    setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    setAccentColor: (accentColor) =>
      setSettings((prev) => ({ ...prev, accentColor })),
    setDefaultCalendarView: (defaultCalendarView) =>
      setSettings((prev) => ({ ...prev, defaultCalendarView })),
    setDefaultPriority: (defaultPriority) =>
      setSettings((prev) => ({ ...prev, defaultPriority })),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be within a SettingsProvider");
  return ctx;
}
