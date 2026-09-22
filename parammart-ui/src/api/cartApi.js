import axiosClient from "./axiosClient";

export const addToCart = async (productId, quantity = 1) => {
    const response = await axiosClient.post("/cart/add", {
        productId,
        quantity,
    });

    return response.data;
};

export const getCart = async () => {
    const response = await axiosClient.get("/cart");

    return response.data;
};

export const updateCartQuantity = async (
    productId,
    quantity
) => {
    const response = await axiosClient.put(
        `/cart/${productId}/${quantity}`
    );

    return response.data;
};

export const removeCartItem = async (productId) => {
    const response = await axiosClient.delete(
        `/cart/${productId}`
    );

    return response.data;
};

export const clearCart = async () => {
    const response = await axiosClient.delete(
        "/cart/clear"
    );

    return response.data;
};