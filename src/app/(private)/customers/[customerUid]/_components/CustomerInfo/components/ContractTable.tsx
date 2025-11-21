import { Chip } from "@mui/material";
import { CONTRACT_STATUS_TYPES } from "@/constants/contract";
import Table, { ColumnConfig } from "@/components/Table";
import { ContractRowData } from "./CustomerInfoTabPanel";
import { Contract } from "@/types/contract";
import { getPropertyTypeColors } from "@/constants/property";
import { INFO, SUCCESS, WARNING } from "@/constants/colors";

interface ContractTableProps {
  contractList: Contract[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading: boolean;
}

const PROPERTY_TYPES = [
  { value: "SALE", name: "매매", color: SUCCESS.main },
  { value: "DEPOSIT", name: "전세", color: INFO.alt },
  { value: "MONTHLY", name: "월세", color: WARNING.dark },
];

function ContractTable({
  contractList,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading,
}: ContractTableProps) {
  const getStatusChip = (status: string) => {
    const statusInfo = CONTRACT_STATUS_TYPES.find(
      (item) => item.value === status
    );
    if (!statusInfo) return status;

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

    return (
      <Chip
        label={statusInfo.name}
        variant="outlined"
        className="font-medium h-[28px] text-sm"
        sx={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category || category === "null") return "-";

    const typeInfo = PROPERTY_TYPES.find((type) => type.value === category);
    if (!typeInfo) return category;

    const colors = getPropertyTypeColors(category);

    return (
      <Chip
        label={typeInfo.name}
        className="font-medium h-[28px] text-sm"
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      />
    );
  };

  const columns: ColumnConfig<ContractRowData>[] = [
    {
      key: "category",
      label: "계약 카테고리",
      render: (value) => getCategoryChip(value as string | null),
    },
    {
      key: "address",
      label: "주소",
    },
    {
      key: "lessorOrSellerNames",
      label: "임대인/매도인",
      render: (value) => (value as string[]).join(", ") || "-",
    },
    {
      key: "lesseeOrBuyerNames",
      label: "임차인/매수인",
      render: (value) => (value as string[]).join(", ") || "-",
    },
    {
      key: "contractDate",
      label: "계약일",
      render: (value) => (value as string | null) ?? "-",
    },
    {
      key: "contractStartDate",
      label: "계약 시작일",
      render: (value) => (value as string | null) ?? "-",
    },
    {
      key: "contractEndDate",
      label: "계약 종료일",
      render: (value) => (value as string | null) ?? "-",
    },
    {
      key: "status",
      label: "상태",
      render: (value) => getStatusChip(value as string),
    },
  ];

  const bodyList: ContractRowData[] = contractList.map((contract) => ({
    id: contract.uid,
    category: contract.category,
    address: contract.address,
    lessorOrSellerNames: contract.lessorOrSellerNames,
    lesseeOrBuyerNames: contract.lesseeOrBuyerNames,
    contractDate: contract.contractDate,
    contractStartDate: contract.contractStartDate,
    contractEndDate: contract.contractEndDate,
    status: contract.status,
    uid: contract.uid,
  }));

  return (
    <Table
      isLoading={loading}
      columns={columns}
      bodyList={bodyList}
      totalElements={totalCount}
      page={page}
      handleChangePage={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      handleChangeRowsPerPage={(e) =>
        onRowsPerPageChange(Number(e.target.value))
      }
      noDataMessage="등록된 계약이 없습니다."
      pagination={true}
    />
  );
}

export default ContractTable;
