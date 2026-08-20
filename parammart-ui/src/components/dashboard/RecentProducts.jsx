import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

export default function RecentProducts({ products = [] }) {
  return (
    <Card
      sx={{
        borderRadius: "22px",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          Recent Products
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 3,
            color: "#94A3B8",
          }}
        >
          Products currently available in your inventory
        </Typography>

        <Stack spacing={1.5}>
          {products.slice(0, 5).map((product) => (
            <Box
              key={product.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 1.5,
                borderRadius: "14px",

                "&:hover": {
                  backgroundColor: "#F8FAFC",
                },

                transition: "background-color .2s ease",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontWeight={700}
                  noWrap
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {product.categoryName}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                <Typography fontWeight={800}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </Typography>

                <Chip
                  label={`${product.stock} in stock`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontWeight: 600,
                    backgroundColor:
                      product.stock <= 15
                        ? "#FEF3C7"
                        : "#DCFCE7",
                    color:
                      product.stock <= 15
                        ? "#92400E"
                        : "#166534",
                  }}
                />
              </Box>
            </Box>
          ))}

          {products.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              sx={{ py: 4 }}
            >
              No products available.
            </Typography>
          )}
        </Stack>

      </CardContent>
    </Card>
  );
}