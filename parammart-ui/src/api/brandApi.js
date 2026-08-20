import axiosClient from "./axiosClient";

export const getBrands = async (
  page = 0,
  size = 20
) => {
  const response = await axiosClient.get("/brands", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const getBrandById = async (id) => {
  const response = await axiosClient.get(
    `/brands/${id}`
  );

  return response.data;
};

export const createBrand = async (data) => {
  const response = await axiosClient.post(
    "/brands",
    data
  );

  return response.data;
};

export const updateBrand = async (id, data) => {
  const response = await axiosClient.put(
    `/brands/${id}`,
    data
  );

  return response.data;
};

export const deleteBrand = async (id) => {
  await axiosClient.delete(`/brands/${id}`);
};