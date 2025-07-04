import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchContractDetail,
  fetchContractHistory,
  deleteContract,
} from "@apis/contractService";
import { showToast } from "@components/Toast";
import { ContractDetail, ContractHistory } from "@ts/contract";
import ContractDetailPageView from "./ContractDetailPageView";

const ContractDetailPage = () => {
  const { contractUid } = useParams<{ contractUid: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [histories, setHistories] = useState<ContractHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [basicInfoModalOpen, setBasicInfoModalOpen] = useState(false);
  const [partyInfoModalOpen, setPartyInfoModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleRefreshData = useCallback(async () => {
    if (!contractUid) return;

    setIsUpdating(true);
    try {
      const [contractDetail, contractHistory] = await Promise.all([
        fetchContractDetail(contractUid),
        fetchContractHistory(contractUid),
      ]);
      setContract(contractDetail);
      setHistories(contractHistory);
      showToast({
        message: "계약 정보가 성공적으로 업데이트되었습니다.",
        type: "success",
      });
    } catch (error) {
      showToast({
        message: "계약 정보 업데이트 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [contractUid]);

  const handleEditBasicInfo = () => {
    setBasicInfoModalOpen(true);
  };

  const handleEditPartyInfo = () => {
    setPartyInfoModalOpen(true);
  };

  const handleEditDocuments = () => {
    setDocumentsModalOpen(true);
  };

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

  const handleCloseBasicInfoModal = () => setBasicInfoModalOpen(false);
  const handleClosePartyInfoModal = () => setPartyInfoModalOpen(false);
  const handleCloseDocumentsModal = () => setDocumentsModalOpen(false);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  return (
    <ContractDetailPageView
      contract={contract}
      histories={histories}
      loading={loading}
      isUpdating={isUpdating}
      basicInfoModalOpen={basicInfoModalOpen}
      partyInfoModalOpen={partyInfoModalOpen}
      documentsModalOpen={documentsModalOpen}
      deleteModalOpen={deleteModalOpen}
      onEditBasicInfo={handleEditBasicInfo}
      onEditPartyInfo={handleEditPartyInfo}
      onEditDocuments={handleEditDocuments}
      onDelete={handleDelete}
      onConfirmDelete={confirmDelete}
      onCloseBasicInfoModal={handleCloseBasicInfoModal}
      onClosePartyInfoModal={handleClosePartyInfoModal}
      onCloseDocumentsModal={handleCloseDocumentsModal}
      onCloseDeleteModal={handleCloseDeleteModal}
      onRefreshData={handleRefreshData}
    />
  );
};

export default ContractDetailPage;
