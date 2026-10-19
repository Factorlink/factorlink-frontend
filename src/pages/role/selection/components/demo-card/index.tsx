import { Card, CardActionArea, Box, Avatar, Chip, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  ROLE_SELECTION_CARD_HEIGHT,
  ROLE_SELECTION_CARD_WIDTH,
} from "../cardSizes";

interface DemoCardProps {
  onClick: () => void;
}

const DemoCard = ({ onClick }: DemoCardProps) => {
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
        border: "2px solid var(--color-border-accent-primary)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "var(--shadow-popover)",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
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
              backgroundColor: "var(--color-bg-accent-secondary)",
              color: "var(--color-fg-accent-primary)",
              borderRadius: "var(--radius-m)",
            }}
          >
            <PlayCircleOutlineIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-m)",
                color: "var(--color-fg-default-primary)",
              }}
            >
              DEMO
            </Typography>
            <Chip
              label="Demostración"
              size="small"
              sx={{
                backgroundColor: "var(--color-bg-accent-secondary)",
                color: "var(--color-fg-accent-primary)",
                fontWeight: 500,
                fontSize: "var(--font-size-xs)",
                height: 22,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ minHeight: 22, mb: 1 }} />

        <Typography
          sx={{
            mt: "auto",
            color: "var(--color-fg-default-secondary)",
            fontSize: "var(--font-size-s)",
          }}
        >
          Ver video de Factorlink
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default DemoCard;
