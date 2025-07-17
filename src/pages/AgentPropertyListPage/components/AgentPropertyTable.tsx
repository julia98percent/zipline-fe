import Table, { ColumnConfig, RowData } from "@components/Table/Table";
import { Property, PropertyCategory } from "@ts/property";
import { formatDate } from "@utils/dateUtil";
import { Typography, Chip, Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropertyCard from "./PropertyCard";

type PropertyRowData = RowData & Property;

interface AgentPropertyTableProps {
  propertyList: Property[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onRowClick?: (property: Property) => void;
}

const AgentPropertyTable = ({
  propertyList,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}: AgentPropertyTableProps) => {
  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case "SALE":
        return "매매";
      case "DEPOSIT":
        return "전세";
      case "MONTHLY":
        return "월세";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  const getPriceText = (property: Property) => {
    if (property.type === "SALE") {
      return property.price ? formatCurrency(property.price) : "-";
    } else if (property.type === "DEPOSIT") {
      return property.deposit ? formatCurrency(property.deposit) : "-";
    } else {
      const deposit = property.deposit ? formatCurrency(property.deposit) : "0";
      const monthly = property.monthlyRent
        ? formatCurrency(property.monthlyRent)
        : "0";
      return `${deposit}/${monthly}`;
    }
  };

  // 컬럼 정의
  const columns: ColumnConfig<PropertyRowData>[] = [
    {
      key: "realCategory",
      label: "매물 유형",
      width: "120px",
      render: (_, row) => (
        <Chip
          label={PropertyCategory[row.realCategory]}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      key: "type",
      label: "거래 유형",
      width: "120px",
      render: (_, row) => (
        <Chip
          label={getPropertyTypeText(row.type)}
          size="small"
          color={
            row.type === "SALE"
              ? "error"
              : row.type === "DEPOSIT"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      key: "address",
      label: "주소",
      width: "300px",
      render: (_, row) => (
        <div>
          <Typography variant="body2">{row.address}</Typography>
          {row.detailAddress && (
            <Typography variant="caption" color="text.secondary">
              {row.detailAddress}
            </Typography>
          )}
        </div>
      ),
    },
    {
      key: "netArea",
      label: "전용 면적",
      width: "120px",
      render: (_, row) => `${row.netArea.toFixed(1)}m²`,
    },
    {
      key: "price",
      label: "가격",
      width: "150px",
      render: (_, row) => (
        <Typography variant="body2" fontWeight="bold">
          {getPriceText(row)}
        </Typography>
      ),
    },
    {
      key: "details",
      label: "기타",
      width: "200px",
      render: (_, row) => (
        <div>
          {row.moveInDate && (
            <Typography variant="caption" color="text.secondary">
              입주: {formatDate(row.moveInDate)}
            </Typography>
          )}
          {row.details ? (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {row.details.length > 20
                ? row.details.slice(0, 20) + "..."
                : row.details}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
              -
            </Typography>
          )}
        </div>
      ),
    },
  ];

  const tableData: PropertyRowData[] = propertyList.map((property) => ({
    ...property,
    id: property.uid,
  }));

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handleRowClick = (rowData: PropertyRowData) => {
    onRowClick?.(rowData as Property);
  };

  return (
    <>
      {/* 모바일 카드 UI (md 미만) */}
      <Box className="md:hidden">
        {propertyList.length > 0 ? (
          <>
            {propertyList.map((property) => (
              <PropertyCard
                key={property.uid}
                property={property}
                onRowClick={onRowClick}
              />
            ))}
            {/* 모바일용 간단한 페이지네이션 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 0.5,
              }}
            >
              {/* 이전 페이지 버튼 */}
              <IconButton
                size="small"
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mr: 0.5,
                }}
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
                    sx={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid",
                      borderColor:
                        page === pageIndex ? "primary.main" : "divider",
                      borderRadius: 1,
                      backgroundColor:
                        page === pageIndex ? "primary.main" : "transparent",
                      color:
                        page === pageIndex
                          ? "primary.contrastText"
                          : "text.primary",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: page === pageIndex ? "bold" : "normal",
                      "&:hover": {
                        backgroundColor:
                          page === pageIndex ? "primary.dark" : "action.hover",
                      },
                    }}
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
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  ml: 0.5,
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
              fontSize: "16px",
            }}
          >
            매물이 없습니다.
          </Box>
        )}
      </Box>

      {/* 데스크톱 테이블 UI (md 이상) */}
      <Box className="hidden md:block">
        <Table
          columns={columns}
          bodyList={tableData}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleRowClick={onRowClick ? handleRowClick : undefined}
          pagination={true}
          hidePaginationControls={true}
        />
      </Box>
    </>
  );
};

export default AgentPropertyTable;
