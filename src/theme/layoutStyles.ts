import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Layout breakpoints (px) — keep in sync with:
 * - CSS tokens `--breakpoint-*` in tokens.css
 * - `theme.breakpoints.values` in theme.tsx
 *
 * Keys map to MUI sx breakpoint keys (except `xxl`, which is CSS-only for now).
 */
export const layoutBreakpoints = {
  /** MUI xs — base */
  xs: 0,
  /** MUI sm ← --breakpoint-s — toolbars stack, dialogs fluid */
  sm: 500,
  /** MUI md ← --breakpoint-m — sidebar rail, headers stack, stats denser */
  md: 768,
  /** MUI lg ← --breakpoint-l — multi-column forms/detail comfortable */
  lg: 1012,
  /** MUI xl ← --breakpoint-xl — wide dashboard splits */
  xl: 1280,
  /** CSS-only ← --breakpoint-2xl — optional content max-width on large monitors */
  xxl: 1440,
} as const;

/** Authenticated page content pane (inside Layout children). */
export const appContentSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: "auto",
  p: { xs: 2, md: 3 },
};

/** Page title row + primary actions. */
export const pageHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  mb: 3,
};

/** Metric / summary cards row. */
export const statsRowSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr 1fr",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 2,
  mb: 3,
};

/**
 * TableContainer shell: horizontal scroll instead of clipping columns.
 * Keep borderRadius/shadow at the call site or merge with this preset.
 */
export const tableShellSx: SxProps<Theme> = {
  overflowX: "auto",
  overflowY: "hidden",
  borderRadius: 3,
  boxShadow: "var(--shadow-card)",
};

/** Pagination / filter toolbars under tables. */
export const toolbarRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  p: 2,
};

/** Prefer over hardcoded PaperProps minWidth on dialogs. */
export const dialogPaperFluidSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: "100%",
};
