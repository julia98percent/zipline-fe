import { Divider, LinearProgress } from "@mui/material";
import ContractDetailContent from "./ContractDetailContent";
import ContractDocumentsEditModal from "./ContractDocumentsEditModal";
import ContractBasicInfoEditModal from "./ContractBasicInfoEditModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { ContractDetail, ContractHistory } from "@/types/contract";
import Button from "@/components/Button";
import CircularProgress from "@/components/CircularProgress";

interface ContractDetailPageViewProps {
  contract: ContractDetail | null;
  histories: ContractHistory[];
  loading: boolean;
  isUpdating: boolean;
  infoModalOpen: boolean;
  documentsModalOpen: boolean;
  deleteModalOpen: boolean;
  statusChangeModalOpen: boolean;
  pendingStatusChange: "CANCELLED" | "TERMINATED" | null;
  onEditBasicInfo: () => void;
  onEditDocuments: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onNavigateToList: () => void;
  onCloseInfoModal: () => void;
  onCloseDocumentsModal: () => void;
  onCloseDeleteModal: () => void;
  onCloseStatusChangeModal: () => void;
  onConfirmStatusChange: () => void;
  onRefreshData: () => void;
  onStatusChange?: (newStatus: "CANCELLED" | "TERMINATED") => void;
  onQuickStatusChange?: (newStatus: string) => void;
}

const ContractDetailPageView = ({
  contract,
  histories,
  loading,
  isUpdating,
  infoModalOpen,
  documentsModalOpen,
  deleteModalOpen,
  statusChangeModalOpen,
  pendingStatusChange,
  onEditBasicInfo,
  onEditDocuments,
  onDelete,
  onConfirmDelete,
  onNavigateToList,
  onCloseInfoModal,
  onCloseDocumentsModal,
  onCloseDeleteModal,
  onCloseStatusChangeModal,
  onConfirmStatusChange,
  onRefreshData,
  onStatusChange,
  onQuickStatusChange,
}: ContractDetailPageViewProps) => {
  if (loading || !contract) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isUpdating && (
        <div className="w-full fixed top-0 left-0 z-50">
          <LinearProgress />
        </div>
      )}

      <div className="p-5 pt-0">
        {infoModalOpen && contract && (
          <ContractBasicInfoEditModal
            open={infoModalOpen}
            onClose={onCloseInfoModal}
            contract={contract}
            onSuccess={onRefreshData}
          />
        )}

        {documentsModalOpen && contract && (
          <ContractDocumentsEditModal
            open={documentsModalOpen}
            onClose={onCloseDocumentsModal}
            contract={contract}
            onSuccess={onRefreshData}
          />
        )}

        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={onConfirmDelete}
          onCancel={onCloseDeleteModal}
          category="계약"
        />

        <DeleteConfirmModal
          open={statusChangeModalOpen}
          onConfirm={onConfirmStatusChange}
          onCancel={onCloseStatusChangeModal}
          category="계약"
          title={`계약 ${
            pendingStatusChange === "CANCELLED" ? "취소" : "해지"
          }`}
          message={`정말로 계약을 ${
            pendingStatusChange === "CANCELLED" ? "취소" : "해지"
          }하시겠습니까?`}
          confirmText={pendingStatusChange === "CANCELLED" ? "취소" : "해지"}
          confirmColor="warning"
        />

        <div className="space-y-6">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="text"
              color="info"
              onClick={onNavigateToList}
              disabled={isUpdating}
            >
              목록으로
            </Button>
            <Divider orientation="vertical" className="h-4 bg-neutral-300" />
            <Button
              variant="text"
              color="error"
              onClick={onDelete}
              disabled={isUpdating}
              className="min-w-min"
            >
              삭제
            </Button>
          </div>

          <ContractDetailContent
            contract={contract}
            histories={histories}
            onEditBasicInfo={onEditBasicInfo}
            onEditDocuments={onEditDocuments}
            onStatusChange={onStatusChange}
            onQuickStatusChange={onQuickStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPageView;
