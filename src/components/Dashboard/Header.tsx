import { Box } from "@mui/material";
import Profile from "./Profile";
import ThemeToggle from "./ThemeToggle";
import useAuthStore from "../../store/authStore";
import { capitalizeString } from "../../utils/utils";

const Header = ({
  hideSuite = false,
  hideNotifications = false,
}: {
  hideSuite?: boolean;
  hideNotifications?: boolean;
}) => {
  const { currentRole } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        flexShrink: 0,
        minWidth: 0,
        backgroundColor: "var(--color-bg-default-primary)",
        boxShadow: "var(--shadow-nav)",
        borderBottom: "1px solid var(--brand-divider)",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            maxWidth: "100%",
            backgroundColor: "var(--color-bg-accent-primary)",
            color: "var(--color-fg-on-accent-primary)",
            px: { xs: 1.5, sm: 3 },
            py: 1,
            borderRadius: "var(--radius-m)",
            fontWeight: 500,
            fontFamily: "var(--font-heading)",
            fontSize: "var(--font-size-s)",
            visibility: !hideSuite ? "visible" : "hidden",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Suite {capitalizeString(currentRole?.contexto || "")}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <ThemeToggle />
        <Profile hideNotifications={hideNotifications} />
      </Box>
    </Box>
  );
};

export default Header;
