import { CircularProgress, Button, Box } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import ContractEditModal from "./components/ContractEditModal";
import ContractDetailContent from "./components/ContractDetailContent";
import styles from "@pages/ContractListPage/styles/ContractListPage.module.css";
import DeleteConfirmModal from "@components/DeleteConfirm";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContractDetail, ContractHistory } from "@ts/contract";

interface ContractDetailPageViewProps {
  contract: ContractDetail | null;
  histories: ContractHistory[];
  loading: boolean;
  isUpdating: boolean;

  basicInfoModalOpen: boolean;
  partyInfoModalOpen: boolean;
  documentsModalOpen: boolean;
  deleteModalOpen: boolean;

  onEditBasicInfo: () => void;
  onEditPartyInfo: () => void;
  onEditDocuments: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;

  onCloseBasicInfoModal: () => void;
  onClosePartyInfoModal: () => void;
  onCloseDocumentsModal: () => void;
  onCloseDeleteModal: () => void;
  onRefreshData: () => void;
}

const ContractDetailPageView = ({
  contract,
  histories,
  loading,
  isUpdating,
  basicInfoModalOpen,
  partyInfoModalOpen,
  documentsModalOpen,
  deleteModalOpen,

  onEditBasicInfo,
  onEditPartyInfo,
  onEditDocuments,
  onDelete,
  onConfirmDelete,
  onCloseBasicInfoModal,
  onClosePartyInfoModal,
  onCloseDocumentsModal,
  onCloseDeleteModal,
  onRefreshData,
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
        {editModalOpen && (
          <ContractEditModal
            open={editModalOpen}
            handleClose={onCloseEditModal}
            fetchContractData={onRefreshData}
            contractUid={Number(contractUid)}
            initialData={contract}
          />
        )}

        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={onConfirmDelete}
          onCancel={onCloseDeleteModal}
          category="계약"
        />

        <div className={styles.contents2}>
          <Box display="flex" justifyContent="flex-end" mt={0} gap={2} mb={3}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{ backgroundColor: "white" }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              sx={{ backgroundColor: "white" }}
            >
              삭제
            </Button>
          </Box>

          <ContractDetailContent contract={contract} histories={histories} />
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPageView;
