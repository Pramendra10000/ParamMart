import { useState } from "react";
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
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card
      sx={{
        width: 480,
        maxWidth: "100%",
        borderRadius: 5,
      }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography variant="h4" fontWeight="bold" align="center">
          Sign In
        </Typography>

        <Typography align="center" color="text.secondary" mb={4}>
          Login to your account
        </Typography>

        <Stack spacing={3}>
          <TextField label="👤Username / Email" />

          <TextField
            label="🔒Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel control={<Checkbox />} label="Remember Me" />

            <Link href="#" underline="none">
              Forgot Password?
            </Link>
          </Stack>

          <Button
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            → Sign In
          </Button>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            mt: 5,
            borderTop: "1px solid #e0e0e0",
            pt: 3,
          }}
        >
          © 2026 ParamMart ERP
          <br />
          Version 1.0.0
        </Typography>
      </CardContent>
    </Card>
  );
}
