import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  fetchContractDetail,
  fetchContractHistory,
  deleteContract,
  updateContractStatus,
  updateContractToNextStatus,
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
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<
    "CANCELLED" | "TERMINATED" | null
  >(null);

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
    } catch {
      showToast({
        message: "계약 정보 업데이트 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [contractUid]);

  const handleEditBasicInfo = () => {
    setInfoModalOpen(true);
  };

  const handleEditDocuments = () => {
    setDocumentsModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleNavigateToList = () => {
    navigate("/contracts");
  };

  const handleStatusChange = async (newStatus: "CANCELLED" | "TERMINATED") => {
    setPendingStatusChange(newStatus);
    setStatusChangeModalOpen(true);
  };

  const handleQuickStatusChange = async (newStatus: string) => {
    if (!contractUid || !contract) return;

    try {
      setContract({ ...contract, status: newStatus });

      await updateContractToNextStatus(contractUid, newStatus, contract);

      const [updatedContract, updatedHistories] = await Promise.all([
        fetchContractDetail(contractUid),
        fetchContractHistory(contractUid),
      ]);
      setContract(updatedContract);
      setHistories(updatedHistories);

      showToast({
        message: `계약 상태가 변경되었습니다.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating contract status:", error);

      await loadContractData();

      showToast({
        message: "계약 상태 변경 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const confirmStatusChange = async () => {
    if (!contractUid || !contract || !pendingStatusChange) return;

    try {
      setContract({ ...contract, status: pendingStatusChange });

      await updateContractStatus(contractUid, pendingStatusChange, contract);

      showToast({
        message: `계약이 ${
          pendingStatusChange === "CANCELLED" ? "취소" : "해지"
        }되었습니다.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating contract status:", error);

      await loadContractData();

      showToast({
        message: `계약 ${
          pendingStatusChange === "CANCELLED" ? "취소" : "해지"
        } 중 오류가 발생했습니다.`,
        type: "error",
      });
    } finally {
      setStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
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

  const handleCloseInfoModal = () => setInfoModalOpen(false);
  const handleCloseDocumentsModal = () => setDocumentsModalOpen(false);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
  const handleCloseStatusChangeModal = () => {
    setStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  return (
    <ContractDetailPageView
      contract={contract}
      histories={histories}
      loading={loading}
      isUpdating={isUpdating}
      infoModalOpen={infoModalOpen}
      documentsModalOpen={documentsModalOpen}
      deleteModalOpen={deleteModalOpen}
      statusChangeModalOpen={statusChangeModalOpen}
      pendingStatusChange={pendingStatusChange}
      onEditBasicInfo={handleEditBasicInfo}
      onEditDocuments={handleEditDocuments}
      onDelete={handleDelete}
      onConfirmDelete={confirmDelete}
      onNavigateToList={handleNavigateToList}
      onCloseInfoModal={handleCloseInfoModal}
      onCloseDocumentsModal={handleCloseDocumentsModal}
      onCloseDeleteModal={handleCloseDeleteModal}
      onCloseStatusChangeModal={handleCloseStatusChangeModal}
      onConfirmStatusChange={confirmStatusChange}
      onRefreshData={handleRefreshData}
      onStatusChange={handleStatusChange}
      onQuickStatusChange={handleQuickStatusChange}
    />
  );
};

export default ContractDetailPage;
