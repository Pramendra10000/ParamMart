import axiosClient from "./axiosClient";

// =========================================================
// GET PRODUCTS
// Supports:
// categoryId
// brandId
// page
// size
// sort
// =========================================================

export const getProducts = async (
  page = 0,
  size = 12,
  sort = "id,desc",
  categoryId = "",
  brandId = ""
) => {
  const params = {
    page,
    size,
    sort,
  };

  if (categoryId) {
    params.categoryId = categoryId;
  }

  if (brandId) {
    params.brandId = brandId;
  }

  const response = await axiosClient.get("/products", {
    params,
  });

  return response.data;
};

// =========================================================
// GET PRODUCT BY ID
// =========================================================

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);

  return response.data;
};

// =========================================================
// SEARCH PRODUCTS
// Supports:
// keyword
// categoryId
// brandId
// page
// size
// sort
// =========================================================

export const searchProducts = async (
  keyword,
  page = 0,
  size = 12,
  sort = "id,desc",
  categoryId = "",
  brandId = ""
) => {
  const params = {
    keyword,
    page,
    size,
    sort,
  };

  if (categoryId) {
    params.categoryId = categoryId;
  }

  if (brandId) {
    params.brandId = brandId;
  }

  const response = await axiosClient.get("/products/search", {
    params,
  });

  return response.data;
};