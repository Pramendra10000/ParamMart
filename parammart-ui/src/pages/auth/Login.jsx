import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";

import LeftPanel from "../../components/auth/LeftPanel";
import LoginCard from "../../components/auth/LoginCard";

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2563EB,#4F46E5)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <LeftPanel />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
            <LoginCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
