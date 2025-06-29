import apiClient from "@apis/apiClient";
import {
  MessageDetail,
  MessageGroup,
  MessageHistoryResponse,
  MessageDetailListResponse,
} from "@ts/message";
import { MESSAGE_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse, API_STATUS_CODES } from "@ts/apiResponse";
import { Template, BulkMessagePayload } from "@ts/message";
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

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Template[]>>(
      "/templates"
    );

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
