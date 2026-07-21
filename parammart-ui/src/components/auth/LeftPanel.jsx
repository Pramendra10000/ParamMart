import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AppLogo from "../common/AppLogo";

const features = [
  "Product Management",
  "Inventory Tracking",
  "Category & Brand Management",
  "Customer & Orders",
  "Reports & Analytics",
];

export default function LeftPanel() {
  return (
    <Box
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <AppLogo />

      <Typography variant="h3" fontWeight="bold" mt={6}>
        Welcome Back! Manage your inventory, products, orders and reports from
        one place.
      </Typography>

      <Typography
        mt={3}
        sx={{
          fontSize: 18,
          opacity: 0.9,
          lineHeight: 1.8,
          maxWidth: 500,
        }}
      >
        Manage your inventory, products, orders and reports from one powerful
        ERP application.
      </Typography>

      <Stack spacing={2} mt={5}>
        {features.map((item) => (
          <Stack key={item} direction="row" spacing={2} alignItems="center">
            <CheckCircleIcon />
            <Typography>{item}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
