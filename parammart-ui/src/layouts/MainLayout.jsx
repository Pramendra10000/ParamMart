import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import AppHeader from "../components/common/AppHeader";

const drawerWidth = 250;
const headerHeight = 72;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <HomeRoundedIcon />,
    },
    {
      label: "Products",
      path: "/products",
      icon: <ShoppingBagRoundedIcon />,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: <FavoriteRoundedIcon />,
    },
    {
      label: "Cart",
      path: "/cart",
      icon: <ShoppingCartRoundedIcon />,
    },
    {
      label: "My Orders",
      path: "/orders",
      icon: <ReceiptLongRoundedIcon />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <PersonRoundedIcon />,
    },
  ];

  /*
   * ============================================================
   * SIDEBAR CONTENT
   * ============================================================
   */

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          height: headerHeight,
          minHeight: headerHeight,
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <Typography
          fontWeight={900}
          fontSize={21}
          sx={{
            background:
              "linear-gradient(90deg,#4F46E5,#06B6D4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ParamMart
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}

      <List
        sx={{
          px: 1.5,
          py: 2,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerClose}
            sx={{
              borderRadius: 2.5,
              mb: 0.5,

              color: "#475569",
              textDecoration: "none",

              "& .MuiListItemIcon-root": {
                color: "#64748B",
              },

              "&:hover": {
                background: "#F8FAFC",
              },

              "&.active": {
                background:
                  "linear-gradient(90deg,rgba(79,70,229,.12),rgba(6,182,212,.08))",

                color: "#4F46E5",

                "& .MuiListItemIcon-root": {
                  color: "#4F46E5",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 42,
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 700,
                fontSize: 14,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        background: "#F5F7FA",
      }}
    >
      {/* ======================================================
          FIXED HEADER
      ====================================================== */}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <AppHeader onMenuClick={handleMenuClick} />
      </Box>

      {/* ======================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: drawerWidth,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,

            boxSizing: "border-box",

            position: "fixed",

            top: headerHeight,

            left: 0,

            height: `calc(100vh - ${headerHeight}px)`,

            borderRight: "1px solid",

            borderColor: "divider",

            overflow: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ======================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ======================================================
          SCROLLABLE MAIN CONTENT
      ====================================================== */}

      <Box
        component="main"
        sx={{
          position: "fixed",

          top: headerHeight,

          left: {
            xs: 0,
            md: drawerWidth,
          },

          right: 0,

          bottom: 0,

          overflowY: "auto",

          overflowX: "hidden",

          background: "#F5F7FA",

          /*
           * Smooth scrolling
           */
          scrollBehavior: "smooth",

          /*
           * Prevent horizontal scrollbar
           */
          "&::-webkit-scrollbar": {
            width: 8,
          },

          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E1",
            borderRadius: 10,
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}