import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const showToast = ({ message, type, duration = 2000 }: ToastProps) => {
  toast[type](message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      marginTop: "10px",
      marginRight: "20px",
      zIndex: 9999,
    },
  });
};

export default showToast;
