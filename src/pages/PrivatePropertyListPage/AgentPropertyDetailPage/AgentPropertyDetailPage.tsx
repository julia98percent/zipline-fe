import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import { CircularProgress, Button, Box } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import AgentPropertyDetailContent from "./AgentPropertyDetailContent";
import styles from "@pages/ContractListPage/styles/ContractListPage.module.css";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import useUserStore from "@stores/useUserStore";

interface AgentPropertyDetail {
  customer: string;
  address: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
  moveInDate: string;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

const AgentPropertyDetailPage = () => {
  const { propertyUid } = useParams<{ propertyUid: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<AgentPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (propertyUid) {
      setLoading(true);
      apiClient
        .get(`/properties/${propertyUid}`)
        .then((res) => {
          setProperty(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [propertyUid]);

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    apiClient
      .delete(`/properties/${propertyUid}`)
      .then(() => {
        alert("매물 삭제 성공");
        navigate("/properties/private");
      })
      .catch((err) => {
        alert("매물 삭제 중 오류가 발생했습니다.");
        console.error(err);
      })
      .finally(() => setDeleteModalOpen(false));
  };

  const handleEdit = () => {
    navigate(`/properties/${propertyUid}/edit`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!property) return <div>매물 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader title="매물 상세 조회" userName={user?.name || "-"} />
      </div>
      <div className={styles.contents}>
        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
        <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
          <Button variant="outlined" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            삭제
          </Button>
        </Box>
        <AgentPropertyDetailContent property={property} />
      </div>
    </div>
  );
};

export default AgentPropertyDetailPage;
