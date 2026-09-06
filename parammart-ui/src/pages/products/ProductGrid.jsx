import { Box } from "@mui/material";

import ProductCard from "../../components/dashboard/ProductCard";

export default function ProductGrid({
  products = [],
  onAddToCart,
  onView,
}) {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },

        gap: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onView={onView}
        />
      ))}
    </Box>
  );
}