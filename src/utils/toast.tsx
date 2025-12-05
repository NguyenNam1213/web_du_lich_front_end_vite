import React from "react";
import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  // Confirm dialog sử dụng Promise
  confirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      toast.warning(message, {
        ...defaultOptions,
        autoClose: false,
        closeOnClick: false,
        render: ({ closeToast }) => (
          <div className="p-2">
            <p className="mb-3 text-sm">{message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Xác nhận
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  closeToast();
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        ),
      });
    });
  },
};

