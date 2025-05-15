import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import apiClient from "@apis/apiClient";
import PropertyTable from "../Tables/PropertyTable";
import ContractTable from "../Tables/ContractTable";
import ConsultationTable from "../Tables/ConsultationTable";
import { Contract } from "../Tables/ContractTable";

interface Consultation {
  counselUid: number;
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  propertyUid: number;
  completed: boolean;
}

interface Property {
  uid: number;
  customerName: string;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  moveInDate: string;
  realCategory: string;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

interface PropertyResponse {
  agentProperty: Property[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

interface ContractResponse {
  contracts: Contract[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

interface ConsultationResponse {
  counsels: Consultation[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

function CustomerInfo({ customerId }: { customerId: string }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [counsel, setCounsel] = useState<Consultation[]>([]);
  const [property, setProperty] = useState<Property[]>([]);
  const [contract, setContract] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  // Consultation 관련 상태
  const [counselPage, setCounselPage] = useState(0);
  const [counselRowsPerPage, setCounselRowsPerPage] = useState(10);
  const [counselTotalCount, setCounselTotalCount] = useState(0);
  const [counselLoading, setCounselLoading] = useState(false);

  // Property 관련 상태
  const [propertyPage, setPropertyPage] = useState(0);
  const [propertyRowsPerPage, setPropertyRowsPerPage] = useState(10);
  const [propertyTotalCount, setPropertyTotalCount] = useState(0);
  const [propertyLoading, setPropertyLoading] = useState(false);

  // Contract 관련 상태
  const [contractPage, setContractPage] = useState(0);
  const [contractRowsPerPage, setContractRowsPerPage] = useState(10);
  const [contractTotalCount, setContractTotalCount] = useState(0);
  const [contractLoading, setContractLoading] = useState(false);

  const fetchCounselData = async () => {
    setCounselLoading(true);
    try {
      const response = await apiClient.get<{ data: ConsultationResponse }>(
        `/customers/${customerId}/counsels`,
        {
          params: {
            page: counselPage + 1,
            size: counselRowsPerPage,
          },
        }
      );

      if (response.data?.data) {
        const { counsels, totalElements } = response.data.data;
        setCounsel(counsels);
        setCounselTotalCount(totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
    } finally {
      setCounselLoading(false);
    }
  };

  const fetchPropertyData = async () => {
    setPropertyLoading(true);
    try {
      const response = await apiClient.get<{ data: PropertyResponse }>(
        `/customers/${customerId}/properties`,
        {
          params: {
            page: propertyPage,
            size: propertyRowsPerPage,
          },
        }
      );

      if (response.data?.data) {
        const { agentProperty, totalElements } = response.data.data;
        setProperty(agentProperty);
        setPropertyTotalCount(totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setPropertyLoading(false);
    }
  };

  const fetchContractData = async () => {
    setContractLoading(true);
    try {
      const response = await apiClient.get<{ data: ContractResponse }>(
        `/customers/${customerId}/contracts`,
        {
          params: {
            page: contractPage,
            size: contractRowsPerPage,
          },
        }
      );

      if (response.data?.data) {
        const { contracts, totalElements } = response.data.data;
        console.log(response.data);
        setContract(contracts);
        setContractTotalCount(totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    } finally {
      setContractLoading(false);
    }
  };

  const fetchData = async (tab: number) => {
    setLoading(true);
    try {
      if (tab === 0) {
        await fetchCounselData();
      } else if (tab === 1) {
        await fetchPropertyData();
      } else if (tab === 2) {
        await fetchContractData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.ChangeEvent<object>, newValue: number) => {
    setCurrentTab(newValue);
    fetchData(newValue);
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    if (currentTab === 0) {
      fetchCounselData();
    }
  }, [counselPage, counselRowsPerPage]);

  useEffect(() => {
    if (currentTab === 1) {
      fetchPropertyData();
    }
  }, [propertyPage, propertyRowsPerPage]);

  useEffect(() => {
    if (currentTab === 2) {
      fetchContractData();
    }
  }, [contractPage, contractRowsPerPage]);

  return (
    <Box sx={{ mt: 0 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        <Tab label="상담 내역" />
        <Tab label="매물" />
        <Tab label="계약" />
      </Tabs>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ mt: 2, boxShadow: "none" }}
        >
          {currentTab === 0 && (
            <ConsultationTable
              counselList={counsel}
              totalCount={counselTotalCount}
              page={counselPage}
              rowsPerPage={counselRowsPerPage}
              onPageChange={setCounselPage}
              onRowsPerPageChange={(newRowsPerPage) => {
                setCounselRowsPerPage(newRowsPerPage);
                setCounselPage(1);
              }}
              loading={counselLoading}
            />
          )}
          {currentTab === 1 && (
            <PropertyTable
              properties={property}
              totalCount={propertyTotalCount}
              page={propertyPage}
              rowsPerPage={propertyRowsPerPage}
              onPageChange={setPropertyPage}
              onRowsPerPageChange={(newRowsPerPage) => {
                setPropertyRowsPerPage(newRowsPerPage);
                setPropertyPage(1);
              }}
              loading={propertyLoading}
            />
          )}
          {currentTab === 2 && (
            <ContractTable
              contractList={contract}
              totalCount={contractTotalCount}
              page={contractPage}
              rowsPerPage={contractRowsPerPage}
              onPageChange={setContractPage}
              onRowsPerPageChange={(newRowsPerPage) => {
                setContractRowsPerPage(newRowsPerPage);
                setContractPage(1);
              }}
              loading={contractLoading}
            />
          )}
        </TableContainer>
      )}
    </Box>
  );
}

export default CustomerInfo;
