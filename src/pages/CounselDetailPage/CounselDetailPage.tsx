import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { showToast } from "@components/Toast";
import CounselDetailPageView from "./CounselDetailPageView";
import { Counsel, CounselCategory } from "@ts/counsel";
import { PropertyCategory } from "@ts/property";

import {
  fetchCounsel,
  updateCounsel,
  deleteCounsel,
} from "@apis/counselService";
import { COUNSEL_ERROR_MESSAGES } from "@constants/clientErrorMessage";

function CounselDetailPage() {
  const { counselUid } = useParams();
  const navigate = useNavigate();

  const [counselData, setCounselData] = useState<Counsel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Counsel | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchCounsel(counselUid!);
        if (result) {
          setCounselData(result);
          setEditedData(result);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (counselUid) {
      fetchData();
    }
  }, [counselUid]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(counselData);
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const updateData = {
        title: editedData.title,
        type: editedData.type,
        counselDate: editedData.counselDate,
        dueDate: editedData.dueDate
          ? dayjs(editedData.dueDate).format("YYYY-MM-DD")
          : null,
        completed: editedData.completed,
        content: editedData.content,
      };

      const result = await updateCounsel(counselUid!, updateData);
      if (result) {
        setCounselData(editedData);
        setIsEditing(false);
        showToast({
          message: "상담 내용을 수정했습니다.",
          type: "success",
        });
      }
    } catch {
      showToast({
        message: COUNSEL_ERROR_MESSAGES.UPDATE_FAILED,
        type: "error",
      });
    }
  };

  const handleInputChange = (field: keyof Counsel, value: string | boolean) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  const handleDetailChange = (value: string) => {
    if (!editedData) return;

    setEditedData({ ...editedData, content: value });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteCounsel(counselUid!);
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        showToast({
          message: "상담을 삭제했습니다.",
          type: "success",
        });
        navigate("/counsels", { replace: true });
      } else {
        const message =
          result && typeof result === "object" && "message" in result
            ? (result.message as string)
            : "상담 삭제 중 오류가 발생했습니다.";
        throw new Error(message);
      }
    } catch (error) {
      console.error("Failed to delete counsel:", error);
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "상담 삭제 중 오류가 발생했습니다.",
        type: "error",
      });
      setDeleteDialogOpen(false);
    }
  };

  return (
    <CounselDetailPageView
      counselData={counselData}
      editedData={editedData}
      isLoading={isLoading}
      isEditing={isEditing}
      deleteDialogOpen={deleteDialogOpen}
      COUNSEL_TYPES={CounselCategory}
      PROPERTY_CATEGORIES={PropertyCategory}
      onEdit={handleEdit}
      onCancelEdit={handleCancelEdit}
      onSave={handleSave}
      onInputChange={handleInputChange}
      onDetailChange={handleDetailChange}
      onDeleteClick={handleDeleteClick}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}

export default CounselDetailPage;
