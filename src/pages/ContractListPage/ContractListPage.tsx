import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@apis/apiClient";
import { Box, CircularProgress, Button } from "@mui/material";
import ContractTable from "./ContractTable";
import ContractAddButtonList from "./ContractAddButtonList";
import ContractFilterModal from "./ContractFilterModal/ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";

export interface ContractItem {
  uid: number;
  lessorOrSellerName: string;
  lesseeOrBuyerName: string | null;
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status:
    | "LISTED"
    | "NEGOTIATING"
    | "INTENT_SIGNED"
    | "CANCELLED"
    | "CONTRACTED"
    | "IN_PROGRESS"
    | "PAID_COMPLETE"
    | "REGISTERED"
    | "MOVED_IN"
    | "TERMINATED";
  address: string;
}

function ContractListPage() {
  const [contractList, setContractList] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<{ period: string; status: string }>({
    period: "",
    status: "",
  });

  const navigate = useNavigate();
  const { user } = useUserStore();

  const fetchContractData = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/contracts", {
        params: {
          ...filter,
          page: 0,
          size: 10,
        },
      })
      .then((res) => {
        const contractData = res?.data?.data?.contracts;
        setContractList(contractData || []);
      })
      .catch((error) => {
        console.error("Failed to fetch contracts:", error);
        setContractList([]);
      })
      .finally(() => {
        setLoading(false);
        setFilterModalOpen(false);
      });
  }, [filter]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <PageHeader title="내 계약 목록" userName={user?.name || "-"} />
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader title="내 계약 목록" userName={user?.name || "-"} />

      <Box sx={{ p: 3 }}>
        {/* 🔍 필터 + 등록 버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box display="flex" gap={1}>
            <Button variant="outlined" onClick={() => setFilterModalOpen(true)}>
              상세 필터
            </Button>
          </Box>
          <ContractAddButtonList fetchContractData={fetchContractData} />
        </Box>

        {/* 📋 계약 테이블 */}
        <ContractTable
          contractList={contractList}
          onRowClick={(contract) => navigate(`/contracts/${contract.uid}`)}
        />

        {/* 🎛️ 필터 모달 */}
        <ContractFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          initialFilter={filter}
          onApply={(newFilter) => {
            setFilter(newFilter);
          }}
        />
      </Box>
    </Box>
  );
}

export default ContractListPage;
