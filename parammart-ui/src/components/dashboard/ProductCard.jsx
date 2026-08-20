import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Rating,
} from "@mui/material";

import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

export default function ProductCard({ product, onAddToCart, onView }) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 45px rgba(15,23,42,.14)",
        },
      }}
    >
      {/* Wishlist */}
      <IconButton
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
          background: "rgba(255,255,255,.9)",

          "&:hover": {
            background: "#fff",
          },
        }}
      >
        <FavoriteBorderRoundedIcon />
      </IconButton>

      {/* Product Image */}

      <Box
        sx={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#F8FAFC,#EEF2FF)",
        }}
      >
        {product.imageUrl ? (
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 3,
            }}
          />
        ) : (
          <Typography
            color="text.secondary"
            fontWeight={600}
          >
            No Image
          </Typography>
        )}
      </Box>

      <CardContent sx={{ p: 2.5 }}>

        {/* SKU */}

        <Typography
          variant="caption"
          color="text.secondary"
        >
          SKU: {product.sku}
        </Typography>

        {/* Product Name */}

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            mt: 0.5,
            minHeight: 58,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        {/* Description */}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            minHeight: 42,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>

        {/* Rating */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1.5,
          }}
        >
          <Rating
            value={4.5}
            precision={0.5}
            size="small"
            readOnly
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            4.5
          </Typography>
        </Box>

        {/* Price */}

        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            mt: 1.5,
            color: "primary.main",
          }}
        >
          ₹{Number(product.price).toLocaleString("en-IN")}
        </Typography>

        {/* Actions */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartRoundedIcon />}
            onClick={() => onAddToCart?.(product)}
          >
            Add to Cart
          </Button>

          <IconButton
            onClick={() => onView?.(product)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <VisibilityRoundedIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}