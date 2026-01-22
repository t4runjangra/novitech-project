import React, { createContext, useContext, useState, useEffect } from "react";
import { SuccessToast } from "../components/SuccessToast";
import { ErrorToast } from "../components/ErrorToast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showSuccess = (message) => setToast({ type: "success", message });
  const showError = (message) => setToast({ type: "error", message });
  const hideToast = () => setToast(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast &&
        (toast.type === "success" ? (
          <SuccessToast message={toast.message} onClose={hideToast} />
        ) : (
          <ErrorToast message={toast.message} onClose={hideToast} />
        ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);