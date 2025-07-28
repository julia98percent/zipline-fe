import { Box, Chip, IconButton } from "@mui/material";
import { Contract } from "@ts/contract";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { ContractCategory, ContractCategoryType } from "@ts/contract";
import Table, { ColumnConfig, RowData } from "@components/Table/Table";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
      <Box className="hidden md:block">
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
      <Box className="block md:hidden">
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
            {/* 모바일용 간단한 페이지네이션 */}
            <Box className="flex justify-center items-center mt-6 gap-1">
              {/* 이전 페이지 버튼 */}
              <IconButton
                size="small"
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                className="w-8 h-8 border border-gray-300 rounded mr-2 disabled:opacity-50"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>

              {/* 페이지 번호들 */}
              {(() => {
                const totalPages = Math.ceil(totalElements / rowsPerPage);
                const currentPage = page;
                const startPage = Math.max(0, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);
                const pages = [];

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((pageIndex) => (
                  <Box
                    key={pageIndex}
                    onClick={() => handleChangePage(null, pageIndex)}
                    className={`w-8 h-8 flex items-center justify-center border rounded cursor-pointer text-sm ${
                      page === pageIndex
                        ? "border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600"
                        : "border-gray-300 bg-transparent text-gray-900 font-normal hover:bg-gray-100"
                    }`}
                  >
                    {pageIndex + 1}
                  </Box>
                ));
              })()}

              {/* 다음 페이지 버튼 */}
              <IconButton
                size="small"
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
                className="w-8 h-8 border border-gray-300 rounded ml-2 disabled:opacity-50"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ContractTable;
