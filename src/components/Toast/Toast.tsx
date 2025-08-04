import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const showToast = ({ message, type, duration = 2000 }: ToastProps) => {
  toast[type](message, {
    autoClose: duration,
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

const ToastProvider = () => {
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

export default ToastProvider;
