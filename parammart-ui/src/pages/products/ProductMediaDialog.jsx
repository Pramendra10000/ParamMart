import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  DeleteOutlineRounded,
  ImageOutlined,
  Star,
  StarBorder,
  CloudUploadOutlined,
  Close
} from "@mui/icons-material";

import {
  getProductMedia,
  uploadProductMedia,
  setPrimaryProductMedia,
  deleteProductMedia,
} from "../../api/productMediaApi";

import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductMediaDialog({
  open,
  product,
  onClose,
}) {
  const { showSuccess, showError, showWarning } = useToast();
  const { hasPermission } = useAuth();

  const fileInputRef = useRef(null);

  const [media, setMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [primaryId, setPrimaryId] = useState(null);

  const canUpload = hasPermission("PRODUCT_UPDATE");
  const canSetPrimary = hasPermission("PRODUCT_UPDATE");
  const canDelete = hasPermission("PRODUCT_DELETE");

  // ---------------------------------------------------------
  // LOAD PRODUCT MEDIA
  // ---------------------------------------------------------
  const loadMedia = async () => {
    if (!product?.id) {
      setMedia([]);
      setPrimaryId(null);
      return;
    }

    try {
      setLoading(true);

      const data = await getProductMedia(product.id);

      const mediaList = Array.isArray(data) ? data : [];

      setMedia(mediaList);

      const primaryMedia = mediaList.find(
        (item) => item.isPrimary === true
      );

      setPrimaryId(primaryMedia?.id ?? null);
    } catch (error) {
      console.error("Failed to load product media:", error);

      showError(
        error?.response?.data?.message ||
          "Failed to load product images."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // LOAD WHEN DIALOG OPENS
  // ---------------------------------------------------------
  useEffect(() => {
    if (open && product?.id) {
      setSelectedFiles([]);
      loadMedia();
    }
  }, [open, product?.id]);

  // ---------------------------------------------------------
  // FILE SELECTION
  // ---------------------------------------------------------
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) =>
      [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ].includes(file.type)
    );

    if (imageFiles.length !== files.length) {
      showWarning(
        "Only JPG, PNG, WEBP and AVIF images are allowed."
      );
    }

    if (!imageFiles.length) {
      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    const validFiles = imageFiles.filter(
      (file) => file.size <= maxSize
    );

    if (validFiles.length !== imageFiles.length) {
      showWarning(
        "Each image must be 10 MB or smaller."
      );
    }

    setSelectedFiles(validFiles);

    // Allow selecting the same file again later.
    event.target.value = "";
  };

  // ---------------------------------------------------------
  // REMOVE SELECTED FILE
  // ---------------------------------------------------------
  const removeSelectedFile = (index) => {
    setSelectedFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  // ---------------------------------------------------------
  // UPLOAD SELECTED FILES
  // ---------------------------------------------------------
  const handleUpload = async () => {
    if (!product?.id) {
      showError("Product ID is missing.");
      return;
    }

    if (!selectedFiles.length) {
      showWarning("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);

      let uploadedCount = 0;

      /*
       * If the product currently has no primary image,
       * the first uploaded image becomes primary.
       */
      const shouldFirstImageBePrimary =
        !media.some((item) => item.isPrimary === true);

      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];

        const uploaded = await uploadProductMedia(
          product.id,
          file,
          {
            primary:
              shouldFirstImageBePrimary && index === 0,
            altText: `${product.name} product image`,
          }
        );

        if (uploaded) {
          uploadedCount++;
        }
      }

      setSelectedFiles([]);

      await loadMedia();

      showSuccess(
        uploadedCount === 1
          ? "Product image uploaded successfully."
          : `${uploadedCount} product images uploaded successfully.`
      );
    } catch (error) {
      console.error("Failed to upload product images:", error);

      showError(
        error?.response?.data?.message ||
          "Failed to upload product images."
      );

      await loadMedia();
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------
  // SET PRIMARY
  // ---------------------------------------------------------
  const handleSetPrimary = async (mediaId) => {
    if (!product?.id || !mediaId) {
      return;
    }

    try {
      setPrimaryId(mediaId);

      await setPrimaryProductMedia(
        product.id,
        mediaId
      );

      await loadMedia();

      showSuccess("Primary image updated successfully.");
    } catch (error) {
      console.error(
        "Failed to set primary image:",
        error
      );

      showError(
        error?.response?.data?.message ||
          "Failed to set primary image."
      );

      await loadMedia();
    }
  };

  // ---------------------------------------------------------
  // DELETE MEDIA
  // ---------------------------------------------------------
  const handleDelete = async (mediaItem) => {
    if (!product?.id || !mediaItem?.id) {
      return;
    }

    const confirmed = window.confirm(
      mediaItem.isPrimary
        ? "This is the primary image. Are you sure you want to delete it?"
        : "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(mediaItem.id);

      await deleteProductMedia(
        product.id,
        mediaItem.id
      );

      await loadMedia();

      showSuccess("Product image deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete product image:",
        error
      );

      showError(
        error?.response?.data?.message ||
          "Failed to delete product image."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------------------------
  // PREVIEW URL
  // ---------------------------------------------------------
  const getPreviewUrl = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <Dialog
      open={open}
      onClose={uploading ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          fontWeight: 700,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Product Images
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {product?.name || "Product"}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={uploading}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>

          {/* =================================================
              UPLOAD SECTION
          ================================================= */}
          {canUpload && (
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                backgroundColor: "#FAFBFF",
              }}
            >
              <CloudUploadOutlined
                sx={{
                  fontSize: 42,
                  color: "primary.main",
                  mb: 1,
                }}
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Add product images
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 2 }}
              >
                Select multiple JPG, PNG, WEBP or AVIF
                images. Maximum 10 MB per image.
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                hidden
                onChange={handleFileSelection}
              />

              <Button
                variant="outlined"
                startIcon={<ImageOutlined />}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
              >
                Select Images
              </Button>
            </Box>
          )}

          {/* =================================================
              SELECTED FILES
          ================================================= */}
          {selectedFiles.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 1.5 }}
              >
                Selected Images ({selectedFiles.length})
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {selectedFiles.map((file, index) => (
                  <Box
                    key={`${file.name}-${index}`}
                    sx={{
                      position: "relative",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box
                      component="img"
                      src={getPreviewUrl(file)}
                      alt={file.name}
                      sx={{
                        width: "100%",
                        height: 130,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() =>
                        removeSelectedFile(index)
                      }
                      disabled={uploading}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor:
                          "rgba(255,255,255,0.9)",
                        "&:hover": {
                          backgroundColor: "#fff",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        p: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                startIcon={
                  uploading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <CloudUploadOutlined />
                  )
                }
                onClick={handleUpload}
                disabled={uploading}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${selectedFiles.length} Image${
                      selectedFiles.length > 1 ? "s" : ""
                    }`}
              </Button>
            </Box>
          )}

          {/* =================================================
              EXISTING MEDIA
          ================================================= */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ mb: 1.5 }}
            >
              Uploaded Images
            </Typography>

            {loading ? (
              <Box
                sx={{
                  minHeight: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : media.length === 0 ? (
              <Alert severity="info">
                No product images have been uploaded yet.
              </Alert>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {media.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      position: "relative",
                      border: "1px solid",
                      borderColor: item.isPrimary
                        ? "primary.main"
                        : "divider",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* IMAGE */}
                    <Box
                      component="img"
                      src={item.mediaUrl}
                      alt={
                        item.altText ||
                        product?.name ||
                        "Product image"
                      }
                      sx={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* PRIMARY BADGE */}
                    {item.isPrimary && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          px: 1,
                          py: 0.4,
                          borderRadius: 1,
                          backgroundColor:
                            "primary.main",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        PRIMARY
                      </Box>
                    )}

                    {/* ACTIONS */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ p: 1 }}
                    >
                      {canSetPrimary ? (
                        <Button
                          size="small"
                          startIcon={
                            item.isPrimary ? (
                              <Star />
                            ) : (
                              <StarBorder />
                            )
                          }
                          onClick={() =>
                            !item.isPrimary &&
                            handleSetPrimary(item.id)
                          }
                          disabled={
                            item.isPrimary ||
                            primaryId === item.id ||
                            uploading
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            minWidth: 0,
                          }}
                        >
                          {item.isPrimary
                            ? "Primary"
                            : "Set Primary"}
                        </Button>
                      ) : (
                        <Box />
                      )}

                      {canDelete && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item.id ||
                            uploading
                          }
                        >
                          {deletingId === item.id ? (
                            <CircularProgress
                              size={18}
                              color="inherit"
                            />
                          ) : (
                            <DeleteOutlineRounded />
                          )}
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={uploading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}