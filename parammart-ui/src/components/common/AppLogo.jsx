import { Box, Typography } from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

export default function AppLogo({ light = false }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: light
            ? "rgba(255,255,255,0.12)"
            : "linear-gradient(135deg, #5B5FEF, #06B6D4)",

          border: light
            ? "1px solid rgba(255,255,255,0.18)"
            : "none",

          boxShadow: light
            ? "0 8px 25px rgba(0,0,0,0.12)"
            : "0 10px 25px rgba(91,95,239,0.25)",
        }}
      >
        <StorefrontRoundedIcon
          sx={{
            color: "#FFFFFF",
            fontSize: 27,
          }}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: {
              xs: "1.35rem",
              sm: "1.5rem",
            },
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: light ? "#FFFFFF" : "text.primary",
          }}
        >
          ParamMart
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: light
              ? "rgba(255,255,255,0.65)"
              : "text.secondary",
          }}
        >
          Shop smarter
        </Typography>
      </Box>
    </Box>
  );
}