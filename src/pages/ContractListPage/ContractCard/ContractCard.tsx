import { Contract } from "@ts/contract";
import { Typography, Chip, Box, Card, CardContent } from "@mui/material";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { getPropertyTypeColors } from "@constants/property";

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
            backgroundColor: "#f5f5f5",
            color: "#666",
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }

    const getColor = (color: string) => {
      switch (color) {
        case "primary":
          return { backgroundColor: "#1976d2", color: "white" };
        case "success":
          return { backgroundColor: "#2e7d32", color: "white" };
        case "error":
          return { backgroundColor: "#d32f2f", color: "white" };
        case "warning":
          return { backgroundColor: "#ed6c02", color: "white" };
        case "info":
          return { backgroundColor: "#0288d1", color: "white" };
        case "secondary":
          return { backgroundColor: "#9c27b0", color: "white" };
        default:
          return { backgroundColor: "#f5f5f5", color: "#666" };
      }
    };

    const colors = getColor(statusType.color);

    return (
      <Chip
        label={statusType.label}
        size="small"
        sx={{
          backgroundColor: colors.backgroundColor,
          color: colors.color,
          fontSize: "0.7rem",
          height: "20px",
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category) return null;

    // 영어 카테고리를 한글로 변환
    const getCategoryLabel = (cat: string) => {
      switch (cat) {
        case "SALE":
          return "매매";
        case "DEPOSIT":
          return "전세";
        case "MONTHLY":
          return "월세";
        default:
          return cat; // 알 수 없는 카테고리는 그대로 표시
      }
    };

    const colors = getPropertyTypeColors(category);
    return (
      <Chip
        label={getCategoryLabel(category)}
        size="small"
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
          fontSize: "0.7rem",
          height: "20px",
        }}
      />
    );
  };

  return (
    <Card
      className="mb-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        {/* 카테고리와 상태 */}
        <Box className="flex gap-1 mb-2 flex-wrap items-center">
          {getCategoryChip(contract.category)}
          {getStatusChip(contract.status)}
        </Box>

        {/* 주소 */}
        <Box className="mb-2">
          <Typography variant="subtitle1" className="font-semibold">
            {contract.address}
          </Typography>
        </Box>

        {/* 임대/매도인 */}
        <Box className="flex items-start gap-2 mb-1 ml-2">
          <Typography variant="body2" className="text-gray-600 mt-0.5">
            •
          </Typography>
          <Box className="flex-1">
            <Typography variant="caption" className="text-gray-600">
              임대/매도인:{" "}
            </Typography>
            <Typography variant="body2" className="text-gray-800 inline">
              {getCustomerDisplay(contract.lessorOrSellerNames)}
            </Typography>
          </Box>
        </Box>

        {/* 임차/매수인 */}
        <Box className="flex items-start gap-2 mb-2 ml-2">
          <Typography variant="body2" className="text-gray-600 mt-0.5">
            •
          </Typography>
          <Box className="flex-1">
            <Typography variant="caption" className="text-gray-600">
              임차/매수인:{" "}
            </Typography>
            <Typography variant="body2" className="text-gray-800 inline">
              {getCustomerDisplay(contract.lesseeOrBuyerNames)}
            </Typography>
          </Box>
        </Box>

        {/* 계약 날짜 정보 */}
        <Box className="space-y-1">
          {contract.contractDate && (
            <Box className="flex items-start gap-2 ml-2">
              <Typography variant="caption" className="text-gray-600 mt-0.5">
                •
              </Typography>
              <Typography variant="caption" className="text-gray-600 flex-1">
                계약일: {contract.contractDate}
              </Typography>
            </Box>
          )}
          {contract.contractStartDate && (
            <Box className="flex items-start gap-2 ml-2">
              <Typography variant="caption" className="text-gray-600 mt-0.5">
                •
              </Typography>
              <Typography variant="caption" className="text-gray-600 flex-1">
                시작일: {contract.contractStartDate}
              </Typography>
            </Box>
          )}
          {contract.contractEndDate && (
            <Box className="flex items-start gap-2 ml-2">
              <Typography variant="caption" className="text-gray-600 mt-0.5">
                •
              </Typography>
              <Typography variant="caption" className="text-gray-600 flex-1">
                종료일: {contract.contractEndDate}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContractCard;
