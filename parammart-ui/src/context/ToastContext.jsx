import { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message, severity = "info") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const showSuccess = (message) => {
    showToast(message, "success");
  };

  const showError = (message) => {
    showToast(message, "error");
  };

  const showWarning = (message) => {
    showToast(message, "warning");
  };

  const showInfo = (message) => {
    showToast(message, "info");
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          elevation={6}
          sx={{
            minWidth: 320,
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}