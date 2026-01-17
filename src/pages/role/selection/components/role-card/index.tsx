import { Card, CardActionArea, Box, Avatar, Chip, Typography } from "@mui/material";
import { Business, Badge, Email, } from "@mui/icons-material";
import { ROLES, ROLE_NAMES } from "../../../../../utils/consts";

const roleColors: Record<string, string> = {
  [ROLES.EMPRESA_ADMIN]: "#00BCD4",
  [ROLES.EMPRESA_USUARIO]: "#4A6B8A",
  [ROLES.FACTORING_ADMIN]: "#00BCD4",
  [ROLES.FACTORING_ANALISTA]: "#00D9A5",
  DEFAULT: "#00BCD4",
};

  const getRoleColor = (roleName: string) => {
    return roleColors[roleName] || roleColors.DEFAULT;
  };

const RoleCard = ({ roleId, currentRoleId, handleSelectRole, razonSocial, roleName, email, rut }: any) => {
  return (
    <Card
      key={roleId}
      sx={{
        width: 280,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        transition: "transform 0.2s, box-shadow 0.2s",
        border:
          currentRoleId === roleId ? "2px solid" : "none",
        borderColor: "primary.main",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardActionArea onClick={handleSelectRole} sx={{ p: 3 }}>
        {/* Header con ícono y nombre */}
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
              backgroundColor: "primary.main",
              borderRadius: 2,
            }}
          >
            <Business sx={{ color: "white" }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.primary",
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
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 22,
                "& .MuiChip-label": { px: 0 },
              }}
            />
          </Box>
        </Box>

        {/* Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
              RUT: {rut || "-"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Email sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.85rem",
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
