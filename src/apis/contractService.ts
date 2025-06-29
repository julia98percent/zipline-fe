import apiClient from "@apis/apiClient";
import { showToast } from "@components/Toast/Toast";

export interface ContractDocument {
  fileName: string;
  fileUrl: string;
}

export interface ContractDetail {
  uid: number;
  category: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  contractStartDate: string | null;
  contractEndDate: string | null;
  expectedContractEndDate: string | null;
  contractDate: string | null;
  status: string;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  documents: ContractDocument[];
  propertyAddress: string;
}

export interface ContractHistory {
  prevStatus: string;
  currentStatus: string;
  changedAt: string;
}

export interface ContractDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: ContractDetail;
}

export interface ContractHistoryResponse {
  success: boolean;
  code: number;
  message: string;
  data: ContractHistory[];
}

export const fetchContractDetail = async (
  contractUid: string
): Promise<ContractDetail> => {
  try {
    const { data: response } = await apiClient.get<ContractDetailResponse>(
      `/contracts/${contractUid}`
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || "계약 정보를 불러올 수 없습니다.");
    }
  } catch (error) {
    console.error("Error fetching contract detail:", error);
    throw error;
  }
};

export const fetchContractHistory = async (
  contractUid: string
): Promise<ContractHistory[]> => {
  try {
    const { data: response } = await apiClient.get<ContractHistoryResponse>(
      `/contracts/${contractUid}/histories`
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(
        response.message || "계약 히스토리를 불러올 수 없습니다."
      );
    }
  } catch (error) {
    console.error("Error fetching contract history:", error);
    throw error;
  }
};

export const deleteContract = async (contractUid: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/contracts/${contractUid}`);
    showToast({
      message: "계약을 삭제했습니다.",
      type: "success",
    });
    return true;
  } catch (error) {
    console.error("계약 삭제 실패", error);
    showToast({
      message: "계약 삭제 중 오류가 발생했습니다.",
      type: "error",
    });
    return false;
  }
};
