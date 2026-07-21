import { Box, Typography } from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

export default function AppLogo() {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Inventory2RoundedIcon color="primary" sx={{ fontSize: 48 }} />

      <Box>
        <Typography variant="h5" fontWeight="bold">
          📦 ParamMart ERP Inventory Management System
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Inventory Management System
        </Typography>
      </Box>
    </Box>
  );
}
