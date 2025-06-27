import { AxiosError } from "axios";
import { showToast } from "@components/Toast/Toast";
import apiClient from "@apis/apiClient";

interface CustomerData {
  name: string;
  phoneNo: string;
  [key: string]: string | number;
}

export const addCustomer = async (customerData: CustomerData) => {
  try {
    const response = await apiClient.post("/customers", customerData);

    if (response.data.success) {
      showToast({
        message: "고객을 등록했습니다.",
        type: "success",
      });
      return true;
    }
    return false;
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>;
    showToast({
      message:
        error.response?.data?.message || "고객 등록 중 오류가 발생했습니다.",
      type: "error",
    });
    return false;
  }
};
