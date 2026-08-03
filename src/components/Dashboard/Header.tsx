import { Box } from "@mui/material";
import Profile from "./Profile";
import ThemeToggle from "./ThemeToggle";
import useAuthStore from "../../store/authStore";
import { capitalizeString } from "../../utils/utils";

const Header = ({ hideSuite = false }: { hideSuite?: boolean }) => {
  const { currentRole } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "var(--color-bg-default-primary)",
        boxShadow: "var(--shadow-nav)",
        borderBottom: "1px solid var(--brand-divider)",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "var(--color-bg-accent-primary)",
          color: "var(--color-fg-on-accent-primary)",
          px: 3,
          py: 1,
          borderRadius: "var(--radius-m)",
          fontWeight: 500,
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-s)",
          visibility: !hideSuite ? "visible" : "hidden",
        }}
      >
        Suite {capitalizeString(currentRole?.contexto || "")}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ThemeToggle />
        <Profile />
      </Box>
    </Box>
  );
};

export default Header;
