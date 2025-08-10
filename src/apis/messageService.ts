import apiClient from "@apis/apiClient";
import {
  MessageDetail,
  MessageHistoryResponse,
  MessageDetailListResponse,
} from "@ts/message";
import { MESSAGE_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse } from "@ts/apiResponse";
import {
  MessageTemplate,
  BulkMessagePayload,
  BulkMessageSendResponse,
} from "@ts/message";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

export const fetchMessages = async (params: {
  criteria?: string;
  cond?: string;
  value?: string;
}) => {
  try {
    const { data: response } = await apiClient.get<MessageHistoryResponse>(
      "/messages",
      {
        params,
      }
    );

    return handleApiResponse(response, MESSAGE_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching messages");
  }
};

export const fetchMessageList = async (
  groupId: string
): Promise<MessageDetail[]> => {
  try {
    const { data: response } = await apiClient.get<MessageDetailListResponse>(
      `/messages/${groupId}`
    );

    const data = handleApiResponse(
      response,
      MESSAGE_ERROR_MESSAGES.LIST_FETCH_FAILED
    );
    return Object.values(data?.messageList || {});
  } catch (error) {
    return handleApiError(error, "fetching message list");
  }
};

export const fetchMessageTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<MessageTemplate[]>
    >("/templates");

    return handleApiResponse(
      response,
      MESSAGE_ERROR_MESSAGES.TEMPLATE_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching templates");
  }
};

export const sendBulkMessages = async (
  payload: BulkMessagePayload[]
): Promise<boolean> => {
  try {
    const { data: response } = await apiClient.post<BulkMessageSendResponse>(
      "/messages",
      payload
    );

    if (response && typeof response === "object") {
      if (response.failedMessageList && response.failedMessageList.length > 0) {
        console.error(
          "Some messages failed to send:",
          response.failedMessageList
        );
        throw new Error("일부 메시지 전송에 실패했습니다.");
      }

      if (response.groupInfo) {
        return true;
      }
    }

    throw new Error("메시지 전송 응답이 올바르지 않습니다.");
  } catch (error) {
    console.error("Error sending bulk messages:", error);
    throw error;
  }
};

interface TemplateRequest {
  name: string;
  content: string;
  category: "GENERAL" | "BIRTHDAY" | "EXPIRED_NOTI";
}

export const createMessageTemplate = async (
  templateData: TemplateRequest
): Promise<void> => {
  try {
    const { data: response } = await apiClient.post<ApiResponse>(
      "/templates",
      templateData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to create template");
    }
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
};

export const updateMessageTemplate = async (
  templateId: number,
  templateData: TemplateRequest
): Promise<void> => {
  try {
    const { data: response } = await apiClient.patch<ApiResponse>(
      `/templates/${templateId}`,
      templateData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update template");
    }
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
};

export const deleteMessageTemplate = async (
  templateId: number
): Promise<void> => {
  try {
    const { data: response } = await apiClient.delete<ApiResponse>(
      `/templates/${templateId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete template");
    }
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
};
