import axiosClient from "./axiosClient";

export const getAddresses = async () => {
    const response = await axiosClient.get("/addresses");
    return response.data;
};

export const addAddress = async (payload) => {
    const response = await axiosClient.post("/addresses", payload);
    return response.data;
};

export const updateAddress = async (id, payload) => {
    const response = await axiosClient.put(
        `/addresses/${id}`,
        payload
    );
    return response.data;
};

export const deleteAddress = async (id) => {
    const response = await axiosClient.delete(
        `/addresses/${id}`
    );
    return response.data;
};

export const setDefaultAddress = async (id) => {
    const response = await axiosClient.put(
        `/addresses/default/${id}`
    );
    return response.data;
};