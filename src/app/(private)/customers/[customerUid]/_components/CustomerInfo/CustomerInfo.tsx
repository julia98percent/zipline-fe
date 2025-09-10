"use client";
import { useState, useEffect, useCallback } from "react";
import CustomerInfoView from "./CustomerInfoView";
import {
  fetchCustomerConsultations,
  fetchCustomerProperties,
  fetchCustomerContracts,
} from "@/apis/customerService";
import { Counsel } from "@/types/counsel";
import { Contract } from "@/types/contract";
import { Property } from "@/types/property";

export enum TabType {
  CONSULTATION = 0,
  PROPERTY = 1,
  CONTRACT = 2,
}

export interface TabState {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  loading: boolean;
}

interface CustomerInfoContainerProps {
  customerId: string;
}

const CustomerInfoContainer = ({ customerId }: CustomerInfoContainerProps) => {
  const [currentTab, setCurrentTab] = useState<TabType>(TabType.CONSULTATION);
  const [loading, setLoading] = useState(false);

  const [consultationData, setConsultationData] = useState<Counsel[]>([]);
  const [consultationState, setConsultationState] = useState<TabState>({
    page: 0,
    rowsPerPage: 10,
    totalCount: 0,
    loading: false,
  });

  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [propertyState, setPropertyState] = useState<TabState>({
    page: 0,
    rowsPerPage: 10,
    totalCount: 0,
    loading: false,
  });

  const [contractData, setContractData] = useState<Contract[]>([]);
  const [contractState, setContractState] = useState<TabState>({
    page: 0,
    rowsPerPage: 10,
    totalCount: 0,
    loading: false,
  });

  const fetchConsultationData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCustomerConsultations(
        customerId,
        consultationState.page,
        consultationState.rowsPerPage
      );

      setConsultationData(response.counsels);
      setConsultationState((prev) => ({
        ...prev,
        totalCount: response.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch consultation data:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId, consultationState.page, consultationState.rowsPerPage]);

  const fetchPropertyData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCustomerProperties(
        customerId,
        propertyState.page,
        propertyState.rowsPerPage
      );

      setPropertyData(response.agentProperty);
      setPropertyState((prev) => ({
        ...prev,
        totalCount: response.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId, propertyState.page, propertyState.rowsPerPage]);

  const fetchContractData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCustomerContracts(
        customerId,
        contractState.page,
        contractState.rowsPerPage
      );

      setContractData(response.contracts);
      setContractState((prev) => ({
        ...prev,
        totalCount: response.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch contract data:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId, contractState.page, contractState.rowsPerPage]);

  const handleTabChange = useCallback((newTab: TabType) => {
    setCurrentTab(newTab);
  }, []);

  useEffect(() => {
    setCurrentTab(TabType.CONSULTATION);
  }, [customerId]);

  const handleConsultationPageChange = useCallback((newPage: number) => {
    setConsultationState((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleConsultationRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setConsultationState((prev) => ({
        ...prev,
        page: 0,
        rowsPerPage: newRowsPerPage,
      }));
    },
    []
  );

  const handlePropertyPageChange = useCallback((newPage: number) => {
    setPropertyState((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handlePropertyRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setPropertyState((prev) => ({
        ...prev,
        page: 0,
        rowsPerPage: newRowsPerPage,
      }));
    },
    []
  );

  const handleContractPageChange = useCallback((newPage: number) => {
    setContractState((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleContractRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setContractState((prev) => ({
        ...prev,
        page: 0,
        rowsPerPage: newRowsPerPage,
      }));
    },
    []
  );

  useEffect(() => {
    if (currentTab === TabType.CONSULTATION) {
      fetchConsultationData();
    }
  }, [
    currentTab,
    consultationState.page,
    consultationState.rowsPerPage,
    fetchConsultationData,
  ]);

  useEffect(() => {
    if (currentTab === TabType.PROPERTY) {
      fetchPropertyData();
    }
  }, [
    currentTab,
    propertyState.page,
    propertyState.rowsPerPage,
    fetchPropertyData,
  ]);

  useEffect(() => {
    if (currentTab === TabType.CONTRACT) {
      fetchContractData();
    }
  }, [
    currentTab,
    contractState.page,
    contractState.rowsPerPage,
    fetchContractData,
  ]);

  return (
    <CustomerInfoView
      currentTab={currentTab}
      loading={loading}
      consultationData={consultationData}
      propertyData={propertyData}
      contractData={contractData}
      consultationState={consultationState}
      propertyState={propertyState}
      contractState={contractState}
      onTabChange={handleTabChange}
      onConsultationPageChange={handleConsultationPageChange}
      onConsultationRowsPerPageChange={handleConsultationRowsPerPageChange}
      onPropertyPageChange={handlePropertyPageChange}
      onPropertyRowsPerPageChange={handlePropertyRowsPerPageChange}
      onContractPageChange={handleContractPageChange}
      onContractRowsPerPageChange={handleContractRowsPerPageChange}
    />
  );
};

export default CustomerInfoContainer;
