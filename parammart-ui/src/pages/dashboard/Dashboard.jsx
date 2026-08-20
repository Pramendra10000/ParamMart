import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

import ProductCard from "../../components/dashboard/ProductCard";
import { getProducts } from "../../api/productApi";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts(0, 20);

      /*
       * Spring Boot returns a Page<ProductResponse>.
       *
       * Therefore the actual products are inside:
       *
       * data.content
       */
      setProducts(data.content || []);

    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load products. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);

    // Cart functionality will be implemented next.
  };

  const handleViewProduct = (product) => {
    console.log("View product:", product);

    // Product details page will be implemented next.
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F5F7FA",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Container maxWidth="xl">

        {/* =====================================================
            Dashboard Header
        ===================================================== */}

        <Box sx={{ mb: 4 }}>

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
            Welcome to ParamMart 👋
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: {
                xs: 14,
                sm: 16,
              },
            }}
          >
            Explore our products and find everything you need.
          </Typography>

        </Box>


        {/* =====================================================
            Loading
        ===================================================== */}

        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}


        {/* =====================================================
            Error
        ===================================================== */}

        {!loading && error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}


        {/* =====================================================
            Products
        ===================================================== */}

        {!loading && !error && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Featured Products
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {products.length} products
              </Typography>
            </Box>


            {products.length === 0 ? (

              <Alert
                severity="info"
                sx={{
                  borderRadius: 3,
                }}
              >
                No products available.
              </Alert>

            ) : (

              <Grid
                container
                spacing={{
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                }}
              >

                {products.map((product) => (

                  <Grid
                    key={product.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                    }}
                  >

                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onView={handleViewProduct}
                    />

                  </Grid>

                ))}

              </Grid>

            )}
          </>
        )}

      </Container>
    </Box>
  );
}