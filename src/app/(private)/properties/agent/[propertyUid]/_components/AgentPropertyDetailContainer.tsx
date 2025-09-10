"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "@/apis/propertyService";
import { showToast } from "@/components/Toast";
import AgentPropertyDetailView from "./AgentPropertyDetailView";

function AgentPropertyDetailPage() {
  const { propertyUid } = useParams();
  const router = useRouter();

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchPropertyData = useCallback(async () => {
    if (!propertyUid) return;

    setIsLoading(true);
    try {
      const propertyData = await fetchPropertyDetail(Number(propertyUid));
      setProperty(propertyData);
    } catch (error) {
      console.error(error);
      showToast({
        message: "매물 정보를 불러오는 데 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyUid]);

  const fetchContractData = useCallback(async () => {
    if (!propertyUid) return;

    setIsLoading(true);
    try {
      const contractData = await fetchPropertyContract(Number(propertyUid));
      setContractInfo(contractData);
    } catch (error) {
      console.error(error);
      setContractInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [propertyUid]);

  const fetchContractHistoryData = useCallback(async () => {
    if (!propertyUid) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [propertyUid]);

  const fetchCounselHistoryData = useCallback(async () => {
    if (!propertyUid) return;

    setIsLoading(true);
    try {
      const counselData = await fetchPropertyCounselHistory(
        Number(propertyUid)
      );
      setCounselHistories(counselData);
    } catch (error) {
      console.error("상담 히스토리 불러오기 실패", error);
      setCounselHistories([]);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (!propertyUid) {
      router.push("/error");
    }
  }, [propertyUid, router]);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyUid) return;

    setIsLoading(true);
    try {
      await deleteProperty(Number(propertyUid));
      showToast({
        message: "매물을 삭제했습니다.",
        type: "success",
      });
      router.push("/properties/agent");
    } catch (error) {
      console.error("매물 삭제 실패", error);
      showToast({
        message: "매물 삭제 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (!property) return null;

  return (
    <AgentPropertyDetailView
      loading={isLoading}
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
    />
  );
}

export default AgentPropertyDetailPage;
