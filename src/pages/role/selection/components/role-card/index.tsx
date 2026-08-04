import { Card, CardActionArea, Box, Avatar, Chip, Typography } from "@mui/material";
import { Business, Badge, Email } from "@mui/icons-material";
import { ROLES, ROLE_NAMES } from "../../../../../utils/consts";

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
}

const RoleCard = ({
  roleId,
  currentRoleId,
  handleSelectRole,
  razonSocial,
  roleName,
  email,
  rut,
}: RoleCardProps) => {
  const isSelected = currentRoleId === roleId;

  return (
    <Card
      sx={{
        width: 280,
        borderRadius: "var(--radius-l)",
        backgroundColor: "var(--color-bg-default-primary)",
        boxShadow: "var(--shadow-card)",
        transition:
          "transform var(--duration-fast) var(--easing-ease), box-shadow var(--duration-fast) var(--easing-ease)",
        border: isSelected
          ? "2px solid var(--color-border-accent-primary)"
          : "1px solid var(--color-border-default-primary)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "var(--shadow-popover)",
        },
      }}
    >
      <CardActionArea onClick={handleSelectRole} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "var(--color-bg-accent-secondary)",
              color: "var(--color-fg-accent-primary)",
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
