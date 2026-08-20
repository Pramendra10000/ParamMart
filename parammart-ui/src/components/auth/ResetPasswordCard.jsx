import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Link,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import PasswordField from "./PasswordField";

export default function ResetPasswordCard() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Temporary frontend behavior.
    // Spring Boot reset-password API will be connected later.

    alert("Password reset successfully.");

    navigate("/login");
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 480,
        borderRadius: "28px",
        boxShadow: "0 30px 80px rgba(15,23,42,.12)",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        <Stack
          alignItems="center"
          textAlign="center"
          spacing={2}
        >
          <CheckCircleRoundedIcon
            sx={{
              fontSize: 55,
              color: "#22C55E",
            }}
          />

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            Create new password
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              lineHeight: 1.7,
            }}
          >
            Choose a strong password for your ParamMart
            account.
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5} mt={4}>
            <PasswordField
              label="New password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 1.7,
                borderRadius: "14px",
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#6366F1,#06B6D4)",
              }}
            >
              Reset password
            </Button>
          </Stack>
        </form>

        <Typography
          align="center"
          sx={{
            mt: 4,
            color: "#64748B",
          }}
        >
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              color: "#4F46E5",
              fontWeight: 800,
            }}
          >
            Back to login
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}