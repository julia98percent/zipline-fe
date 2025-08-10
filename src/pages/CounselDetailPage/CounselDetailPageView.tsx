import { Box, Typography, CircularProgress } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import styles from "./styles/CounselDetailPage.module.css";
import { CounselCategoryType } from "@ts/counsel";
import { PropertyCategoryType } from "@ts/property";
import { Counsel } from "@ts/counsel";
import {
  CounselBasicInfo,
  CounselCustomerInfo,
  CounselPropertyInfo,
  CounselDetailsContent,
  CounselActionButtons,
} from "./components";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import { Dayjs } from "dayjs";

interface CounselDetailPageViewProps {
  counselData: Counsel | null;
  editedData: Counsel | null;
  isLoading: boolean;
  isEditing: boolean;
  deleteDialogOpen: boolean;
  COUNSEL_TYPES: Record<CounselCategoryType, string>;
  PROPERTY_CATEGORIES: Record<PropertyCategoryType, string>;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onInputChange: (
    field: keyof Counsel,
    value: string | boolean | Dayjs | null
  ) => void;
  onDetailChange: (value: string) => void;
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onMobileMenuToggle: () => void;
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
  onMobileMenuToggle,
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
      <PageHeader title="상담 상세" onMobileMenuToggle={onMobileMenuToggle} />

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
          content={data.content}
          isEditing={isEditing}
          onDetailChange={onDetailChange}
        />
        <DeleteConfirmModal
          open={deleteDialogOpen}
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
          category="상담"
        />
      </Box>
    </Box>
  );
};

export default CounselDetailPageView;
