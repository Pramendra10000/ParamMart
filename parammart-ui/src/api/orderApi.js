
import axiosClient from "./axiosClient";

export const placeOrder = async (addressId) => {
    const response = await axiosClient.post(
        "/orders/place",
        {
            addressId,
        }
    );

    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosClient.get(
        "/orders"
    );

    return response.data;
};

export const getOrderById = async (id) => {
    const response = await axiosClient.get(
        `/orders/${id}`
    );

    return response.data;
};

export const cancelOrder = async (id) => {
    const response = await axiosClient.put(
        `/orders/cancel/${id}`
    );

    return response.data;
};

