import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

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
export const appContentSx: SystemStyleObject<Theme> = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: "auto",
  p: { xs: 2, md: 3 },
};

/** Page title row + primary actions. */
export const pageHeaderSx: SystemStyleObject<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  mb: 3,
};

/** Metric / summary cards row. */
export const statsRowSx: SystemStyleObject<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr 1fr",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 2,
  mb: 3,
};

/**
 * Outer Paper / TableContainer: clips border radius.
 * Wrap the <Table> in a Box with `tableScrollSx` so pagination footers
 * stay fixed while columns scroll horizontally.
 */
export const tableShellSx: SystemStyleObject<Theme> = {
  overflow: "hidden",
  borderRadius: 3,
  boxShadow: "var(--shadow-card)",
};

/** Horizontal scroll region wrapping <Table>. */
export const tableScrollSx: SystemStyleObject<Theme> = {
  overflowX: "auto",
  width: "100%",
};

/** ~7–8 column factura / marketplace / users tables. */
export const tableWideSx: SystemStyleObject<Theme> = {
  minWidth: 900,
};

/** ~4–6 column compact tables (invitations, documents, dashboard). */
export const tableCompactSx: SystemStyleObject<Theme> = {
  minWidth: 720,
};

/** Pagination / filter toolbars under tables. */
export const toolbarRowSx: SystemStyleObject<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  p: 2,
};

/** "Rows per page" select — fluid min width. */
export const paginationSelectSx: SystemStyleObject<Theme> = {
  minWidth: { xs: 120, sm: 160 },
};

/** Prefer over hardcoded PaperProps minWidth on dialogs. */
export const dialogPaperFluidSx: SystemStyleObject<Theme> = {
  width: "100%",
  maxWidth: "100%",
};
