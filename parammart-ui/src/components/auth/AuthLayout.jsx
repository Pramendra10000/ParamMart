import { Box, Container, Grid } from "@mui/material";
import AuthBrandPanel from "./AuthBrandPanel";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 10% 10%, rgba(99,102,241,.18), transparent 30%), radial-gradient(circle at 90% 90%, rgba(14,165,233,.15), transparent 30%), #f7f9fc",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(37,99,235,.12), rgba(79,70,229,.04))",
          top: -180,
          left: -180,
          filter: "blur(2px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(6,182,212,.12), rgba(37,99,235,.03))",
          bottom: -150,
          right: -120,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            sm: 5,
            md: 6,
          },
        }}
      >
        <Grid
          container
          spacing={{
            xs: 4,
            md: 8,
            lg: 12,
          }}
          alignItems="center"
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <AuthBrandPanel />
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            display="flex"
            justifyContent={{
              xs: "center",
              md: "flex-end",
            }}
          >
            {children}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}