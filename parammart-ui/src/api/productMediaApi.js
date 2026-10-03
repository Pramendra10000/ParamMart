import axiosClient from "./axiosClient";

// ---------------------------------------------------------
// GET ALL MEDIA
// ---------------------------------------------------------
export const getProductMedia = async (productId) => {
  const response = await axiosClient.get(
    `/products/${productId}/media`
  );

  return response.data;
};

// ---------------------------------------------------------
// GET PRIMARY MEDIA
// ---------------------------------------------------------
export const getPrimaryMedia = async (productId) => {
  const response = await axiosClient.get(
    `/products/${productId}/media/primary`
  );

  // 204 No Content means there is no primary image
  if (response.status === 204) {
    return null;
  }

  return response.data;
};

// ---------------------------------------------------------
// UPLOAD PRODUCT IMAGE
// ---------------------------------------------------------
export const uploadProductMedia = async (
  productId,
  file,
  {
    primary = false,
    altText = "",
  } = {}
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("mediaType", "IMAGE");
  formData.append("primary", String(primary));

  if (altText?.trim()) {
    formData.append("altText", altText.trim());
  }

  const response = await axiosClient.post(
    `/products/${productId}/media`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ---------------------------------------------------------
// SET PRIMARY IMAGE
// ---------------------------------------------------------
export const setPrimaryProductMedia = async (
  productId,
  mediaId
) => {
  await axiosClient.put(
    `/products/${productId}/media/${mediaId}/primary`
  );
};

// ---------------------------------------------------------
// DELETE IMAGE
// ---------------------------------------------------------
export const deleteProductMedia = async (
  productId,
  mediaId
) => {
  await axiosClient.delete(
    `/products/${productId}/media/${mediaId}`
  );
};