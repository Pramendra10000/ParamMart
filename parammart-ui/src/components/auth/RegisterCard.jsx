import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import PasswordField from "./PasswordField";

export default function RegisterCard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agree) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      console.log("Registration:", form);

      navigate("/login");
    }, 800);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 520,
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
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            color: "#111827",
            letterSpacing: "-1px",
          }}
        >
          Create your account
        </Typography>

        <Typography
          sx={{
            mt: 1,
            mb: 4,
            color: "#64748B",
          }}
        >
          Join ParamMart and start shopping smarter.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                label="First name"
                value={form.firstName}
                onChange={updateField("firstName")}
                required
              />

              <TextField
                label="Last name"
                value={form.lastName}
                onChange={updateField("lastName")}
                required
              />
            </Stack>

            <TextField
              label="Email address"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              required
            />

            <PasswordField
              label="Password"
              value={form.password}
              onChange={updateField("password")}
            />

            <PasswordField
              label="Confirm password"
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    component={RouterLink}
                    to="#"
                    underline="none"
                    sx={{ fontWeight: 700 }}
                  >
                    Terms & Conditions
                  </Link>
                </Typography>
              }
            />

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
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#6366F1,#06B6D4)",
              }}
            >
              Create account
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
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              fontWeight: 800,
              color: "#4F46E5",
            }}
          >
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}