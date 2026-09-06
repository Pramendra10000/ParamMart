import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import {
  getProducts,
  searchProducts,
} from "../../api/productApi";

import ProductGrid from "./ProductGrid";


export default function Products() {

  /*
   * ============================
   * STATE
   * ============================
   */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(12);

  const [sort, setSort] = useState("id,desc");

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);


  /*
   * ============================
   * LOAD PRODUCTS
   * ============================
   */

  useEffect(() => {
    loadProducts();
  }, [page, size, sort]);


  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");


      let data;


      /*
       * If search keyword exists
       * call search API.
       */

      if (keyword.trim()) {

        data = await searchProducts(
          keyword.trim(),
          page,
          size,
          sort
        );

      }

      /*
       * Otherwise load all products.
       */

      else {

        data = await getProducts(
          page,
          size,
          sort
        );

      }


      console.log(
        "Products from Spring Boot:",
        data
      );


      /*
       * Spring Page response
       */

      setProducts(
        data.content || []
      );

      setTotalPages(
        data.totalPages || 0
      );

      setTotalElements(
        data.totalElements || 0
      );

    }

    catch (err) {

      console.error(
        "Failed to load products:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to load products. Please try again."
      );

    }

    finally {

      setLoading(false);

    }
  };


  /*
   * ============================
   * SEARCH
   * ============================
   */

  const handleSearch = async () => {

    /*
     * Always start search
     * from first page.
     */

    setPage(0);


    try {

      setLoading(true);

      setError("");


      const searchText =
        keyword.trim();


      /*
       * Empty search
       * means load all products.
       */

      if (!searchText) {

        const data = await getProducts(
          0,
          size,
          sort
        );


        setProducts(
          data.content || []
        );

        setTotalPages(
          data.totalPages || 0
        );

        setTotalElements(
          data.totalElements || 0
        );


        return;
      }


      /*
       * Search backend
       */

      const data =
        await searchProducts(
          searchText,
          0,
          size,
          sort
        );


      console.log(
        "Search results:",
        data
      );


      setProducts(
        data.content || []
      );

      setTotalPages(
        data.totalPages || 0
      );

      setTotalElements(
        data.totalElements || 0
      );

    }

    catch (err) {

      console.error(
        "Product search failed:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to search products. Please try again."
      );

    }

    finally {

      setLoading(false);

    }
  };


  /*
   * ============================
   * CLEAR SEARCH
   * ============================
   */

  const handleClearSearch = async () => {

    setKeyword("");

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
        data.content || []
      );

      setTotalPages(
        data.totalPages || 0
      );

      setTotalElements(
        data.totalElements || 0
      );

    }

    catch (err) {

      console.error(
        "Failed to reload products:",
        err
      );


      setError(
        "Unable to reload products."
      );

    }

    finally {

      setLoading(false);

    }
  };


  /*
   * ============================
   * PAGINATION
   * ============================
   */

  const handlePageChange = (
    _event,
    newPage
  ) => {

    /*
     * MUI pagination starts
     * from 1.
     *
     * Spring starts from 0.
     */

    setPage(newPage - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /*
   * ============================
   * PAGE SIZE
   * ============================
   */

  const handleSizeChange = (
    event
  ) => {

    setSize(
      Number(event.target.value)
    );

    setPage(0);
  };


  /*
   * ============================
   * SORT
   * ============================
   */

  const handleSortChange = (
    event
  ) => {

    setSort(
      event.target.value
    );

    setPage(0);
  };


  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {

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


  /*
   * ============================
   * PAGE
   * ============================
   */

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

      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box
        sx={{
          mb: 3,
        }}
      >

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            mb: 1,
          }}
        >
          Products
        </Typography>


        <Typography
          sx={{
            color: "#64748B",
          }}
        >
          Browse our complete
          product collection.
        </Typography>

      </Box>


      {/* =========================
          SEARCH + SORT
      ========================= */}

      <Box
        sx={{
          display: "flex",

          gap: 2,

          flexWrap: "wrap",

          alignItems: "center",

          mb: 3,
        }}
      >

        {/* SEARCH */}

        <TextField
          fullWidth
          placeholder="Search products..."
          value={keyword}
          onChange={(event) =>
            setKeyword(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key === "Enter"
            ) {

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

              backgroundColor:
                "#FFFFFF",

            },
          }}

          InputProps={{

            startAdornment: (

              <InputAdornment
                position="start"
              >

                <SearchRoundedIcon
                  color="action"
                />

              </InputAdornment>

            ),

            endAdornment:

              keyword && (

                <InputAdornment
                  position="end"
                >

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


        {/* SEARCH BUTTON */}

        <Box
          component="button"
          onClick={handleSearch}
          sx={{
            border: "none",

            cursor: "pointer",

            borderRadius: 2.5,

            px: 3,

            py: 1.6,

            background:
              "linear-gradient(135deg,#2563EB,#4F46E5)",

            color: "#FFFFFF",

            fontSize: "0.95rem",

            fontWeight: 700,

            transition:
              "all .2s ease",

            "&:hover": {

              transform:
                "translateY(-2px)",

              boxShadow:
                "0 10px 25px rgba(37,99,235,.25)",

            },

            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          Search
        </Box>


        {/* SORT */}

        <FormControl
          sx={{
            minWidth: {
              xs: "100%",
              sm: 220,
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

              backgroundColor:
                "#FFFFFF",
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

      </Box>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>

      )}


      {/* =========================
          RESULT INFORMATION
      ========================= */}

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
            color:
              "text.secondary",

            fontWeight: 600,
          }}
        >
          {totalElements} products available
        </Typography>


        {/* PAGE SIZE */}

        <FormControl
          size="small"
        >

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


      {/* =========================
          PRODUCT GRID
      ========================= */}

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


      {/* =========================
          EMPTY STATE
      ========================= */}

      {products.length === 0 && (

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
            sx={{
              mt: 1,
            }}
          >
            Try a different
            search keyword.
          </Typography>

        </Box>

      )}


      {/* =========================
          PAGINATION
      ========================= */}

      {totalPages > 1 && (

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            mt: 5,

            pb: 3,
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