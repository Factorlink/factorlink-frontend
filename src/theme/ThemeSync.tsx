import { useAppTheme } from "./useAppTheme";

/** Keeps data-theme in sync with React state and system preference (no UI). */
export function ThemeSync() {
  useAppTheme();
  return null;
}
