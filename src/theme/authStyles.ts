import type { SxProps, Theme } from "@mui/material/styles";

/** Shared auth/legal page shell styles (login, register, password, legal). */
export const authPageSx: SxProps<Theme> = {
  minHeight: "100vh",
  backgroundColor: "var(--color-bg-neutral-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 2,
};

export const authCardSx: SxProps<Theme> = {
  backgroundColor: "var(--color-bg-default-primary)",
  borderRadius: "var(--radius-l)",
  overflow: "hidden",
  boxShadow: "var(--shadow-popover)",
  border: "1px solid var(--color-border-default-primary)",
};

export const authTabSx: SxProps<Theme> = {
  backgroundColor: "var(--color-bg-accent-primary)",
  color: "var(--color-fg-on-accent-primary)",
  padding: "12px 28px",
  width: "fit-content",
  borderRadius: "0 0 var(--radius-m) 0",
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  fontSize: "var(--font-size-s)",
};

export const authLogoColumnSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRight: {
    xs: "none",
    md: "1px solid var(--color-border-default-primary)",
  },
  paddingRight: { md: 4 },
  height: "100%",
};

export const authSecondaryButtonSx: SxProps<Theme> = {
  backgroundColor: "var(--brand-secondary)",
  color: "var(--brand-primary)",
  textTransform: "none",
  padding: "12px",
  fontSize: "var(--font-size-m)",
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  borderRadius: "var(--radius-m)",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "var(--color-bg-accent-secondary-hover)",
    boxShadow: "none",
  },
};

export const authPrimaryButtonSx: SxProps<Theme> = {
  backgroundColor: "var(--color-bg-accent-primary)",
  color: "var(--color-fg-on-accent-primary)",
  textTransform: "none",
  padding: "12px",
  fontSize: "var(--font-size-m)",
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  borderRadius: "var(--radius-m)",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "var(--color-bg-accent-primary-hover)",
    boxShadow: "none",
  },
};

export const authLinkSx: SxProps<Theme> = {
  color: "var(--color-fg-accent-primary)",
  textDecoration: "none",
  fontSize: "var(--font-size-s)",
  cursor: "pointer",
  "&:hover": {
    color: "var(--color-fg-accent-secondary)",
    textDecoration: "underline",
  },
};

export const authCheckboxSx: SxProps<Theme> = {
  color: "var(--color-fg-disabled-primary)",
  "&.Mui-checked": {
    color: "var(--color-fg-accent-primary)",
  },
};

export const legalPageSx: SxProps<Theme> = {
  minHeight: "100vh",
  backgroundColor: "var(--color-bg-neutral-primary)",
  py: 6,
};

export const legalPaperSx: SxProps<Theme> = {
  p: { xs: 3, md: 5 },
  borderRadius: "var(--radius-l)",
  backgroundColor: "var(--color-bg-default-primary)",
  boxShadow: "var(--shadow-card)",
  border: "1px solid var(--color-border-default-primary)",
};

export const legalHeadingSx: SxProps<Theme> = {
  fontFamily: "var(--font-heading)",
  fontWeight: 400,
  color: "var(--color-fg-default-primary)",
};

export const legalSectionHeadingSx: SxProps<Theme> = {
  fontFamily: "var(--font-heading)",
  fontWeight: 500,
  color: "var(--color-fg-default-primary)",
};
