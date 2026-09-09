import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

import {
  getProducts,
  searchProducts,
} from "../../api/productApi";

import axiosClient from "../../api/axiosClient";

import ProductGrid from "./ProductGrid";

export default function Products() {

  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // SEARCH
  // =========================================================

  const [keyword, setKeyword] = useState("");

  // =========================================================
  // FILTERS
  // =========================================================

  const [categoryId, setCategoryId] = useState("");

  const [brandId, setBrandId] = useState("");

  const [categories, setCategories] = useState([]);

  const [brands, setBrands] = useState([]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(12);

  // =========================================================
  // SORTING
  // =========================================================

  const [sort, setSort] = useState("id,desc");

  // =========================================================
  // PAGE INFO
  // =========================================================

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);


  // =========================================================
  // LOAD CATEGORIES + BRANDS
  // =========================================================

  useEffect(() => {
    loadFilters();
  }, []);


  const loadFilters = async () => {

    try {

      const [categoryResponse, brandResponse] =
        await Promise.all([
          axiosClient.get("/categories"),
          axiosClient.get("/brands"),
        ]);

      setCategories(
        categoryResponse.data?.content ||
        categoryResponse.data ||
        []
      );

      setBrands(
        brandResponse.data?.content ||
        brandResponse.data ||
        []
      );

    } catch (err) {

      console.error(
        "Failed to load categories/brands:",
        err
      );

    }
  };


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  useEffect(() => {

    loadProducts();

  }, [
    page,
    size,
    sort,
    categoryId,
    brandId,
  ]);


  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");

      let data;

      if (keyword.trim()) {

        data = await searchProducts(
          keyword.trim(),
          page,
          size,
          sort,
          categoryId,
          brandId
        );

      } else {

        data = await getProducts(
          page,
          size,
          sort,
          categoryId,
          brandId
        );
      }

      console.log(
        "Products from Spring Boot:",
        data
      );

      setProducts(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(
        data.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Failed to load products:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load products. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = async () => {

    setPage(0);

    try {

      setLoading(true);

      setError("");

      const searchText = keyword.trim();

      let data;

      if (!searchText) {

        data = await getProducts(
          0,
          size,
          sort,
          categoryId,
          brandId
        );

      } else {

        data = await searchProducts(
          searchText,
          0,
          size,
          sort,
          categoryId,
          brandId
        );
      }

      setProducts(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(
        data.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Product search failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to search products."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {

    setKeyword("");

    setPage(0);

  };


  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (event) => {

    setCategoryId(event.target.value);

    setPage(0);

  };


  // =========================================================
  // BRAND CHANGE
  // =========================================================

  const handleBrandChange = (event) => {

    setBrandId(event.target.value);

    setPage(0);

  };


  // =========================================================
  // SORT CHANGE
  // =========================================================

  const handleSortChange = (event) => {

    setSort(event.target.value);

    setPage(0);

  };


  // =========================================================
  // PAGE SIZE
  // =========================================================

  const handleSizeChange = (event) => {

    setSize(Number(event.target.value));

    setPage(0);

  };


  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (
    _event,
    newPage
  ) => {

    setPage(newPage - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {

    setCategoryId("");

    setBrandId("");

    setKeyword("");

    setPage(0);

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading && products.length === 0) {

    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  }


  return (

    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        maxWidth: "1800px",
        mx: "auto",
      }}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box sx={{ mb: 3 }}>

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ mb: 1 }}
        >
          Products
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
          }}
        >
          Browse our complete product collection.
        </Typography>

      </Box>


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >

        <TextField
          fullWidth
          placeholder="Search products..."
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          onKeyDown={(event) => {

            if (event.key === "Enter") {
              handleSearch();
            }

          }}
          sx={{
            flex: 1,

            minWidth: {
              xs: "100%",
              sm: 300,
            },

            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">

                <SearchRoundedIcon
                  color="action"
                />

              </InputAdornment>
            ),

            endAdornment:
              keyword && (
                <InputAdornment position="end">

                  <IconButton
                    onClick={
                      handleClearSearch
                    }
                    size="small"
                  >
                    <ClearRoundedIcon />
                  </IconButton>

                </InputAdornment>
              ),
          }}
        />

        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: "none",
            background:
              "linear-gradient(135deg,#2563EB,#4F46E5)",
          }}
        >
          Search
        </Button>

      </Box>


      {/* =====================================================
          FILTERS
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          p: 2,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 4px 20px rgba(15,23,42,.06)",
        }}
      >

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >

          <FilterAltRoundedIcon
            color="primary"
          />

          <Typography
            fontWeight={800}
          >
            Filters
          </Typography>

        </Stack>


        {/* CATEGORY */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 200,
            },
          }}
        >

          <Select
            value={categoryId}
            onChange={handleCategoryChange}
            displayEmpty
            sx={{
              borderRadius: 2.5,
            }}
          >

            <MenuItem value="">
              All Categories
            </MenuItem>

            {categories.map((category) => (

              <MenuItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </MenuItem>

            ))}

          </Select>

        </FormControl>


        {/* BRAND */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 200,
            },
          }}
        >

          <Select
            value={brandId}
            onChange={handleBrandChange}
            displayEmpty
            sx={{
              borderRadius: 2.5,
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

          </Select>

        </FormControl>


        {/* SORT */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 220,
            },
          }}
        >

          <Select
            value={sort}
            onChange={handleSortChange}
            sx={{
              borderRadius: 2.5,
            }}
          >

            <MenuItem value="id,desc">
              Latest Products
            </MenuItem>

            <MenuItem value="name,asc">
              Name: A → Z
            </MenuItem>

            <MenuItem value="name,desc">
              Name: Z → A
            </MenuItem>

            <MenuItem value="price,asc">
              Price: Low → High
            </MenuItem>

            <MenuItem value="price,desc">
              Price: High → Low
            </MenuItem>

          </Select>

        </FormControl>


        {/* CLEAR FILTERS */}

        {(categoryId ||
          brandId ||
          keyword) && (

          <Button
            onClick={handleClearFilters}
            variant="outlined"
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Clear Filters
          </Button>

        )}

      </Box>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          PRODUCT COUNT + PAGE SIZE
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >

        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 600,
          }}
        >
          {totalElements} products available
        </Typography>


        <FormControl size="small">

          <Select
            value={size}
            onChange={handleSizeChange}
            sx={{
              minWidth: 120,
              borderRadius: 2,
            }}
          >

            <MenuItem value={8}>
              8 / page
            </MenuItem>

            <MenuItem value={12}>
              12 / page
            </MenuItem>

            <MenuItem value={20}>
              20 / page
            </MenuItem>

            <MenuItem value={40}>
              40 / page
            </MenuItem>

          </Select>

        </FormControl>

      </Box>


      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      {products.length > 0 ? (

        <ProductGrid
          products={products}
          onAddToCart={(product) => {
            console.log(
              "Add to cart:",
              product
            );
          }}
          onView={(product) => {
            console.log(
              "View product:",
              product
            );
          }}
        />

      ) : (

        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
          >
            No products found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Try changing your search or filters.
          </Typography>

        </Box>

      )}


      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {totalPages > 1 && (

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            pb: 3,
          }}
        >

          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />

        </Box>

      )}

    </Box>
  );
}