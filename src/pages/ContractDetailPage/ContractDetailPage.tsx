import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import { CircularProgress, Button, Box } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import ContractEditModal from "@pages/ContractListPage/ContractAddButtonList/ContractEditModal";
import ContractDetailContent from "./ContractDetailContent";
import styles from "@pages/ContractListPage/styles/ContractListPage.module.css";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import useUserStore from "@stores/useUserStore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { showToast } from "@components/Toast/Toast";

const ContractDetailPage = () => {
  const { contractUid } = useParams<{ contractUid: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [histories, setHistories] = useState<ContractHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user } = useUserStore();

  const handleEdit = () => setEditModalOpen(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setDeleteModalOpen(true); // 모달 열기
  };

  const confirmDelete = () => {
    apiClient
      .delete(`/contracts/${contractUid}`)
      .then(() => {
        showToast({
          message: "계약을 삭제했습니다.",
          type: "success",
        });
        navigate("/contracts");
      })
      .catch((err) => {
        console.error("계약 삭제 실패", err);
        showToast({
          message: "계약 삭제 중 오류가 발생했습니다.",
          type: "error",
        });
      })
      .finally(() => {
        setDeleteModalOpen(false);
      });
  };

  useEffect(() => {
    if (contractUid) {
      Promise.all([
        apiClient.get(`/contracts/${contractUid}`),
        apiClient.get(`/contracts/${contractUid}/histories`),
      ])
        .then(([contractRes, historyRes]) => {
          setContract(contractRes.data.data);
          setHistories(historyRes.data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
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
      <PageHeader title="계약 상세 조회" userName={user?.name || "-"} />

      <div className={styles.contents}>
        {editModalOpen && (
          <ContractEditModal
            open={editModalOpen}
            handleClose={() => setEditModalOpen(false)}
            fetchContractData={() => {
              Promise.all([
                apiClient.get(`/contracts/${contractUid}`),
                apiClient.get(`/contracts/${contractUid}/histories`),
              ]).then(([contractRes, historyRes]) => {
                setContract(contractRes.data.data);
                setHistories(historyRes.data.data);
              });
            }}
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

export interface ContractDocument {
  fileName: string;
  fileUrl: string;
}

export interface ContractDetail {
  uid: number;
  category: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  contractStartDate: string | null;
  contractEndDate: string | null;
  expectedContractEndDate: string | null;
  contractDate: string | null;
  status: string;
  lessorOrSellerName: string;
  lesseeOrBuyerName: string | null;
  documents: ContractDocument[];
  propertyAddress: string;
}

export interface ContractHistory {
  prevStatus: string;
  currentStatus: string;
  changedAt: string;
}
