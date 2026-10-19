import { Card, CardActionArea, Box, Avatar, Chip, Typography } from "@mui/material";
import { Business, Badge, Email } from "@mui/icons-material";
import { ROLES, ROLE_NAMES } from "../../../../../utils/consts";
import {
  ROLE_SELECTION_CARD_HEIGHT,
  ROLE_SELECTION_CARD_WIDTH,
} from "../cardSizes";

/** Role chip colors — semantic tokens (accent / success / neutral). */
const roleColors: Record<string, string> = {
  [ROLES.EMPRESA_ADMIN]: "var(--color-fg-accent-primary)",
  [ROLES.EMPRESA_USUARIO]: "var(--color-fg-neutral-secondary)",
  [ROLES.FACTORING_ADMIN]: "var(--color-fg-accent-primary)",
  [ROLES.FACTORING_ANALISTA]: "var(--color-fg-success-primary)",
  DEFAULT: "var(--color-fg-accent-primary)",
};

const getRoleColor = (roleName: string) =>
  roleColors[roleName] || roleColors.DEFAULT;

interface RoleCardProps {
  roleId?: string;
  currentRoleId?: string;
  handleSelectRole: () => void;
  razonSocial?: string;
  roleName: string;
  email?: string;
  rut?: string;
  isPendingEnrollment?: boolean;
}

const RoleCard = ({
  roleId,
  currentRoleId,
  handleSelectRole,
  razonSocial,
  roleName,
  email,
  rut,
  isPendingEnrollment = false,
}: RoleCardProps) => {
  const isSelected = currentRoleId === roleId;

  const borderColor = isSelected
    ? "var(--color-border-accent-primary)"
    : isPendingEnrollment
      ? "var(--color-border-warning-secondary)"
      : "var(--color-border-default-primary)";

  return (
    <Card
      sx={{
        width: ROLE_SELECTION_CARD_WIDTH,
        minWidth: ROLE_SELECTION_CARD_WIDTH,
        height: ROLE_SELECTION_CARD_HEIGHT,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-l)",
        backgroundColor: "var(--color-bg-default-primary)",
        boxShadow: "var(--shadow-card)",
        transition:
          "transform var(--duration-fast) var(--easing-ease), box-shadow var(--duration-fast) var(--easing-ease)",
        border:
          isSelected || isPendingEnrollment
            ? `2px solid ${borderColor}`
            : `1px solid ${borderColor}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "var(--shadow-popover)",
        },
      }}
    >
      <CardActionArea
        onClick={handleSelectRole}
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: isPendingEnrollment
                ? "var(--color-bg-warning-secondary)"
                : "var(--color-bg-accent-secondary)",
              color: isPendingEnrollment
                ? "var(--color-fg-warning-primary)"
                : "var(--color-fg-accent-primary)",
              borderRadius: "var(--radius-m)",
            }}
          >
            <Business />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-m)",
                color: "var(--color-fg-default-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {razonSocial || "-"}
            </Typography>
            <Chip
              label={ROLE_NAMES[roleName]}
              size="small"
              sx={{
                backgroundColor: "transparent",
                color: getRoleColor(roleName),
                fontWeight: 500,
                fontSize: "var(--font-size-xs)",
                height: 22,
                "& .MuiChip-label": { px: 0 },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ minHeight: 22, mb: 1 }}>
          {isPendingEnrollment ? (
            <Chip
              label="Pendiente de enrolar"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "var(--font-size-xs)",
                height: 22,
                backgroundColor: "var(--color-bg-warning-secondary)",
                color: "var(--color-fg-warning-primary)",
                borderRadius: "var(--radius-m)",
              }}
            />
          ) : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: 18,
              }}
            />
            <Typography
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: "var(--font-size-s)",
              }}
            >
              RUT: {rut || "-"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Email
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: 18,
              }}
            />
            <Typography
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: "var(--font-size-s)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email || "-"}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default RoleCard;
