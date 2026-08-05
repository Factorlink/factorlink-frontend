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

/** Centered single-column auth shell (login, forgot, reset). */
export const authCenteredPageSx: SxProps<Theme> = {
  minHeight: "100vh",
  backgroundColor: "var(--color-bg-default-secondary)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  px: 2,
  py: 3,
};

/** Same shell but top-aligned for long forms (register). */
export const authCenteredPageTopSx: SxProps<Theme> = {
  ...authCenteredPageSx,
  justifyContent: "flex-start",
  alignItems: "center",
  py: 4,
};

export const authLogoLinkSx: SxProps<Theme> = {
  display: "block",
  lineHeight: 0,
  textDecoration: "none",
};

export const authLogoImgSx: SxProps<Theme> = {
  maxWidth: { xs: 140, sm: 180 },
  width: "100%",
  height: "auto",
  display: "block",
};

export const authTitleSx: SxProps<Theme> = {
  textAlign: "center",
  fontFamily: "var(--font-heading)",
  fontWeight: 400,
  color: "var(--color-fg-default-primary)",
  fontSize: {
    xs: "var(--font-size-display-h4)",
    sm: "var(--font-size-display-h3)",
  },
};

export const authFormSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: 400,
  display: "flex",
  flexDirection: "column",
};

export const authFormWideSx: SxProps<Theme> = {
  ...authFormSx,
  maxWidth: 480,
};

export const authFooterTextSx: SxProps<Theme> = {
  textAlign: "center",
  mt: 3,
  color: "var(--color-fg-default-secondary)",
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
