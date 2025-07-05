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
  onEditBasicInfo: () => void;
  onEditDocuments: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;

  onCloseInfoModal: () => void;
  onCloseDocumentsModal: () => void;
  onCloseDeleteModal: () => void;
  onRefreshData: () => void;
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

  onEditBasicInfo,
  onEditDocuments,
  onDelete,
  onConfirmDelete,
  onCloseInfoModal,
  onCloseDocumentsModal,
  onCloseDeleteModal,
  onRefreshData,
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
            onQuickStatusChange={onQuickStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPageView;
