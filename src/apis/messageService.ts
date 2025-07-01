import apiClient from "@apis/apiClient";
import {
  MessageDetail,
  MessageGroup,
  MessageHistoryResponse,
  MessageDetailListResponse,
} from "@ts/message";
import { MESSAGE_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse, API_STATUS_CODES } from "@ts/apiResponse";
import { MessageTemplate, BulkMessagePayload } from "@ts/message";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

export const fetchMessages = async (): Promise<MessageGroup[]> => {
  try {
    const { data: response } = await apiClient.get<MessageHistoryResponse>(
      "/messages"
    );

    const data = handleApiResponse(
      response,
      MESSAGE_ERROR_MESSAGES.FETCH_FAILED
    );
    return Object.values(data?.groupList || {});
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
    const { data: response } = await apiClient.post<ApiResponse>(
      "/messages",
      payload
    );
    if (response.code !== API_STATUS_CODES.SUCCESS) {
      throw new Error(
        response.message || MESSAGE_ERROR_MESSAGES.BULK_SEND_FAILED
      );
    }

    return true;
  } catch (error) {
    console.error("Error sending bulk messages:", error);
    return false;
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
