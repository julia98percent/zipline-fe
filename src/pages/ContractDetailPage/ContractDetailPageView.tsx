import { CircularProgress, Button, Box, LinearProgress } from "@mui/material";
import PageHeader from "@components/PageHeader";
import {
  ContractDetailContent,
  ContractDocumentsEditModal,
  ContractBasicInfoEditModal,
} from "./components";
import styles from "@pages/ContractListPage/styles/ContractListPage.module.css";
import DeleteConfirmModal from "@components/DeleteConfirm";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContractDetail, ContractHistory } from "@ts/contract";

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
  onCloseInfoModal,
  onCloseDocumentsModal,
  onCloseDeleteModal,
  onCloseStatusChangeModal,
  onConfirmStatusChange,
  onRefreshData,
  onStatusChange,
  onQuickStatusChange,
}: ContractDetailPageViewProps) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!contract) {
    return <div>계약 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <PageHeader title="계약 상세 조회" />

      <div className={styles.contents}>
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

        <div className={styles.contents2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            disabled={isUpdating}
            sx={{ backgroundColor: "white" }}
          >
            삭제
          </Button>

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
