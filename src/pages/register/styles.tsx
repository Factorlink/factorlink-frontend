import { TextField, Select } from "@mui/material";
import { styled } from "@mui/material/styles";


export const StyledTextField = styled(TextField)(({theme}) => ({
  paddingBottom: 16,
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.default,
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.text.disabled,
    },
    "& input": {
      color: theme.palette.text.secondary,
    },
    "& input::placeholder": {
      color: theme.palette.text.disabled,
      opacity: 1,
    },

    "& input::label": {
      color: theme.palette.text.disabled,
      opacity: 1,
    },
  },
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: 16,
  backgroundColor: theme.palette.background.default,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.text.disabled,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiSelect-select": {
    color: theme.palette.text.secondary,
  },
}));
