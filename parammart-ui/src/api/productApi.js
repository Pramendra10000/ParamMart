import axiosClient from "./axiosClient";

// =========================================================
// GET PRODUCTS
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

  if (categoryId !== "" && categoryId !== null) {
    params.categoryId = categoryId;
  }

  if (brandId !== "" && brandId !== null) {
    params.brandId = brandId;
  }

  const response = await axiosClient.get(
    "/products",
    { params }
  );

  return response.data;
};


// =========================================================
// GET PRODUCT BY ID
// =========================================================

export const getProductById = async (id) => {
  const response = await axiosClient.get(
    `/products/${id}`
  );

  return response.data;
};


// =========================================================
// SEARCH PRODUCTS
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

  if (categoryId !== "" && categoryId !== null) {
    params.categoryId = categoryId;
  }

  if (brandId !== "" && brandId !== null) {
    params.brandId = brandId;
  }

  const response = await axiosClient.get(
    "/products/search",
    { params }
  );

  return response.data;
};


// =========================================================
// GET CATEGORIES
// =========================================================

export const getCategories = async () => {
  const response = await axiosClient.get(
    "/categories"
  );

  return response.data;
};


// =========================================================
// GET BRANDS
// =========================================================

export const getBrands = async (
  page = 0,
  size = 100,
  sort = "name,asc"
) => {
  const response = await axiosClient.get(
    "/brands",
    {
      params: {
        page,
        size,
        sort,
      },
    }
  );

  return response.data;
};


// =========================================================
// GET PRODUCT MEDIA
// =========================================================

export const getProductMedia = async (
  productId
) => {
  const response = await axiosClient.get(
    `/products/${productId}/media`
  );

  return response.data;
};