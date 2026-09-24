import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Switch,
  TextField,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { getCategories, getBrands } from "../../api/productApi";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stock: "",
  active: true,
  categoryId: "",
  brandId: "",
};

export default function ProductForm({
  open,
  onClose,
  onSubmit,
  product = null,
  submitting = false,
}) {
  const [form, setForm] = useState(initialForm);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(product);

  // =========================================================
  // LOAD FORM DATA
  // =========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (product) {
      setForm({
        name: product.name ?? "",
        sku: product.sku ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        active: product.active ?? true,
        categoryId: product.categoryId ?? "",
        brandId: product.brandId ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [open, product]);

  // =========================================================
  // LOAD CATEGORIES + BRANDS
  // =========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [categoryResponse, brandResponse] =
          await Promise.all([
            getCategories(),
            getBrands(0, 100, "name,asc"),
          ]);

        /*
         * Categories may come directly as an array.
         */
        setCategories(
          Array.isArray(categoryResponse)
            ? categoryResponse
            : categoryResponse?.content ?? []
        );

        /*
         * Brands are pageable in your backend.
         */
        setBrands(
          Array.isArray(brandResponse)
            ? brandResponse
            : brandResponse?.content ?? []
        );
      } catch (err) {
        console.error(
          "Failed to load product form options:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load categories and brands."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [open]);

  // =========================================================
  // FIELD CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleActiveChange = (event) => {
    setForm((previous) => ({
      ...previous,
      active: event.target.checked,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) <= 0
    ) {
      setError("Price must be greater than 0.");
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      setError("Stock cannot be negative.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.brandId) {
      setError("Please select a brand.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      active: Boolean(form.active),
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error("Product form submit error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save product."
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >
      <DialogContent
        dividers
        sx={{
          p: { xs: 2, sm: 3 },
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {loadingOptions ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {/* NAME */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </Grid>

            {/* SKU */}

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. SAM-S25-256-BLK"
              />
            </Grid>

            {/* PRICE */}

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                inputProps={{
                  min: 0.01,
                  step: 0.01,
                }}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="span"
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      ₹
                    </Box>
                  ),
                }}
              />
            </Grid>

            {/* CATEGORY */}

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  Select category
                </MenuItem>

                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* BRAND */}

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                select
                label="Brand"
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  Select brand
                </MenuItem>

                {brands.map((brand) => (
                  <MenuItem
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* STOCK */}

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Initial Stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                inputProps={{
                  min: 0,
                  step: 1,
                }}
                helperText="Inventory management will control stock later."
              />
            </Grid>

            {/* ACTIVE */}

            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.active)}
                    onChange={handleActiveChange}
                  />
                }
                label={
                  form.active
                    ? "Product Active"
                    : "Product Inactive"
                }
              />
            </Grid>

            {/* DESCRIPTION */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={submitting}
          variant="outlined"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={
            submitting ||
            loadingOptions
          }
          sx={{
            minWidth: 130,
          }}
        >
          {submitting ? (
            <CircularProgress
              size={22}
              color="inherit"
            />
          ) : isEdit ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </DialogActions>
    </Box>
  );
}