
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import { getOrderById, cancelOrder } from "../../api/orderApi";
import { useToast } from "../../context/ToastContext";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { showSuccess, showError } = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("=================================");
            console.log("LOADING ORDER DETAILS");
            console.log("ORDER ID:", id);
            console.log("=================================");

            const response = await getOrderById(id);

            console.log("ORDER DETAILS RESPONSE:", response);

            const orderData = response?.data;

            if (!orderData) {
                throw new Error("Order details were not found.");
            }

            setOrder(orderData);
        } catch (error) {
            console.error("FAILED TO LOAD ORDER DETAILS:", error);
            console.error("RESPONSE:", error?.response);
            console.error("RESPONSE DATA:", error?.response?.data);

            setError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load order details."
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

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /*
     * Customer can cancel only before shipment.
     */
    const canCancelOrder = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
    ].includes(order?.status);

    const handleCancelOrder = async () => {
        try {
            setCancelling(true);

            console.log("=================================");
            console.log("CANCELLING ORDER");
            console.log("ORDER ID:", id);
            console.log("=================================");

            const response = await cancelOrder(id);

            console.log("CANCEL ORDER RESPONSE:", response);

            const updatedOrder = response?.data;

            if (updatedOrder) {
                setOrder(updatedOrder);
            } else {
                await loadOrder();
            }

            setCancelDialogOpen(false);

            showSuccess("Order cancelled successfully.");
        } catch (error) {
            console.error("FAILED TO CANCEL ORDER:", error);
            console.error("RESPONSE:", error?.response);
            console.error("RESPONSE DATA:", error?.response?.data);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to cancel the order.";

            showError(message);
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading order details...
                    </Typography>
                </Stack>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        <Stack
                            spacing={3}
                            alignItems="center"
                            textAlign="center"
                        >
                            <ReceiptLongRoundedIcon
                                sx={{
                                    fontSize: 60,
                                    color: "text.secondary",
                                }}
                            />

                            <Box>
                                <Typography variant="h5" fontWeight={800}>
                                    Unable to load order
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {error ||
                                        "Order details were not found."}
                                </Typography>
                            </Box>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackRoundedIcon />}
                                    onClick={() => navigate("/orders")}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    Back to Orders
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={loadOrder}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    Try Again
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: { xs: 3, md: 5 },
            }}
        >
            <Stack spacing={3}>
                {/* Back button */}
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate("/orders")}
                    sx={{
                        alignSelf: "flex-start",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 3,
                    }}
                >
                    Back to My Orders
                </Button>

                {/* Order Header */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                            spacing={2}
                        >
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <ReceiptLongRoundedIcon
                                        sx={{
                                            color: "primary.main",
                                            fontSize: 32,
                                        }}
                                    />

                                    <Typography
                                        variant="h4"
                                        fontWeight={800}
                                        sx={{
                                            fontSize: {
                                                xs: "1.7rem",
                                                md: "2.1rem",
                                            },
                                        }}
                                    >
                                        Order #{order.id}
                                    </Typography>
                                </Stack>

                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Placed on {formatDate(order.orderedAt)}
                                </Typography>
                            </Box>

                            <Chip
                                label={order.status || "UNKNOWN"}
                                color={getStatusColor(order.status)}
                                sx={{
                                    fontWeight: 800,
                                    borderRadius: 2,
                                    px: 1,
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Cancel Order Action */}
                {canCancelOrder && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "error.light",
                            bgcolor: "error.50",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: { xs: 2.5, md: 3 },
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                justifyContent="space-between"
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center",
                                }}
                                spacing={2}
                            >
                                <Box>
                                    <Typography
                                        fontWeight={800}
                                        color="error.main"
                                    >
                                        Need to cancel this order?
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        You can cancel this order before it
                                        is shipped.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelRoundedIcon />}
                                    onClick={() =>
                                        setCancelDialogOpen(true)
                                    }
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Cancel Order
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {/* Order Status Timeline */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ mb: 4 }}
                        >
                            Order Status
                        </Typography>

                        {order.status === "CANCELLED" ? (
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: "error.lighter",
                                    border: "1px solid",
                                    borderColor: "error.light",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <CancelRoundedIcon
                                        sx={{
                                            color: "error.main",
                                            fontSize: 32,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            fontWeight={800}
                                            color="error.main"
                                        >
                                            Order Cancelled
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            This order has been cancelled and
                                            the inventory has been restored.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    maxWidth: 700,
                                    mx: "auto",
                                }}
                            >
                                {[
                                    {
                                        status: "PENDING",
                                        title: "Order Placed",
                                        description:
                                            "Your order has been successfully placed.",
                                        icon: <ReceiptLongRoundedIcon />,
                                    },
                                    {
                                        status: "CONFIRMED",
                                        title: "Order Confirmed",
                                        description:
                                            "Your order has been confirmed.",
                                        icon: <CheckCircleRoundedIcon />,
                                    },
                                    {
                                        status: "PROCESSING",
                                        title: "Processing",
                                        description:
                                            "Your order is being prepared.",
                                        icon: <Inventory2RoundedIcon />,
                                    },
                                    {
                                        status: "SHIPPED",
                                        title: "Shipped",
                                        description:
                                            "Your order is on its way.",
                                        icon: <LocalShippingRoundedIcon />,
                                    },
                                    {
                                        status: "DELIVERED",
                                        title: "Delivered",
                                        description:
                                            "Your order has been delivered.",
                                        icon: <DoneAllRoundedIcon />,
                                    },
                                ].map((step, index, steps) => {
                                    const statusOrder = [
                                        "PENDING",
                                        "CONFIRMED",
                                        "PROCESSING",
                                        "SHIPPED",
                                        "DELIVERED",
                                    ];

                                    const currentIndex =
                                        statusOrder.indexOf(order.status);

                                    const stepIndex =
                                        statusOrder.indexOf(step.status);

                                    const completed =
                                        stepIndex <= currentIndex;

                                    const active =
                                        step.status === order.status;

                                    return (
                                        <Box
                                            key={step.status}
                                            sx={{
                                                position: "relative",
                                                display: "flex",
                                            }}
                                        >
                                            {/* Timeline column */}
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {/* Circle */}
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        bgcolor: completed
                                                            ? "primary.main"
                                                            : "background.paper",
                                                        color: completed
                                                            ? "primary.contrastText"
                                                            : "text.disabled",
                                                        border: "2px solid",
                                                        borderColor: completed
                                                            ? "primary.main"
                                                            : "divider",
                                                        zIndex: 2,
                                                        boxShadow: active
                                                            ? "0 0 0 5px rgba(37, 99, 235, 0.10)"
                                                            : "none",
                                                        transition:
                                                            "all 0.25s ease",
                                                    }}
                                                >
                                                    {active ? (
                                                        <RadioButtonCheckedRoundedIcon
                                                            sx={{
                                                                fontSize: 19,
                                                            }}
                                                        />
                                                    ) : completed ? (
                                                        <CheckCircleRoundedIcon
                                                            sx={{
                                                                fontSize: 19,
                                                            }}
                                                        />
                                                    ) : (
                                                        <CircleOutlinedIcon
                                                            sx={{
                                                                fontSize: 18,
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                {/* Vertical line */}
                                                {index < steps.length - 1 && (
                                                    <Box
                                                        sx={{
                                                            width: 2,
                                                            height: 58,
                                                            bgcolor:
                                                                stepIndex <
                                                                currentIndex
                                                                    ? "primary.main"
                                                                    : "divider",
                                                            transition:
                                                                "background-color 0.25s ease",
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {/* Status content */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    pb:
                                                        index <
                                                        steps.length - 1
                                                            ? 2.5
                                                            : 0,
                                                    pt: 0.25,
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={
                                                        active || completed
                                                            ? 800
                                                            : 600
                                                    }
                                                    color={
                                                        active
                                                            ? "primary.main"
                                                            : completed
                                                            ? "text.primary"
                                                            : "text.disabled"
                                                    }
                                                >
                                                    {step.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color={
                                                        completed
                                                            ? "text.secondary"
                                                            : "text.disabled"
                                                    }
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {step.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ mb: 2.5 }}
                        >
                            Order Items
                        </Typography>

                        <Stack spacing={2.5}>
                            {order.orderItems?.map((item, index) => (
                                <Box key={item.id}>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{
                                                    width: 54,
                                                    height: 54,
                                                    borderRadius: 2.5,
                                                    bgcolor: "action.hover",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <ShoppingBagRoundedIcon color="action" />
                                            </Box>

                                            <Box>
                                                <Typography
                                                    fontWeight={700}
                                                    sx={{
                                                        wordBreak:
                                                            "break-word",
                                                    }}
                                                >
                                                    {item.productName ||
                                                        "Product"}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    Quantity: {item.quantity}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Price: ₹
                                                    {Number(
                                                        item.price || 0
                                                    ).toLocaleString("en-IN")}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Typography
                                            fontWeight={800}
                                            sx={{
                                                alignSelf: {
                                                    xs: "flex-start",
                                                    sm: "center",
                                                },
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            ₹
                                            {Number(
                                                item.totalPrice || 0
                                            ).toLocaleString("en-IN")}
                                        </Typography>
                                    </Stack>

                                    {index <
                                        (order.orderItems?.length || 0) -
                                            1 && (
                                        <Divider sx={{ mt: 2.5 }} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Summary + Address */}
                <Grid container spacing={3}>
                    {/* Delivery Address */}
                    <Grid item xs={12} md={7}>
                        <Card
                            elevation={0}
                            sx={{
                                height: "100%",
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                    sx={{ mb: 2.5 }}
                                >
                                    <LocationOnRoundedIcon color="primary" />

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                    >
                                        Delivery Address
                                    </Typography>
                                </Stack>

                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        bgcolor: "action.hover",
                                    }}
                                >
                                    {order.address ? (
                                        <Stack spacing={0.75}>
                                            <Typography fontWeight={800}>
                                                {order.address.fullName}
                                            </Typography>

                                            <Typography color="text.secondary">
                                                {order.address.addressLine1}
                                            </Typography>

                                            {order.address.addressLine2 && (
                                                <Typography color="text.secondary">
                                                    {
                                                        order.address
                                                            .addressLine2
                                                    }
                                                </Typography>
                                            )}

                                            <Typography color="text.secondary">
                                                {order.address.city},{" "}
                                                {order.address.state}
                                            </Typography>

                                            <Typography color="text.secondary">
                                                {order.address.country} -{" "}
                                                {order.address.pincode}
                                            </Typography>

                                            <Typography
                                                color="text.secondary"
                                                sx={{ pt: 0.5 }}
                                            >
                                                Mobile:{" "}
                                                {order.address.mobile}
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        <Typography color="text.secondary">
                                            Delivery address is not available.
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={5}>
                        <Card
                            elevation={0}
                            sx={{
                                height: "100%",
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{ mb: 2.5 }}
                                >
                                    Order Summary
                                </Typography>

                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Typography color="text.secondary">
                                            Total Items
                                        </Typography>

                                        <Typography fontWeight={700}>
                                            {order.totalItems || 0}
                                        </Typography>
                                    </Stack>

                                    <Divider />

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography fontWeight={800}>
                                            Total Amount
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight={900}
                                        >
                                            ₹
                                            {Number(
                                                order.totalAmount || 0
                                            ).toLocaleString("en-IN")}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Continue Shopping */}
                <Button
                    variant="contained"
                    startIcon={<ShoppingBagRoundedIcon />}
                    onClick={() => navigate("/products")}
                    sx={{
                        alignSelf: "center",
                        minWidth: { xs: "100%", sm: 220 },
                        borderRadius: 3,
                        py: 1.4,
                        textTransform: "none",
                        fontWeight: 800,
                    }}
                >
                    Continue Shopping
                </Button>
            </Stack>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => {
                    if (!cancelling) {
                        setCancelDialogOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                    },
                }}
            >
                <DialogTitle>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <WarningAmberRoundedIcon
                            color="warning"
                            sx={{ fontSize: 30 }}
                        />

                        <Typography
                            component="span"
                            variant="h6"
                            fontWeight={800}
                        >
                            Cancel Order?
                        </Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to cancel Order #{order.id}?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                    >
                        This action will cancel the order and restore the
                        purchased items to available inventory.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={() => setCancelDialogOpen(false)}
                        disabled={cancelling}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Keep Order
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        startIcon={
                            cancelling ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <CancelRoundedIcon />
                            )
                        }
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 800,
                        }}
                    >
                        {cancelling
                            ? "Cancelling..."
                            : "Yes, Cancel Order"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

