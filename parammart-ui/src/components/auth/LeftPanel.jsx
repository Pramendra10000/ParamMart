import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import AppLogo from "../common/AppLogo";

const features = [
  {
    icon: ShoppingBagRoundedIcon,
    title: "Discover products",
    description: "Explore products across multiple categories.",
  },
  {
    icon: LocalShippingRoundedIcon,
    title: "Simple shopping",
    description: "Manage your cart and orders with ease.",
  },
  {
    icon: SecurityRoundedIcon,
    title: "Secure experience",
    description: "Your account and shopping experience stay protected.",
  },
];

export default function LeftPanel() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 620,
        mx: {
          xs: "auto",
          md: 0,
        },
      }}
    >
      <AppLogo />

      <Chip
        label="PREMIUM SHOPPING EXPERIENCE"
        size="small"
        sx={{
          mt: {
            xs: 4,
            md: 7,
          },

          px: 1,

          height: 30,

          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.08em",

          color: "primary.main",

          backgroundColor: "rgba(91,95,239,0.08)",

          border: "1px solid rgba(91,95,239,0.15)",

          "& .MuiChip-label": {
            px: 1,
          },
        }}
      />

      <Typography
        component="h1"
        sx={{
          mt: 3,

          fontSize: {
            xs: "2.5rem",
            sm: "3.2rem",
            md: "3.8rem",
            lg: "4.2rem",
          },

          lineHeight: 1.05,

          fontWeight: 800,

          letterSpacing: "-0.045em",

          color: "text.primary",
        }}
      >
        Everything you need.
        <Box
          component="span"
          sx={{
            display: "block",
            background:
              "linear-gradient(90deg, #5B5FEF, #06B6D4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          All in one place.
        </Box>
      </Typography>

      <Typography
        sx={{
          mt: 3,

          maxWidth: 540,

          fontSize: {
            xs: "0.95rem",
            sm: "1.05rem",
          },

          lineHeight: 1.8,

          color: "text.secondary",
        }}
      >
        Welcome to ParamMart — your modern shopping destination for
        smartphones, laptops, audio devices, gaming products and
        everyday technology.
      </Typography>

      <Stack spacing={2} mt={5}>
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Stack
              key={feature.title}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  minWidth: 42,

                  borderRadius: "12px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "rgba(91,95,239,0.08)",

                  border: "1px solid rgba(91,95,239,0.12)",
                }}
              >
                <Icon
                  sx={{
                    fontSize: 21,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.92rem",
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {feature.description}
                </Typography>
              </Box>

              <CheckCircleRoundedIcon
                sx={{
                  ml: "auto",
                  fontSize: 19,
                  color: "success.main",
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}