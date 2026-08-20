import axiosClient from "./axiosClient";

export const getProducts = async (page = 0, size = 20) => {
  const response = await axiosClient.get("/products", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);

  return response.data;
};

export const searchProducts = async (keyword, page = 0, size = 20) => {
  const response = await axiosClient.get("/products/search", {
    params: {
      keyword,
      page,
      size,
    },
  });

  return response.data;
};