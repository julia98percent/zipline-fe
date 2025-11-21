import type { Contract } from "@/types/contract";
import Chip from "@mui/material/Chip";
import { CONTRACT_STATUS_TYPES } from "@/constants/contract";
import { getPropertyTypeColors } from "@/constants/property";
import InfoField from "@/components/InfoField";
import {
  ERROR,
  INFO,
  NEUTRAL,
  PURPLE,
  SUCCESS,
  WARNING,
  TEXT,
} from "@/constants/colors";

interface ContractCardProps {
  contract: Contract;
  onRowClick?: (contract: Contract) => void;
}

const ContractCard = ({ contract, onRowClick }: ContractCardProps) => {
  const handleCardClick = () => {
    onRowClick?.(contract);
  };

  const getCustomerDisplay = (
    customer: string | string[] | null | undefined
  ) => {
    if (!customer || customer === "null") return "-";
    if (Array.isArray(customer)) {
      if (customer.length === 0) return "-";
      if (customer.length === 1) return customer[0];
      if (customer.length === 2) return customer.join(", ");
      return `${customer[0]} 외 ${customer.length - 1}명`;
    }
    return customer;
  };

  const getStatusChip = (status: string) => {
    const statusType = CONTRACT_STATUS_TYPES.find(
      (type) => type.value === status
    );
    if (!statusType) {
      return (
        <Chip
          label={status}
          size="small"
          sx={{
            backgroundColor: NEUTRAL[100],
            color: TEXT.secondary,
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }

    const getColor = (color: string) => {
      switch (color) {
        case "primary":
          return { backgroundColor: INFO.main, color: "white" };
        case "success":
          return { backgroundColor: SUCCESS.dark, color: "white" };
        case "error":
          return { backgroundColor: ERROR.dark, color: "white" };
        case "warning":
          return { backgroundColor: WARNING.main, color: "white" };
        case "info":
          return { backgroundColor: INFO.dark, color: "white" };
        case "secondary":
          return { backgroundColor: PURPLE.dark, color: "white" };
        default:
          return { backgroundColor: NEUTRAL[100], color: TEXT.secondary };
      }
    };

    const colors = getColor(statusType.color);

    return (
      <Chip
        label={statusType.label}
        size="small"
        className="text-xs"
        sx={{
          backgroundColor: colors.backgroundColor,
          color: colors.color,
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category || category === "null") return null;

    const getCategoryLabel = (cat: string) => {
      switch (cat) {
        case "SALE":
          return "매매";
        case "DEPOSIT":
          return "전세";
        case "MONTHLY":
          return "월세";
        default:
          return cat;
      }
    };

    const colors = getPropertyTypeColors(category);
    return (
      <Chip
        label={getCategoryLabel(category)}
        size="small"
        className="text-xs"
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      />
    );
  };

  return (
    <div className="card cursor-pointer" onClick={handleCardClick}>
      <div className="flex flex-col p-5 gap-2">
        <div className="flex gap-1 flex-wrap items-center">
          {getCategoryChip(contract.category)}
          {getStatusChip(contract.status)}
        </div>

        <h6 className="text-md font-semibold">{contract.address}</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <InfoField
            className="flex-row items-center text-sm"
            label="• 임대/매도인: "
            value={getCustomerDisplay(contract.lessorOrSellerNames)}
          />

          <InfoField
            className="flex-row items-center text-sm"
            label="• 임차/매수인: "
            value={getCustomerDisplay(contract.lesseeOrBuyerNames)}
          />

          <InfoField
            className="flex-row items-center text-sm"
            label="• 계약일: "
            value={getCustomerDisplay(contract.contractDate)}
          />

          <InfoField
            className="flex-row items-center text-sm"
            label="• 계약 시작일: "
            value={getCustomerDisplay(contract.contractStartDate)}
          />

          <InfoField
            className="flex-row items-center text-sm"
            label="• 계약 종료일: "
            value={getCustomerDisplay(contract.contractEndDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractCard;
