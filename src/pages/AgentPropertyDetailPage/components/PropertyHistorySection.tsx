import { Box, Typography, Tabs, Tab, Chip } from "@mui/material";
import { InfoCard } from "../styles/AgentPropertyDetailPage.styles";
import {
  ContractHistoryItem,
  CounselHistory,
  ContractCustomer,
} from "@apis/propertyService";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import dayjs from "dayjs";
import { ContractCategory, ContractCategoryType } from "@ts/contract";
import { getPropertyTypeColors } from "@constants/property";

interface PropertyHistorySectionProps {
  contractHistories: ContractHistoryItem[];
  counselHistories: CounselHistory[];
  tab: number;
  onTabChange: (value: number) => void;
}

const PropertyHistorySection = ({
  contractHistories,
  counselHistories,
  tab,
  onTabChange,
}: PropertyHistorySectionProps) => {
  const getColor = (color: string) => {
    switch (color) {
      case "primary":
        return "#1976d2";
      case "success":
        return "#2e7d32";
      case "error":
        return "#d32f2f";
      case "warning":
        return "#ed6c02";
      case "info":
        return "#0288d1";
      case "secondary":
        return "#9c27b0";
      default:
        return "#999";
    }
  };

  const getStatusChip = (status: string) => {
    const statusInfo = CONTRACT_STATUS_TYPES.find(
      (item) => item.value === status
    );
    if (!statusInfo) return status;

    return (
      <Chip
        label={statusInfo.name}
        variant="outlined"
        sx={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
          fontWeight: 500,
          height: 28,
          fontSize: 13,
        }}
      />
    );
  };

  const getCategoryChip = (category: ContractCategoryType | null) => {
    if (!category) return "-";
    const label = ContractCategory[category] ?? category;
    const colors = getPropertyTypeColors(category);

    return (
      <Chip
        label={label}
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
          fontWeight: 500,
          height: 26,
          fontSize: 13,
        }}
      />
    );
  };

  const getCustomerSummary = (
    customers: ContractCustomer[],
    role: ContractCustomer["customerRole"]
  ) => {
    const names = customers
      .filter((c) => c.customerRole === role)
      .map((c) => c.customerName);
    if (names.length === 0) return "-";
    if (names.length === 1) return names[0];
    return `${names[0]} 외 ${names.length - 1}명`;
  };

  return (
    <InfoCard
      sx={{
        flex: 6,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "230px",
      }}
    >
      <Tabs value={tab} onChange={(_, v) => onTabChange(v)} sx={{ mb: 2 }}>
        <Tab label="계약 히스토리" />
        <Tab label="상담 히스토리" />
      </Tabs>

      {tab === 0 && (
        <>
          <Box
            display="flex"
            fontWeight="bold"
            fontSize={14}
            sx={{ borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}
          >
            <Box flex={1} textAlign="center">
              임대인/매도인
            </Box>
            <Box flex={1} textAlign="center">
              임차인/매수인
            </Box>
            <Box flex={1} textAlign="center">
              카테고리
            </Box>
            <Box flex={1} textAlign="center">
              상태
            </Box>
            <Box flex={1} textAlign="center">
              변경일
            </Box>
          </Box>
          {contractHistories.length === 0 ? (
            <Typography color="text.secondary" align="center">
              매물과 관련된 계약 히스토리가 없습니다.
            </Typography>
          ) : (
            contractHistories.map((history, idx) => (
              <Box
                key={idx}
                display="flex"
                alignItems="center"
                fontSize={14}
                sx={{
                  borderBottom: "1px solid #eee",
                  py: 1,
                }}
              >
                <Box flex={1} textAlign="center">
                  {getCustomerSummary(history.customers, "LESSOR_OR_SELLER")}
                </Box>
                <Box flex={1} textAlign="center">
                  {getCustomerSummary(history.customers, "LESSEE_OR_BUYER")}
                </Box>
                <Box flex={1} textAlign="center">
                  {getCategoryChip(history.contractCategory)}
                </Box>
                <Box flex={1} textAlign="center">
                  {getStatusChip(history.contractStatus)}
                </Box>
                <Box flex={1} textAlign="center">
                  {dayjs(history.endDate).format("YYYY.MM.DD")}
                </Box>
              </Box>
            ))
          )}
        </>
      )}

      {tab === 1 && (
        <>
          <Box
            display="flex"
            fontWeight="bold"
            fontSize={14}
            sx={{ borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}
          >
            <Box flex={1} textAlign="center">
              상담 제목
            </Box>
            <Box flex={1} textAlign="center">
              상담일
            </Box>
            <Box flex={1} textAlign="center">
              고객명
            </Box>
            <Box flex={1} textAlign="center">
              연락처
            </Box>
          </Box>
          {counselHistories.length === 0 ? (
            <Typography color="text.secondary" align="center">
              매물과 관련된 상담 히스토리가 없습니다.
            </Typography>
          ) : (
            counselHistories.map((counsel) => (
              <Box
                key={counsel.counselUid}
                display="flex"
                alignItems="center"
                fontSize={14}
                sx={{ borderBottom: "1px solid #eee", py: 1 }}
              >
                <Box flex={1} textAlign="center">
                  {counsel.counselTitle}
                </Box>
                <Box flex={1} textAlign="center">
                  {counsel.counselDate}
                </Box>
                <Box flex={1} textAlign="center">
                  {counsel.customerName}
                </Box>
                <Box flex={1} textAlign="center">
                  {counsel.customerPhoneNo}
                </Box>
              </Box>
            ))
          )}
        </>
      )}
    </InfoCard>
  );
};

export default PropertyHistorySection;
