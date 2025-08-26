import { Box, LinearProgress } from "@mui/material";
import PageHeader from "@components/PageHeader";
import {
  ContractDetailContent,
  ContractDocumentsEditModal,
  ContractBasicInfoEditModal,
} from "./components";
import DeleteConfirmModal from "@components/DeleteConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContractDetail, ContractHistory } from "@ts/contract";
import Button from "@components/Button";
import CircularProgress from "@components/CircularProgress";

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
  onMobileMenuToggle: () => void;
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
      <div className="flex-grow bg-gray-100 min-h-screen">
        <PageHeader />
        <div className="flex items-center justify-center h-screen">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-100 min-h-screen">
      <PageHeader />

      {isUpdating && (
        <Box className="w-full fixed top-0 left-0 z-50">
          <LinearProgress />
        </Box>
      )}

      <div className="p-5 max-w-full mx-auto">
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
          <div className="flex justify-between items-center">
            <Button
              variant="outlined"
              color="primary"
              onClick={onNavigateToList}
              disabled={isUpdating}
            >
              목록으로
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              disabled={isUpdating}
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
