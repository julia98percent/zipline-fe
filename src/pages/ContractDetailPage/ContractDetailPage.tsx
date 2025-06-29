import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Button, Box } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import ContractEditModal from "@pages/ContractListPage/ContractAddButtonList/ContractEditModal";
import ContractDetailContent from "./ContractDetailContent";
import styles from "@pages/ContractListPage/styles/ContractListPage.module.css";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchContractDetail,
  fetchContractHistory,
  deleteContract,
} from "@apis/contractService";
import { showToast } from "@components/Toast/Toast";
import { ContractDetail, ContractHistory } from "@ts/contract";

const ContractDetailPage = () => {
  const { contractUid } = useParams<{ contractUid: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [histories, setHistories] = useState<ContractHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 공통 데이터 로딩 함수
  const loadContractData = useCallback(async () => {
    if (!contractUid) return;

    setLoading(true);
    try {
      const [contractDetail, contractHistory] = await Promise.all([
        fetchContractDetail(contractUid),
        fetchContractHistory(contractUid),
      ]);
      setContract(contractDetail);
      setHistories(contractHistory);
    } catch {
      showToast({
        message: "계약 정보를 불러올 수 없습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [contractUid]);

  const handleEdit = () => setEditModalOpen(true);

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteContract(contractUid!);
      showToast({
        message: "계약을 삭제했습니다.",
        type: "success",
      });
      navigate("/contracts");
    } catch (error) {
      console.error("Error deleting contract:", error);
      showToast({
        message: "계약 삭제 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  useEffect(() => {
    if (contractUid) {
      const loadContractData = async () => {
        try {
          const [contractDetail, contractHistory] = await Promise.all([
            fetchContractDetail(contractUid),
            fetchContractHistory(contractUid),
          ]);
          setContract(contractDetail);
          setHistories(contractHistory);
        } catch (error) {
          console.error("Error loading contract data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadContractData();
    }
  }, [contractUid]);

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

  if (!contract) return <div>계약 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <PageHeader title="계약 상세 조회" />

      <div className={styles.contents}>
        {editModalOpen && (
          <ContractEditModal
            open={editModalOpen}
            handleClose={() => setEditModalOpen(false)}
            fetchContractData={loadContractData}
            contractUid={Number(contractUid)}
            initialData={contract}
          />
        )}

        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          category="계약"
        />

        <div className={styles.contents2}>
          <Box display="flex" justifyContent="flex-end" mt={0} gap={2} mb={3}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ backgroundColor: "white" }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
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

export default ContractDetailPage;
