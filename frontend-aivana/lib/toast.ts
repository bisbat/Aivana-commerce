import toast from "react-hot-toast";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
  });
};
