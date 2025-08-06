import { Box, Chip } from "@mui/material";
import { Contract } from "@ts/contract";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { ContractCategory, ContractCategoryType } from "@ts/contract";
import Table, { ColumnConfig, RowData } from "@components/Table/Table";
import MobilePagination from "@components/MobilePagination";
import ContractCard from "./ContractCard";
import { getPropertyTypeColors } from "@constants/property";

interface Props {
  contractList: Contract[];
  onRowClick?: (contract: Contract) => void;
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ContractRowData extends RowData {
  id: string;
  lessorOrSellerNames: string[] | null;
  lesseeOrBuyerNames: string[] | null;
  address: string;
  category: string | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
}

const ContractTable = ({
  contractList,
  onRowClick,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
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
        className="text-sm font-medium h-7"
        sx={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category || category === "null") return "-";
    const isValidCategory = (
      category: string
    ): category is ContractCategoryType => {
      return category in ContractCategory;
    };

    const label = isValidCategory(category)
      ? ContractCategory[category]
      : category;

    const colors = getPropertyTypeColors(category);

    return (
      <Chip
        label={label}
        className="text-sm font-medium h-7"
        sx={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      />
    );
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

  const columns: ColumnConfig<ContractRowData>[] = [
    {
      key: "lessorOrSellerNames",
      label: "임대/매도인",
      render: (value) => getCustomerDisplay(value as string[] | null),
    },
    {
      key: "lesseeOrBuyerNames",
      label: "임차/매수인",
      render: (value) => getCustomerDisplay(value as string[] | null),
    },
    {
      key: "address",
      label: "주소",
    },
    {
      key: "category",
      label: "계약 카테고리",
      render: (value) => getCategoryChip(value as string | null),
    },
    {
      key: "contractDate",
      label: "계약일",
      render: (value) => (value as string) ?? "-",
    },
    {
      key: "contractStartDate",
      label: "계약 시작일",
      render: (value) => (value as string) ?? "-",
    },
    {
      key: "contractEndDate",
      label: "계약 종료일",
      render: (value) => (value as string) ?? "-",
    },
    {
      key: "status",
      label: "상태",
      render: (value) => getStatusChip(value as string),
    },
  ];

  const rows: ContractRowData[] = contractList.map((contract) => ({
    id: contract.uid.toString(),
    lessorOrSellerNames: contract.lessorOrSellerNames,
    lesseeOrBuyerNames: contract.lesseeOrBuyerNames,
    address: contract.address,
    category: contract.category,
    contractDate: contract.contractDate,
    contractStartDate: contract.contractStartDate,
    contractEndDate: contract.contractEndDate,
    status: contract.status,
  }));

  const handleRowClick = (_rowData: ContractRowData, index: number) => {
    const originalContract = contractList[index];
    onRowClick?.(originalContract);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(_, newPage);
  };

  return (
    <Box className="w-full mt-[28px]">
      {/* Desktop view - 768px and above */}
      <Box className="hidden lg:block">
        <Table<ContractRowData>
          columns={columns}
          bodyList={rows}
          handleRowClick={handleRowClick}
          totalElements={totalElements}
          page={page}
          handleChangePage={onPageChange}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={onRowsPerPageChange}
          noDataMessage="계약 데이터가 없습니다"
          className="min-w[650px]"
          sx={{
            "& .MuiTableCell-root": {
              minHeight: "60px",
              paddingTop: "12px",
              paddingBottom: "12px",
              lineHeight: 1.4,
            },
            "& .MuiTableRow-root": {
              minHeight: "60px",
            },
          }}
        />
      </Box>

      {/* Mobile view - below 768px */}
      <Box className="block lg:hidden">
        {contractList.length === 0 ? (
          <Box className="text-center py-8 text-gray-500">
            계약 데이터가 없습니다
          </Box>
        ) : (
          <>
            <Box className="space-y-4">
              {contractList.map((contract) => (
                <ContractCard
                  key={contract.uid}
                  contract={contract}
                  onRowClick={onRowClick}
                />
              ))}
            </Box>
            <MobilePagination
              page={page}
              totalElements={totalElements}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default ContractTable;
