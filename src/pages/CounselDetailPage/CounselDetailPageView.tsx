import { Box, Typography, CircularProgress } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import styles from "./styles/CounselDetailPage.module.css";
import { CounselCategoryType } from "@ts/counsel";
import { PropertyCategoryType } from "@ts/property";
import { CounselDetail, CounselDetailItem } from "@ts/counsel";
import {
  CounselBasicInfo,
  CounselCustomerInfo,
  CounselPropertyInfo,
  CounselDetailsContent,
  CounselActionButtons,
  CounselDeleteDialog,
} from "./components";

interface CounselDetailPageViewProps {
  counselData: CounselDetail | null;
  editedData: CounselDetail | null;
  isLoading: boolean;
  isEditing: boolean;
  deleteDialogOpen: boolean;
  COUNSEL_TYPES: Record<CounselCategoryType, string>;
  PROPERTY_CATEGORIES: Record<PropertyCategoryType, string>;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onInputChange: (field: keyof CounselDetail, value: string | boolean) => void;
  onDetailChange: (
    detailUid: number,
    field: keyof CounselDetailItem,
    value: string
  ) => void;
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (counselDetailUid: number) => void;
}

const CounselDetailPageView = ({
  counselData,
  editedData,
  isLoading,
  isEditing,
  deleteDialogOpen,
  COUNSEL_TYPES,
  PROPERTY_CATEGORIES,
  onEdit,
  onCancelEdit,
  onSave,
  onInputChange,
  onDetailChange,
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
  onAddQuestion,
  onRemoveQuestion,
}: CounselDetailPageViewProps) => {
  if (isLoading) {
    return (
      <Box className={styles.container}>
        <CircularProgress />
      </Box>
    );
  }

  if (!counselData || !editedData) {
    return (
      <Box className={styles.container}>
        <Typography>상담 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const data = isEditing ? editedData : counselData;

  return (
    <Box className={styles.container}>
      <PageHeader title="상담 상세" />

      <Box className={styles.contentContainer}>
        <CounselActionButtons
          isEditing={isEditing}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onDeleteClick={onDeleteClick}
        />

        <CounselBasicInfo
          data={data}
          isEditing={isEditing}
          COUNSEL_TYPES={COUNSEL_TYPES}
          onInputChange={onInputChange}
        />

        <CounselCustomerInfo customer={data.customer} />

        {data.property && (
          <CounselPropertyInfo
            property={data.property}
            PROPERTY_CATEGORIES={PROPERTY_CATEGORIES}
          />
        )}

        <CounselDetailsContent
          counselDetails={data.counselDetails}
          isEditing={isEditing}
          onDetailChange={onDetailChange}
          onAddQuestion={onAddQuestion}
          onRemoveQuestion={onRemoveQuestion}
        />

        <CounselDeleteDialog
          open={deleteDialogOpen}
          onClose={onDeleteCancel}
          onConfirm={onDeleteConfirm}
        />
      </Box>
    </Box>
  );
};

export default CounselDetailPageView;
