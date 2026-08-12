import { TextField, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";

export const StyledTextField = styled(TextField)(() => ({
  paddingBottom: 16,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-bg-default-primary)",
    borderRadius: "var(--radius-m)",
    "& fieldset": {
      borderColor: "var(--color-border-default-primary)",
    },
    "&:hover fieldset": {
      borderColor: "var(--color-border-default-secondary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-border-accent-primary)",
      borderWidth: "1.5px",
    },
    "&.Mui-error fieldset": {
      borderColor: "var(--color-border-danger-primary)",
    },
    "&.Mui-error": {
      backgroundColor: "var(--color-bg-danger-tertiary)",
    },
    "& input": {
      color: "var(--color-fg-default-primary)",
    },
    "& input::placeholder": {
      color: "var(--color-fg-disabled-primary)",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--color-fg-default-secondary)",
    "&.Mui-focused": {
      color: "var(--color-fg-accent-primary)",
    },
    "&.Mui-error": {
      color: "var(--color-fg-danger-primary)",
    },
  },
}));

const datePickerFieldStyles = {
  paddingBottom: 16,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-bg-default-primary)",
    borderRadius: "var(--radius-m)",
    "& fieldset": {
      borderColor: "var(--color-border-default-primary)",
    },
    "&:hover fieldset": {
      borderColor: "var(--color-border-default-secondary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-border-accent-primary)",
      borderWidth: "1.5px",
    },
    "&.Mui-error fieldset": {
      borderColor: "var(--color-border-danger-primary)",
    },
    "&.Mui-error": {
      backgroundColor: "var(--color-bg-danger-tertiary)",
    },
    "& input": {
      color: "var(--color-fg-default-primary)",
    },
    "& input::placeholder": {
      color: "var(--color-fg-disabled-primary)",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--color-fg-default-secondary)",
    "&.Mui-focused": {
      color: "var(--color-fg-accent-primary)",
    },
    "&.Mui-error": {
      color: "var(--color-fg-danger-primary)",
    },
  },
  "& .MuiInputAdornment-root .MuiIconButton-root": {
    color: "var(--color-fg-disabled-primary)",
  },
} as const;

const DatePickerRoot = styled(DatePicker)<DatePickerProps<false>>(
  () => datePickerFieldStyles,
);

/** Uses MUI TextField (legacy field DOM) so styles match StyledTextField. */
export const StyledDatePicker = (props: DatePickerProps<false>) => (
  <DatePickerRoot {...props} enableAccessibleFieldDOMStructure={false} />
);

export const StyledSelect = styled(Select)(() => ({
  marginBottom: 16,
  backgroundColor: "var(--color-bg-default-primary)",
  borderRadius: "var(--radius-m)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-default-primary)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-default-secondary)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-accent-primary)",
    borderWidth: "1.5px",
  },
  "& .MuiSelect-select": {
    color: "var(--color-fg-default-primary)",
  },
}));
