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
  getCategories,
  getBrands,
} from "../../api/productApi";

import ProductGrid from "./ProductGrid";


// =========================================================
// PRODUCTS PAGE
// =========================================================

export default function Products() {

  // =======================================================
  // PRODUCT DATA
  // =======================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =======================================================
  // SEARCH
  // =======================================================

  const [keyword, setKeyword] = useState("");


  // =======================================================
  // FILTERS
  // =======================================================

  const [categoryId, setCategoryId] = useState("");

  const [brandId, setBrandId] = useState("");


  // =======================================================
  // FILTER OPTIONS
  // =======================================================

  const [categories, setCategories] = useState([]);

  const [brands, setBrands] = useState([]);

  const [filtersLoading, setFiltersLoading] = useState(true);


  // =======================================================
  // PAGINATION / SORT
  // =======================================================

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(12);

  const [sort, setSort] = useState("id,desc");

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);


  // =======================================================
  // LOAD CATEGORY + BRAND FILTERS
  // =======================================================

  useEffect(() => {
    loadFilters();
  }, []);


  const loadFilters = async () => {

    try {

      setFiltersLoading(true);

      setError("");

      const [categoryData, brandData] =
        await Promise.all([
          getCategories(),
          getBrands(0, 100, "name,asc"),
        ]);


      // ---------------------------------------------------
      // CATEGORIES
      // Backend returns List<Category>
      // ---------------------------------------------------

      const categoryList =
        Array.isArray(categoryData)
          ? categoryData
          : categoryData?.content || [];

      setCategories(categoryList);


      // ---------------------------------------------------
      // BRANDS
      // Backend returns Page<BrandResponse>
      // ---------------------------------------------------

      const brandList =
        Array.isArray(brandData)
          ? brandData
          : brandData?.content || [];

      setBrands(brandList);

    } catch (err) {

      console.error(
        "Failed to load category/brand filters:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load product filters. Please try again."
      );

    } finally {

      setFiltersLoading(false);

    }
  };


  // =======================================================
  // LOAD PRODUCTS
  // =======================================================

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


      // ---------------------------------------------------
      // SEARCH + FILTERS
      // ---------------------------------------------------

      if (keyword.trim()) {

        data = await searchProducts(
          keyword.trim(),
          page,
          size,
          sort,
          categoryId,
          brandId
        );

      }

      // ---------------------------------------------------
      // NORMAL PRODUCTS + FILTERS
      // ---------------------------------------------------

      else {

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


      // ---------------------------------------------------
      // PRODUCT DATA
      // ---------------------------------------------------

      setProducts(
        Array.isArray(data?.content)
          ? data.content
          : []
      );


      // ---------------------------------------------------
      // PAGINATION DATA
      // ---------------------------------------------------

      setTotalPages(
        data?.totalPages || 0
      );

      setTotalElements(
        data?.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Failed to load products:",
        err
      );

      setProducts([]);

      setTotalPages(0);

      setTotalElements(0);

      setError(
        err.response?.data?.message ||
        "Unable to load products. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = async () => {

    const searchText = keyword.trim();

    // -----------------------------------------------------
    // Always start search from first page
    // -----------------------------------------------------

    setPage(0);


    try {

      setLoading(true);

      setError("");

      let data;


      // ---------------------------------------------------
      // EMPTY SEARCH
      // ---------------------------------------------------

      if (!searchText) {

        data = await getProducts(
          0,
          size,
          sort,
          categoryId,
          brandId
        );

      }

      // ---------------------------------------------------
      // SEARCH WITH CURRENT FILTERS
      // ---------------------------------------------------

      else {

        data = await searchProducts(
          searchText,
          0,
          size,
          sort,
          categoryId,
          brandId
        );

      }


      console.log(
        "Search results:",
        data
      );


      setProducts(
        Array.isArray(data?.content)
          ? data.content
          : []
      );

      setTotalPages(
        data?.totalPages || 0
      );

      setTotalElements(
        data?.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Product search failed:",
        err
      );

      setProducts([]);

      setTotalPages(0);

      setTotalElements(0);

      setError(
        err.response?.data?.message ||
        "Unable to search products. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // CLEAR SEARCH
  // =======================================================

  const handleClearSearch = async () => {

    setKeyword("");

    setPage(0);


    try {

      setLoading(true);

      setError("");


      const data = await getProducts(
        0,
        size,
        sort,
        categoryId,
        brandId
      );


      setProducts(
        Array.isArray(data?.content)
          ? data.content
          : []
      );

      setTotalPages(
        data?.totalPages || 0
      );

      setTotalElements(
        data?.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Failed to clear search:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to reload products."
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // CATEGORY CHANGE
  // =======================================================

  const handleCategoryChange = (event) => {

    const value = event.target.value;

    setCategoryId(value);

    setPage(0);

  };


  // =======================================================
  // BRAND CHANGE
  // =======================================================

  const handleBrandChange = (event) => {

    const value = event.target.value;

    setBrandId(value);

    setPage(0);

  };


  // =======================================================
  // SORT CHANGE
  // =======================================================

  const handleSortChange = (event) => {

    setSort(event.target.value);

    setPage(0);

  };


  // =======================================================
  // PAGE SIZE CHANGE
  // =======================================================

  const handleSizeChange = (event) => {

    setSize(
      Number(event.target.value)
    );

    setPage(0);

  };


  // =======================================================
  // PAGE CHANGE
  // =======================================================

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


  // =======================================================
  // CLEAR ALL FILTERS
  // =======================================================

  const handleClearFilters = async () => {

    setKeyword("");

    setCategoryId("");

    setBrandId("");

    setPage(0);


    try {

      setLoading(true);

      setError("");


      const data = await getProducts(
        0,
        size,
        sort
      );


      setProducts(
        Array.isArray(data?.content)
          ? data.content
          : []
      );

      setTotalPages(
        data?.totalPages || 0
      );

      setTotalElements(
        data?.totalElements || 0
      );

    } catch (err) {

      console.error(
        "Failed to clear filters:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to reload products."
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // ACTIVE FILTER CHECK
  // =======================================================

  const hasActiveFilters =
    keyword.trim() !== "" ||
    categoryId !== "" ||
    brandId !== "";


  // =======================================================
  // LOADING STATE
  // =======================================================

  if (loading && products.length === 0) {

    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );

  }


  // =======================================================
  // PAGE UI
  // =======================================================

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

        width: "100%",
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Box sx={{ mb: 3 }}>

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            mb: 1,
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
              md: "2.6rem",
            },
          }}
        >
          Products
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
            },
          }}
        >
          Browse our complete product collection.
        </Typography>

      </Box>


      {/* =================================================
          SEARCH BAR
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2.5,

          flexDirection: {
            xs: "column",
            sm: "row",
          },
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
                    onClick={handleClearSearch}
                    size="small"
                  >
                    <ClearRoundedIcon />
                  </IconButton>

                </InputAdornment>

              ),
          }}

          sx={{

            "& .MuiOutlinedInput-root": {

              borderRadius: 3,

              backgroundColor: "#FFFFFF",

              minHeight: 54,

            },

          }}
        />


        <Button
          variant="contained"

          onClick={handleSearch}

          sx={{

            minWidth: {
              xs: "100%",
              sm: 120,
            },

            minHeight: 54,

            borderRadius: 3,

            fontWeight: 700,

            textTransform: "none",

            background:
              "linear-gradient(135deg,#2563EB,#4F46E5)",

            "&:hover": {

              background:
                "linear-gradient(135deg,#1D4ED8,#4338CA)",

              transform: "translateY(-1px)",

            },

          }}
        >
          Search
        </Button>

      </Box>


      {/* =================================================
          FILTER BAR
      ================================================= */}

      <Box
        sx={{
          backgroundColor: "#FFFFFF",

          borderRadius: 4,

          p: {
            xs: 2,
            sm: 2.5,
          },

          mb: 3,

          boxShadow:
            "0 10px 30px rgba(15,23,42,.07)",

          display: "flex",

          alignItems: {
            xs: "stretch",
            md: "center",
          },

          gap: 1.5,

          flexWrap: "wrap",
        }}
      >

        {/* -----------------------------------------------
            FILTER LABEL
        ------------------------------------------------ */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mr: {
              xs: 0,
              md: 1,
            },
          }}
        >

          <FilterAltRoundedIcon
            sx={{
              color: "primary.main",
            }}
          />

          <Typography
            fontWeight={700}
          >
            Filters
          </Typography>

        </Stack>


        {/* -----------------------------------------------
            CATEGORY
        ------------------------------------------------ */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 220,
            },

            flex: {
              xs: "1 1 100%",
              sm: "1 1 220px",
              md: "0 1 240px",
            },
          }}
        >

          <Select

            value={categoryId}

            onChange={
              handleCategoryChange
            }

            displayEmpty

            disabled={filtersLoading}

            sx={{
              borderRadius: 3,

              backgroundColor: "#FFFFFF",

              minHeight: 48,
            }}
          >

            <MenuItem value="">
              All Categories
            </MenuItem>

            {categories
              .filter(
                (category) =>
                  category?.active !== false
              )
              .map((category) => (

                <MenuItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </MenuItem>

              ))}

          </Select>

        </FormControl>


        {/* -----------------------------------------------
            BRAND
        ------------------------------------------------ */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 220,
            },

            flex: {
              xs: "1 1 100%",
              sm: "1 1 220px",
              md: "0 1 240px",
            },
          }}
        >

          <Select

            value={brandId}

            onChange={
              handleBrandChange
            }

            displayEmpty

            disabled={filtersLoading}

            sx={{
              borderRadius: 3,

              backgroundColor: "#FFFFFF",

              minHeight: 48,
            }}
          >

            <MenuItem value="">
              All Brands
            </MenuItem>

            {brands
              .filter(
                (brand) =>
                  brand?.active !== false
              )
              .map((brand) => (

                <MenuItem
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </MenuItem>

              ))}

          </Select>

        </FormControl>


        {/* -----------------------------------------------
            SORT
        ------------------------------------------------ */}

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 220,
            },

            flex: {
              xs: "1 1 100%",
              sm: "1 1 220px",
              md: "0 1 220px",
            },
          }}
        >

          <Select

            value={sort}

            onChange={
              handleSortChange
            }

            sx={{
              borderRadius: 3,

              backgroundColor: "#FFFFFF",

              minHeight: 48,
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


        {/* -----------------------------------------------
            CLEAR FILTERS
        ------------------------------------------------ */}

        {hasActiveFilters && (

          <Button

            variant="outlined"

            startIcon={
              <ClearRoundedIcon />
            }

            onClick={
              handleClearFilters
            }

            sx={{

              minHeight: 48,

              borderRadius: 3,

              textTransform: "none",

              fontWeight: 700,

              whiteSpace: "nowrap",

              width: {
                xs: "100%",
                sm: "auto",
              },

            }}
          >
            Clear Filters
          </Button>

        )}

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          PRODUCT SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          justifyContent:
            "space-between",

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
          {totalElements}{" "}
          {totalElements === 1
            ? "product"
            : "products"}{" "}
          available
        </Typography>


        {/* -----------------------------------------------
            PAGE SIZE
        ------------------------------------------------ */}

        <FormControl size="small">

          <Select
            value={size}
            onChange={
              handleSizeChange
            }

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


      {/* =================================================
          PRODUCTS
      ================================================= */}

      {products.length > 0 ? (

        <Box
          sx={{
            position: "relative",
          }}
        >

          {/* ---------------------------------------------
              SMALL LOADING INDICATOR
          --------------------------------------------- */}

          {loading && (

            <Box
              sx={{
                position: "absolute",

                top: -10,

                right: 0,

                zIndex: 2,
              }}
            >

              <CircularProgress
                size={24}
              />

            </Box>

          )}


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

        </Box>

      ) : (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 2,
          }}
        >

          <Typography
            variant="h6"
            fontWeight={800}
          >
            No products found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 3,
            }}
          >
            Try changing your search or
            filters.
          </Typography>


          {hasActiveFilters && (

            <Button
              variant="outlined"
              onClick={
                handleClearFilters
              }

              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Clear Filters
            </Button>

          )}

        </Box>

      )}


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            mt: 5,

            pb: 3,

            overflowX: "auto",

            px: 1,
          }}
        >

          <Pagination

            count={totalPages}

            page={page + 1}

            onChange={
              handlePageChange
            }

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