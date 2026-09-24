import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { CircularProgress, Box } from "@mui/material";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();


  // =========================================================
  // AUTHENTICATION STATE IS BEING CHECKED
  // =========================================================

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F7FA",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  // =========================================================
  // USER IS NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  // =========================================================
  // USER IS AUTHENTICATED
  // =========================================================

  return <Outlet />;
}