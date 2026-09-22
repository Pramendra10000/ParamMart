import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const orderId = order?.id;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 9 } }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 7 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">

            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "success.light",
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 58,
                  color: "success.main",
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                gutterBottom
              >
                Order Placed Successfully!
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
              >
                Thank you for shopping with ParamMart.
                Your order has been confirmed.
              </Typography>
            </Box>

            {orderId && (
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Order ID
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  #{orderId}
                </Typography>
              </Box>
            )}

            {order?.totalAmount != null && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Order Total
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </Typography>
              </Box>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              width="100%"
              justifyContent="center"
              sx={{ pt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<ReceiptLongRoundedIcon />}
                onClick={() => navigate("/orders")}
                sx={{
                  minWidth: 190,
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View My Orders
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ShoppingBagRoundedIcon />}
                onClick={() => navigate("/products")}
                sx={{
                  minWidth: 190,
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}