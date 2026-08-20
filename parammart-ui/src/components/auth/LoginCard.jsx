import { useState } from "react";
import { Box } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import PasswordField from "./PasswordField";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function LoginCard() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setLoading(true);

    const response = await login({
      email,
      password,
    });

    showSuccess("Login Successful");

    // Give toaster a moment to appear
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 500);

  } catch (error) {
    console.error("Login error:", error);

    showError(
      error?.response?.data?.message ||
      "Login failed. Please check your email and password."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 480,
        borderRadius: "28px",
        background: "rgba(255,255,255,.94)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.8)",
        boxShadow: "0 30px 80px rgba(15,23,42,.12)",
        animation: "cardIn .6s ease",

        "@keyframes cardIn": {
          from: {
            opacity: 0,
            transform: "translateY(25px) scale(.98)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
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
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            letterSpacing: "-1px",
            color: "#111827",
          }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            mt: 1,
            mb: 4,
            color: "#64748B",
          }}
        >
          Sign in to continue to your ParamMart account.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>

            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />

            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    disabled={loading}
                  />
                }
                label="Remember me"
              />

              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="none"
                sx={{
                  fontWeight: 700,
                  color: "#4F46E5",
                }}
              >
                Forgot password?
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                py: 1.7,
                borderRadius: "14px",
                fontSize: 16,
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#6366F1,#06B6D4)",
                boxShadow:
                  "0 12px 25px rgba(79,70,229,.22)",

                "&:hover": {
                  background:
                    "linear-gradient(90deg,#4F46E5,#0891B2)",
                  transform: "translateY(-1px)",
                  boxShadow:
                    "0 15px 30px rgba(79,70,229,.28)",
                },

                transition: "all .2s ease",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Divider sx={{ my: 1 }}>
              OR
            </Divider>

            <Button
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: "14px",
                color: "#111827",
                borderColor: "#E2E8F0",
                fontWeight: 700,
              }}
            >
              Continue with Google
            </Button>

          </Stack>
        </Box>

        <Typography
          align="center"
          sx={{
            mt: 4,
            color: "#64748B",
          }}
        >
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="none"
            sx={{
              fontWeight: 800,
              color: "#4F46E5",
            }}
          >
            Create an account
          </Link>
        </Typography>

        <Typography
          align="center"
          variant="caption"
          sx={{
            display: "block",
            mt: 3,
            color: "#94A3B8",
          }}
        >
          © 2026 ParamMart · Secure shopping experience
        </Typography>
      </CardContent>
    </Card>
  );
}