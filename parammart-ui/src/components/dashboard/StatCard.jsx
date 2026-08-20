import { Box, Card, CardContent, Typography } from "@mui/material";

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "22px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 20px 45px rgba(15,23,42,0.12)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(99,102,241,.12), rgba(6,182,212,.08))",
          top: -50,
          right: -40,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 900,
                color: "#0F172A",
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#94A3B8",
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,#6366F1,#06B6D4)",
              color: "white",
              boxShadow:
                "0 10px 25px rgba(79,70,229,.22)",
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontWeight: 700,
              color: "#16A34A",
            }}
          >
            ↑ {trend}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}