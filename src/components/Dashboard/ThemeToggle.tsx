import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAppTheme } from "../../theme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <Tooltip title={isDark ? "Modo claro" : "Modo oscuro"}>
      <IconButton
        onClick={toggleTheme}
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        sx={{
          color: "text.secondary",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "var(--radius-m)",
          "&:hover": {
            backgroundColor: "var(--color-bg-default-primary-hover)",
            borderColor: "var(--color-border-default-secondary)",
          },
        }}
      >
        {isDark ? (
          <LightModeOutlined fontSize="small" />
        ) : (
          <DarkModeOutlined fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
