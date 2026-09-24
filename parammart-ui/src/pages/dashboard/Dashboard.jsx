import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

import { useAuth } from "../../context/AuthContext";

import CustomerDashboard from "./CustomerDashboard";


export default function Dashboard() {

  const {
    user,
    hasRole,
  } = useAuth();


  // =========================================================
  // CUSTOMER
  // =========================================================

  if (hasRole("CUSTOMER")) {
    return <CustomerDashboard />;
  }


  // =========================================================
  // ADMIN
  // =========================================================

  if (hasRole("ADMIN")) {

    return (
      <RoleDashboard
        title="Admin Dashboard"
        description="Manage ParamMart operations, products, users, inventory and orders."
        role="ADMIN"
        icon={<AdminPanelSettingsRoundedIcon />}
      />
    );
  }


  // =========================================================
  // MANAGER
  // =========================================================

  if (hasRole("MANAGER")) {

    return (
      <RoleDashboard
        title="Manager Dashboard"
        description="Manage products, inventory, orders and business operations."
        role="MANAGER"
        icon={<ManageAccountsRoundedIcon />}
      />
    );
  }


  // =========================================================
  // EMPLOYEE
  // =========================================================

  if (hasRole("EMPLOYEE")) {

    return (
      <RoleDashboard
        title="Employee Dashboard"
        description="Access the ParamMart features available to you."
        role="EMPLOYEE"
        icon={<BadgeRoundedIcon />}
      />
    );
  }


  // =========================================================
  // UNKNOWN ROLE
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: 5,
      }}
    >
      <Container maxWidth="xl">

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(15,23,42,.08)",
          }}
        >
          <CardContent sx={{ p: 4 }}>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              Welcome to ParamMart
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Your account role could not be identified.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Logged-in user: {user?.email || "Unknown"}
            </Typography>

          </CardContent>
        </Card>

      </Container>
    </Box>
  );
}


// =============================================================
// ROLE DASHBOARD
// =============================================================

function RoleDashboard({
  title,
  description,
  role,
  icon,
}) {

  const {
    user,
  } = useAuth();


  return (
    <Box
      sx={{
        minHeight: "100%",
        background: "#F5F7FA",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >

      <Container maxWidth="xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box sx={{ mb: 4 }}>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.2rem",
                md: "2.5rem",
              },
            }}
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: 700,
            }}
          >
            {description}
          </Typography>

        </Box>


        {/* =====================================================
            USER WELCOME CARD
        ===================================================== */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#4F46E5,#06B6D4)",
            color: "#FFFFFF",
            boxShadow:
              "0 18px 45px rgba(79,70,229,.20)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgba(255,255,255,.18)",
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>

              <Box sx={{ minWidth: 0 }}>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Welcome,{" "}
                  {user?.firstName || "User"}!
                </Typography>

                <Typography
                  sx={{
                    opacity: 0.85,
                    mt: 0.3,
                  }}
                >
                  {user?.email}
                </Typography>

              </Box>

              <Chip
                label={role}
                sx={{
                  ml: "auto",
                  color: "#FFFFFF",
                  background:
                    "rgba(255,255,255,.18)",
                  fontWeight: 800,
                }}
              />

            </Box>

          </CardContent>

        </Card>


        {/* =====================================================
            COMING DASHBOARD MODULES
        ===================================================== */}

        <Grid
          container
          spacing={3}
        >

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >

            <DashboardCard
              title="Products"
              description="Manage and view products."
              icon={<ShoppingBagRoundedIcon />}
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >

            <DashboardCard
              title="Inventory"
              description="Monitor stock and inventory."
              icon={<ShoppingBagRoundedIcon />}
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >

            <DashboardCard
              title="Orders"
              description="View and manage orders."
              icon={<ShoppingBagRoundedIcon />}
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >

            <DashboardCard
              title="Account"
              description="View your account details."
              icon={<BadgeRoundedIcon />}
            />

          </Grid>

        </Grid>

      </Container>

    </Box>
  );
}


// =============================================================
// DASHBOARD CARD
// =============================================================

function DashboardCard({
  title,
  description,
  icon,
}) {

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        transition:
          "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 15px 35px rgba(15,23,42,.10)",
        },
      }}
    >

      <CardContent sx={{ p: 3 }}>

        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg,rgba(79,70,229,.12),rgba(6,182,212,.10))",
            color: "#4F46E5",
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.8,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

      </CardContent>

    </Card>
  );
}