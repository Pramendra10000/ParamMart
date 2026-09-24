import { useCallback, useEffect, useState } from "react";

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
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

import {
  getProducts,
  searchProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import ProductForm from "./ProductForm";

export default function ProductManagement() {
  const {
    hasPermission,
    hasRole,
  } = useAuth();

  const {
    showSuccess,
    showError,
  } = useToast();

  // =========================================================
  // PERMISSIONS
  // =========================================================

  const canCreate =
    hasPermission("PRODUCT_CREATE");

  const canUpdate =
    hasPermission("PRODUCT_UPDATE");

  const canDelete =
    hasPermission("PRODUCT_DELETE");

  const isAdmin = hasRole("ADMIN");

  // =========================================================
  // PRODUCT STATE
  // =========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [brandId, setBrandId] =
    useState("");

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const [categories, setCategories] =
    useState([]);

  const [brands, setBrands] =
    useState([]);

  const [filtersLoading, setFiltersLoading] =
    useState(true);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] =
    useState(0);

  const [totalElements, setTotalElements] =
    useState(0);

  // =========================================================
  // DIALOG
  // =========================================================

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  // =========================================================
  // DELETE DIALOG
  // =========================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [productToDelete, setProductToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // =========================================================
  // LOAD FILTERS
  // =========================================================

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFiltersLoading(true);

        const [
          categoryResponse,
          brandResponse,
        ] = await Promise.all([
          getCategories(),
          getBrands(0, 100, "name,asc"),
        ]);

        setCategories(
          Array.isArray(categoryResponse)
            ? categoryResponse
            : categoryResponse?.content ?? []
        );

        setBrands(
          Array.isArray(brandResponse)
            ? brandResponse
            : brandResponse?.content ?? []
        );
      } catch (err) {
        console.error(
          "Failed to load filters:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load categories and brands."
        );
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          searchKeyword.trim()
            ? await searchProducts(
                searchKeyword.trim(),
                page,
                size,
                "id,desc",
                categoryId,
                brandId
              )
            : await getProducts(
                page,
                size,
                "id,desc",
                categoryId,
                brandId
              );

        setProducts(
          response?.content ?? []
        );

        setTotalPages(
          response?.totalPages ?? 0
        );

        setTotalElements(
          response?.totalElements ?? 0
        );
      } catch (err) {
        console.error(
          "Failed to load products:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      searchKeyword,
      page,
      size,
      categoryId,
      brandId,
    ]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setKeyword("");
    setSearchKeyword("");
    setPage(0);
  };

  // =========================================================
  // FILTER
  // =========================================================

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    setPage(0);
  };

  const handleBrandChange = (event) => {
    setBrandId(event.target.value);
    setPage(0);
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {
    if (submitting) {
      return;
    }

    setFormOpen(false);
    setEditingProduct(null);
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmitProduct = async (
    payload
  ) => {
    try {
      setSubmitting(true);

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          payload
        );

        showSuccess(
          "Product updated successfully."
        );
      } else {
        await createProduct(payload);

        showSuccess(
          "Product created successfully."
        );
      }

      setFormOpen(false);
      setEditingProduct(null);

      /*
       * Go back to first page after creation
       * so the user can immediately see the
       * newest product when sorting by id desc.
       */
      if (!editingProduct) {
        setPage(0);
      }

      await loadProducts();
    } catch (err) {
      console.error(
        "Failed to save product:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save product.";

      showError(message);

      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) {
      return;
    }

    try {
      setDeleting(true);

      await deleteProduct(
        productToDelete.id
      );

      showSuccess(
        "Product deleted successfully."
      );

      setDeleteDialogOpen(false);
      setProductToDelete(null);

      /*
       * If the last product on a page was deleted,
       * move back one page when necessary.
       */
      if (
        products.length === 1 &&
        page > 0
      ) {
        setPage((previous) =>
          previous - 1
        );
      } else {
        await loadProducts();
      }
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err
      );

      showError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const handlePageChange = (
    _event,
    newPage
  ) => {
    setPage(newPage - 1);
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(0);
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getCategoryName = (id) => {
    return (
      categories.find(
        (category) =>
          Number(category.id) ===
          Number(id)
      )?.name || "-"
    );
  };

  const getBrandName = (id) => {
    return (
      brands.find(
        (brand) =>
          Number(brand.id) ===
          Number(id)
      )?.name || "-"
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100%",
        background: "#F5F7FA",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Container maxWidth="xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                },
              }}
            >
              Product Management
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.7,
              }}
            >
              Manage ParamMart products,
              pricing, categories and
              availability.
            </Typography>
          </Box>

          {canCreate && (
            <Button
              variant="contained"
              startIcon={
                <AddRoundedIcon />
              }
              onClick={
                handleAddProduct
              }
              sx={{
                minWidth: 160,
                borderRadius: 2.5,
                fontWeight: 800,
              }}
            >
              Add Product
            </Button>
          )}
        </Box>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              flex: 1,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,rgba(79,70,229,.12),rgba(6,182,212,.10))",
                  color: "#4F46E5",
                }}
              >
                <Inventory2RoundedIcon />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Products
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                >
                  {totalElements}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              flex: 1,
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Access Level
              </Typography>

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mt: 0.5 }}
              >
                {isAdmin
                  ? "Administrator"
                  : canUpdate
                    ? "Manager"
                    : "Employee"}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Based on your account
                permissions
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2.5,
            }}
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            FILTER CARD
        ================================================= */}

        <Card
          sx={{
            borderRadius: 3.5,
            mb: 3,
          }}
        >
          <CardContent>
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
            >
              <TextField
                fullWidth
                placeholder="Search products..."
                value={keyword}
                onChange={(event) =>
                  setKeyword(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleSearchKeyDown
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                label="Category"
                value={categoryId}
                onChange={
                  handleCategoryChange
                }
                disabled={filtersLoading}
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 190,
                  },
                }}
              >
                <MenuItem value="">
                  All Categories
                </MenuItem>

                {categories.map(
                  (category) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                select
                label="Brand"
                value={brandId}
                onChange={
                  handleBrandChange
                }
                disabled={filtersLoading}
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 190,
                  },
                }}
              >
                <MenuItem value="">
                  All Brands
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

              <Button
                variant="contained"
                onClick={
                  handleSearch
                }
                sx={{
                  minWidth: 120,
                  borderRadius: 2.5,
                  fontWeight: 800,
                }}
              >
                Search
              </Button>

              {(keyword ||
                searchKeyword) && (
                <Button
                  variant="outlined"
                  onClick={
                    handleClearSearch
                  }
                  sx={{
                    minWidth: 110,
                    borderRadius: 2.5,
                  }}
                >
                  Clear
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* =================================================
            TABLE
        ================================================= */}

        <Card
          sx={{
            borderRadius: 3.5,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                minHeight: 350,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
              }}
            >
              <Inventory2RoundedIcon
                sx={{
                  fontSize: 55,
                  color: "text.disabled",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
              >
                No products found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Try changing your search
                or filters.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={{
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  minWidth: 900,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        "#F8FAFC",
                    }}
                  >
                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Product
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        SKU
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Category
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Brand
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Price
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Stock
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        Status
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        fontWeight={800}
                      >
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map(
                    (product) => (
                      <TableRow
                        key={product.id}
                        hover
                      >
                        <TableCell>
                          <Typography
                            fontWeight={800}
                            sx={{
                              maxWidth: 220,
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ID: {product.id}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {product.sku}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {product.categoryName ||
                            getCategoryName(
                              product.categoryId
                            )}
                        </TableCell>

                        <TableCell>
                          {product.brandName ||
                            getBrandName(
                              product.brandId
                            )}
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontWeight={800}
                          >
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontWeight={700}
                          >
                            {product.stock ??
                              0}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              product.active
                                ? "Active"
                                : "Inactive"
                            }
                            sx={{
                              fontWeight: 800,
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={0.5}
                          >
                            {canUpdate && (
                              <Tooltip title="Edit Product">
                                <IconButton
                                  onClick={() =>
                                    handleEditProduct(
                                      product
                                    )
                                  }
                                >
                                  <EditRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            {canDelete && (
                              <Tooltip title="Delete Product">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDeleteClick(
                                      product
                                    )
                                  }
                                >
                                  <DeleteOutlineRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading &&
            products.length > 0 && (
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  borderTop:
                    "1px solid",
                  borderColor:
                    "divider",
                  display: "flex",
                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },
                  justifyContent:
                    "space-between",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  select
                  size="small"
                  label="Rows"
                  value={size}
                  onChange={
                    handleSizeChange
                  }
                  sx={{
                    width: 110,
                  }}
                >
                  <MenuItem value={10}>
                    10
                  </MenuItem>

                  <MenuItem value={20}>
                    20
                  </MenuItem>

                  <MenuItem value={40}>
                    40
                  </MenuItem>
                </TextField>

                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={
                      handlePageChange
                    }
                    color="primary"
                    shape="rounded"
                  />
                )}

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Page {page + 1} of{" "}
                  {Math.max(
                    totalPages,
                    1
                  )}
                </Typography>
              </Box>
            )}
        </Card>
      </Container>

      {/* =====================================================
          ADD / EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={formOpen}
        onClose={
          handleCloseForm
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            fontWeight: 900,
          }}
        >
          {editingProduct
            ? "Edit Product"
            : "Add Product"}

          <IconButton
            onClick={
              handleCloseForm
            }
            disabled={submitting}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <ProductForm
          open={formOpen}
          product={editingProduct}
          onClose={
            handleCloseForm
          }
          onSubmit={
            handleSubmitProduct
          }
          submitting={submitting}
        />
      </Dialog>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      <Dialog
        open={deleteDialogOpen}
        onClose={
          handleCloseDeleteDialog
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
          }}
        >
          Delete Product?
        </DialogTitle>

        <Box
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Typography
            color="text.secondary"
          >
            Are you sure you want to
            delete{" "}
            <strong>
              {productToDelete?.name}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1.5 }}
          >
            This action cannot be
            undone.
          </Typography>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={
              handleCloseDeleteDialog
            }
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={
              handleConfirmDelete
            }
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Delete"
            )}
          </Button>
        </Stack>
      </Dialog>
    </Box>
  );
}