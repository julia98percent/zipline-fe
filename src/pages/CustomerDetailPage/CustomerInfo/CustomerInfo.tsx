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
import PropertyTable from "@pages/PrivatePropertyListPage/PropertyTable";
import ContractTable from "@pages/ContractListPage/ContractTable";
import CounselTable from "../CounselTable";

function CustomerInfo({ customerId }: any) {
  const [currentTab, setCurrentTab] = useState(0);
  const [counsel, setCounsel] = useState([]);
  const [property, setProperty] = useState([]);
  const [contract, setContract] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (tab: number) => {
    setLoading(true);
    try {
      if (tab === 0) {
        const response = await apiClient.get(
          `/customers/${customerId}/counsels`
        );
        setCounsel(response.data.data || []);
      } else if (tab === 1) {
        const response = await apiClient.get(
          `/customers/${customerId}/properties`
        );
        setProperty(response.data.data.agentProperty || []);
      } else if (tab === 2) {
        const response = await apiClient.get(
          `/customers/${customerId}/contracts`
        );
        setContract(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
    fetchData(newValue); // 탭 변경 시 API 호출
  };

  useEffect(() => {
    // 초기 로드 시 첫 번째 탭 데이터 가져오기
    fetchData(0);
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      {/* Tabs */}
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

      {/* Loading Indicator */}
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
        <TableContainer component={Paper} elevation={4} sx={{ mt: 2 }}>
          {/* Counsel Tab */}
          {currentTab === 0 && <CounselTable counselList={counsel} />}

          {/* Property Tab */}
          {currentTab === 1 && <PropertyTable propertyList={property} />}

          {/* Contract Tab */}
          {currentTab === 2 && <ContractTable contractList={contract} />}
        </TableContainer>
      )}
    </Box>
  );
}

export default CustomerInfo;
