import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

export default function ForgotPasswordCard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Temporary frontend behavior.
    // Backend OTP/email integration comes later.

    navigate("/reset-password");
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
        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: "#64748B",
            fontWeight: 700,
            mb: 4,
          }}
        >
          <ArrowBackRoundedIcon fontSize="small" />
          Back to login
        </Link>

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            color: "#111827",
            letterSpacing: "-1px",
          }}
        >
          Forgot password?
        </Typography>

        <Typography
          sx={{
            mt: 1,
            mb: 4,
            color: "#64748B",
            lineHeight: 1.7,
          }}
        >
          Enter the email address associated with your
          ParamMart account and we'll help you reset your
          password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                py: 1.7,
                borderRadius: "14px",
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#6366F1,#06B6D4)",
              }}
            >
              Continue
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
          Remember your password?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              color: "#4F46E5",
              fontWeight: 800,
            }}
          >
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}