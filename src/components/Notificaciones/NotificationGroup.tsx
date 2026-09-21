import type { FC, ReactNode } from "react";
import { Box, Chip, Collapse, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface NotificationGroupProps {
  label: string;
  count: number;
  unreadCount?: number;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const NotificationGroup: FC<NotificationGroupProps> = ({
  label,
  count,
  unreadCount = 0,
  expanded,
  onToggle,
  children,
}) => {
  return (
    <Box
      sx={{
        borderBottom: "1px solid var(--color-border-default-primary)",
        "&:last-of-type": { borderBottom: "none" },
      }}
    >
      <Box
        component="button"
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
          px: 2,
          py: 1.25,
          backgroundColor:
            unreadCount > 0
              ? "var(--color-bg-accent-tertiary)"
              : "var(--color-bg-default-secondary)",
          transition: "background-color var(--duration-fast) var(--easing-ease)",
          "&:hover": {
            backgroundColor:
              unreadCount > 0
                ? "var(--color-bg-accent-secondary)"
                : "var(--color-bg-default-primary-hover)",
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: unreadCount > 0 ? 600 : 500,
              fontSize: "var(--font-size-s)",
              color: "var(--color-fg-default-primary)",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "var(--color-fg-default-secondary)",
              fontSize: "var(--font-size-xs)",
            }}
          >
            {count} {count === 1 ? "notificación" : "notificaciones"}
          </Typography>
        </Box>

        <Chip
          label={unreadCount > 0 ? unreadCount : count}
          size="small"
          sx={{
            height: 22,
            minWidth: 28,
            fontSize: "var(--font-size-xs)",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            backgroundColor:
              unreadCount > 0
                ? "var(--color-bg-accent-secondary)"
                : "var(--color-bg-default-primary)",
            color:
              unreadCount > 0
                ? "var(--color-fg-accent-primary)"
                : "var(--color-fg-default-secondary)",
          }}
        />

        {expanded ? (
          <ExpandLess
            sx={{
              fontSize: 20,
              color: "var(--color-fg-default-secondary)",
              flexShrink: 0,
            }}
          />
        ) : (
          <ExpandMore
            sx={{
              fontSize: 20,
              color: "var(--color-fg-default-secondary)",
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            borderTop: "1px solid var(--color-border-default-primary)",
            backgroundColor: "var(--color-bg-default-primary)",
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default NotificationGroup;
