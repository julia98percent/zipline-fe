import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  AgentPropertyDetail,
  ContractHistoryItem,
  ContractInfo,
  CounselHistory,
  fetchPropertyDetail,
  fetchPropertyContract,
  fetchPropertyContractHistory,
  fetchPropertyCounselHistory,
  deleteProperty,
} from "@apis/propertyService";
import { showToast } from "@components/Toast";
import AgentPropertyDetailPageView from "./AgentPropertyDetailPageView";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

function AgentPropertyDetailPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { propertyUid } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<AgentPropertyDetail | null>(null);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [contractHistories, setContractHistories] = useState<
    ContractHistoryItem[]
  >([]);
  const [counselHistories, setCounselHistories] = useState<CounselHistory[]>(
    []
  );
  const [tab, setTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchPropertyData = useCallback(async () => {
    if (!propertyUid) return;

    try {
      const propertyData = await fetchPropertyDetail(Number(propertyUid));
      setProperty(propertyData);
    } catch (error) {
      console.error(error);
      showToast({
        message: "매물 정보를 불러오는 데 실패했습니다.",
        type: "error",
      });
    }
  }, [propertyUid]);

  const fetchContractData = useCallback(async () => {
    if (!propertyUid) return;

    try {
      const contractData = await fetchPropertyContract(Number(propertyUid));
      setContractInfo(contractData);
    } catch (error) {
      console.error(error);
      setContractInfo(null);
    }
  }, [propertyUid]);

  const fetchContractHistoryData = useCallback(async () => {
    if (!propertyUid) return;

    try {
      const historyData = await fetchPropertyContractHistory(
        Number(propertyUid)
      );
      setContractHistories(historyData);
    } catch (error) {
      console.error("계약 히스토리 불러오기 실패", error);
      showToast({
        message: "계약 히스토리를 불러오는 데 실패했습니다.",
        type: "error",
      });
    }
  }, [propertyUid]);

  const fetchCounselHistoryData = useCallback(async () => {
    if (!propertyUid) return;

    try {
      const counselData = await fetchPropertyCounselHistory(
        Number(propertyUid)
      );
      setCounselHistories(counselData);
    } catch (error) {
      console.error("상담 히스토리 불러오기 실패", error);
      setCounselHistories([]);
    }
  }, [propertyUid]);

  useEffect(() => {
    fetchPropertyData();
    fetchContractData();
  }, [fetchPropertyData, fetchContractData]);

  useEffect(() => {
    fetchContractHistoryData();
  }, [fetchContractHistoryData]);

  useEffect(() => {
    fetchCounselHistoryData();
  }, [fetchCounselHistoryData]);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyUid) return;

    try {
      await deleteProperty(Number(propertyUid));
      showToast({
        message: "매물을 삭제했습니다.",
        type: "success",
      });
      navigate("/properties/agent");
    } catch (error) {
      console.error("매물 삭제 실패", error);
      showToast({
        message: "매물 삭제 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (!propertyUid) navigate("/error");

  if (!property) return null;

  return (
    <AgentPropertyDetailPageView
      property={property}
      contractInfo={contractInfo}
      contractHistories={contractHistories}
      counselHistories={counselHistories}
      tab={tab}
      editModalOpen={editModalOpen}
      deleteModalOpen={deleteModalOpen}
      propertyUid={Number(propertyUid)}
      onTabChange={setTab}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onConfirmDelete={confirmDelete}
      onEditModalClose={() => setEditModalOpen(false)}
      onDeleteModalClose={() => setDeleteModalOpen(false)}
      onPropertyDataRefresh={fetchPropertyData}
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
}

export default AgentPropertyDetailPage;
