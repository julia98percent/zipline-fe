import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

export const showToast = ({ message, type }: ToastProps) => {
  toast[type](message, {
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      marginTop: "6px",
      top: "40px",
    },
  });
};

export const ToastProvider = () => {
  return (
    <ToastContainer
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};
