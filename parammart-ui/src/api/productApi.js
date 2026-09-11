import axiosClient from "./axiosClient";

// =========================================================
// PRODUCTS API
// =========================================================

/**
 * Get products with optional category and brand filters.
 *
 * Backend:
 * GET /api/products
 *
 * Supported:
 * - page
 * - size
 * - sort
 * - categoryId
 * - brandId
 */
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

  const response = await axiosClient.get("/products", {
    params,
  });

  return response.data;
};


// =========================================================
// GET PRODUCT BY ID
// =========================================================

/**
 * Backend:
 * GET /api/products/{id}
 */
export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);

  return response.data;
};


// =========================================================
// SEARCH PRODUCTS
// =========================================================

/**
 * Search products with optional category and brand filters.
 *
 * Backend:
 * GET /api/products/search
 *
 * Supported:
 * - keyword
 * - page
 * - size
 * - sort
 * - categoryId
 * - brandId
 */
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

  const response = await axiosClient.get("/products/search", {
    params,
  });

  return response.data;
};


// =========================================================
// CATEGORIES API
// =========================================================

/**
 * Get all categories.
 *
 * Backend:
 * GET /api/categories
 *
 * Backend returns:
 * [
 *   {
 *     id,
 *     name,
 *     description,
 *     active,
 *     ...
 *   }
 * ]
 */
export const getCategories = async () => {
  const response = await axiosClient.get("/categories");

  return response.data;
};


// =========================================================
// BRANDS API
// =========================================================

/**
 * Get all brands.
 *
 * Backend:
 * GET /api/brands
 *
 * Backend returns Spring Page:
 *
 * {
 *   content: [],
 *   totalElements: ...,
 *   totalPages: ...
 * }
 */
export const getBrands = async (
  page = 0,
  size = 100,
  sort = "name,asc"
) => {
  const response = await axiosClient.get("/brands", {
    params: {
      page,
      size,
      sort,
    },
  });

  return response.data;
};