import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { placeOrder } from "../../api/orderApi";
import {
  getAddresses,
  addAddress,
} from "../../api/addressApi";

import { useEffect, useState } from "react";

export default function Checkout() {
  const navigate = useNavigate();

 const {
  cartItems,
  cartItemCount,
  cartSubtotal,
  loadCart,
} = useCart();

  const { showSuccess, showError } = useToast();

  // =========================================================
  // ADDRESS STATE
  // =========================================================

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [addressLoading, setAddressLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  const [showAddAddress, setShowAddAddress] = useState(false);

  // =========================================================
  // NEW ADDRESS FORM
  // =========================================================

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saveAddress, setSaveAddress] = useState(true);

  // =========================================================
  // PRICE
  // =========================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  // =========================================================
  // LOAD ADDRESSES
  // =========================================================

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);

      console.log("=================================");
      console.log("LOADING SAVED ADDRESSES");
      console.log("=================================");

      const response = await getAddresses();

      console.log("ADDRESS API RESPONSE:", response);

      const loadedAddresses = response?.data ?? [];

      if (!Array.isArray(loadedAddresses)) {
        setAddresses([]);
        return;
      }

      setAddresses(loadedAddresses);

      // -------------------------------------------------------
      // Select default address automatically
      // -------------------------------------------------------

      const defaultAddress = loadedAddresses.find(
        (address) => address.defaultAddress === true
      );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (loadedAddresses.length > 0) {
        setSelectedAddressId(loadedAddresses[0].id);
      }
    } catch (error) {
      console.error("FAILED TO LOAD ADDRESSES:", error);

      setAddresses([]);
      setSelectedAddressId(null);

      showError(
        error?.response?.data?.message ||
          "Unable to load saved addresses."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // =========================================================
  // LOAD ADDRESSES ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    if (cartItems.length > 0) {
      loadAddresses();
    }
  }, [cartItems.length]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "mobile",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      return false;
    }

    return true;
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetAddressForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setSaveAddress(true);
  };

  // =========================================================
  // ADD NEW ADDRESS
  // =========================================================

  const handleSaveNewAddress = async () => {
    if (!validateForm()) {
      showError(
        "Please enter valid delivery details."
      );
      return;
    }

    try {
      setSavingAddress(true);

      const fullName =
        `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      const payload = {
        fullName,
        mobile: form.mobile.trim(),
        addressLine1: form.address.trim(),
        addressLine2: "",
        city: form.city.trim(),
        state: form.state.trim(),
        country: "India",
        pincode: form.pincode.trim(),

        /*
         * The address must exist in the Address table
         * because the Order will reference addressId.
         *
         * For now we respect the checkbox for default status.
         */
        defaultAddress: saveAddress && addresses.length === 0
          ? true
          : saveAddress,
      };

      console.log("=================================");
      console.log("ADDING NEW ADDRESS");
      console.log("ADDRESS PAYLOAD:", payload);
      console.log("=================================");

      const response = await addAddress(payload);

      console.log("ADD ADDRESS RESPONSE:", response);

      const createdAddress = response?.data;

      if (!createdAddress?.id) {
        throw new Error(
          "Address was created but no address ID was returned."
        );
      }

      setAddresses((previous) => [
        createdAddress,
        ...previous,
      ]);

      setSelectedAddressId(createdAddress.id);

      resetAddressForm();
      setShowAddAddress(false);

      showSuccess(
        "Delivery address added successfully."
      );
    } catch (error) {
      console.error("FAILED TO ADD ADDRESS:", error);

      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // =========================================================
  // SELECT ADDRESS
  // =========================================================

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);

    console.log(
      "SELECTED ADDRESS ID:",
      addressId
    );
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

const handlePlaceOrder = async () => {
  if (!selectedAddressId) {
    showError("Please select a delivery address before continuing.");
    return;
  }

  if (!cartItems || cartItems.length === 0) {
    showError("Your cart is empty.");
    return;
  }

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  );

  if (!selectedAddress) {
    showError("Selected delivery address was not found.");
    return;
  }

  try {
    console.log("=================================");
    console.log("PLACING ORDER");
    console.log("=================================");
    console.log("SELECTED ADDRESS:", selectedAddress);
    console.log("ADDRESS ID:", selectedAddressId);
    console.log("ORDER DATA:", {
      addressId: selectedAddressId,
      cartItems,
      cartItemCount,
      cartSubtotal,
    });

    const response = await placeOrder(selectedAddressId);

    console.log("=================================");
    console.log("ORDER PLACED SUCCESSFULLY");
    console.log("=================================");
    console.log("PLACE ORDER RESPONSE:", response);

    const order = response?.data;

    /*
     * Backend has already cleared the cart.
     * Refresh React CartContext so Header/Cart immediately
     * reflect the empty cart.
     */
    await loadCart();

    showSuccess("Order placed successfully.");

    /*
     * Give the success toast a moment to appear before
     * navigating to the confirmation page.
     */
    setTimeout(() => {
      navigate("/order-success", {
        state: {
          order,
        },
      });
    }, 500);

  } catch (error) {
    console.error("=================================");
    console.error("PLACE ORDER FAILED");
    console.error("=================================");
    console.error("ERROR:", error);
    console.error("RESPONSE:", error?.response);
    console.error("RESPONSE DATA:", error?.response?.data);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to place order.";

    showError(message);
  }
};


  // =========================================================
  // EMPTY CART
  // =========================================================

  if (!cartItems.length) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          backgroundColor: "#F5F7FA",
          py: {
            xs: 4,
            sm: 6,
            md: 8,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            px: {
              xs: 2,
              sm: 3,
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
            }}
          >
            <Box
              sx={{
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 3,
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  fontSize: 64,
                  color: "#2563EB",
                  mb: 2,
                }}
              />

              <Typography
                variant="h5"
                fontWeight={900}
              >
                Your cart is empty
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 430,
                }}
              >
                Add some products to your cart before
                proceeding to checkout.
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate("/products")
                }
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  px: 4,
                  py: 1.3,
                  textTransform: "none",
                  fontWeight: 700,
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
  // CHECKOUT
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
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            mb: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Button
            startIcon={
              <ArrowBackRoundedIcon />
            }
            onClick={() => navigate("/cart")}
            sx={{
              mb: 1.5,
              textTransform: "none",
              fontWeight: 700,
              px: 0,
            }}
          >
            Back to Cart
          </Button>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.6rem",
                sm: "2rem",
                md: "2.35rem",
              },
              lineHeight: 1.2,
            }}
          >
            Checkout
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
            Select your delivery address and review
            your order.
          </Typography>
        </Box>

        {/* ================================================= */}
        {/* MAIN LAYOUT */}
        {/* ================================================= */}

        <Grid
          container
          spacing={{
            xs: 2.5,
            sm: 3,
            md: 4,
          }}
          alignItems="flex-start"
        >
          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <Grid
            item
            xs={12}
            lg={8}
          >
            {/* ================================================= */}
            {/* DELIVERY ADDRESS */}
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
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                    md: 3.5,
                  },
                  "&:last-child": {
                    pb: {
                      xs: 2,
                      sm: 3,
                      md: 3.5,
                    },
                  },
                }}
              >
                {/* SECTION HEADER */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 40,
                        sm: 44,
                      },
                      height: {
                        xs: 40,
                        sm: 44,
                      },
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
                      flexShrink: 0,
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      sx={{
                        color: "#2563EB",
                        fontSize: {
                          xs: 22,
                          sm: 24,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      fontWeight={900}
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                          md: 21,
                        },
                      }}
                    >
                      Delivery Address
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.3,
                        fontSize: {
                          xs: 12,
                          sm: 13,
                        },
                      }}
                    >
                      Select where you want your order
                      delivered.
                    </Typography>
                  </Box>

                  {!showAddAddress && (
                    <Button
                      variant="outlined"
                      startIcon={
                        <AddRoundedIcon />
                      }
                      onClick={() =>
                        setShowAddAddress(true)
                      }
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                      }}
                    >
                      Add New
                    </Button>
                  )}
                </Box>

                {/* ================================================= */}
                {/* SAVED ADDRESSES */}
                {/* ================================================= */}

                {addressLoading ? (
                  <Box
                    sx={{
                      minHeight: 150,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={1.5}
                    >
                      <CircularProgress
                        size={28}
                      />

                      <Typography
                        color="text.secondary"
                        fontSize={13}
                      >
                        Loading saved addresses...
                      </Typography>
                    </Stack>
                  </Box>
                ) : addresses.length > 0 &&
                  !showAddAddress ? (
                  <Stack spacing={1.5}>
                    {addresses.map(
                      (address) => {
                        const isSelected =
                          selectedAddressId ===
                          address.id;

                        return (
                          <Card
                            key={address.id}
                            elevation={0}
                            onClick={() =>
                              handleSelectAddress(
                                address.id
                              )
                            }
                            sx={{
                              cursor: "pointer",
                              borderRadius: 3,
                              border: "1px solid",
                              borderColor: isSelected
                                ? "#2563EB"
                                : "rgba(15,23,42,0.10)",
                              backgroundColor:
                                isSelected
                                  ? "#F8FAFF"
                                  : "#FFFFFF",
                              transition:
                                "all 0.2s ease",
                              "&:hover": {
                                borderColor:
                                  "#2563EB",
                                transform:
                                  "translateY(-1px)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                p: {
                                  xs: 1.5,
                                  sm: 2,
                                },
                                "&:last-child": {
                                  pb: {
                                    xs: 1.5,
                                    sm: 2,
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems:
                                    "flex-start",
                                  gap: 1,
                                }}
                              >
                                <Radio
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    handleSelectAddress(
                                      address.id
                                    )
                                  }
                                  sx={{
                                    p: 0.5,
                                    mt: -0.25,
                                  }}
                                />

                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    backgroundColor:
                                      "#EFF6FF",
                                    display: "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <HomeRoundedIcon
                                    sx={{
                                      fontSize: 19,
                                      color:
                                        "#2563EB",
                                    }}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      flexWrap:
                                        "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      fontWeight={800}
                                      sx={{
                                        fontSize: {
                                          xs: 13.5,
                                          sm: 14.5,
                                        },
                                      }}
                                    >
                                      {
                                        address.fullName
                                      }
                                    </Typography>

                                    {address.defaultAddress && (
                                      <Box
                                        sx={{
                                          px: 0.9,
                                          py: 0.25,
                                          borderRadius: 1.5,
                                          backgroundColor:
                                            "#DCFCE7",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color:
                                              "#15803D",
                                          }}
                                        >
                                          DEFAULT
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>

                                  <Typography
                                    color="text.secondary"
                                    sx={{
                                      mt: 0.45,
                                      fontSize: {
                                        xs: 12,
                                        sm: 13,
                                      },
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {
                                      address.addressLine1
                                    }
                                    {address.addressLine2
                                      ? `, ${address.addressLine2}`
                                      : ""}
                                  </Typography>

                                  <Typography
                                    color="text.secondary"
                                    sx={{
                                      fontSize: {
                                        xs: 12,
                                        sm: 13,
                                      },
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {
                                      address.city
                                    }
                                    ,{" "}
                                    {
                                      address.state
                                    }{" "}
                                    -{" "}
                                    {
                                      address.pincode
                                    }
                                  </Typography>

                                  <Typography
                                    sx={{
                                      mt: 0.35,
                                      fontSize: {
                                        xs: 12,
                                        sm: 13,
                                      },
                                      fontWeight: 600,
                                    }}
                                  >
                                    Mobile:{" "}
                                    {
                                      address.mobile
                                    }
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </Stack>
                ) : null}

                {/* ================================================= */}
                {/* NO SAVED ADDRESS */}
                {/* ================================================= */}

                {!addressLoading &&
                  addresses.length === 0 &&
                  !showAddAddress && (
                    <Box
                      sx={{
                        p: {
                          xs: 2,
                          sm: 2.5,
                        },
                        borderRadius: 3,
                        backgroundColor: "#F8FAFC",
                        border: "1px dashed",
                        borderColor:
                          "rgba(15,23,42,0.15)",
                        textAlign: "center",
                      }}
                    >
                      <HomeRoundedIcon
                        sx={{
                          fontSize: 32,
                          color: "#94A3B8",
                          mb: 0.5,
                        }}
                      />

                      <Typography
                        fontWeight={800}
                        fontSize={14}
                      >
                        No saved addresses
                      </Typography>

                      <Typography
                        color="text.secondary"
                        fontSize={12}
                        sx={{ mt: 0.4 }}
                      >
                        Add a delivery address to
                        continue.
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={
                          <AddRoundedIcon />
                        }
                        onClick={() =>
                          setShowAddAddress(true)
                        }
                        sx={{
                          mt: 1.5,
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Add Address
                      </Button>
                    </Box>
                  )}

                {/* ================================================= */}
                {/* ADD NEW ADDRESS FORM */}
                {/* ================================================= */}

                {showAddAddress && (
                  <Box>
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          fontWeight={800}
                          sx={{
                            fontSize: {
                              xs: 15,
                              sm: 16,
                            },
                          }}
                        >
                          Add New Address
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.25,
                            fontSize: 12,
                          }}
                        >
                          Enter your delivery details.
                        </Typography>
                      </Box>

                      {addresses.length > 0 && (
                        <Button
                          onClick={() => {
                            resetAddressForm();
                            setShowAddAddress(
                              false
                            );
                          }}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>

                    <Stack spacing={2}>
                      <Grid
                        container
                        spacing={1.5}
                      >
                        {/* FIRST NAME */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="First Name"
                            name="firstName"
                            value={
                              form.firstName
                            }
                            onChange={
                              handleChange
                            }
                            autoComplete="given-name"
                          />
                        </Grid>

                        {/* LAST NAME */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="Last Name"
                            name="lastName"
                            value={
                              form.lastName
                            }
                            onChange={
                              handleChange
                            }
                            autoComplete="family-name"
                          />
                        </Grid>

                        {/* MOBILE */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="Mobile Number"
                            name="mobile"
                            value={
                              form.mobile
                            }
                            onChange={
                              handleChange
                            }
                            inputProps={{
                              maxLength: 10,
                            }}
                            autoComplete="tel"
                          />
                        </Grid>

                        {/* COMPLETE ADDRESS */}

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Complete Address"
                            name="address"
                            value={
                              form.address
                            }
                            onChange={
                              handleChange
                            }
                            multiline
                            minRows={2}
                            maxRows={3}
                            placeholder="House / Flat / Street / Area"
                            autoComplete="street-address"
                          />
                        </Grid>

                        {/* CITY */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={
                              handleChange
                            }
                            autoComplete="address-level2"
                          />
                        </Grid>

                        {/* STATE */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="State"
                            name="state"
                            value={form.state}
                            onChange={
                              handleChange
                            }
                            autoComplete="address-level1"
                          />
                        </Grid>

                        {/* PIN CODE */}

                        <Grid
                          item
                          xs={12}
                          sm={4}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="PIN Code"
                            name="pincode"
                            value={
                              form.pincode
                            }
                            onChange={
                              handleChange
                            }
                            inputProps={{
                              maxLength: 6,
                            }}
                            autoComplete="postal-code"
                          />
                        </Grid>
                      </Grid>

                      <FormControlLabel
                        sx={{
                          mt: 0.2,
                          mb: -0.5,
                        }}
                        control={
                          <Checkbox
                            size="small"
                            checked={
                              saveAddress
                            }
                            onChange={(
                              event
                            ) =>
                              setSaveAddress(
                                event.target
                                  .checked
                              )
                            }
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13,
                              },
                            }}
                          >
                            Make this my default
                            address
                          </Typography>
                        }
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "flex-end",
                          gap: 1,
                          pt: 0.5,
                        }}
                      >
                        {addresses.length >
                          0 && (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              resetAddressForm();
                              setShowAddAddress(
                                false
                              );
                            }}
                            sx={{
                              borderRadius: 2.5,
                              textTransform:
                                "none",
                              fontWeight: 700,
                            }}
                          >
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          onClick={
                            handleSaveNewAddress
                          }
                          disabled={
                            savingAddress
                          }
                          startIcon={
                            savingAddress ? (
                              <CircularProgress
                                size={17}
                                color="inherit"
                              />
                            ) : (
                              <CheckCircleOutlineRoundedIcon />
                            )
                          }
                          sx={{
                            borderRadius: 2.5,
                            textTransform:
                              "none",
                            fontWeight: 700,
                          }}
                        >
                          {savingAddress
                            ? "Saving..."
                            : "Save Address"}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* ================================================= */}
            {/* DELIVERY INFORMATION */}
            {/* ================================================= */}

            <Card
              elevation={0}
              sx={{
                mt: {
                  xs: 2.5,
                  sm: 3,
                },
                borderRadius: {
                  xs: 3,
                  sm: 4,
                },
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                  },
                }}
              >
                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: {
                      xs: 16,
                      sm: 18,
                    },
                  }}
                >
                  Delivery Information
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 1.5,
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },
                    borderRadius: 3,
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <CheckCircleOutlineRoundedIcon
                    sx={{
                      color: "#16A34A",
                      fontSize: 21,
                      mt: 0.1,
                    }}
                  />

                  <Box>
                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: {
                          xs: 13,
                          sm: 14,
                        },
                      }}
                    >
                      Free delivery
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.3,
                        fontSize: {
                          xs: 11.5,
                          sm: 12.5,
                        },
                        lineHeight: 1.6,
                      }}
                    >
                      Your order will be delivered
                      to your selected address.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ================================================= */}
          {/* RIGHT SIDE - ORDER SUMMARY */}
          {/* ================================================= */}

          <Grid
            item
            xs={12}
            lg={4}
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
                position: {
                  lg: "sticky",
                },
                top: {
                  lg: 88,
                },
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
                  fontWeight={900}
                  sx={{
                    fontSize: {
                      xs: 18,
                      sm: 19,
                      md: 21,
                    },
                  }}
                >
                  Order Summary
                </Typography>

                {/* ================================================= */}
                {/* ITEMS */}
                {/* ================================================= */}

                <Stack
                  spacing={1.5}
                  sx={{
                    mt: 2.5,
                    maxHeight: {
                      xs: 300,
                      lg: 360,
                    },
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {cartItems.map((item) => {
                    const product =
                      item.product;

                    const price =
                      Number(
                        item.price ||
                          product.price ||
                          0
                      );

                    const total =
                      price *
                      Number(
                        item.quantity || 0
                      );

                    return (
                      <Box
                        key={product.id}
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1.5,
                        }}
                      >
                        {/* IMAGE */}

                        <Box
                          sx={{
                            width: {
                              xs: 52,
                              sm: 58,
                            },
                            height: {
                              xs: 52,
                              sm: 58,
                            },
                            borderRadius: 2,
                            backgroundColor:
                              "#F8FAFC",
                            border: "1px solid",
                            borderColor:
                              "rgba(15,23,42,0.08)",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {product.primaryImageUrl ? (
                            <Box
                              component="img"
                              src={
                                product.primaryImageUrl
                              }
                              alt={
                                product.name
                              }
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit:
                                  "contain",
                                p: 0.5,
                              }}
                            />
                          ) : (
                            <ShoppingBagOutlinedIcon
                              sx={{
                                fontSize: 25,
                                color:
                                  "text.disabled",
                              }}
                            />
                          )}
                        </Box>

                        {/* INFO */}

                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13,
                              },
                              display:
                                "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient:
                                "vertical",
                              overflow:
                                "hidden",
                              lineHeight: 1.4,
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{
                              mt: 0.3,
                              fontSize: {
                                xs: 11,
                                sm: 12,
                              },
                            }}
                          >
                            Qty:{" "}
                            {item.quantity}
                          </Typography>
                        </Box>

                        {/* PRICE */}

                        <Typography
                          fontWeight={800}
                          sx={{
                            fontSize: {
                              xs: 12,
                              sm: 13,
                            },
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatPrice(
                            total
                          )}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                {/* ================================================= */}
                {/* PRICE DETAILS */}
                {/* ================================================= */}

                <Stack spacing={1.7}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
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
                      {formatPrice(
                        cartSubtotal
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      fontWeight={900}
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                        },
                      }}
                    >
                      Total
                    </Typography>

                    <Typography
                      fontWeight={900}
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                        },
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatPrice(
                        cartSubtotal
                      )}
                    </Typography>
                  </Box>
                </Stack>

                {/* ================================================= */}
                {/* PLACE ORDER */}
                {/* ================================================= */}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={
                    addressLoading ||
                    savingAddress ||
                    !selectedAddressId
                  }
                  sx={{
                    mt: 3,
                    py: {
                      xs: 1.35,
                      sm: 1.5,
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
                  Place Order
                </Button>

                {/* ================================================= */}
                {/* SECURITY */}
                {/* ================================================= */}

                <Box
                  sx={{
                    mt: 2.5,
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },
                    borderRadius: 3,
                    backgroundColor:
                      "#F8FAFC",
                    display: "flex",
                    gap: 1,
                    alignItems:
                      "flex-start",
                  }}
                >
                  <LockRoundedIcon
                    sx={{
                      color: "#16A34A",
                      fontSize: 19,
                      mt: 0.1,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: 11,
                        sm: 12,
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    Your checkout information is
                    securely transmitted and
                    protected.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}