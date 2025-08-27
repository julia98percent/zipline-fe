import PageHeader from "@components/PageHeader/PageHeader";
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
import DeleteConfirmModal from "@components/DeleteConfirmModal";
import { Dayjs } from "dayjs";
import CircularProgress from "@components/CircularProgress";

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
}: CounselDetailPageViewProps) => {
  if (isLoading) {
    return (
      <div>
        <PageHeader />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!counselData || !editedData) {
    return (
      <>
        <PageHeader />
        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <h6>상담 정보를 찾을 수 없습니다.</h6>
        </div>
      </>
    );
  }

  const data = isEditing ? editedData : counselData;

  return (
    <>
      <PageHeader />

      <div className="flex flex-col gap-4 p-5 pt-0">
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
      </div>
    </>
  );
};

export default CounselDetailPageView;
