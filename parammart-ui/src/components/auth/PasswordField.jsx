import { useState } from "react";

import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  error,
  helperText,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      autoComplete="current-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <VisibilityOffRoundedIcon />
              ) : (
                <VisibilityRoundedIcon />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}