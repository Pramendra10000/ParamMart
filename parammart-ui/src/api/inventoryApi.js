import axiosClient from "./axiosClient";

export const getInventory = async () => {
  const response = await axiosClient.get("/inventory");

  return response.data;
};

export const getInventoryById = async (id) => {
  const response = await axiosClient.get(`/inventory/${id}`);

  return response.data;
};

export const getInventoryByProduct = async (productId) => {
  const response = await axiosClient.get(
    `/inventory/product/${productId}`
  );

  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await axiosClient.get(
    "/inventory/low-stock"
  );

  return response.data;
};

export const createInventory = async (data) => {
  const response = await axiosClient.post(
    "/inventory",
    data
  );

  return response.data;
};

export const updateInventory = async (id, data) => {
  const response = await axiosClient.put(
    `/inventory/${id}`,
    data
  );

  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await axiosClient.delete(
    `/inventory/${id}`
  );

  return response.data;
};

export const stockIn = async (productId, quantity) => {
  const response = await axiosClient.put(
    `/inventory/stock-in/${productId}/${quantity}`
  );

  return response.data;
};

export const stockOut = async (productId, quantity) => {
  const response = await axiosClient.put(
    `/inventory/stock-out/${productId}/${quantity}`
  );

  return response.data;
};