import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const showToast = ({ message, type, duration = 2000 }: ToastProps) => {
  const toastId = `${type}-${message}`;

  if (toast.isActive(toastId)) {
    return;
  }

  toast[type](message, {
    toastId,
    autoClose: duration,
    draggable: true,
    className:
      "w-[70vw]! xs:w-[60vw]! sm:w-[40vw]! md:w-[30vw]! lg:w-[22vw]! mb-2! mt-[20px] mr-[20px]",
  });
};

export default showToast;
