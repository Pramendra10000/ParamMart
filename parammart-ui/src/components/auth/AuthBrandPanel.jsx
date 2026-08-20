import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const features = [
  {
    icon: <ShoppingBagRoundedIcon />,
    title: "Discover products",
    description: "Explore products across multiple categories.",
  },
  {
    icon: <LocalShippingRoundedIcon />,
    title: "Simple shopping",
    description: "Manage your cart and orders with ease.",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "Secure experience",
    description: "Your account and shopping experience stay protected.",
  },
];

export default function AuthBrandPanel() {
  return (
    <Box
      sx={{
        maxWidth: 650,
        animation: "fadeUp .7s ease",
        "@keyframes fadeUp": {
          from: {
            opacity: 0,
            transform: "translateY(20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Logo */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #6366F1, #06B6D4)",
            color: "white",
            boxShadow: "0 12px 30px rgba(37,99,235,.25)",
          }}
        >
          <StorefrontRoundedIcon sx={{ fontSize: 30 }} />
        </Box>

        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: "#111827",
              letterSpacing: "-.5px",
            }}
          >
            ParamMart
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              letterSpacing: 1,
            }}
          >
            SHOP SMARTER
          </Typography>
        </Box>
      </Stack>

      {/* Badge */}
      <Chip
        label="PREMIUM SHOPPING EXPERIENCE"
        sx={{
          mt: 4,
          px: 1,
          borderRadius: "999px",
          color: "#4F46E5",
          background: "rgba(99,102,241,.08)",
          border: "1px solid rgba(99,102,241,.18)",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: 1,
        }}
      />

      {/* Heading */}
      <Typography
        sx={{
          mt: 4,
          fontSize: {
            xs: 42,
            sm: 52,
            md: 58,
            lg: 68,
          },
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: "-3px",
          color: "#111827",
        }}
      >
        Everything you need.
      </Typography>

      <Typography
        sx={{
          fontSize: {
            xs: 42,
            sm: 52,
            md: 58,
            lg: 68,
          },
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: "-3px",
          background:
            "linear-gradient(90deg,#6366F1,#06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        All in one place.
      </Typography>

      <Typography
        sx={{
          mt: 3,
          maxWidth: 570,
          fontSize: {
            xs: 16,
            md: 18,
          },
          lineHeight: 1.8,
          color: "#64748B",
        }}
      >
        Welcome to ParamMart — your modern shopping destination
        for smartphones, laptops, audio devices, gaming products
        and everyday technology.
      </Typography>

      {/* Features */}
      <Stack spacing={2.5} mt={5}>
        {features.map((feature) => (
          <Stack
            key={feature.title}
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366F1",
                background: "rgba(99,102,241,.08)",
                border: "1px solid rgba(99,102,241,.12)",
                flexShrink: 0,
              }}
            >
              {feature.icon}
            </Box>

            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Typography fontWeight={800}>
                  {feature.title}
                </Typography>

                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "#16A34A",
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  mt: 0.3,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}