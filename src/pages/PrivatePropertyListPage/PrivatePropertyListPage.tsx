import { useEffect, useState, useCallback } from "react";
import apiClient from "@apis/apiClient";
import PropertyAddButtonList from "./PropertyAddButtonList";
import PropertyTable from "./PropertyTable";
import PropertyFilterModal from "./PropertyFilterModal/PropertyFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";

import { Box, CircularProgress, Button } from "@mui/material";
import { AgentPropertyFilterRequest } from "../../types/AgentPropertyFilterRequest";

export interface PropertyItem {
  uid: number;
  customerName: string;
  address: string;
  deposit: number | null;
  monthlyRent: number | null;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  moveInDate: string | null;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number | null;
  hasElevator: boolean;
  constructionYear: number | null;
  parkingCapacity: number | null;
  netArea: number;
  totalArea: number;
  details: string | null;
}

function PrivatePropertyListPage() {
  const [privatePropertyList, setPrivatePropertyList] = useState<
    PropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<AgentPropertyFilterRequest>({});
  const { user } = useUserStore();

  const fetchPropertyData = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/properties")
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        setPrivatePropertyList(agentPropertyData || []);
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchFilteredProperties = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/properties", {
        params: {
          ...filter,
          page: 0,
          size: 10,
        },
      })
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        setPrivatePropertyList(agentPropertyData || []);
      })
      .catch((error) => {
        console.error("Failed to fetch filtered properties:", error);
        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
        setFilterModalOpen(false);
      });
  }, [filter]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <PageHeader title="내 매물 목록" userName={user?.name || "-"} />
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
      <PageHeader title="내 매물 목록" userName={user?.name || "-"} />

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
          <PropertyAddButtonList fetchPropertyData={fetchPropertyData} />
        </Box>

        {/* 테이블 */}
        <PropertyTable propertyList={privatePropertyList} />

        {/* 필터 모달 */}
        <PropertyFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filter={filter}
          setFilter={setFilter}
          onApply={fetchFilteredProperties}
          onReset={() => setFilter({})}
        />
      </Box>
    </Box>
  );
}

export default PrivatePropertyListPage;
