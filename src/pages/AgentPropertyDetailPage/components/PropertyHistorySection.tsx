import { Tabs, Tab, Chip } from "@mui/material";
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
        className="font-medium h-7 text-sm"
        style={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
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
        className="font-medium h-6 text-sm"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
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
    <InfoCard className="flex-[6] flex flex-col h-full min-h-58 rounded-lg shadow-sm">
      <Tabs value={tab} onChange={(_, v) => onTabChange(v)} className="mb-4 ">
        <Tab label="계약 히스토리" />
        <Tab label="상담 히스토리" />
      </Tabs>

      {tab === 0 && (
        <>
          <div className="flex font-bold text-sm border-b border-gray-200 pb-2 ">
            <div className="flex-1 text-center">임대인/매도인</div>
            <div className="flex-1 text-center">임차인/매수인</div>
            <div className="flex-1 text-center">카테고리</div>
            <div className="flex-1 text-center">상태</div>
            <div className="flex-1 text-center">변경일</div>
          </div>
          {contractHistories.length === 0 ? (
            <h5 color="text.secondary" className="text-center text-sm">
              매물과 관련된 계약 히스토리가 없습니다.
            </h5>
          ) : (
            contractHistories.map((history, idx) => (
              <div
                key={idx}
                className="flex items-center text-sm border-b border-gray-200 py-2"
              >
                <div className="flex-1 text-center">
                  {getCustomerSummary(history.customers, "LESSOR_OR_SELLER")}
                </div>
                <div className="flex-1 text-center">
                  {getCustomerSummary(history.customers, "LESSEE_OR_BUYER")}
                </div>
                <div className="flex-1 text-center">
                  {getCategoryChip(history.contractCategory)}
                </div>
                <div className="flex-1 text-center">
                  {getStatusChip(history.contractStatus)}
                </div>
                <div className="flex-1 text-center">
                  {dayjs(history.endDate).format("YYYY.MM.DD")}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {tab === 1 && (
        <>
          <div className="flex font-bold text-sm border-b border-gray-200 pb-2 mb-2">
            <div className="flex-1 text-center">상담 제목</div>
            <div className="flex-1 text-center">상담일</div>
            <div className="flex-1 text-center">고객명</div>
            <div className="flex-1 text-center">연락처</div>
          </div>
          {counselHistories.length === 0 ? (
            <h5 color="text.secondary" className="text-center text-sm">
              매물과 관련된 상담 히스토리가 없습니다.
            </h5>
          ) : (
            counselHistories.map((counsel) => (
              <div
                key={counsel.counselUid}
                className="flex items-center text-sm border-b border-gray-200 py-2"
              >
                <div className="flex-1 text-center">{counsel.counselTitle}</div>
                <div className="flex-1 text-center">{counsel.counselDate}</div>
                <div className="flex-1 text-center">{counsel.customerName}</div>
                <div className="flex-1 text-center">
                  {counsel.customerPhoneNo}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </InfoCard>
  );
};

export default PropertyHistorySection;
