import Table, { ColumnConfig, RowData } from "@components/Table/Table";
import { Property, PropertyCategory } from "@ts/property";
import { formatDate } from "@utils/dateUtil";
import { Typography, Chip, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropertyCard from "./PropertyCard";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";

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
      const deposit = property.deposit ? formatCurrency(property.deposit) : "-";
      const monthly = property.monthlyRent
        ? formatCurrency(property.monthlyRent)
        : "-";
      return `${deposit}/${monthly}`;
    }
  };

  const getTypeChipColor = (type: string) => {
    return getPropertyTypeColors(type).text;
  };

  const getCategoryChipColor = (category: string) => {
    return getPropertyCategoryColors(category).text;
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
          variant="outlined"
          className="text-xs h-6"
          style={{
            borderColor: getCategoryChipColor(row.realCategory),
            color: getCategoryChipColor(row.realCategory),
          }}
          sx={{
            "& .MuiChip-label": {
              padding: "0 8px",
            },
          }}
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
          variant="outlined"
          className="text-xs h-6"
          style={{
            borderColor: getTypeChipColor(row.type),
            color: getTypeChipColor(row.type),
          }}
          sx={{
            "& .MuiChip-label": {
              padding: "0 8px",
            },
          }}
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
              입주 가능일: {formatDate(row.moveInDate)}
            </Typography>
          )}
          {row.details ? (
            <Typography variant="body2" className="mt-1">
              {row.details.length > 20
                ? row.details.slice(0, 20) + "..."
                : row.details}
            </Typography>
          ) : (
            <Typography variant="body2" className="mt-1" color="text.secondary">
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
      <div className="lg:hidden">
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
            <div className="flex justify-center items-center mt-6 gap-1">
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
                  <div
                    key={pageIndex}
                    onClick={() => handleChangePage(null, pageIndex)}
                    className={`w-8 h-8 flex items-center justify-center border rounded cursor-pointer text-sm ${
                      page === pageIndex
                        ? "border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600"
                        : "border-gray-300 bg-transparent text-gray-900 font-normal hover:bg-gray-100"
                    }`}
                  >
                    {pageIndex + 1}
                  </div>
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
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 text-base">
            매물이 없습니다.
          </div>
        )}
      </div>

      {/* 데스크톱 테이블 UI (md 이상) */}
      <div className="hidden lg:block">
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
      </div>
    </>
  );
};

export default AgentPropertyTable;
