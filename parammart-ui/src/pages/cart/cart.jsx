import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartItemCount,
    cartSubtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { showSuccess } = useToast();

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);

    showSuccess(`${productName} removed from cart.`);
  };

  const handleClearCart = () => {
    clearCart();

    showSuccess("Cart cleared successfully.");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    // Checkout will be implemented next.
    console.log("Proceed to checkout");
  };

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#F5F7FA",
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 420, sm: 480 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
                  mb: 3,
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 44,
                    color: "#2563EB",
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  fontSize: {
                    xs: "1.7rem",
                    sm: "2rem",
                  },
                }}
              >
                Your cart is empty
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.2,
                  maxWidth: 480,
                  lineHeight: 1.7,
                }}
              >
                Looks like you haven't added anything to your
                cart yet. Explore our products and find
                something you love.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={handleContinueShopping}
                sx={{
                  mt: 4,
                  px: 4,
                  py: 1.4,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }

  // =========================================================
  // CART
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F5F7FA",
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                  md: "2.4rem",
                },
              }}
            >
              Shopping Cart
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.7 }}
            >
              {cartItemCount}{" "}
              {cartItemCount === 1 ? "item" : "items"} in
              your cart
            </Typography>
          </Box>

          <Button
            variant="text"
            color="error"
            onClick={handleClearCart}
            sx={{
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Clear Cart
          </Button>
        </Box>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1fr) 380px",
            },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          {/* ================================================= */}
          {/* CART ITEMS */}
          {/* ================================================= */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, sm: 3 },
                "&:last-child": {
                  pb: { xs: 2, sm: 3 },
                },
              }}
            >
              <Stack spacing={0}>
                {cartItems.map((item, index) => {
                  const { product, quantity } = item;

                  const imageUrl =
                    product.primaryImageUrl || "";

                  const itemTotal =
                    Number(product.price || 0) * quantity;

                  return (
                    <Box key={product.id}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "80px minmax(0, 1fr)",
                            sm: "110px minmax(0, 1fr) auto",
                          },
                          gap: {
                            xs: 2,
                            sm: 2.5,
                          },
                          py: index === 0 ? 0 : 2.5,
                          pb:
                            index ===
                            cartItems.length - 1
                              ? 0
                              : 2.5,
                        }}
                      >
                        {/* PRODUCT IMAGE */}

                        <Box
                          sx={{
                            width: {
                              xs: 80,
                              sm: 110,
                            },
                            height: {
                              xs: 80,
                              sm: 110,
                            },
                            borderRadius: 3,
                            background: "#F8FAFC",
                            border: "1px solid",
                            borderColor:
                              "rgba(15,23,42,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {imageUrl ? (
                            <Box
                              component="img"
                              src={imageUrl}
                              alt={product.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                p: 1,
                              }}
                            />
                          ) : (
                            <ShoppingBagOutlinedIcon
                              sx={{
                                fontSize: 38,
                                color: "text.disabled",
                              }}
                            />
                          )}
                        </Box>

                        {/* PRODUCT INFO */}

                        <Box
                          sx={{
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            fontWeight={800}
                            sx={{
                              fontSize: {
                                xs: 14,
                                sm: 16,
                              },
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              fontSize: 12,
                            }}
                          >
                            SKU: {product.sku}
                          </Typography>

                          {product.brandName && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.3,
                                fontSize: 12,
                              }}
                            >
                              Brand: {product.brandName}
                            </Typography>
                          )}

                          <Typography
                            fontWeight={800}
                            sx={{
                              mt: 1,
                              fontSize: {
                                xs: 15,
                                sm: 17,
                              },
                            }}
                          >
                            {formatPrice(product.price)}
                          </Typography>

                          {/* QUANTITY + REMOVE */}

                          <Box
                            sx={{
                              mt: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "space-between",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid",
                                borderColor:
                                  "rgba(15,23,42,0.15)",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  decreaseQuantity(
                                    product.id
                                  )
                                }
                                disabled={quantity <= 1}
                              >
                                <RemoveRoundedIcon fontSize="small" />
                              </IconButton>

                              <Typography
                                sx={{
                                  minWidth: 34,
                                  textAlign: "center",
                                  fontWeight: 800,
                                  fontSize: 14,
                                }}
                              >
                                {quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  increaseQuantity(
                                    product.id
                                  )
                                }
                                disabled={
                                  Number(product.stock) > 0 &&
                                  quantity >=
                                    Number(product.stock)
                                }
                              >
                                <AddRoundedIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Button
                              size="small"
                              color="error"
                              startIcon={
                                <DeleteOutlineRoundedIcon />
                              }
                              onClick={() =>
                                handleRemove(
                                  product.id,
                                  product.name
                                )
                              }
                              sx={{
                                textTransform: "none",
                                fontWeight: 700,
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Box>

                        {/* ITEM TOTAL */}

                        <Box
                          sx={{
                            display: {
                              xs: "none",
                              sm: "flex",
                            },
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            minWidth: 120,
                          }}
                        >
                          <Typography
                            fontWeight={900}
                            sx={{
                              fontSize: 17,
                            }}
                          >
                            {formatPrice(itemTotal)}
                          </Typography>
                        </Box>
                      </Box>

                      {index <
                        cartItems.length - 1 && (
                        <Divider />
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================================= */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              position: {
                lg: "sticky",
              },
              top: {
                lg: 90,
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography
                variant="h6"
                fontWeight={900}
              >
                Order Summary
              </Typography>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    Items ({cartItemCount})
                  </Typography>

                  <Typography fontWeight={700}>
                    {formatPrice(cartSubtotal)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    Delivery
                  </Typography>

                  <Typography
                    fontWeight={700}
                    sx={{ color: "#16A34A" }}
                  >
                    FREE
                  </Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Total
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    {formatPrice(cartSubtotal)}
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: "none",
                  fontSize: 16,
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={handleContinueShopping}
                sx={{
                  mt: 1.5,
                  py: 1.3,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Continue Shopping
              </Button>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  background: "#F8FAFC",
                  display: "flex",
                  gap: 1.2,
                  alignItems: "flex-start",
                }}
              >
                <LockRoundedIcon
                  sx={{
                    fontSize: 20,
                    color: "#16A34A",
                    mt: 0.1,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: 12,
                  }}
                >
                  Your shopping cart is saved securely on
                  this device.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}