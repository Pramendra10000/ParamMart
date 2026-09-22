import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { getMyOrders } from "../../api/orderApi";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      console.log("MY ORDERS RESPONSE:", response);

      const orderData = response?.data ?? [];

      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error("FAILED TO LOAD ORDERS:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";

      case "CONFIRMED":
        return "info";

      case "PROCESSING":
        return "info";

      case "SHIPPED":
        return "primary";

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">
            Loading your orders...
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>

        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
          >
            My Orders
          </Typography>

          <Typography color="text.secondary">
            View and track your ParamMart orders.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!error && orders.length === 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ py: 8 }}>
              <Stack alignItems="center" spacing={2}>
                <ShoppingBagRoundedIcon
                  sx={{
                    fontSize: 64,
                    color: "text.secondary",
                  }}
                />

                <Typography variant="h6" fontWeight={700}>
                  You haven't placed any orders yet.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate("/products")}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Start Shopping
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {orders.map((order) => (
          <Card
            key={order.id}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      Order #{order.id}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {order.orderedAt
                        ? new Date(order.orderedAt).toLocaleString(
                            "en-IN"
                          )
                        : "Date unavailable"}
                    </Typography>
                  </Box>

                  <Chip
                    label={order.status || "UNKNOWN"}
                    color={getStatusColor(order.status)}
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                  {order.orderItems?.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          fontWeight={600}
                          noWrap
                        >
                          {item.productName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Qty: {item.quantity} × ₹
                          {Number(item.price).toLocaleString("en-IN")}
                        </Typography>
                      </Box>

                      <Typography fontWeight={700}>
                        ₹
                        {Number(item.totalPrice).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {order.totalItems} item
                      {order.totalItems !== 1 ? "s" : ""}
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      ₹
                      {Number(order.totalAmount).toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() =>
                      navigate(`/orders/${order.id}`)
                    }
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    View Details
                  </Button>
                </Stack>

              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}