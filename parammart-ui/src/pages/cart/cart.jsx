import { Box, Button, Card, CardContent, Container, Divider, IconButton, Stack, Typography } from "@mui/material";

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
        cartLoading,
    } = useCart();

    const { showSuccess, showError } = useToast();

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        });
    };

    // =========================================================
    // REMOVE ITEM
    // =========================================================

    const handleRemove = async (productId, productName) => {
        try {
            await removeFromCart(productId);
            showSuccess(`${productName} removed from cart.`);
        } catch (error) {
            console.error("REMOVE ITEM ERROR:", error);

            showError(error?.response?.data?.message || error?.message || "Unable to remove item.");
        }
    };

    // =========================================================
    // CLEAR CART
    // =========================================================

    const handleClearCart = async () => {
        try {
            await clearCart();
            showSuccess("Cart cleared successfully.");
        } catch (error) {
            console.error("CLEAR CART ERROR:", error);

            showError(error?.response?.data?.message || error?.message || "Unable to clear cart.");
        }
    };

    // =========================================================
    // INCREASE
    // =========================================================

    const handleIncrease = async (productId) => {
        try {
            await increaseQuantity(productId);
        } catch (error) {
            console.error("INCREASE QUANTITY ERROR:", error);

            showError(error?.response?.data?.message || error?.message || "Unable to increase quantity.");
        }
    };

    // =========================================================
    // DECREASE
    // =========================================================

    const handleDecrease = async (productId) => {
        try {
            await decreaseQuantity(productId);
        } catch (error) {
            console.error("DECREASE QUANTITY ERROR:", error);

            showError(error?.response?.data?.message || error?.message || "Unable to decrease quantity.");
        }
    };

    // =========================================================
    // NAVIGATION
    // =========================================================

    const handleContinueShopping = () => {
        navigate("/products");
    };

   const handleCheckout = () => {
    console.log("1. CHECKOUT BUTTON CLICKED");

    console.log("2. NAVIGATE FUNCTION:", navigate);

    navigate("/checkout");

    console.log("3. NAVIGATE CALLED");
};

    // =========================================================
    // EMPTY CART
    // =========================================================

    if (!cartLoading && cartItems.length === 0) {
        return (
            <Box
                sx={{
                    minHeight: "100%",
                    backgroundColor: "#F5F7FA",
                    py: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                        lg: 6,
                    },
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: {
                                xs: 3,
                                sm: 4,
                            },
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                minHeight: {
                                    xs: 380,
                                    sm: 430,
                                    md: 460,
                                },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                px: {
                                    xs: 2.5,
                                    sm: 4,
                                    md: 6,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: {
                                        xs: 76,
                                        sm: 86,
                                        md: 94,
                                    },
                                    height: {
                                        xs: 76,
                                        sm: 86,
                                        md: 94,
                                    },
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
                                    mb: {
                                        xs: 2.5,
                                        sm: 3,
                                    },
                                }}
                            >
                                <ShoppingBagOutlinedIcon
                                    sx={{
                                        fontSize: {
                                            xs: 36,
                                            sm: 42,
                                            md: 46,
                                        },
                                        color: "#2563EB",
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h4"
                                fontWeight={900}
                                sx={{
                                    fontSize: {
                                        xs: "1.55rem",
                                        sm: "1.9rem",
                                        md: "2.2rem",
                                    },
                                }}
                            >
                                Your cart is empty
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1.2,
                                    maxWidth: 500,
                                    lineHeight: 1.7,
                                    fontSize: {
                                        xs: 13,
                                        sm: 14,
                                        md: 15,
                                    },
                                }}
                            >
                                Looks like you haven't added anything to your cart yet. Explore our products and find
                                something you love.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingBagOutlinedIcon />}
                                onClick={handleContinueShopping}
                                sx={{
                                    mt: 3.5,
                                    px: {
                                        xs: 3,
                                        sm: 4,
                                    },
                                    py: 1.35,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: {
                                        xs: 14,
                                        sm: 15,
                                    },
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
    // LOADING
    // =========================================================

    if (cartLoading && cartItems.length === 0) {
        return (
            <Box
                sx={{
                    minHeight: "100%",
                    backgroundColor: "#F5F7FA",
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            minHeight: 420,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography color="text.secondary" fontWeight={600}>
                            Loading your cart...
                        </Typography>
                    </Box>
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
                minHeight: "100%",
                backgroundColor: "#F5F7FA",
                py: {
                    xs: 2.5,
                    sm: 3,
                    md: 4,
                    lg: 5,
                },
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    px: {
                        xs: 1.5,
                        sm: 2.5,
                        md: 3,
                        lg: 4,
                    },
                }}
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <Box
                    sx={{
                        mb: {
                            xs: 2.5,
                            sm: 3,
                            md: 4,
                        },
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
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{
                                fontSize: {
                                    xs: "1.55rem",
                                    sm: "1.9rem",
                                    md: "2.2rem",
                                    lg: "2.35rem",
                                },
                                lineHeight: 1.2,
                            }}
                        >
                            Shopping Cart
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.7,
                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                    md: 15,
                                },
                            }}
                        >
                            {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your cart
                        </Typography>
                    </Box>

                    <Button
                        variant="text"
                        color="error"
                        onClick={handleClearCart}
                        disabled={cartLoading}
                        sx={{
                            fontWeight: 700,
                            textTransform: "none",
                            alignSelf: {
                                xs: "flex-start",
                                sm: "center",
                            },
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
                            lg: "minmax(0, 1fr) minmax(300px, 360px)",
                            xl: "minmax(0, 1fr) minmax(320px, 380px)",
                        },
                        gap: {
                            xs: 2.5,
                            sm: 3,
                            md: 3.5,
                            lg: 4,
                        },
                        alignItems: "start",
                    }}
                >
                    {/* ================================================= */}
                    {/* CART ITEMS */}
                    {/* ================================================= */}

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: {
                                xs: 3,
                                sm: 4,
                            },
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                            minWidth: 0,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 1.5,
                                    sm: 2.5,
                                    md: 3,
                                },
                                "&:last-child": {
                                    pb: {
                                        xs: 1.5,
                                        sm: 2.5,
                                        md: 3,
                                    },
                                },
                            }}
                        >
                            <Stack spacing={0}>
                                {cartItems.map((item, index) => {
                                    const { product, quantity } = item;

                                    const imageUrl = product.primaryImageUrl || "";

                                    const itemTotal = Number(item.price || product.price || 0) * quantity;

                                    const stock = Number(product.stock);

                                    return (
                                        <Box key={product.id}>
                                            <Box
                                                sx={{
                                                    display: "grid",

                                                    /*
                                                     * Mobile:
                                                     * image + content
                                                     *
                                                     * Tablet:
                                                     * image + content + total
                                                     *
                                                     * Laptop/Desktop:
                                                     * same layout but wider
                                                     */
                                                    gridTemplateColumns: {
                                                        xs: "72px minmax(0, 1fr)",
                                                        sm: "90px minmax(0, 1fr) auto",
                                                        md: "105px minmax(0, 1fr) auto",
                                                    },

                                                    gap: {
                                                        xs: 1.5,
                                                        sm: 2,
                                                        md: 2.5,
                                                    },

                                                    py:
                                                        index === 0
                                                            ? 0
                                                            : {
                                                                  xs: 2,
                                                                  sm: 2.5,
                                                                  md: 3,
                                                              },

                                                    pb:
                                                        index === cartItems.length - 1
                                                            ? 0
                                                            : {
                                                                  xs: 2,
                                                                  sm: 2.5,
                                                                  md: 3,
                                                              },

                                                    minWidth: 0,
                                                }}
                                            >
                                                {/* ================================================= */}
                                                {/* PRODUCT IMAGE */}
                                                {/* ================================================= */}

                                                <Box
                                                    sx={{
                                                        width: {
                                                            xs: 72,
                                                            sm: 90,
                                                            md: 105,
                                                        },
                                                        height: {
                                                            xs: 72,
                                                            sm: 90,
                                                            md: 105,
                                                        },
                                                        borderRadius: {
                                                            xs: 2.5,
                                                            sm: 3,
                                                        },
                                                        backgroundColor: "#F8FAFC",
                                                        border: "1px solid",
                                                        borderColor: "rgba(15,23,42,0.08)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        overflow: "hidden",
                                                        flexShrink: 0,
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
                                                                p: {
                                                                    xs: 0.75,
                                                                    sm: 1,
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <ShoppingBagOutlinedIcon
                                                            sx={{
                                                                fontSize: {
                                                                    xs: 30,
                                                                    sm: 36,
                                                                    md: 40,
                                                                },
                                                                color: "text.disabled",
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                {/* ================================================= */}
                                                {/* PRODUCT INFO */}
                                                {/* ================================================= */}

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
                                                                xs: 13.5,
                                                                sm: 15,
                                                                md: 16,
                                                            },
                                                            lineHeight: 1.4,
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: {
                                                                xs: 2,
                                                                sm: 2,
                                                            },
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>

                                                    {product.sku && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 0.45,
                                                                fontSize: {
                                                                    xs: 10.5,
                                                                    sm: 11.5,
                                                                    md: 12,
                                                                },
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            SKU: {product.sku}
                                                        </Typography>
                                                    )}

                                                    {product.brandName && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 0.25,
                                                                fontSize: {
                                                                    xs: 10.5,
                                                                    sm: 11.5,
                                                                    md: 12,
                                                                },
                                                            }}
                                                        >
                                                            Brand: {product.brandName}
                                                        </Typography>
                                                    )}

                                                    <Typography
                                                        fontWeight={800}
                                                        sx={{
                                                            mt: {
                                                                xs: 0.7,
                                                                sm: 1,
                                                            },
                                                            fontSize: {
                                                                xs: 14,
                                                                sm: 16,
                                                                md: 17,
                                                            },
                                                        }}
                                                    >
                                                        {formatPrice(item.price || product.price)}
                                                    </Typography>

                                                    {/* ================================================= */}
                                                    {/* QUANTITY + REMOVE */}
                                                    {/* ================================================= */}

                                                    <Box
                                                        sx={{
                                                            mt: {
                                                                xs: 1.1,
                                                                sm: 1.5,
                                                            },
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            gap: 1,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                border: "1px solid",
                                                                borderColor: "rgba(15,23,42,0.15)",
                                                                borderRadius: 2,
                                                                overflow: "hidden",
                                                                backgroundColor: "#FFFFFF",
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDecrease(product.id)}
                                                                disabled={quantity <= 1 || cartLoading}
                                                                sx={{
                                                                    width: {
                                                                        xs: 30,
                                                                        sm: 34,
                                                                    },
                                                                    height: {
                                                                        xs: 30,
                                                                        sm: 34,
                                                                    },
                                                                    borderRadius: 0,
                                                                }}
                                                            >
                                                                <RemoveRoundedIcon
                                                                    sx={{
                                                                        fontSize: {
                                                                            xs: 16,
                                                                            sm: 18,
                                                                        },
                                                                    }}
                                                                />
                                                            </IconButton>

                                                            <Typography
                                                                sx={{
                                                                    minWidth: {
                                                                        xs: 30,
                                                                        sm: 34,
                                                                    },
                                                                    textAlign: "center",
                                                                    fontWeight: 800,
                                                                    fontSize: {
                                                                        xs: 13,
                                                                        sm: 14,
                                                                    },
                                                                }}
                                                            >
                                                                {quantity}
                                                            </Typography>

                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleIncrease(product.id)}
                                                                disabled={
                                                                    cartLoading || (stock > 0 && quantity >= stock)
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs: 30,
                                                                        sm: 34,
                                                                    },
                                                                    height: {
                                                                        xs: 30,
                                                                        sm: 34,
                                                                    },
                                                                    borderRadius: 0,
                                                                }}
                                                            >
                                                                <AddRoundedIcon
                                                                    sx={{
                                                                        fontSize: {
                                                                            xs: 16,
                                                                            sm: 18,
                                                                        },
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </Box>

                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            startIcon={
                                                                <DeleteOutlineRoundedIcon
                                                                    sx={{
                                                                        fontSize: {
                                                                            xs: 17,
                                                                            sm: 19,
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            onClick={() => handleRemove(product.id, product.name)}
                                                            disabled={cartLoading}
                                                            sx={{
                                                                textTransform: "none",
                                                                fontWeight: 700,
                                                                fontSize: {
                                                                    xs: 11.5,
                                                                    sm: 13,
                                                                },
                                                                minWidth: "auto",
                                                                px: {
                                                                    xs: 0.5,
                                                                    sm: 1,
                                                                },
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>

                                                {/* ================================================= */}
                                                {/* ITEM TOTAL */}
                                                {/* ================================================= */}

                                                <Box
                                                    sx={{
                                                        display: {
                                                            xs: "none",
                                                            sm: "flex",
                                                        },
                                                        alignItems: "flex-start",
                                                        justifyContent: "flex-end",
                                                        minWidth: {
                                                            sm: 90,
                                                            md: 105,
                                                        },
                                                        pt: 0.25,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={900}
                                                        sx={{
                                                            fontSize: {
                                                                sm: 15,
                                                                md: 16,
                                                                lg: 17,
                                                            },
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {formatPrice(itemTotal)}
                                                    </Typography>
                                                </Box>

                                                {/* ================================================= */}
                                                {/* MOBILE ITEM TOTAL */}
                                                {/* ================================================= */}

                                                <Box
                                                    sx={{
                                                        display: {
                                                            xs: "flex",
                                                            sm: "none",
                                                        },
                                                        gridColumn: "2",
                                                        justifyContent: "flex-end",
                                                        mt: -0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={900}
                                                        sx={{
                                                            fontSize: 14,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {formatPrice(itemTotal)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {index < cartItems.length - 1 && <Divider />}
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
                            borderRadius: {
                                xs: 3,
                                sm: 4,
                            },
                            border: "1px solid",
                            borderColor: "divider",

                            position: {
                                lg: "sticky",
                            },

                            top: {
                                lg: 88,
                            },

                            minWidth: 0,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                    md: 3,
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={900}
                                sx={{
                                    fontSize: {
                                        xs: 17,
                                        sm: 18,
                                        md: 20,
                                    },
                                }}
                            >
                                Order Summary
                            </Typography>

                            <Stack
                                spacing={{
                                    xs: 1.7,
                                    sm: 2,
                                }}
                                sx={{ mt: 2.5 }}
                            >
                                {/* ITEMS */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                        }}
                                    >
                                        Items ({cartItemCount})
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                        }}
                                    >
                                        {formatPrice(cartSubtotal)}
                                    </Typography>
                                </Box>

                                {/* DELIVERY */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                        }}
                                    >
                                        Delivery
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            color: "#16A34A",
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                        }}
                                    >
                                        FREE
                                    </Typography>
                                </Box>

                                <Divider />

                                {/* TOTAL */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={900}
                                        sx={{
                                            fontSize: {
                                                xs: 17,
                                                sm: 19,
                                                md: 20,
                                            },
                                        }}
                                    >
                                        Total
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight={900}
                                        sx={{
                                            fontSize: {
                                                xs: 17,
                                                sm: 19,
                                                md: 20,
                                            },
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {formatPrice(cartSubtotal)}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* CHECKOUT */}

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleCheckout}
                                disabled={cartLoading}
                                sx={{
                                    mt: 3,
                                    py: {
                                        xs: 1.3,
                                        sm: 1.45,
                                    },
                                    borderRadius: 3,
                                    fontWeight: 800,
                                    textTransform: "none",
                                    fontSize: {
                                        xs: 14,
                                        sm: 15,
                                        md: 16,
                                    },
                                }}
                            >
                                Proceed to Checkout
                            </Button>

                            {/* CONTINUE SHOPPING */}

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={handleContinueShopping}
                                sx={{
                                    mt: 1.3,
                                    py: {
                                        xs: 1.15,
                                        sm: 1.3,
                                    },
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: {
                                        xs: 13,
                                        sm: 14,
                                    },
                                }}
                            >
                                Continue Shopping
                            </Button>

                            {/* SECURITY INFO */}

                            <Box
                                sx={{
                                    mt: 2.5,
                                    p: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    borderRadius: 3,
                                    backgroundColor: "#F8FAFC",
                                    display: "flex",
                                    gap: 1.1,
                                    alignItems: "flex-start",
                                }}
                            >
                                <LockRoundedIcon
                                    sx={{
                                        fontSize: {
                                            xs: 18,
                                            sm: 20,
                                        },
                                        color: "#16A34A",
                                        mt: 0.1,
                                        flexShrink: 0,
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.6,
                                        fontSize: {
                                            xs: 11,
                                            sm: 12,
                                        },
                                    }}
                                >
                                    Your cart is securely synchronized with your ParamMart account.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}
