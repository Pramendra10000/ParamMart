import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

import {
    getProductById,
    getProductMedia,
} from "../../api/productApi";

import { useParams } from "react-router-dom";

// =========================================================
// PRODUCT DETAILS
// =========================================================

export default function ProductDetails() {
    const { id } = useParams();


   const { showSuccess, showError } = useToast();
const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [media, setMedia] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD PRODUCT
    // =========================================================

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const [productData, mediaData] =
                await Promise.all([
                    getProductById(id),
                    getProductMedia(id),
                ]);

            console.log(
                "Product Details:",
                productData
            );

            console.log(
                "Product Media:",
                mediaData
            );

            setProduct(productData);

            const imageMedia =
                Array.isArray(mediaData)
                    ? mediaData.filter(
                        (item) =>
                            item.active !== false &&
                            item.mediaType === "IMAGE" &&
                            item.mediaUrl
                    )
                    : [];

            setMedia(imageMedia);

            const primaryImage =
                imageMedia.find(
                    (item) =>
                        item.isPrimary === true
                );

            if (primaryImage) {
                setSelectedImage(primaryImage);
            } else if (imageMedia.length > 0) {
                setSelectedImage(imageMedia[0]);
            } else {
                setSelectedImage(null);
            }
        } catch (err) {
            console.error(
                "Failed to load product:",
                err
            );

            setProduct(null);
            setMedia([]);
            setSelectedImage(null);

            setError(
                err.response?.data?.message ||
                "Unable to load product. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // IMAGE NAVIGATION
    // =========================================================

    const handlePreviousImage = () => {
        if (media.length <= 1) {
            return;
        }

        const currentIndex =
            media.findIndex(
                (item) =>
                    item.id === selectedImage?.id
            );

        const previousIndex =
            currentIndex <= 0
                ? media.length - 1
                : currentIndex - 1;

        setSelectedImage(
            media[previousIndex]
        );
    };

    const handleNextImage = () => {
        if (media.length <= 1) {
            return;
        }

        const currentIndex =
            media.findIndex(
                (item) =>
                    item.id === selectedImage?.id
            );

        const nextIndex =
            currentIndex >= media.length - 1
                ? 0
                : currentIndex + 1;

        setSelectedImage(
            media[nextIndex]
        );
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const handleDecreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const handleIncreaseQuantity = () => {
        if (!product?.stock) {
            return;
        }

        setQuantity((current) =>
            Math.min(
                product.stock,
                current + 1
            )
        );
    };

    // =========================================================
    // CART / BUY ACTIONS
    // =========================================================

const handleAddToCart = async () => {
    console.log("=================================");
    console.log("ADD TO CART BUTTON CLICKED");
    console.log("Product:", product);
    console.log("Product ID:", product?.id);
    console.log("Quantity:", quantity);
    console.log("In Stock:", isInStock);
    console.log("=================================");

    if (!product || !isInStock) {
        console.log(
            "Add to cart stopped: product unavailable or out of stock."
        );
        return;
    }

    try {
        console.log(
            "Calling CartContext addToCart..."
        );

        await addToCart(product, quantity);

        console.log(
            "Product successfully added to cart."
        );

        showSuccess(
            `${product.name} added to cart successfully.`
        );
    } catch (error) {
        console.error(
            "ADD TO CART FAILED:",
            error
        );

        console.error(
            "Response:",
            error?.response
        );

        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unable to add product to cart.";

        showError(message);
    }
};

    const handleBuyNow = () => {
        console.log(
            "Buy Now:",
            product,
            "Quantity:",
            quantity
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <Box
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    // =========================================================
    // NOT FOUND
    // =========================================================

    if (!product) {
        return (
            <Box
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Product not found.
                </Typography>
            </Box>
        );
    }

    const isInStock =
        product.active !== false &&
        Number(product.stock) > 0;

    const stockText = !isInStock
        ? "Out of Stock"
        : product.stock <= 5
            ? `Only ${product.stock} left`
            : "In Stock";

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                p: {
                    xs: 1.5,
                    sm: 2.5,
                    md: 4,
                },
                maxWidth: "1800px",
                mx: "auto",
                width: "100%",
            }}
        >
            {/* =====================================================
          MAIN PRODUCT CARD
      ====================================================== */}

            <Box
                sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: {
                        xs: 3,
                        md: 4,
                    },
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                    boxShadow:
                        "0 10px 35px rgba(15,23,42,.07)",
                }}
            >
                {/* ===================================================
            BREADCRUMB / SMALL HEADER
        ==================================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                    }}
                >
                    Products
                    {" / "}
                    {product.categoryName || "Product"}
                    {" / "}
                    {product.name}
                </Typography>

                {/* ===================================================
            PRODUCT MAIN AREA
        ==================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "minmax(0, 1.15fr) minmax(420px, .85fr)",
                        },
                        gap: {
                            xs: 4,
                            lg: 6,
                        },
                        alignItems: "start",
                    }}
                >
                    {/* =================================================
              LEFT - IMAGE GALLERY
          ================================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm:
                                        media.length > 0
                                            ? "90px minmax(0,1fr)"
                                            : "1fr",
                                },
                                gap: 2,
                            }}
                        >
                            {/* =============================================
                  THUMBNAILS
              ============================================== */}

                            {media.length > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "row",
                                            sm: "column",
                                        },
                                        gap: 1.5,
                                        overflowX: {
                                            xs: "auto",
                                            sm: "visible",
                                        },
                                        overflowY: {
                                            xs: "hidden",
                                            sm: "auto",
                                        },
                                        maxHeight: {
                                            sm: 520,
                                        },
                                        pb: {
                                            xs: 1,
                                            sm: 0,
                                        },
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {media.map((item) => {
                                        const isSelected =
                                            selectedImage?.id ===
                                            item.id;

                                        return (
                                            <Box
                                                key={item.id}
                                                onClick={() =>
                                                    setSelectedImage(
                                                        item
                                                    )
                                                }
                                                sx={{
                                                    flexShrink: 0,
                                                    width: {
                                                        xs: 72,
                                                        sm: 82,
                                                    },
                                                    height: {
                                                        xs: 72,
                                                        sm: 82,
                                                    },
                                                    borderRadius: 2.5,
                                                    border: "2px solid",
                                                    borderColor:
                                                        isSelected
                                                            ? "primary.main"
                                                            : "#E2E8F0",
                                                    backgroundColor:
                                                        "#F8FAFC",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    overflow: "hidden",
                                                    transition:
                                                        "all .2s ease",
                                                    "&:hover": {
                                                        borderColor:
                                                            "primary.main",
                                                        transform:
                                                            "translateY(-1px)",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={
                                                        item.mediaUrl
                                                    }
                                                    alt={
                                                        item.altText ||
                                                        product.name
                                                    }
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit:
                                                            "contain",
                                                        p: 0.75,
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}

                            {/* =============================================
                  MAIN IMAGE
              ============================================== */}

                            <Box
                                sx={{
                                    position: "relative",
                                    minHeight: {
                                        xs: 320,
                                        sm: 450,
                                        md: 520,
                                    },
                                    borderRadius: 4,
                                    background:
                                        "linear-gradient(135deg,#F8FAFC,#EEF2FF)",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    overflow: "hidden",
                                    border:
                                        "1px solid #E2E8F0",
                                }}
                            >
                                {selectedImage?.mediaUrl ? (
                                    <Box
                                        component="img"
                                        src={
                                            selectedImage.mediaUrl
                                        }
                                        alt={
                                            selectedImage.altText ||
                                            product.name
                                        }
                                        sx={{
                                            width: "100%",
                                            height: {
                                                xs: 320,
                                                sm: 450,
                                                md: 520,
                                            },
                                            objectFit: "contain",
                                            p: {
                                                xs: 2,
                                                sm: 3,
                                                md: 5,
                                            },
                                            transition:
                                                "transform .3s ease",
                                            "&:hover": {
                                                transform:
                                                    "scale(1.025)",
                                            },
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        No Image Available
                                    </Typography>
                                )}

                                {/* PREVIOUS */}

                                {media.length > 1 && (
                                    <IconButton
                                        onClick={
                                            handlePreviousImage
                                        }
                                        aria-label="Previous image"
                                        sx={{
                                            position:
                                                "absolute",
                                            left: {
                                                xs: 8,
                                                sm: 16,
                                            },
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            backgroundColor:
                                                "rgba(255,255,255,.94)",
                                            boxShadow:
                                                "0 5px 18px rgba(15,23,42,.15)",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#FFFFFF",
                                            },
                                        }}
                                    >
                                        <ChevronLeftRoundedIcon />
                                    </IconButton>
                                )}

                                {/* NEXT */}

                                {media.length > 1 && (
                                    <IconButton
                                        onClick={
                                            handleNextImage
                                        }
                                        aria-label="Next image"
                                        sx={{
                                            position:
                                                "absolute",
                                            right: {
                                                xs: 8,
                                                sm: 16,
                                            },
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            backgroundColor:
                                                "rgba(255,255,255,.94)",
                                            boxShadow:
                                                "0 5px 18px rgba(15,23,42,.15)",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#FFFFFF",
                                            },
                                        }}
                                    >
                                        <ChevronRightRoundedIcon />
                                    </IconButton>
                                )}

                                {/* WISHLIST */}

                                <IconButton
                                    aria-label="Add to wishlist"
                                    sx={{
                                        position:
                                            "absolute",
                                        top: 16,
                                        right: 16,
                                        backgroundColor:
                                            "rgba(255,255,255,.94)",
                                        boxShadow:
                                            "0 5px 18px rgba(15,23,42,.12)",
                                        "&:hover": {
                                            backgroundColor:
                                                "#FFFFFF",
                                        },
                                    }}
                                >
                                    <FavoriteBorderRoundedIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {media.length > 0 && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1.5,
                                    textAlign: "center",
                                }}
                            >
                                {media.length}{" "}
                                {media.length === 1
                                    ? "image"
                                    : "images"}
                            </Typography>
                        )}
                    </Box>

                    {/* =================================================
              RIGHT - PRODUCT INFORMATION
          ================================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        {/* BRAND */}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={700}
                            sx={{
                                textTransform:
                                    "uppercase",
                                letterSpacing:
                                    ".08em",
                                mb: 1,
                            }}
                        >
                            {product.brandName ||
                                "ParamMart"}
                        </Typography>

                        {/* PRODUCT NAME */}

                        <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{
                                fontSize: {
                                    xs: "1.8rem",
                                    sm: "2.2rem",
                                    md: "2.6rem",
                                },
                                lineHeight: 1.15,
                                mb: 2,
                            }}
                        >
                            {product.name}
                        </Typography>

                        {/* RATING */}

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mb: 2.5,
                            }}
                        >
                            <Chip
                                label="★ 4.5"
                                size="small"
                                sx={{
                                    backgroundColor:
                                        "#16A34A",
                                    color: "#FFFFFF",
                                    fontWeight: 800,
                                    borderRadius: 1.5,
                                }}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                128 ratings
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                •
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                42 reviews
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        {/* PRICE */}

                        <Typography
                            variant="h3"
                            fontWeight={900}
                            color="primary"
                            sx={{
                                fontSize: {
                                    xs: "2rem",
                                    sm: "2.4rem",
                                    md: "2.7rem",
                                },
                                mb: 0.5,
                            }}
                        >
                            ₹
                            {Number(
                                product.price
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 3,
                            }}
                        >
                            Inclusive of all taxes
                        </Typography>

                        {/* STOCK */}

                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 2.5,
                                backgroundColor:
                                    isInStock
                                        ? "#F0FDF4"
                                        : "#FEF2F2",
                                border:
                                    "1px solid",
                                borderColor:
                                    isInStock
                                        ? "#BBF7D0"
                                        : "#FECACA",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        width: 9,
                                        height: 9,
                                        borderRadius:
                                            "50%",
                                        backgroundColor:
                                            isInStock
                                                ? "#16A34A"
                                                : "#DC2626",
                                    }}
                                />

                                <Typography
                                    fontWeight={800}
                                    color={
                                        isInStock
                                            ? "success.dark"
                                            : "error.main"
                                    }
                                >
                                    {stockText}
                                </Typography>
                            </Stack>

                            {isInStock && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Ready to ship from
                                    ParamMart
                                </Typography>
                            )}
                        </Box>

                        {/* QUANTITY */}

                        {isInStock && (
                            <>
                                <Typography
                                    fontWeight={800}
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    Quantity
                                </Typography>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    <IconButton
                                        onClick={
                                            handleDecreaseQuantity
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                        sx={{
                                            border:
                                                "1px solid #CBD5E1",
                                            borderRadius:
                                                "10px 0 0 10px",
                                        }}
                                    >
                                        <RemoveRoundedIcon />
                                    </IconButton>

                                    <Box
                                        sx={{
                                            minWidth: 55,
                                            height: 42,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            borderTop:
                                                "1px solid #CBD5E1",
                                            borderBottom:
                                                "1px solid #CBD5E1",
                                            backgroundColor:
                                                "#FFFFFF",
                                        }}
                                    >
                                        <Typography
                                            fontWeight={800}
                                        >
                                            {quantity}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        onClick={
                                            handleIncreaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                        sx={{
                                            border:
                                                "1px solid #CBD5E1",
                                            borderRadius:
                                                "0 10px 10px 0",
                                        }}
                                    >
                                        <AddRoundedIcon />
                                    </IconButton>
                                </Stack>
                            </>
                        )}

                        {/* ACTION BUTTONS */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
                            sx={{
                                mb: 4,
                            }}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                startIcon={
                                    <ShoppingCartOutlinedIcon />
                                }
                                disabled={!isInStock}
                                onClick={
                                    handleAddToCart
                                }
                                sx={{
                                    minHeight: 54,
                                    borderRadius: 2.5,
                                    fontWeight: 800,
                                    borderWidth: 1.5,
                                    "&:hover": {
                                        borderWidth: 1.5,
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={
                                    <FlashOnRoundedIcon />
                                }
                                disabled={!isInStock}
                                onClick={
                                    handleBuyNow
                                }
                                sx={{
                                    minHeight: 54,
                                    borderRadius: 2.5,
                                    fontWeight: 800,
                                    boxShadow:
                                        "0 8px 20px rgba(37,99,235,.22)",
                                }}
                            >
                                Buy Now
                            </Button>
                        </Stack>

                        {/* DELIVERY BENEFITS */}

                        <Box
                            sx={{
                                border:
                                    "1px solid #E2E8F0",
                                borderRadius: 3,
                                overflow: "hidden",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    p: 2,
                                }}
                            >
                                <LocalShippingOutlinedIcon
                                    color="primary"
                                />

                                <Box>
                                    <Typography
                                        fontWeight={800}
                                    >
                                        Fast Delivery
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Get this product
                                        delivered quickly
                                        to your address.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    p: 2,
                                }}
                            >
                                <VerifiedOutlinedIcon
                                    color="primary"
                                />

                                <Box>
                                    <Typography
                                        fontWeight={800}
                                    >
                                        Quality Assured
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Genuine products
                                        from verified
                                        brands.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    p: 2,
                                }}
                            >
                                <ReplayRoundedIcon
                                    color="primary"
                                />

                                <Box>
                                    <Typography
                                        fontWeight={800}
                                    >
                                        Easy Returns
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Simple return
                                        experience for
                                        eligible products.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* ===================================================
            PRODUCT INFORMATION
        ==================================================== */}

                <Divider
                    sx={{
                        my: {
                            xs: 4,
                            md: 6,
                        },
                    }}
                />

                <Typography
                    variant="h5"
                    fontWeight={900}
                    sx={{
                        mb: 3,
                    }}
                >
                    Product Information
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    {/* PRODUCT ID */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Product ID
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.id}
                        </Typography>
                    </Box>

                    {/* SKU */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            SKU
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.sku}
                        </Typography>
                    </Box>

                    {/* BRAND */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Brand
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.brandName ||
                                "-"}
                        </Typography>
                    </Box>

                    {/* CATEGORY */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Category
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.categoryName ||
                                "-"}
                        </Typography>
                    </Box>

                    {/* STOCK */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Available Stock
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.stock}
                        </Typography>
                    </Box>

                    {/* STATUS */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Status
                        </Typography>

                        <Typography
                            fontWeight={800}
                        >
                            {product.active
                                ? "Active"
                                : "Inactive"}
                        </Typography>
                    </Box>
                </Box>

                {/* ===================================================
            DESCRIPTION
        ==================================================== */}

                <Box
                    sx={{
                        mt: 4,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={900}
                        sx={{
                            mb: 1.5,
                        }}
                    >
                        Description
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.8,
                            maxWidth: 1000,
                        }}
                    >
                        {product.description ||
                            "No description available."}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}