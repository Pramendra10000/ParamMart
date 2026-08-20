import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { useAuth } from "../../context/AuthContext";

export default function AppHeader({ onMenuClick }) {
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleAccountClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "#111827",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 72,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          gap: 2,
        }}
      >

        {/* =====================================================
            Mobile Menu
        ===================================================== */}

        <IconButton
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>


        {/* =====================================================
            Logo
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg,#4F46E5,#06B6D4)",

              color: "#fff",
              boxShadow:
                "0 8px 20px rgba(79,70,229,.25)",
            }}
          >
            <Inventory2RoundedIcon />
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography
              fontWeight={900}
              sx={{
                fontSize: {
                  sm: 18,
                  md: 20,
                },
                lineHeight: 1,
              }}
            >
              ParamMart
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Smart Shopping
            </Typography>
          </Box>
        </Box>


        {/* =====================================================
            Search
        ===================================================== */}

        <Box
          sx={{
            flex: 1,
            maxWidth: 620,
            mx: {
              xs: 0,
              md: 3,
            },

            display: {
              xs: "none",
              sm: "flex",
            },

            alignItems: "center",

            background: "#F1F5F9",

            borderRadius: 3,

            px: 2,

            height: 44,

            transition: "all .2s ease",

            "&:focus-within": {
              background: "#fff",
              boxShadow:
                "0 0 0 2px rgba(79,70,229,.15)",
            },
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "text.secondary",
              mr: 1,
            }}
          />

          <InputBase
            placeholder="Search products..."
            fullWidth
            sx={{
              fontSize: 14,
            }}
          />
        </Box>


        {/* =====================================================
            Actions
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.5,
              sm: 1,
            },
            ml: "auto",
          }}
        >

          {/* Wishlist */}

          <Tooltip title="Wishlist">
            <IconButton
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
              }}
            >
              <Badge
                badgeContent={0}
                color="error"
              >
                <FavoriteBorderRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>


          {/* Notifications */}

          <Tooltip title="Notifications">
            <IconButton
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
              }}
            >
              <Badge
                badgeContent={0}
                color="error"
              >
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>


          {/* Cart */}

          <Tooltip title="Shopping Cart">
            <IconButton>
              <Badge
                badgeContent={0}
                color="primary"
              >
                <ShoppingCartRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>


          {/* Account */}

          <Tooltip title="Account">
            <IconButton
              onClick={handleAccountClick}
              sx={{
                ml: {
                  xs: 0,
                  sm: 0.5,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: 15,
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg,#4F46E5,#06B6D4)",
                }}
              >
                P
              </Avatar>
            </IconButton>
          </Tooltip>

        </Box>


        {/* =====================================================
            Account Menu
        ===================================================== */}

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleAccountClose}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 210,
                borderRadius: 3,
                boxShadow:
                  "0 15px 40px rgba(15,23,42,.15)",
              },
            },
          }}
        >

          <MenuItem onClick={handleAccountClose}>
            <PersonRoundedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            My Profile
          </MenuItem>

          <MenuItem onClick={handleAccountClose}>
            <ShoppingCartRoundedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            My Orders
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <LogoutRoundedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Logout
          </MenuItem>

        </Menu>

      </Toolbar>


      {/* =====================================================
          Mobile Search
      ===================================================== */}

      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          px: 2,
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 42,
            display: "flex",
            alignItems: "center",
            background: "#F1F5F9",
            borderRadius: 3,
            px: 1.5,
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "text.secondary",
              mr: 1,
            }}
          />

          <InputBase
            placeholder="Search products..."
            fullWidth
          />
        </Box>
      </Box>

    </AppBar>
  );
}